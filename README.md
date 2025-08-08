# Fancy Tunes

**Fancy Tunes** is a full-stack restaurant web application designed to provide a seamless experience for both customers and system administrators. Built with React for the frontend and Node.js for the backend, it offers a comprehensive suite of features for browsing accommodations, ordering food, booking conference rooms, and managing restaurant operations.

## Features

### For Users
- **Browse Room Accommodations:** View available rooms and amenities.
- **Explore Food Delicacies:** Browse the restaurant menu and specialties.
- **Order Management:** Place, view, and manage food orders.
- **Payments:** Secure payment integration with Stripe and M-Pesa.
- **Conference Room Booking:** Reserve conference rooms for meetings or events.
- **Real-Time Updates:** Receive instant notifications and updates on orders and bookings via Socket.IO.

### For System Administrators
- **User Monitoring:** Track and manage system users.
- **Privilege Management:** Assign and update user roles and permissions.
- **Order Oversight:** View and manage all orders.
- **Account Recovery:** Assist users with account recovery processes.
- **Stock Management:** Monitor and update inventory.
- **Room & Service Creation:** Add new rooms and services to the system.
- **Real-Time Dashboard:** Monitor live activity and system changes using Socket.IO.

## Technology Stack

- **Frontend:** React, Context API, Hooks, Guards, Styled Components
- **Backend:** Node.js, Express, TypeScript, Socket.IO
- **Database:** PostgreSQL (via Prisma ORM)
- **Payments:** Stripe, M-Pesa
- **Deployment:** Docker, Render

## Folder Structure

### Root
```
/fancy-Tunes
  /frontend
  /backend
  README.md
  docker-compose.yml
```

### Frontend (`/frontend`)
- `components/` - Reusable UI components
- `context/` - Global state management
- `hooks/` - Custom React hooks
- `guards/` - Route protection logic
- `pages/` - Application pages
- `assets/` - Images and static files
- `utils/` - Utility functions

### Backend (`/backend`)
- `package.json`, `tsconfig.json` - Configuration files
- `src/`
  - `controllers/` - Request handlers
  - `routes/` - API endpoints
  - `services/` - Business logic
  - `middlewares/` - Express middlewares
  - `utils/` - Helper functions
  - `emails/` - Email templates and logic
  - `interfaces/` - TypeScript interfaces
  - `models/` - Prisma models
  - `sockets/` - Socket.IO event handlers

## Getting Started

### Prerequisites
- Node.js & npm
- Docker
- PostgreSQL

### Installation

1. **Clone the repository:**
   ```bash
   git clone <project-url>
   cd fancy-Tunes
   ```

2. **Setup environment variables:**  
   Create `.env` files in both `/frontend` and `/backend` folders with necessary configuration.

3. **Install dependencies:**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

4. **Run with Docker:**
   ```bash
   docker-compose up --build
   ```

### Database Migration
```bash
cd backend
npx prisma migrate dev
```

## Deployment

The application will be deployed using Docker and Render. Update the placeholder URL below after deployment.

**Live URL:** [https://your-fancy-Tunes-url.com](https://your-fancy-Tunes-url.com)

## License

This project is licensed under xhr.

---

**Contact:**  
For questions or support, please open an issue or contact me.
