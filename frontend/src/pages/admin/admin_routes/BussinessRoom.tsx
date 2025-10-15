import React, { useState, useEffect } from "react";
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

export const BusinessRooms: React.FC = () => {
  const [businessRooms, setBusinessRooms] = useState<BusinessRoom[]>([
    {
      BusinessRoomId: "1",
      RoomCount: 1,
      Name: "Executive Conference Room",
      Description:
        "Premium conference room with state-of-the-art AV equipment, whiteboard, and comfortable seating for up to 20 people. Perfect for board meetings and presentations.",
      Capacity: 20,
      PricePerHour: 75,
      Amenities:
        "Projector, Whiteboard, Video Conferencing, WiFi, Coffee Station",
      BusinessRoomImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
      IsAvailable: true,
      CreatedAt: new Date("2024-01-10"),
      UpdatedAt: new Date("2024-01-10"),
    },
    {
      BusinessRoomId: "2",
      RoomCount: 2,
      Name: "Grand Banquet Hall",
      Description:
        "Spacious hall ideal for weddings, corporate events, and large gatherings. Features elegant décor, professional sound system, and customizable lighting.",
      Capacity: 150,
      PricePerHour: 250,
      Amenities:
        "Sound System, Stage, Dance Floor, Catering Area, Bar Counter, Parking",
      BusinessRoomImage:
        "https://images.unsplash.com/photo-1519167758481-83f29da8d332?w=500",
      IsAvailable: true,
      CreatedAt: new Date("2024-01-05"),
      UpdatedAt: new Date("2024-01-15"),
    },
  ]);
  const [filteredRooms, setFilteredRooms] = useState<BusinessRoom[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<BusinessRoom | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<BusinessRoom | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBusinessRoomDto | UpdateBusinessRoomDto>({
    mode: "all",
  });

  useEffect(() => {
    // TODO: Fetch business rooms from API
    // fetchBusinessRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [businessRooms, searchTerm, availabilityFilter]);

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
    setImageFile(null);
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
    setImageFile(null);
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
    setImageFile(null);
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
      // TODO: Upload image file first, then use the returned URL
      if (imageFile) {
        console.log("Image file to upload:", imageFile);
        // const uploadedImageUrl = await uploadImage(imageFile);
        // data.BusinessRoomImage = uploadedImageUrl;
      }

      if (editingRoom) {
        // TODO: Update business room API call
        console.log("Updating business room:", data);
        // await updateBusinessRoom(editingRoom.BusinessRoomId, data);
      } else {
        // TODO: Create business room API call
        console.log("Creating business room:", data);
        // await createBusinessRoom(data);
      }
      closeModal();
      // fetchBusinessRooms();
    } catch (error) {
      console.error("Error saving business room:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async () => {
    if (!roomToDelete) return;

    try {
      // TODO: Delete business room API call
      console.log("Deleting business room:", roomToDelete.BusinessRoomId);
      // await deleteBusinessRoom(roomToDelete.BusinessRoomId);
      setBusinessRooms(
        businessRooms.filter(
          (r) => r.BusinessRoomId !== roomToDelete.BusinessRoomId
        )
      );
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting business room:", error);
    }
  };

  return (
    <div className={styles.container}>
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