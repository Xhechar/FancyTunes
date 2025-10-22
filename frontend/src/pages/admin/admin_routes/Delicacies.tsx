import React, { useState, useEffect, useRef } from "react";
import { set, useForm } from "react-hook-form";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Filter,
  Image as ImageIcon,
  Utensils,
  DollarSign,
  CheckCircle,
  XCircle,
  Tag,
} from "lucide-react";
import { Delicacy } from "../../../interfaces/interfaces";
import { CreateDelicacyDto, UpdateDelicacyDto } from "../../../interfaces/dtos/interfaces.dtos";
import styles from "../../../styles/admin/admin_routes/Delicacies.module.css";
import { socket } from "../../../socket.io";
import { ToastProps } from "../../../components/Toast";
import Toast from "../../../components/Toast";
import { DelicacyService } from "../../../services/delicacy.service";

export const Delicacies: React.FC = () => {
  const [delicacies, setDelicacies] = useState<Delicacy[]>([]);
  const [filteredDelicacies, setFilteredDelicacies] = useState<Delicacy[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDelicacy, setEditingDelicacy] = useState<Delicacy | null>(null);
  const [delicacyToDelete, setDelicacyToDelete] = useState<Delicacy | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageUrlRef= useRef<string | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDelicacyDto | UpdateDelicacyDto>({
    mode: "all",
  });

  useEffect(() => {
    
    socket.connect();

    socket.on("delicacy-created", (newDelicacy: Delicacy) => {
      setDelicacies((prev) => [...prev, newDelicacy]);
    });

    socket.on("delicacy-updated", (updatedDelicacy: Delicacy) => {
      setDelicacies((prev) =>
        prev.map((delicacy) =>
          delicacy.DelicacyId === updatedDelicacy.DelicacyId
            ? updatedDelicacy
            : delicacy
        )
      );
    });

    socket.on("delicacy-deleted", (deletedDelicacyId: string) => {
      setDelicacies((prev) =>
        prev.filter((delicacy) => delicacy.DelicacyId !== deletedDelicacyId)
      );
    });

    return () => {
      socket.off("delicacy-created");
      socket.off("delicacy-updated");
      socket.off("delicacy-deleted");
      socket.disconnect();
    }

  }, []);

  useEffect(() => {

    const getDelicacies = async () => {

      const result = await DelicacyService.GetAllDelicacies();

      if (result.success) {
        const toast: ToastProps = {
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message: result.message as string,
          onClose: function (): void {
            setToast(() => null);
          }
        };
        setToast(toast);
        setDelicacies(result.dataList as Delicacy[]);
        setFilteredDelicacies(result.dataList as Delicacy[]);
      } else {
        const toast: ToastProps = {
          isVisible: true,
          type: "error",
          title: "ERROR",
          message: result.message as string,
          onClose: function (): void {
            setToast(() => null);
          }
        };

        setToast(toast);
      };
    };
    getDelicacies();
  }, []);

  useEffect(() => {
    filterDelicacies();
  }, [searchTerm, categoryFilter, availabilityFilter, delicacies]);

  const filterDelicacies = () => {
    let filtered = [...delicacies];

    if (searchTerm) {
      filtered = filtered.filter(
        (delicacy) =>
          delicacy.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delicacy.Description.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          delicacy.Category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (delicacy) => delicacy.Category === categoryFilter
      );
    }

    if (availabilityFilter === "available") {
      filtered = filtered.filter((delicacy) => delicacy.IsAvailable);
    } else if (availabilityFilter === "unavailable") {
      filtered = filtered.filter((delicacy) => !delicacy.IsAvailable);
    }

    setFilteredDelicacies(filtered);
  };

  const openCreateModal = () => {
    setEditingDelicacy(null);
    setImagePreview(null);
    imageUrlRef.current = null;
    reset({
      Name: "",
      Description: "",
      Price: 0,
      DelicacyImage: "",
      Category: "",
      IsAvailable: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (delicacy: Delicacy) => {
    setEditingDelicacy(delicacy);
    setImagePreview(delicacy.DelicacyImage || null);
    imageUrlRef.current = null;
    reset({
      Name: delicacy.Name,
      Description: delicacy.Description,
      Price: delicacy.Price,
      DelicacyImage: delicacy.DelicacyImage,
      Category: delicacy.Category,
      IsAvailable: delicacy.IsAvailable,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDelicacy(null);
    setImagePreview(null);
    imageUrlRef.current = null;
    reset();
  };

  const openDeleteModal = (delicacy: Delicacy) => {
    setDelicacyToDelete(delicacy);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDelicacyToDelete(null);
  };

  const onSubmit = async (data: CreateDelicacyDto | UpdateDelicacyDto) => {
    try {
      if (!imageUrlRef.current) {
        const toast: ToastProps = {
          isVisible: true,
          type: "warning",
          title: "IMAGE ERROR",
          message: "kindly upload image first to proceed.",
          onClose: function (): void {
            setToast(() => null);
          }
        };

        setToast(toast);
        return;
      }

      data.DelicacyImage = imageUrlRef.current;

      if (editingDelicacy) {
        
        const result = await DelicacyService.UpdateDelicacy(editingDelicacy.DelicacyId, {
          ...data, DelicacyImage: data.DelicacyImage ? data.DelicacyImage : editingDelicacy.DelicacyImage
        } as UpdateDelicacyDto);

        if(result.success) {
          const toast: ToastProps = {
            isVisible: true,
            type: "success",
            title: "SUCCESS",
            message: result.message as string,
            onClose: function (): void {
              setToast(() => null);
            },
          };

          setToast(toast);
        } else {
          const toast: ToastProps = {
            isVisible: true,
            type: "error",
            title: "ERROR",
            message: result.message as string,
            onClose: function (): void {
              setToast(() => null);
            },
          };

          setToast(toast);
        }

      } else {
        
        const result = await DelicacyService.CreateDelicacy({...data, DelicacyImage: data.DelicacyImage ? data.DelicacyImage : null} as CreateDelicacyDto);

        if (result.success) {
          const toast: ToastProps = {
            isVisible: true,
            type: "success",
            title: "SUCCESS",
            message: result.message as string,
            onClose: function (): void {
              setToast(() => null);
            },
          };

          setToast(toast);
        } else {
          const toast: ToastProps = {
            isVisible: true,
            type: "error",
            title: "ERROR",
            message: result.message as string,
            onClose: function (): void {
              setToast(() => null);
            },
          };

          setToast(toast);
        }
      }
      closeModal();
    } catch (error: any) {
      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: error.response?.data?.error || "ERROR",
        message: error.response?.data?.message || "An error occurred while creating the room.",
        onClose: function (): void {
          setToast(() => null);
        },
      };

      setToast(toast);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      if (!file.type.startsWith("image/")) {
        const toast: ToastProps = {
          isVisible: true,
          type: "warning",
          title: "IMAGE ERROR",
          message: "only upload image files.",
          onClose: function (): void {
            setToast(() => null);
          }
        };
        setToast(toast);
        return;
      }

      const formData: FormData = new FormData();
      
      formData.append("file", file);
      formData.append("upload_preset", "allapps");
      formData.append("cloud_name", "dakyiye2e");

      await fetch("https://api.cloudinary.com/v1_1/dakyiye2e/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.secure_url) imageUrlRef.current = (res.secure_url);
          setImagePreview(res.secure_url);
        })
        .catch((err) => {
          const toast: ToastProps = {
            isVisible: true,
            type: "error",
            title: "IMAGE UPLOAD ERROR",
            message: err.message || "An error occurred while uploading image.",
            onClose: function (): void {
              setToast(() => null);
            },
          };

          setToast(toast);
        });
    }
  };

  const removeImage = () => {
    imageUrlRef.current = null;
    setImagePreview(null);
  };

  const handleDelete = async () => {
    if (!delicacyToDelete) return;

    try {
      
      const result = await DelicacyService.DeleteDelicacy(delicacyToDelete.DelicacyId);

      if (result.success) {
        const toast: ToastProps = {
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message: result.message as string,
          onClose: function (): void {
            setToast(() => null);
          },
        };

        setToast(toast);
      } else {
        const toast: ToastProps = {
          isVisible: true,
          type: "error",
          title: "ERROR",
          message: result.message as string,
          onClose: function (): void {
            setToast(() => null);
          },
        };

        setToast(toast);
      }

      setDelicacies(
        delicacies.filter((d) => d.DelicacyId !== delicacyToDelete.DelicacyId)
      );
      closeDeleteModal();
    } catch (error: any) {
      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: error.response?.data?.error || "ERROR",
        message: error.response?.data?.message || "An error occurred while creating the room.",
        onClose: function (): void {
          setToast(() => null);
        },
      };

      setToast(toast);
    }
  };

  const categories = [
    "Appetizer",
    "Main Course",
    "Dessert",
    "Beverage",
    "Side Dish",
    "Salad",
  ];

  return (
    <div className={styles.container}>
      {toast && <Toast {...toast} />}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Delicacies Menu</h1>
          <p className={styles.subtitle}>
            Manage all food items, prices, and availability
          </p>
        </div>
        <button className={styles.addButton} onClick={openCreateModal}>
          <Plus size={20} />
          Add New Item
        </button>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Tag size={18} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <Filter size={18} />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Items</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Items:</span>
          <span className={styles.statValue}>{delicacies.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Available:</span>
          <span className={styles.statValue}>
            {delicacies.filter((d) => d.IsAvailable).length}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Out of Stock:</span>
          <span className={styles.statValue}>
            {delicacies.filter((d) => !d.IsAvailable).length}
          </span>
        </div>
      </div>

      <div className={styles.delicaciesGrid}>
        {filteredDelicacies.map((delicacy: Delicacy) => (
          <div key={delicacy.DelicacyId} className={styles.delicacyCard}>
            <div className={styles.delicacyImage}>
              {delicacy.DelicacyImage ? (
                <img src={delicacy.DelicacyImage} alt={delicacy.Name} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <ImageIcon size={40} />
                </div>
              )}
              <span
                className={`${styles.availabilityBadge} ${
                  delicacy.IsAvailable ? styles.available : styles.unavailable
                }`}
              >
                {delicacy.IsAvailable ? (
                  <>
                    <CheckCircle size={14} /> Available
                  </>
                ) : (
                  <>
                    <XCircle size={14} /> Out of Stock
                  </>
                )}
              </span>
              <span className={styles.categoryBadge}>{delicacy.Category}</span>
            </div>

            <div className={styles.delicacyContent}>
              <h3 className={styles.delicacyName}>{delicacy.Name}</h3>

              <p className={styles.delicacyDescription}>
                {delicacy.Description}
              </p>

              <div className={styles.priceSection}>
                <DollarSign size={20} className={styles.dollarIcon} />
                <span className={styles.price}>
                  ${Number(delicacy?.Price ?? 0).toFixed(2)}
                </span>
              </div>

              <div className={styles.delicacyActions}>
                <button
                  className={styles.editButton}
                  onClick={() => openEditModal(delicacy)}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => openDeleteModal(delicacy)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDelicacies.length === 0 && (
        <div className={styles.emptyState}>
          <Utensils size={64} className={styles.emptyIcon} />
          <h3>No delicacies found</h3>
          <p>Try adjusting your filters or add a new item to get started.</p>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingDelicacy ? "Edit Delicacy" : "Add New Delicacy"}</h2>
              <button className={styles.closeButton} onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="Name">Item Name</label>
                  <input
                    type="text"
                    id="Name"
                    {...register("Name", {
                      required: "Item name is required",
                      minLength: {
                        value: 3,
                        message: "Must be at least 3 characters",
                      },
                    })}
                    className={errors.Name ? styles.inputError : ""}
                  />
                  {errors.Name && (
                    <span className={styles.errorMessage}>
                      {errors.Name.message}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="Category">Category</label>
                  <select
                    id="Category"
                    {...register("Category", {
                      required: "Category is required",
                    })}
                    className={errors.Category ? styles.inputError : ""}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.Category && (
                    <span className={styles.errorMessage}>
                      {errors.Category.message}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="Price">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  id="Price"
                  {...register("Price", {
                    required: "Price is required",
                    min: { value: 0.01, message: "Must be greater than 0" },
                    max: { value: 10000, message: "Cannot exceed $10,000" },
                  })}
                  className={errors.Price ? styles.inputError : ""}
                />
                {errors.Price && (
                  <span className={styles.errorMessage}>
                    {errors.Price.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="Description">Description</label>
                <textarea
                  id="Description"
                  rows={4}
                  {...register("Description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Must be at least 10 characters",
                    },
                    maxLength: {
                      value: 500,
                      message: "Cannot exceed 500 characters",
                    },
                  })}
                  className={errors.Description ? styles.inputError : ""}
                />
                {errors.Description && (
                  <span className={styles.errorMessage}>
                    {errors.Description.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    {...register("IsAvailable")}
                    className={styles.checkbox}
                  />
                  <span>Available for orders</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="DelicacyImage">Food Image</label>
                <div className={styles.imageUploadWrapper}>
                  {imagePreview && (
                    <div className={styles.imagePreviewSmall}>
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={removeImage}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    id="DelicacyImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInputField}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingDelicacy ? "Update Item" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && delicacyToDelete && (
        <div className={styles.modalOverlay} onClick={closeDeleteModal}>
          <div
            className={styles.deleteModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.deleteIcon}>
              <Trash2 size={48} />
            </div>
            <h2>Delete Delicacy</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{delicacyToDelete.Name}</strong>? This action cannot be
              undone and will remove it from all menus and orders.
            </p>
            <div className={styles.deleteActions}>
              <button
                className={styles.cancelButton}
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteButton}
                onClick={handleDelete}
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};