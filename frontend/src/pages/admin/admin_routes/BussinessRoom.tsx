import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Filter,
  Image as ImageIcon,
  Briefcase,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { BusinessRoom } from "../../../interfaces/interfaces";
import { CreateBusinessRoomDto, UpdateBusinessRoomDto } from "../../../interfaces/dtos/interfaces.dtos";
import styles from "../../../styles/admin/admin_routes/BussinessRoom.module.css";
import Toast, { ToastProps } from "../../../components/Toast";
import { socket } from "../../../socket.io";
import { BusinessRoomService } from "../../../services/business.room.service";

export const BusinessRooms: React.FC = () => {
  const [businessRooms, setBusinessRooms] = useState<BusinessRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<BusinessRoom[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<BusinessRoom | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<BusinessRoom | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageUrlRef= useRef<string | null>(null);
  const [ toast, setToast ] = useState<ToastProps | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBusinessRoomDto | UpdateBusinessRoomDto>({
    mode: "all",
  });

  useEffect(() => {
    
    socket.connect();

    socket.on("business-room-created", (newRoom: BusinessRoom) => {
      setBusinessRooms((prevRooms) => [...prevRooms, newRoom]);
    });

    socket.on("business-room-updated", (updatedRoom: BusinessRoom) => {
      setBusinessRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.BusinessRoomId === updatedRoom.BusinessRoomId ? updatedRoom : room
        )
      );

      socket.on("business-room-deleted", (deletedRoomId: string) => {
        setBusinessRooms((prevRooms) =>
          prevRooms.filter((room) => room.BusinessRoomId !== deletedRoomId)
        );
      });
    });

    return () => {
      socket.off("business-room-created");
      socket.off("business-room-updated");
      socket.off("business-room-deleted");
      socket.disconnect();
    };  
  }, []);

  useEffect(() => {

    const getBusinessRooms = async () => {
      try {
        
        let result = await BusinessRoomService.GetAllBusinessRooms();

        if (result.success && result.dataList) {
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
          setBusinessRooms(result.dataList);
          setFilteredRooms(result.dataList);
          return;
        } else {
          const toast: ToastProps = {
            isVisible: false,
            type: "error",
            title: result.error as string,
            message: result.message as string,
            onClose: function (): void {
              setToast(() => null);
            }
          };

          setToast(toast);
        }

      } catch (error: any) {
        const toast: ToastProps = {
          isVisible: true,
          type: "error",
          title: error.response?.data?.error || "ERROR",
          message: error.response?.data?.message || "An error occurred while fetching business rooms.",
          onClose: function (): void {
            setToast(() => null);
          },
        };

        setToast(toast);
      }
    };
    getBusinessRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [searchTerm, availabilityFilter, businessRooms]);

  const filterRooms = () => {
    let filtered = [...businessRooms];

    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.Amenities?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (availabilityFilter === "available") {
      filtered = filtered.filter((room) => room.IsAvailable);
    } else if (availabilityFilter === "unavailable") {
      filtered = filtered.filter((room) => !room.IsAvailable);
    }

    setFilteredRooms(filtered);
  };

  const openCreateModal = () => {
    setEditingRoom(null);
    setImagePreview(null);
    imageUrlRef.current = null;
    reset({
      RoomCount: 0,
      Name: "",
      Description: "",
      Capacity: 1,
      PricePerHour: "",
      Amenities: "",
      BusinessRoomImage: "",
      IsAvailable: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room: BusinessRoom) => {
    setEditingRoom(room);
    setImagePreview(room.BusinessRoomImage || null);
    imageUrlRef.current = room.BusinessRoomImage || null;
    reset({
      RoomCount: room.RoomCount,
      Name: room.Name,
      Description: room.Description,
      Capacity: room.Capacity,
      PricePerHour: room.PricePerHour.toString(),
      Amenities: room.Amenities,
      BusinessRoomImage: room.BusinessRoomImage,
      IsAvailable: room.IsAvailable,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setImagePreview(null);
    imageUrlRef.current = null;
    reset();
  };

  const openDeleteModal = (room: BusinessRoom) => {
    setRoomToDelete(room);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRoomToDelete(null);
  };

  const onSubmit = async (
    data: CreateBusinessRoomDto | UpdateBusinessRoomDto
  ) => {
    try {

      if (editingRoom) {
        let updateData: UpdateBusinessRoomDto = {
          BusinessRoomImage: imageUrlRef.current ? imageUrlRef.current : editingRoom.BusinessRoomImage,
          RoomCount: data.RoomCount,
          Name: data.Name,
          Description: data.Description,
          Capacity: data.Capacity,
          PricePerHour: data.PricePerHour,
          Amenities: data.Amenities,
          IsAvailable: data.IsAvailable
        };
        
        const result = await BusinessRoomService.UpdateBusinessRoom(editingRoom.BusinessRoomId, updateData);

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
        }
      } else {

        let createData: CreateBusinessRoomDto = {
          RoomCount: data.RoomCount,
          Name: data.Name,
          Description: data.Description,
          Capacity: data.Capacity,
          PricePerHour: data.PricePerHour,
          Amenities: data.Amenities,
          BusinessRoomImage: imageUrlRef.current ? imageUrlRef.current : "",
          IsAvailable: data.IsAvailable
        } as CreateBusinessRoomDto;

        
        const result = await BusinessRoomService.CreateBusinessRoom(createData);

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
            title: result.error as string,
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
          type: "error",
          title: "INVALID FILE TYPE",
          message: "Please select a valid image file.",
          onClose: function (): void {
            setToast(() => null);
          },
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
    if (!roomToDelete) return;

    try {

      const result = await BusinessRoomService.DeleteBusinessRoom(roomToDelete.BusinessRoomId);

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
      
      setBusinessRooms(
        businessRooms.filter(
          (r) => r.BusinessRoomId !== roomToDelete.BusinessRoomId
        )
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

  return (
    <div className={styles.container}>
      {toast && toast.isVisible ? <Toast {...toast} /> : null}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Business Rooms & Event Halls</h1>
          <p className={styles.subtitle}>
            Manage conference rooms, meeting spaces, and event venues
          </p>
        </div>
        <button className={styles.addButton} onClick={openCreateModal}>
          <Plus size={20} />
          Add New Space
        </button>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, description, or amenities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={18} />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Rooms</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Spaces:</span>
          <span className={styles.statValue}>{businessRooms.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Available:</span>
          <span className={styles.statValue}>
            {businessRooms.filter((r) => r.IsAvailable).length}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Booked:</span>
          <span className={styles.statValue}>
            {businessRooms.filter((r) => !r.IsAvailable).length}
          </span>
        </div>
      </div>

      <div className={styles.roomsGrid}>
        {filteredRooms.map((room) => (
          <div key={room.BusinessRoomId} className={styles.roomCard}>
            <div className={styles.roomImage}>
              {room.BusinessRoomImage ? (
                <img src={room.BusinessRoomImage} alt={room.Name} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <ImageIcon size={40} />
                </div>
              )}
              <span
                className={`${styles.availabilityBadge} ${
                  room.IsAvailable ? styles.available : styles.unavailable
                }`}
              >
                {room.IsAvailable ? (
                  <>
                    <CheckCircle size={14} /> Available
                  </>
                ) : (
                  <>
                    <XCircle size={14} /> Booked
                  </>
                )}
              </span>
            </div>

            <div className={styles.roomContent}>
              <div className={styles.roomHeader}>
                <h3 className={styles.roomName}>{room.Name}</h3>
                {room.RoomCount && (
                  <span className={styles.roomNumber}>#{room.RoomCount}</span>
                )}
              </div>

              <p className={styles.roomDescription}>{room.Description}</p>

              {room.Amenities && (
                <div className={styles.amenitiesSection}>
                  <strong>Amenities:</strong>
                  <p className={styles.amenities}>{room.Amenities}</p>
                </div>
              )}

              <div className={styles.roomDetails}>
                <div className={styles.detail}>
                  <Users size={16} />
                  <span>{room.Capacity} People</span>
                </div>
                <div className={styles.detail}>
                  <Clock size={16} />
                  <span>${room.PricePerHour}/hour</span>
                </div>
              </div>

              <div className={styles.roomActions}>
                <button
                  className={styles.editButton}
                  onClick={() => openEditModal(room)}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => openDeleteModal(room)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className={styles.emptyState}>
          <Briefcase size={64} className={styles.emptyIcon} />
          <h3>No business rooms found</h3>
          <p>Try adjusting your filters or add a new space to get started.</p>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                {editingRoom ? "Edit Business Room" : "Add New Business Room"}
              </h2>
              <button className={styles.closeButton} onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="RoomCount">Room Number</label>
                  <input
                    type="number"
                    id="RoomCount"
                    {...register("RoomCount", {
                      required: "Room number is required",
                      min: { value: 1, message: "Must be at least 1" },
                    })}
                    className={errors.RoomCount ? styles.inputError : ""}
                  />
                  {errors.RoomCount && (
                    <span className={styles.errorMessage}>
                      {errors.RoomCount.message}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="Name">Room Name</label>
                  <input
                    type="text"
                    id="Name"
                    {...register("Name", {
                      required: "Room name is required",
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
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="Capacity">Capacity (People)</label>
                  <input
                    type="number"
                    id="Capacity"
                    {...register("Capacity", {
                      required: "Capacity is required",
                      min: { value: 1, message: "Must be at least 1" },
                      max: { value: 500, message: "Cannot exceed 500" },
                    })}
                    className={errors.Capacity ? styles.inputError : ""}
                  />
                  {errors.Capacity && (
                    <span className={styles.errorMessage}>
                      {errors.Capacity.message}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="PricePerHour">Price Per Hour ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="PricePerHour"
                    {...register("PricePerHour", {
                      required: "Price is required",
                      min: { value: 0, message: "Must be positive" },
                    })}
                    className={errors.PricePerHour ? styles.inputError : ""}
                  />
                  {errors.PricePerHour && (
                    <span className={styles.errorMessage}>
                      {errors.PricePerHour.message}
                    </span>
                  )}
                </div>
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
                <label htmlFor="Amenities">Amenities (comma-separated)</label>
                <textarea
                  id="Amenities"
                  rows={2}
                  placeholder="e.g., Projector, WiFi, Whiteboard, Coffee Station"
                  {...register("Amenities")}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    {...register("IsAvailable")}
                    className={styles.checkbox}
                  />
                  <span>Available for booking</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="BusinessRoomImage">Room Image</label>
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
                    id="BusinessRoomImage"
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
                  {editingRoom ? "Update Room" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && roomToDelete && (
        <div className={styles.modalOverlay} onClick={closeDeleteModal}>
          <div
            className={styles.deleteModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.deleteIcon}>
              <Trash2 size={48} />
            </div>
            <h2>Delete Business Room</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{roomToDelete.Name}</strong>? This action cannot be undone
              and will affect all related bookings.
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
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};