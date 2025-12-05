# Hotel Management System (Backend)

This project is a RESTful API developed in **Node.js** with **TypeScript** for hotel management. The system currently controls entities such as rooms, guests, reservations, and events.

## Technologies Used

- **Language:** TypeScript
- **Runtime:** Node.js
- **Web Framework:** Express
- **ORM:** Sequelize
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose
- **Documentation:** Swagger (OpenAPI)

## Key Features

- **User:** Create, get, update, and delete users
- **Room:** Create, get, update, and delete rooms
- **Employee:** Create, get, update, and delete employees
- **Reservation:** Create, get, update, and delete reservations

---

## API Documentation (Swagger)

Interactive documentation for all endpoints, including input schemas (JSON) and response examples, is available via Swagger UI.

After starting the server, access it in your browser at:
> **http://localhost:3000/api-docs**

*(Note: The port may vary if you have modified the .env file)*

---

## How to Run the Project

Make sure you have **Docker** and **Docker Compose** installed.

### 1. Environment Configuration
Follow the example in the `.env.example` file and create a `.env` file, replacing the placeholders with your desired values.

### 2. Start Docker (Database)
Once the `.env` file is created, execute the following command at the project root:
```bash
docker compose up -d
```

### 3. Running the Application
Still at the project root, run these two commands to install the required dependecies and start the application:

```bash
npm install
npm run dev
```

Finally, the application is ready to be tested. Good luck!