import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Calendar,
  Users,
  Clock,
  Star,
  MapPin,
  CreditCard,
  ShoppingCart,
  Bell,
  Search,
  Filter,
  Heart,
  Plus,
  Minus,
  Check,
  X,
  ChefHat,
  Bed,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  Briefcase,
  Loader2,
} from "lucide-react";
import styles from "../../../styles/user/user_routes/Dashboard.module.css";
import {
  Room,
  Delicacy,
  Booking,
  Order,
  Cart,
  User,
  Notification,
  BusinessRoom,
  CreatePaymentData,
  Payment,
  Accommodation,
} from "../../../interfaces/interfaces";
import { DelicacyService } from "../../../services/delicacy.service";
import { RoomsService } from "../../../services/room.service";
import { UsersService } from "../../../services/user.service";
import { socket } from "../../../socket.io";
import { CreateAccommodationDto, CreateBookingDto, CreateCartDto } from "../../../interfaces/dtos/interfaces.dtos";
import { CartService } from "../../../services/cart.service";
import Toast, { ToastProps } from "../../../components/Toast";
import { BusinessRoomService } from "../../../services/business.room.service";
import { PaymentService } from "../../../services/payment.service";
import { TypeService } from "../../../enums/service.type.enum";
import { ServiceResult } from "../../../shared/service.result/service.result";

interface BookingFormData {
  RoomId: string;
  BookingDate: string;
  CheckInDate: string;
  CheckOutDate: string;
  NumberOfGuests: number;
  SpecialRequests?: string;
}

interface OrderFormData {
  DelicacyId: string;
  Quantity: number;
}

type PaymentMethod = "mpesa" | "stripe";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "rooms" | "business-rooms" | "delicacies" | "bookings" | "orders" | "cart"
  >("rooms");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedBusinessRoom, setSelectedBusinessRoom] =
    useState<BusinessRoom | null>(null);
  const [selectedDelicacy, setSelectedDelicacy] = useState<Delicacy | null>(
    null
  );
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    title: string;
    message: string;
    type: "processing" | "success" | "error";
  } | null>(null);
  const [currentPaymentType, setCurrentPaymentType] = useState<
    "cart" | "room" | "business-room"
  >("cart");

  const bookingForm = useForm<BookingFormData>({
    mode: "all"
  });
  const orderForm = useForm<OrderFormData>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [businessRooms, setBusinessRooms] = useState<BusinessRoom[]>([]);
  const [delicacies, setDelicacies] = useState<Delicacy[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<ToastProps | null>(null);

  const CheckInDate = bookingForm.watch("CheckInDate");

  useEffect(() => {
    socket.connect();

    socket.on("payment-created", (createdPayment: Payment) => {
      processPayment(createdPayment.Amount);
    });

    socket.on("payment-error", (response: ServiceResult<object>) => {
      setPaymentStatus({
        title: response.error as string,
        message: response.message as string,
        type: "error",
      });

      setTimeout(() => {
        setIsProcessingPayment(false);
        setTimeout(() => {
          setPaymentStatus(null);
        }, 1000);
      }, 2500);
    });

    socket.on("room-created", (newRoom: Room) => {
      setRooms((prev) => [...prev, newRoom]);
    });

    socket.on("room-updated", (updateRoom: Room) => {
      setRooms((prev) =>
        prev.map((room) =>
          room.RoomId === updateRoom.RoomId ? updateRoom : room
        )
      );
    });

    socket.on("room-deleted", (deletedRoom: Room) => {
      setRooms((prev) =>
        prev.filter((room) => room.RoomId !== deletedRoom.RoomId)
      );
    });

    socket.on("business-room-created", (newBusinessRoom: BusinessRoom) => {
      setBusinessRooms((prev) => [...prev, newBusinessRoom]);
    });

    socket.on("business-room-updated", (updateBusinessRoom: BusinessRoom) => {
      setBusinessRooms((prev) =>
        prev.map((businessRoom) =>
          businessRoom.BusinessRoomId == updateBusinessRoom.BusinessRoomId
            ? updateBusinessRoom
            : businessRoom
        )
      );
    });

    socket.on("business-room-deleted", (deletedRoom: BusinessRoom) => {
      setBusinessRooms((prev) =>
        prev.filter(
          (room) => room.BusinessRoomId !== deletedRoom.BusinessRoomId
        )
      );
    });

    socket.on("delicacy-created", (newDelicacy: Delicacy) => {
      setDelicacies((prev) => [...prev, newDelicacy]);
    });

    socket.on("delicacy-updated", (updatedDelicacy: Delicacy) => {
      setDelicacies((prev) =>
        prev.map((delicacy) =>
          delicacy.DelicacyId == updatedDelicacy.DelicacyId
            ? updatedDelicacy
            : delicacy
        )
      );
    });

    socket.on("delicacy-deleted", (deletedDelicacy: Delicacy) => {
      setDelicacies((prev) =>
        prev.filter(
          (delicacy) => delicacy.DelicacyId !== deletedDelicacy.DelicacyId
        )
      );
    });

    socket.on("cart-created", (createdCart: Cart) => {
      console.log("cart created now oh", createdCart);
      setCartItems((prev) => [...prev, createdCart]);
    });

    socket.on("cart-updated", (updatedCart: Cart) => {
      setCartItems((prev) =>
        prev.map((cart) =>
          cart.CartId == updatedCart.CartId ? updatedCart : cart
        )
      );
    });

    socket.on("cart-deleted", (deletedCart: Cart) => {
      setCartItems((prev) =>
        prev.filter((cart) => cart.CartId !== deletedCart.CartId)
      );
    });

    socket.on("order-created", (createdOrder: Order) => {
      setUserOrders([... userOrders, createdOrder]);
    });

    socket.on("booking-created", (createdBooking: Booking) => {
      setUserBookings([...userBookings, createdBooking]);
    });

    socket.on("cart-cleared", (clearedItems: Cart[]) => {
      setCartItems([]);
    });

    return () => {
      socket.off("order-created");
      socket.off("booking-created");
      socket.off("payment-created");
      socket.off("payment-error");
      socket.off("delicacy-created");
      socket.off("delicacy-updated");
      socket.off("delicacy-deleted");
      socket.off("business-room-created");
      socket.off("business-room-updated");
      socket.off("business-room-deleted");
      socket.off("room-created");
      socket.off("room-updated");
      socket.off("room-deleted");
      socket.off("cart-created");
      socket.off("cart-updated");
      socket.off("cart-deleted");
      socket.off("cart-cleared");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const getDelicacies = async () => {
      let result = await DelicacyService.GetAvailableDelicacies();

      if (result.success) {
        setDelicacies(() => result.dataList as Delicacy[]);
      }
    };

    const getRooms = async () => {
      let result = await RoomsService.GetAllRooms();

      if (result.success) {
        setRooms(() => result.dataList as Room[]);
      }
    };

    const getSingleUser = async () => {
      let result = await UsersService.GetUserByUserId();

      if (result.success) {
        setUserBookings(() => (result.data as User).Bookings as Booking[]);
        setUserOrders(() => (result.data as User).Orders as Order[]);
        setNotifications(
          () => (result.data as User).Notifications as Notification[]
        );
        setCartItems(() => (result.data as User).Carts as Cart[]);
      }
    };

    const getBusinessRooms = async () => {
      let result = await BusinessRoomService.GetAvailableBusinessRooms();

      if (result.success) {
        setBusinessRooms(() => result.dataList as BusinessRoom[]);
      }
    };

    getDelicacies();
    getRooms();
    getSingleUser();
    getBusinessRooms();
  }, []);

  const categories = [
    "All",
    "Appetizer",
    "Main Course",
    "Dessert",
    "Beverages",
  ];

  const handleBack = () => {
    navigate(-1);
  };

  function calculateDurationInHours(
    startTime: string,
    endTime: string
  ): number {
    const toMinutes = (time: string): number => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    let diff = end - start;

    if (diff < 0) {
      diff += 24 * 60;
    }

    return diff / 60;
  }


  const isTimeAfter = (t1: string, t2: string) => {
    const [h1, m1] = t1.split(":").map(Number);
    const [h2, m2] = t2.split(":").map(Number);
    return h1 > h2 || (h1 === h2 && m1 > m2);
  };

  const isFutureTimeToday = (time: string) => {
    const now = new Date();
    const [h, m] = time.split(":").map(Number);

    return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setSelectedBusinessRoom(null);
    setCurrentPaymentType("room");
    setShowBookingModal(true);
  };

  const handleBookBusinessRoom = (room: BusinessRoom) => {
    setSelectedBusinessRoom(room);
    setSelectedRoom(null);
    setCurrentPaymentType("business-room");
    setShowBookingModal(true);
  };

  const handleOrderDelicacy = (delicacy: Delicacy) => {
    setSelectedDelicacy(delicacy);
    setShowOrderModal(true);
  };

  const onBookingSubmit = async (data: BookingFormData) => {
    setShowBookingModal(false);
    setShowPaymentModal(true);

    const room = selectedRoom || selectedBusinessRoom;
    const price = selectedRoom
      ? selectedRoom.PricePerNight
      : selectedBusinessRoom?.PricePerHour || 0;

    if (selectedRoom) {
      try {
        setPaymentStatus({
          title: "Processing Accommdation",
          message: "Please wait while we prepare your accommodation...",
          type: "processing",
        });

        let AccommodationData: CreateAccommodationDto = {
          CheckInDate: new Date(data.CheckInDate),
          CheckOutDate: new Date(data.CheckOutDate),
          SpecialRequests: data.SpecialRequests,
        };

        let PaymentData: CreatePaymentData = {
          ServiceType: TypeService.ACCOMMODATION,
          Amount:
            (price *
              (new Date(data.CheckOutDate).getTime() -
                new Date(data.CheckInDate).getTime())) /
            (1000 * 3600 * 24),
          Accommodation: AccommodationData,
        };

        let result = await PaymentService.CreatePayment(
          selectedRoom.RoomId,
          PaymentData
        );

        if (result.success) {
          setPaymentStatus({
            title: "STK Push Sent",
            message:
              "Please check your phone and enter your M-PESA PIN to complete the payment.",
            type: "processing",
          });
        } else {
          setTimeout(() => {
            setShowPaymentModal(false);
            setPaymentStatus(null);
          }, 800);

          const toast: ToastProps = {
            isVisible: true,
            type: "warning",
            title: (result.error as string) ?? "Booking Failed",
            message:
              (result.message as string) ??
              "An error occurred while processing your booking.",
            onClose: () => setToast(null),
          };
          setToast(toast);
        }

        bookingForm.reset();
      } catch (error: any) {
        setPaymentStatus({
          title: (error?.response?.data?.error as string) ?? "Booking Failed",
          message:
            (error?.response?.data?.message as string) ??
            "An error occurred while processing your booking.",
          type: "error",
        });

        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentStatus(null);
        }, 1000);

        const toast: ToastProps = {
          isVisible: true,
          type: "error",
          title: (error?.response?.data?.error as string) ?? "Booking Failed",
          message:
            (error?.response?.data?.message as string) ??
            "An error occurred while processing your booking.",
          onClose: () => setToast(null),
        };
        setToast(toast);
      }
    } else if (selectedBusinessRoom) {
      try {
        setPaymentStatus({
          title: "Processing Booking",
          message: "Please wait while we prepare your booking...",
          type: "processing",
        });

        let BookingData: CreateBookingDto = {
          SpecialRequests: data.SpecialRequests,
          NumberOfGuests: Number(data.NumberOfGuests),
          DurationInHours: calculateDurationInHours(
            data.CheckInDate,
            data.CheckOutDate
          ),
          BookingDate: new Date(data.BookingDate),
          CheckInTime: data.CheckInDate,
          CheckOutTime: data.CheckOutDate,
          TotalAmount: calculateDurationInHours(
            data.CheckInDate,
            data.CheckOutDate
          ) * price,
        };

        let PaymentData: CreatePaymentData = {
          ServiceType: TypeService.BOOKING,
          Amount: price,
          Booking: BookingData,
        };

        let result = await PaymentService.CreatePayment(
          selectedBusinessRoom.BusinessRoomId,
          PaymentData
        );

        if (result.success) {
          setPaymentStatus({
            title: "STK Push Sent",
            message:
              "Please check your phone and enter your M-PESA PIN to complete the payment.",
            type: "processing",
          });
        } else {
          setTimeout(() => {
            setShowPaymentModal(false);
            setPaymentStatus(null);
          }, 800);

          const toast: ToastProps = {
            isVisible: true,
            type: "warning",
            title: (result.error as string) ?? "Booking Failed",
            message:
              (result.message as string) ??
              "An error occurred while processing your booking.",
            onClose: () => setToast(null),
          };
          setToast(toast);
        }

        bookingForm.reset();
      } catch (error: any) {
        setPaymentStatus({
          title: (error?.response?.data?.error as string) ?? "Booking Failed",
          message:
            (error?.response?.data?.message as string) ??
            "An error occurred while processing your booking.",
          type: "error",
        });

        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentStatus(null);
        }, 1000);

        const toast: ToastProps = {
          isVisible: true,
          type: "error",
          title: (error?.response?.data?.error as string) ?? "Booking Failed",
          message:
            (error?.response?.data?.message as string) ??
            "An error occurred while processing your booking.",
          onClose: () => setToast(null),
        };
        setToast(toast);
      }
    }
    bookingForm.reset();
  };

  const onOrderSubmit = async(data: OrderFormData) => {
    //
  };

  const processPayment = async (amount: number) => {
    setPaymentStatus({
      title: "Processing Payment ...",
      message: "Hang in there, payment is being finalised.",
      type: "processing",
    });

    setIsProcessingPayment(true);

    if (paymentMethod === "mpesa") {
      setTimeout(() => {
        setPaymentStatus({
          title: "Payment Successful!",
          message:
            "Your payment has been processed successfully. You will receive a confirmation shortly.",
          type: "success",
        });
        setIsProcessingPayment(false);

        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentStatus(null);

          const toast: ToastProps = {
            isVisible: true,
            type: "success",
            title: "SUCCESS",
            message: `${
              currentPaymentType === "cart" ? "Order" : "Booking"
            } completed successfully!`,
            onClose: () => setToast(null),
          };
          setToast(toast);
        }, 2000);
      }, 5000);
    } else {
      setPaymentStatus({
        title: "Processing Stripe Payment",
        message: "Please wait while we redirect you to Stripe...",
        type: "processing",
      });

      setTimeout(() => {
        setPaymentStatus({
          title: "Payment Successful!",
          message: "Your payment has been processed successfully via Stripe.",
          type: "success",
        });
        setIsProcessingPayment(false);

        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentStatus(null);

          const toast: ToastProps = {
            isVisible: true,
            type: "success",
            title: "SUCCESS",
            message: `${
              currentPaymentType === "cart" ? "Order" : "Booking"
            } completed successfully!`,
            onClose: () => setToast(null),
          };
          setToast(toast);
        }, 2000);
      }, 3000);
    }
  };

  const handleCheckout = async () => {
    setCurrentPaymentType("cart");
    setShowPaymentModal(true);

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + (item.Delicacy?.Price ?? 0) * item.Quantity,
      0
    );

    try {
      setPaymentStatus({
        title: "Processing Order",
        message: "Please wait while we prepare your order...",
        type: "processing",
      });

      let result = await PaymentService.CreatePayment("nullid", {
        ServiceType: TypeService.ORDER,
        Amount: totalAmount,
      });

      if (result.success) {
        setPaymentStatus({
          title: "STK Push Sent",
          message:
            "Please check your phone and enter your M-PESA PIN to complete the payment.",
          type: "processing",
        });
      } else {
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentStatus(null);
        }, 800);

        const toast: ToastProps = {
          isVisible: true,
          type: "warning",
          title: (result.error as string) ?? "Order Failed",
          message:
            (result.message as string) ??
            "An error occurred while processing your order.",
          onClose: () => setToast(null),
        };
        setToast(toast);
      }

    } catch (error: any) {
      setPaymentStatus({
        title: (error?.response?.data?.error as string) ?? "Order Failed",
        message:
          (error?.response?.data?.message as string) ??
          "An error occurred while processing your order.",
        type: "error",
      });

      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentStatus(null);
      }, 1000);

      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: (error?.response?.data?.error as string) ?? "Booking Failed",
        message:
          (error?.response?.data?.message as string) ??
          "An error occurred while processing your booking.",
        onClose: () => setToast(null),
      };
      setToast(toast);
    }

    setShowOrderModal(false);
  };

  const addToCart = async (delicacy: Delicacy) => {
    try {
      const newCartItem: CreateCartDto = {
        Quantity: 1,
      };

      let result = await CartService.CreateCart(
        delicacy.DelicacyId,
        newCartItem
      );

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

        setToast(() => toast);
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

        setToast(() => toast);
      }
    } catch (error: any) {
      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: error?.response?.data?.error as string,
        message: error?.response?.data?.message as string,
        onClose: function (): void {
          setToast(() => null);
        },
      };

      setToast(() => toast);
    }
  };

  const removeFromCart = async (CartId: string) => {
    try {
      let result = await CartService.DeleteCart(CartId);

      if (result.success) {
        const toast: ToastProps = {
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message: result.message as string,
          onClose: function (): void {
            setToast(() => toast);
          },
        };

        setToast(() => toast);
      } else {
        const toast: ToastProps = {
          isVisible: true,
          type: "warning",
          title: result.error as string,
          message: result.message as string,
          onClose: function (): void {
            setToast(() => null);
          },
        };

        setToast(() => toast);
      }
    } catch (error: any) {
      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: error?.response?.data?.error as string,
        message: error?.response?.data?.message as string,
        onClose: function (): void {
          setToast(() => null);
        },
      };

      setToast(() => toast);
      return;
    }
  };

  const IncrementCart = async (CartId: string) => {
    try {
      let result = await CartService.IncrementCartItem(CartId);

      if (result.success) {
        const toast: ToastProps = {
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message: result.message as string,
          onClose: function (): void {
            setToast(() => toast);
          },
        };

        setToast(() => toast);
      } else {
        const toast: ToastProps = {
          isVisible: true,
          type: "warning",
          title: result.error as string,
          message: result.message as string,
          onClose: function (): void {
            setToast(() => null);
          },
        };

        setToast(() => toast);
      }
    } catch (error: any) {
      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: error?.response?.data?.error as string,
        message: error?.response?.data?.message as string,
        onClose: function (): void {
          setToast(() => null);
        },
      };

      setToast(() => toast);
      return;
    }
  };

  const DecrementCart = async (CartId: string) => {
    try {
      let result = await CartService.DecrementCartItem(CartId);

      if (result.success) {
        const toast: ToastProps = {
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message: result.message as string,
          onClose: function (): void {
            setToast(() => toast);
          },
        };

        setToast(() => toast);
      } else {
        const toast: ToastProps = {
          isVisible: true,
          type: "warning",
          title: result.error as string,
          message: result.message as string,
          onClose: function (): void {
            setToast(() => null);
          },
        };

        setToast(() => toast);
      }
    } catch (error: any) {
      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: error?.response?.data?.error as string,
        message: error?.response?.data?.message as string,
        onClose: function (): void {
          setToast(() => null);
        },
      };

      setToast(() => toast);
      return;
    }
  };

  const filteredRooms = rooms?.filter(
    (room) =>
      room.RoomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBusinessRooms = businessRooms?.filter(
    (room) =>
      room.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDelicacies = delicacies?.filter((delicacy) => {
    const matchesSearch =
      delicacy.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delicacy.Description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || delicacy.Category === selectedCategory;
    return matchesSearch && matchesCategory && delicacy.IsAvailable;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${styles.star} ${i < rating ? styles.filled : ""}`}
        size={16}
      />
    ));
  };

  return (
    <div className={styles["dashboard-container"]}>
      {toast && <Toast {...toast}></Toast>}
      <div className={styles["dashboard-header"]}>
        <div className={styles["header-top"]}>
          <button onClick={handleBack} className={styles["back-button"]}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className={styles.notifications}>
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className={styles["notification-badge"]}>
                {notifications.length}
              </span>
            )}
          </div>
        </div>

        <div className={styles["welcome-section"]}>
          <h1 className={styles["dashboard-title"]}>Welcome to FancyTunes</h1>
          <p className={styles["dashboard-subtitle"]}>
            Discover amazing rooms and delicious cuisine
          </p>
        </div>

        <div className={styles["search-section"]}>
          <div className={styles["search-bar"]}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search rooms, delicacies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === "delicacies" && (
            <div className={styles["category-filter"]}>
              <Filter size={18} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className={styles["dashboard-tabs"]}>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "rooms" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("rooms")}
        >
          <Bed size={20} />
          <span>Rooms</span>
        </button>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "business-rooms" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("business-rooms")}
        >
          <Briefcase size={20} />
          <span>Business Rooms</span>
        </button>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "delicacies" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("delicacies")}
        >
          <ChefHat size={20} />
          <span>Menu</span>
        </button>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "bookings" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          <Calendar size={20} />
          <span>My Bookings</span>
        </button>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "orders" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          <Clock size={20} />
          <span>My Orders</span>
        </button>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "cart" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("cart")}
        >
          <ShoppingCart size={20} />
          <span>Cart</span>
          {cartItems.length > 0 && (
            <span className={styles["cart-badge"]}>{cartItems.length}</span>
          )}
        </button>
      </div>

      <div className={styles["dashboard-content"]}>
        {activeTab === "rooms" && (
          <div className={styles["rooms-section"]}>
            <div className={styles["section-header"]}>
              <h2>Available Rooms</h2>
              <span className={styles.count}>
                {filteredRooms?.length} rooms
              </span>
            </div>
            {filteredRooms?.length === 0 ? (
              <div className={styles["empty-state"]}>
                <Bed size={48} />
                <h3>No Rooms Available</h3>
                <p>
                  There are currently no rooms available. Please check back
                  later!
                </p>
              </div>
            ) : (
              <div className={styles["rooms-grid"]}>
                {filteredRooms?.map((room) => (
                  <div key={room.RoomId} className={styles["room-card"]}>
                    <div className={styles["room-image"]}>
                      <img src={room.RoomImage} alt={room.RoomType} />
                      <div className={styles["room-status"]}>
                        <span
                          className={`${styles.status} ${
                            styles[room.Status.toLowerCase()]
                          }`}
                        >
                          {room.Status}
                        </span>
                      </div>
                    </div>
                    <div className={styles["room-content"]}>
                      <div className={styles["room-header"]}>
                        <h3>{room.RoomType}</h3>
                        <span className={styles["room-number"]}>
                          #{room.RoomCount}
                        </span>
                      </div>
                      <p className={styles["room-description"]}>
                        {room.Description}
                      </p>
                      <div className={styles["room-details"]}>
                        <div className={styles.detail}>
                          <Users size={16} />
                          <span>{room.Capacity} guests</span>
                        </div>
                        <div className={styles.detail}>
                          <MapPin size={16} />
                          <span>Premium Location</span>
                        </div>
                      </div>
                      <div className={styles["room-amenities"]}>
                        <Wifi size={16} />
                        <Tv size={16} />
                        <Coffee size={16} />
                        <Bath size={16} />
                        <Car size={16} />
                      </div>
                      <div className={styles["room-footer"]}>
                        <div className={styles.price}>
                          <span className={styles.amount}>
                            Ksh. {room.PricePerNight}
                          </span>
                          <span className={styles.period}>/night</span>
                        </div>
                        <button
                          className={styles["book-button"]}
                          onClick={() => handleBookRoom(room)}
                          disabled={room.Status !== "Available"}
                        >
                          {room.Status === "Available"
                            ? "Book Room"
                            : "Unavailable"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "business-rooms" && (
          <div className={styles["rooms-section"]}>
            <div className={styles["section-header"]}>
              <h2>Business & Conference Rooms</h2>
              <span className={styles.count}>
                {filteredBusinessRooms?.length} rooms
              </span>
            </div>
            {filteredBusinessRooms?.length === 0 ? (
              <div className={styles["empty-state"]}>
                <Briefcase size={48} />
                <h3>No Business Rooms Available</h3>
                <p>
                  There are currently no business rooms available. Please check
                  back later!
                </p>
              </div>
            ) : (
              <div className={styles["rooms-grid"]}>
                {filteredBusinessRooms?.map((room) => (
                  <div
                    key={room.BusinessRoomId}
                    className={styles["room-card"]}
                  >
                    <div className={styles["room-image"]}>
                      <img src={room.BusinessRoomImage} alt={room.Name} />
                      <div className={styles["room-status"]}>
                        <span
                          className={`${styles.status} ${
                            room.IsAvailable
                              ? styles.available
                              : styles.occupied
                          }`}
                        >
                          {room.IsAvailable ? "Available" : "Occupied"}
                        </span>
                      </div>
                    </div>
                    <div className={styles["room-content"]}>
                      <div className={styles["room-header"]}>
                        <h3>{room.Name}</h3>
                        {room.RoomCount && (
                          <span className={styles["room-number"]}>
                            #{room.RoomCount}
                          </span>
                        )}
                      </div>
                      <p className={styles["room-description"]}>
                        {room.Description}
                      </p>
                      <div className={styles["room-details"]}>
                        <div className={styles.detail}>
                          <Users size={16} />
                          <span>{room.Capacity} people</span>
                        </div>
                        <div className={styles.detail}>
                          <Briefcase size={16} />
                          <span>Professional Setup</span>
                        </div>
                      </div>
                      {room.Amenities && (
                        <div className={styles["room-amenities"]}>
                          <Wifi size={16} />
                          <Tv size={16} />
                          <Coffee size={16} />
                        </div>
                      )}
                      <div className={styles["room-footer"]}>
                        <div className={styles.price}>
                          <span className={styles.amount}>
                            Ksh. {room.PricePerHour}
                          </span>
                          <span className={styles.period}>/hour</span>
                        </div>
                        <button
                          className={styles["book-button"]}
                          onClick={() => handleBookBusinessRoom(room)}
                          disabled={!room.IsAvailable}
                        >
                          {room.IsAvailable ? "Book Business Room" : "Unavailable"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "delicacies" && (
          <div className={styles["delicacies-section"]}>
            <div className={styles["section-header"]}>
              <h2>Our Menu</h2>
              <span className={styles.count}>
                {filteredDelicacies?.length} items
              </span>
            </div>
            {filteredDelicacies?.length === 0 ? (
              <div className={styles["empty-state"]}>
                <ChefHat size={48} />
                <h3>No Menu Items Available</h3>
                <p>
                  There are currently no menu items available. Please check back
                  later!
                </p>
              </div>
            ) : (
              <div className={styles["delicacies-grid"]}>
                {filteredDelicacies?.map((delicacy) => (
                  <div
                    key={delicacy.DelicacyId}
                    className={styles["delicacy-card"]}
                  >
                    <div className={styles["delicacy-image"]}>
                      <img src={delicacy.DelicacyImage} alt={delicacy.Name} />
                      <button
                        className={styles["favorite-button"]}
                        onClick={() => {
                          /* Handle favorite */
                        }}
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                    <div className={styles["delicacy-content"]}>
                      <div className={styles["delicacy-header"]}>
                        <h3>{delicacy.Name}</h3>
                        <span className={styles["category-badge"]}>
                          {delicacy.Category}
                        </span>
                      </div>
                      <p className={styles["delicacy-description"]}>
                        {delicacy.Description}
                      </p>
                      <div className={styles["delicacy-rating"]}>
                        {renderStars(4)}
                        <span className={styles["rating-text"]}>(4.0)</span>
                      </div>
                      <div className={styles["delicacy-footer"]}>
                        <div className={styles.price}>
                          <span className={styles.amount}>
                            Ksh. {delicacy.Price}
                          </span>
                        </div>
                        <div className={styles["action-buttons"]}>
                          <button
                            className={styles["cart-button"]}
                            onClick={() => addToCart(delicacy)}
                          >
                            <ShoppingCart size={16} />
                            <span className={styles["button-text"]}>
                              Add to Cart
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className={styles["bookings-section"]}>
            <div className={styles["section-header"]}>
              <h2>My Bookings</h2>
              <span className={styles.count}>
                {userBookings?.length} bookings
              </span>
            </div>
            {userBookings?.length === 0 ? (
              <div className={styles["empty-state"]}>
                <Calendar size={48} />
                <h3>No Bookings Yet</h3>
                <p>Start by booking your first room!</p>
                <button
                  className={styles["primary-button"]}
                  onClick={() => setActiveTab("rooms")}
                >
                  Browse Rooms
                </button>
              </div>
            ) : (
              <div className={styles["bookings-list"]}>
                {userBookings?.map((booking) => (
                  <div
                    key={booking.BookingId}
                    className={styles["booking-card"]}
                  >
                    <div className={styles["booking-header"]}>
                      <div className={styles["booking-title"]}>
                        <h4>{booking.BusinessRoom?.Name || "Room Booking"}</h4>
                        <span
                          className={`${styles["booking-status"]} ${
                            styles[
                              booking.BookingStatus.toLowerCase().replace(
                                /\s/g,
                                "-"
                              )
                            ]
                          }`}
                        >
                          {booking.BookingStatus}
                        </span>
                      </div>
                      <div className={styles["booking-id"]}>
                        <span>#{booking.BookingId.slice(0, 8)}</span>
                      </div>
                    </div>

                    <div className={styles["booking-details"]}>
                      <div className={styles["booking-info"]}>
                        <Calendar size={16} />
                        <div className={styles["booking-dates"]}>
                          <span className={styles["date-label"]}>
                            Check-in:
                          </span>
                          <span className={styles["date-value"]}>
                            {new Date(booking.BookingDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className={styles["booking-info"]}>
                        <Calendar size={16} />
                        <div className={styles["booking-dates"]}>
                          <span className={styles["date-label"]}>
                            Check-out:
                          </span>
                          <span className={styles["date-value"]}>
                            {new Date(
                              booking.BookingDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className={styles["booking-info"]}>
                        <Users size={16} />
                        <span>{booking.NumberOfGuests} Guests</span>
                      </div>

                      {booking.SpecialRequests && (
                        <div className={styles["booking-requests"]}>
                          <span className={styles["requests-label"]}>
                            Special Requests:
                          </span>
                          <p className={styles["requests-text"]}>
                            {booking.SpecialRequests}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className={styles["booking-footer"]}>
                      <div className={styles["booking-amount"]}>
                        <span className={styles["amount-label"]}>
                          Total Amount:
                        </span>
                        <span className={styles["amount-value"]}>
                          Ksh.{" "}
                          {parseFloat(
                            String(booking.TotalAmount) || "0"
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className={styles["payment-status"]}>
                        <span
                          className={`${styles["payment-badge"]} ${
                            styles[booking.PaymentStatus.toLowerCase()]
                          }`}
                        >
                          {booking.PaymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className={styles["orders-section"]}>
            <div className={styles["section-header"]}>
              <h2>My Orders</h2>
              <span className={styles.count}>{userOrders?.length} orders</span>
            </div>
            {userOrders?.length === 0 ? (
              <div className={styles["empty-state"]}>
                <Clock size={48} />
                <h3>No Orders Yet</h3>
                <p>Discover our delicious menu!</p>
                <button
                  className={styles["primary-button"]}
                  onClick={() => setActiveTab("delicacies")}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className={styles["orders-list"]}>
                {userOrders?.map((order) => (
                  <div key={order.OrderId} className={styles["order-card"]}>
                    <div className={styles["order-header"]}>
                      <div className={styles["order-title"]}>
                        <h4>{order.Delicacy?.Name || "Order"}</h4>
                        <span
                          className={`${styles["order-status"]} ${
                            styles[
                              order.OrderStatus.toLowerCase().replace(
                                /\s/g,
                                "-"
                              )
                            ]
                          }`}
                        >
                          {order.OrderStatus}
                        </span>
                      </div>
                      <div className={styles["order-id"]}>
                        <span>#{order.OrderId.slice(0, 8)}</span>
                      </div>
                    </div>

                    <div className={styles["order-content"]}>
                      <div className={styles["order-image"]}>
                        <img
                          src={order.Delicacy?.DelicacyImage}
                          alt={order.Delicacy?.Name}
                        />
                      </div>

                      <div className={styles["order-details"]}>
                        <div className={styles["order-info"]}>
                          <Clock size={16} />
                          <div>
                            <span className={styles["info-label"]}>
                              Ordered:
                            </span>
                            <span className={styles["info-value"]}>
                              {new Date(order.OrderedAt).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(order.OrderedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        {order.DeliveredAt && (
                          <div className={styles["order-info"]}>
                            <Check size={16} />
                            <div>
                              <span className={styles["info-label"]}>
                                Delivered:
                              </span>
                              <span className={styles["info-value"]}>
                                {new Date(
                                  order.DeliveredAt
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(
                                  order.DeliveredAt
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className={styles["order-info"]}>
                          <ShoppingCart size={16} />
                          <span>Quantity: {order.Quantity}</span>
                        </div>

                        <div className={styles["order-info"]}>
                          <span className={styles["info-label"]}>
                            Unit Price:
                          </span>
                          <span className={styles["info-value"]}>
                            Ksh.{" "}
                            {parseFloat(
                              String(order.Delicacy?.Price) || "0"
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles["order-footer"]}>
                      <div className={styles["order-amount"]}>
                        <span className={styles["amount-label"]}>
                          Total Amount:
                        </span>
                        <span className={styles["amount-value"]}>
                          Ksh.{" "}
                          {parseFloat(String(order.TotalAmount) || "0").toFixed(
                            2
                          )}
                        </span>
                      </div>
                      <div className={styles["payment-status"]}>
                        <span
                          className={`${styles["payment-badge"]} ${
                            styles[order.PaymentStatus.toLowerCase()]
                          }`}
                        >
                          {order.PaymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "cart" && (
          <div className={styles["cart-section"]}>
            <div className={styles["section-header"]}>
              <h2>Shopping Cart</h2>
              <span className={styles.count}>{cartItems.length} items</span>
            </div>
            {cartItems.length === 0 ? (
              <div className={styles["empty-state"]}>
                <ShoppingCart size={48} />
                <h3>Your Cart is Empty</h3>
                <p>Add some delicious items to your cart!</p>
                <button
                  className={styles["primary-button"]}
                  onClick={() => setActiveTab("delicacies")}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className={styles["cart-content"]}>
                <div className={styles["cart-items"]}>
                  {cartItems.map((item: Cart) => (
                    <div key={item.CartId} className={styles["cart-item"]}>
                      <div className={styles["item-image"]}>
                        <img
                          src={item?.Delicacy?.DelicacyImage || ""}
                          alt={item?.Delicacy?.Name || "Delicacy"}
                        />
                      </div>
                      <div className={styles["item-details"]}>
                        <h4>{item?.Delicacy?.Name || ""}</h4>
                        <p>
                          Ksh.
                          {(
                            parseFloat(String(item?.Delicacy?.Price ?? 0)) || 0
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div className={styles["quantity-controls"]}>
                        <button onClick={() => DecrementCart(item.CartId)}>
                          <Minus size={16} />
                        </button>
                        <span>{item.Quantity}</span>
                        <button onClick={() => IncrementCart(item.CartId)}>
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className={styles["item-total"]}>
                        Ksh.
                        {((item?.Delicacy?.Price ?? 0) * item.Quantity).toFixed(
                          2
                        )}
                      </div>
                      <button
                        className={styles["remove-button"]}
                        onClick={() => removeFromCart(item.CartId)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles["cart-summary"]}>
                  <div className={styles.total}>
                    <strong>
                      Total: Ksh.
                      {cartItems
                        .reduce(
                          (sum, item) =>
                            sum + (item.Delicacy?.Price ?? 0) * item.Quantity,
                          0
                        )
                        .toFixed(2)}
                    </strong>
                  </div>
                  <button
                    className={styles["checkout-button"]}
                    onClick={handleCheckout}
                  >
                    <CreditCard size={20} />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showBookingModal && (selectedRoom || selectedBusinessRoom) && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["modal-header"]}>
              <h3>
                Book{" "}
                {selectedRoom
                  ? selectedRoom.RoomType
                  : selectedBusinessRoom?.Name}
              </h3>
              <button onClick={() => setShowBookingModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={bookingForm.handleSubmit(onBookingSubmit)}
              className={styles["booking-form"]}
            >
              <div className={styles["booking-preview"]}>
                <div className={styles["preview-image"]}>
                  <img
                    src={
                      selectedRoom
                        ? selectedRoom.RoomImage
                        : selectedBusinessRoom?.BusinessRoomImage
                    }
                    alt={
                      selectedRoom
                        ? selectedRoom.RoomType
                        : selectedBusinessRoom?.Name
                    }
                  />
                </div>
                <div className={styles["preview-info"]}>
                  <h4>
                    {selectedRoom
                      ? selectedRoom.RoomType
                      : selectedBusinessRoom?.Name}
                  </h4>
                  <p className={styles["preview-price"]}>
                    Ksh.
                    {selectedRoom
                      ? selectedRoom.PricePerNight
                      : selectedBusinessRoom?.PricePerHour}
                    <span>{selectedRoom ? "/night" : "/hour"}</span>
                  </p>
                  <div className={styles["preview-details"]}>
                    <span>
                      <Users size={14} />{" "}
                      {selectedRoom
                        ? selectedRoom.Capacity
                        : selectedBusinessRoom?.Capacity}{" "}
                      {selectedRoom ? "guests" : "people"}
                    </span>
                  </div>
                </div>
              </div>

              {selectedBusinessRoom && (
                <div className={styles["form-group"]}>
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    {...bookingForm.register("BookingDate", {
                      required: "Check-in is required",
                      validate: (value) => {
                        return (
                          new Date(value) > new Date() ||
                          "Check-in date must be in the future"
                        );
                      },
                    })}
                  />
                  {bookingForm.formState.errors.BookingDate && (
                    <span className={styles.error}>
                      {bookingForm.formState.errors.BookingDate.message}
                    </span>
                  )}
                </div>
              )}

              <div className={styles["form-group"]}>
                {selectedBusinessRoom ? (
                  <label>Check-in Time</label>
                ) : (
                  <label>Check-in Date</label>
                )}
                <input
                  type={selectedBusinessRoom ? "time" : "date"}
                  {...bookingForm.register("CheckInDate", {
                    required: "Check-in is required",
                    validate: (value) => {
                      if (selectedBusinessRoom) {
                        if(!CheckInDate) return "Please select check-in date first";
                        
                        const selectedDate = new Date(CheckInDate);
                        const today = new Date();

                        const isToday =
                          selectedDate.toDateString() === today.toDateString();

                        if (!isToday) return true;

                        const [hours, minutes] = value.split(":");
                        const selectedDateTime = new Date(CheckInDate);
                        selectedDateTime.setHours(+hours, +minutes, 0, 0);

                        return (
                          selectedDateTime > today ||
                          "Check-in time must be after the current time"
                        );
                      } else {
                        return (
                          new Date(value) > new Date() ||
                          "Check-in date must be in the future"
                        );
                      }
                    },
                  })}
                />
                {bookingForm.formState.errors.CheckInDate && (
                  <span className={styles.error}>
                    {bookingForm.formState.errors.CheckInDate.message}
                  </span>
                )}
              </div>
              <div className={styles["form-group"]}>
                {selectedBusinessRoom ? (
                  <label>Check-out Time</label>
                ) : (
                  <label>Check-out Date</label>
                )}
                <input
                  type={selectedBusinessRoom ? "time" : "date"}
                  {...bookingForm.register("CheckOutDate", {
                    required: "Check-out is required",
                    validate: (value) => {
                      const checkIn = bookingForm.watch("CheckInDate");

                      if (!checkIn) return "Please select check-in first";

                      if (selectedBusinessRoom) {
                        return (
                          isTimeAfter(value, checkIn) ||
                          "Check-out time must be after check-in time"
                        );
                      } else {
                        return (
                          new Date(value) > new Date(checkIn) ||
                          "Check-out date must be after check-in date"
                        );
                      }
                    },
                  })}
                />
                {bookingForm.formState.errors.CheckOutDate && (
                  <span className={styles.error}>
                    {bookingForm.formState.errors.CheckOutDate.message}
                  </span>
                )}
              </div>
              <div className={styles["form-group"]}>
                <label>Number of {selectedRoom ? "Guests" : "People"}</label>
                <input
                  type="number"
                  min="1"
                  max={
                    selectedRoom
                      ? selectedRoom.Capacity
                      : selectedBusinessRoom?.Capacity
                  }
                  {...bookingForm.register("NumberOfGuests", {
                    required: "Number of guests is required",
                    min: { value: 1, message: "At least 1 guest is required" },
                    max: {
                      value: selectedRoom
                        ? selectedRoom.Capacity
                        : selectedBusinessRoom?.Capacity || 1,
                      message: `Maximum ${
                        selectedRoom
                          ? selectedRoom.Capacity
                          : selectedBusinessRoom?.Capacity
                      } guests allowed`,
                    },
                  })}
                />
                {bookingForm.formState.errors.NumberOfGuests && (
                  <span className={styles.error}>
                    {bookingForm.formState.errors.NumberOfGuests.message}
                  </span>
                )}
              </div>
              <div className={styles["form-group"]}>
                <label>Special Requests (Optional)</label>
                <textarea
                  {...bookingForm.register("SpecialRequests")}
                  placeholder="Any special requirements..."
                />
              </div>

              <div className={styles["payment-method-selector"]}>
                <h4>Select Payment Method</h4>
                <div className={styles["payment-options"]}>
                  <label className={styles["payment-option"]}>
                    <input
                      type="radio"
                      value="mpesa"
                      checked={paymentMethod === "mpesa"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                    />
                    <div className={styles["payment-option-content"]}>
                      <span className={styles["payment-icon"]}>📱</span>
                      <span>M-PESA</span>
                    </div>
                  </label>
                  <label className={styles["payment-option"]}>
                    <input
                      type="radio"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                    />
                    <div className={styles["payment-option-content"]}>
                      <span className={styles["payment-icon"]}>💳</span>
                      <span>Stripe</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className={styles["modal-actions"]}>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className={styles["cancel-button"]}
                >
                  Cancel
                </button>
                <button type="submit" className={styles["submit-button"]}>
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Processing Modal */}
      {showPaymentModal && paymentStatus && (
        <div className={styles["modal-overlay"]}>
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["payment-modal"]}>
              <div className={styles["payment-icon-container"]}>
                {paymentStatus.type === "processing" && (
                  <Loader2 className={styles["spinner"]} size={64} />
                )}
                {paymentStatus.type === "success" && (
                  <div className={styles["success-icon"]}>
                    <Check size={64} />
                  </div>
                )}
                {paymentStatus.type === "error" && (
                  <div className={styles["error-icon"]}>
                    <X size={64} />
                  </div>
                )}
              </div>
              <h3 className={styles["payment-title"]}>{paymentStatus.title}</h3>
              <p className={styles["payment-message"]}>
                {paymentStatus.message}
              </p>

              {paymentStatus.type === "processing" &&
                paymentMethod === "mpesa" && (
                  <div className={styles["payment-info"]}>
                    <div className={styles["info-card"]}>
                      <span className={styles["info-label"]}>
                        Payment Method:
                      </span>
                      <span className={styles["info-value"]}>M-PESA</span>
                    </div>
                    <div className={styles["info-card"]}>
                      <span className={styles["info-label"]}>Amount:</span>
                      <span className={styles["info-value"]}>
                        Ksh.
                        {currentPaymentType === "cart"
                          ? cartItems
                              .reduce(
                                (sum, item) =>
                                  sum +
                                  (item.Delicacy?.Price ?? 0) * item.Quantity,
                                0
                              )
                              .toFixed(2)
                          : selectedRoom
                          ? selectedRoom.PricePerNight
                          : selectedBusinessRoom?.PricePerHour}
                      </span>
                    </div>
                    {currentPaymentType !== "cart" && (
                      <div className={styles["info-card"]}>
                        <span className={styles["info-label"]}>Booking:</span>
                        <span className={styles["info-value"]}>
                          {selectedRoom
                            ? selectedRoom.RoomType
                            : selectedBusinessRoom?.Name}
                        </span>
                      </div>
                    )}
                  </div>
                )}

              {paymentStatus.type === "processing" &&
                paymentMethod === "stripe" && (
                  <div className={styles["payment-info"]}>
                    <div className={styles["info-card"]}>
                      <span className={styles["info-label"]}>
                        Payment Method:
                      </span>
                      <span className={styles["info-value"]}>Stripe</span>
                    </div>
                    <div className={styles["info-card"]}>
                      <span className={styles["info-label"]}>Amount:</span>
                      <span className={styles["info-value"]}>
                        Ksh.
                        {currentPaymentType === "cart"
                          ? cartItems
                              .reduce(
                                (sum, item) =>
                                  sum +
                                  (item.Delicacy?.Price ?? 0) * item.Quantity,
                                0
                              )
                              .toFixed(2)
                          : selectedRoom
                          ? selectedRoom.PricePerNight
                          : selectedBusinessRoom?.PricePerHour}
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};