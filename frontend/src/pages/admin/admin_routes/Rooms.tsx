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
  Bed,
  Users,
  DollarSign,
} from "lucide-react";
import { Room } from "../../../interfaces/interfaces";
import { CreateRoomDto, UpdateRoomDto } from "../../../interfaces/dtos/interfaces.dtos";
import styles from "../../../styles/admin/admin_routes/Rooms.module.css";

export const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoomDto | UpdateRoomDto>({
    mode: "all",
  });

  useEffect(() => {
    // TODO: Fetch rooms from API
    // fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchTerm, statusFilter, roomTypeFilter]);

  const filterRooms = () => {
    let filtered = [...rooms];

    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.RoomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.Description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((room) => room.Status === statusFilter);
    }

    if (roomTypeFilter !== "all") {
      filtered = filtered.filter((room) => room.RoomType === roomTypeFilter);
    }

    setFilteredRooms(filtered);
  };

  const openCreateModal = () => {
    setEditingRoom(null);
    reset({
      RoomCount: 0,
      RoomType: "",
      PricePerNight: "",
      Description: "",
      Capacity: 1,
      Status: "Available",
      RoomImage: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    reset({
      RoomCount: room.RoomCount,
      RoomType: room.RoomType,
      PricePerNight: room.PricePerNight.toString(),
      Description: room.Description,
      Capacity: room.Capacity,
      Status: room.Status,
      RoomImage: room.RoomImage,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    reset();
  };

  const openDeleteModal = (room: Room) => {
    setRoomToDelete(room);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRoomToDelete(null);
  };

  const onSubmit = async (data: CreateRoomDto | UpdateRoomDto) => {
    try {
      if (editingRoom) {
        // TODO: Update room API call
        console.log("Updating room:", data);
        // await updateRoom(editingRoom.RoomId, data);
      } else {
        // TODO: Create room API call
        console.log("Creating room:", data);
        // await createRoom(data);
      }
      closeModal();
      // fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  const handleDelete = async () => {
    if (!roomToDelete) return;

    try {
      // TODO: Delete room API call
      console.log("Deleting room:", roomToDelete.RoomId);
      // await deleteRoom(roomToDelete.RoomId);
      setRooms(rooms.filter((r) => r.RoomId !== roomToDelete.RoomId));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const roomTypes = ["Single", "Double", "Suite", "Deluxe", "Presidential"];
  const statuses = ["Available", "Occupied", "Maintenance", "Reserved"];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Room Management</h1>
          <p className={styles.subtitle}>
            Manage all accommodation rooms and their availability
          </p>
        </div>
        <button className={styles.addButton} onClick={openCreateModal}>
          <Plus size={20} />
          Add New Room
        </button>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by room type or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <Bed size={18} />
            <select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Room Types</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Rooms:</span>
          <span className={styles.statValue}>{rooms.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Available:</span>
          <span className={styles.statValue}>
            {rooms.filter((r) => r.Status === "Available").length}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Occupied:</span>
          <span className={styles.statValue}>
            {rooms.filter((r) => r.Status === "Occupied").length}
          </span>
        </div>
      </div>

      <div className={styles.roomsGrid}>
        {filteredRooms.map((room) => (
          <div key={room.RoomId} className={styles.roomCard}>
            <div className={styles.roomImage}>
              {room.RoomImage ? (
                <img src={room.RoomImage} alt={room.RoomType} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <ImageIcon size={40} />
                </div>
              )}
              <span className={`${styles.statusBadge} ${styles[room.Status.toLowerCase()]}`}>
                {room.Status}
              </span>
            </div>

            <div className={styles.roomContent}>
              <div className={styles.roomHeader}>
                <h3 className={styles.roomType}>{room.RoomType}</h3>
                <span className={styles.roomNumber}>#{room.RoomCount}</span>
              </div>

              <p className={styles.roomDescription}>{room.Description}</p>

              <div className={styles.roomDetails}>
                <div className={styles.detail}>
                  <Users size={16} />
                  <span>{room.Capacity} Guests</span>
                </div>
                <div className={styles.detail}>
                  <DollarSign size={16} />
                  <span>${room.PricePerNight}/night</span>
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
          <Bed size={64} className={styles.emptyIcon} />
          <h3>No rooms found</h3>
          <p>Try adjusting your filters or add a new room to get started.</p>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingRoom ? "Edit Room" : "Add New Room"}</h2>
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
                  <label htmlFor="RoomType">Room Type</label>
                  <select
                    id="RoomType"
                    {...register("RoomType", {
                      required: "Room type is required",
                    })}
                    className={errors.RoomType ? styles.inputError : ""}
                  >
                    <option value="">Select type</option>
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.RoomType && (
                    <span className={styles.errorMessage}>
                      {errors.RoomType.message}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="Capacity">Capacity</label>
                  <input
                    type="number"
                    id="Capacity"
                    {...register("Capacity", {
                      required: "Capacity is required",
                      min: { value: 1, message: "Must be at least 1" },
                      max: { value: 10, message: "Cannot exceed 10" },
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
                  <label htmlFor="PricePerNight">Price Per Night ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="PricePerNight"
                    {...register("PricePerNight", {
                      required: "Price is required",
                      min: { value: 0, message: "Must be positive" },
                    })}
                    className={errors.PricePerNight ? styles.inputError : ""}
                  />
                  {errors.PricePerNight && (
                    <span className={styles.errorMessage}>
                      {errors.PricePerNight.message}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="Status">Status</label>
                <select
                  id="Status"
                  {...register("Status", { required: "Status is required" })}
                  className={errors.Status ? styles.inputError : ""}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.Status && (
                  <span className={styles.errorMessage}>
                    {errors.Status.message}
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
                <label htmlFor="RoomImage">Image URL</label>
                <input
                  type="url"
                  id="RoomImage"
                  {...register("RoomImage")}
                  placeholder="https://example.com/image.jpg"
                />
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
            <h2>Delete Room</h2>
            <p>
              Are you sure you want to delete <strong>{roomToDelete.RoomType}</strong> (Room #{roomToDelete.RoomCount})?
              This action cannot be undone.
            </p>
            <div className={styles.deleteActions}>
              <button
                className={styles.cancelButton}
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button className={styles.confirmDeleteButton} onClick={handleDelete}>
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};