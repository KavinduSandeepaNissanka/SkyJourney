# SkyJourney ✈️

SkyJourney is a full-stack airport/airline companion app that helps passengers manage their journey — from booking and seat exchanges to real-time baggage tracking and in-airport navigation — while giving staff and admins the tools to manage flights and baggage behind the scenes.

The project has two parts:

- **`backend/`** — a Java Spring Boot REST API (MySQL, Flyway, JWT auth, WebSockets)
- **`frontend/`** — a React + TypeScript single-page app (Vite, MUI, Zustand)

## Features

- 🔐 **Authentication & Roles** — JWT-based login/registration with `PASSENGER`, `STAFF`, and `ADMIN` roles (staff/admin sign-up is gated behind a secret key)
- 📊 **Journey Dashboard** — a live boarding-pass style overview of the passenger's current flight, gate, seat, and booking reference
- 🧳 **Baggage Tracking** — real-time RFID-style baggage telemetry with a step-by-step tracking timeline (Checked In → Loaded → In Transit → Arrived) and a staff dashboard for updating baggage status/location
- 🗺️ **Airport Navigation** — an interactive terminal map with a pathfinder router that gives turn-by-turn walking directions between airport landmarks
- 🪑 **Seat Exchange** — an interactive cabin seat map where passengers can request to swap seats with one another
- 💬 **AI Travel Assistant** — a real-time chat assistant (WebSockets/STOMP) that can answer questions about bag location, gate directions, and flight status
- 🛠️ **Admin Management** — flight and system management for admins

## Screenshots

| Landing Page |
<br>
 <img width="1295" height="626" alt="image" src="https://github.com/user-attachments/assets/a37d5fc1-dcad-43b1-94ee-302d4249c189" /> 
 

| Journey Dashboard |
<br>
 <img width="1346" height="632" alt="image" src="https://github.com/user-attachments/assets/6be7214e-bcbc-4c32-a756-5a9d4bb67324" />


| Baggage Tracking |
<br>
<img width="1345" height="642" alt="image" src="https://github.com/user-attachments/assets/29d4379a-0e2e-493c-9faf-7845e92ace27" />


| Airport Navigation |
<br>
<img width="1347" height="638" alt="image" src="https://github.com/user-attachments/assets/23b56c81-2ed8-4627-bc7d-ac1cc5624a33" />
 

| Seat Exchange |
<br>
 <img width="1316" height="637" alt="image" src="https://github.com/user-attachments/assets/aac70e7d-2419-4e4b-9f85-d8bebd4b2c50" />


| AI Travel Assistant |
<br>
 <img width="1328" height="636" alt="image" src="https://github.com/user-attachments/assets/1ddbdcf5-6bf7-443c-a636-8c0d2c687c2a" />


## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19, TypeScript, Vite, MUI (Material UI), Zustand, React Router, STOMP/SockJS |
| Backend   | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA, Spring WebSocket |
| Database  | MySQL, Flyway migrations |
| Auth      | JWT (JJWT) |

## Project Structure

```
SkyJourney/
├── backend/                # Spring Boot API
│   └── src/main/java/com/skyjourney/backend/
│       ├── controller/      # REST controllers (e.g. AuthController)
│       ├── model/           # JPA entities (Flight, Booking, Baggage, Seat, ...)
│       ├── repository/      # Spring Data repositories
│       ├── security/        # JWT service & filter
│       ├── config/          # Security & app configuration
│       └── dto/              # Request/response DTOs
│   └── src/main/resources/
│       ├── application.properties
│       └── db/migration/     # Flyway SQL migrations
└── frontend/                # React SPA
    └── src/
        ├── pages/            # LandingPage, LoginPage, DashboardPage, BaggagePage, ...
        ├── components/       # Shared UI components (Layout, ...)
        ├── store/            # Zustand global state
        └── AppRoutes.tsx     # Route definitions
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Java 21](https://adoptium.net/)
- [MySQL](https://dev.mysql.com/downloads/) 8+
- Maven (or use the included `mvnw` wrapper)

### 1. Clone the repository

```bash
git clone https://github.com/KavinduSandeepaNissanka/SkyJourney.git
cd SkyJourney
```

### 2. Backend setup

Create a MySQL database (or let Flyway create it automatically) and update the credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/skyjourney_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

Then run the backend:

```bash
cd backend
./mvnw spring-boot:run
```

The API will start on **http://localhost:8080**. Flyway will automatically apply the migrations in `src/main/resources/db/migration` on startup.

> ⚠️ **Note:** The default JWT secret and DB credentials in `application.properties` are for local development only. Replace them with your own values (e.g. via environment variables) before deploying anywhere public.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173** (Vite's default port).

### 4. Build for production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
./mvnw clean package
```

## User Roles

| Role        | Access |
|-------------|--------|
| `PASSENGER` | Dashboard, baggage tracking, seat exchange, navigation, chat assistant |
| `STAFF`     | Baggage management dashboard |
| `ADMIN`     | Admin management panel |

During registration, choosing `STAFF` or `ADMIN` requires a matching secret key configured in the backend.

## API Overview

The backend exposes a REST API under `/api`, including:

- `POST /api/auth/register` — register a new passenger/staff/admin account
- `POST /api/auth/login` — authenticate and receive a JWT

Additional endpoints for flights, bookings, seats, baggage, and chat are exposed through their respective controllers/repositories as the project grows.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or issue.

## License

No license has been specified yet for this project.
