import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';
import { VerifyMail } from './pages/VerifyMail';
import { ChangePassword } from './pages/ChangePassword';
import { UserDashboard } from "./pages/user/UserDashboard";
import { Accommodations } from './pages/user/user_routes/Accommodations';
import { Bookings } from './pages/user/user_routes/Bookings';
import { Cart } from './pages/user/user_routes/Cart';
import { Orders } from './pages/user/user_routes/Orders';
import { Profile } from './pages/user/user_routes/Profile';
import { Reviews } from './pages/user/user_routes/Reviews';
import { Admin } from './pages/admin/Admin';
import { Delicacies } from './pages/admin/admin_routes/Delicacies';
import { Payments } from './pages/admin/admin_routes/Payments';
import { UserRecoveries } from './pages/admin/admin_routes/UserRecoveries';
import { UserReviews } from './pages/admin/admin_routes/UserReviews';
import { Rooms } from './pages/admin/admin_routes/Rooms';
import { UserAccommodations } from './pages/admin/admin_routes/UserAccommodations';
import { UserOrders } from './pages/admin/admin_routes/UserOrders';
import { UserBookings } from './pages/admin/admin_routes/UserBookings';
import { Users } from './pages/admin/admin_routes/Users';
import { SingleRoom } from './pages/SingleRoom';
import { Dashboard } from './pages/user/user_routes/Dashboard';
import { MyPayments } from './pages/user/user_routes/MyPayments';
import { Notificationss } from './components/Notificationss';
import { BusinessRooms } from './pages/admin/admin_routes/BussinessRoom';
import { AdminDashboard } from './pages/admin/admin_routes/AdminDashboard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-mail" element={<VerifyMail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/room/:RoomId" element={<SingleRoom />} />

        <Route
          path="/user"
          element={
            <UserGuard>
              <UserDashboard />
            </UserGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-payments" element={<MyPayments />} />
          <Route path="notifications" element={<Notificationss />} />
          <Route path="settings" element={<Profile />} />
          <Route path="single-room" element={<SingleRoom />} />
          <Route path="accommodations" element={<Accommodations />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reviews" element={<Reviews />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="delicacies" element={<Delicacies />} />
          <Route path="payments" element={<Payments />} />
          <Route path="recoveries" element={<UserRecoveries />} />
          <Route path="user-reviews" element={<UserReviews />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="user-accommodations" element={<UserAccommodations />} />
          <Route path="user-orders" element={<UserOrders />} />
          <Route path="user-bookings" element={<UserBookings />} />
          <Route path="users" element={<Users />} />
          <Route path="business-rooms" element={<BusinessRooms />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
