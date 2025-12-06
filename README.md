# Music Library Project

A full-stack web application for managing and playing your personal music library.  
Built with React, Node.js, Express, and PostgreSQL.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or later recommended)
- **Docker** and **Docker Compose** (recommended for database setup)
  - Alternative: **PostgreSQL** (v16 or later) — if not using Docker

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone <your-repository-url>
   cd <repository-folder-name>
   ```

2. **Install All Dependencies**  
   From the root project directory, run:

   ```bash
   npm run install:all
   ```

   This will install both backend and frontend dependencies.

3. **Database Setup**

   ### Option A: Using Docker (Recommended) 🐳

   The database will start automatically when you run `npm run dev`. The Docker setup will:

   - Start a PostgreSQL 16 container
   - Create the database "Music Library"
   - Automatically run the schema from `backend/schema.sql`

   **Useful Database Commands** (if you need to manage the database separately):

   ```bash
   # Start the database manually
   npm run db:up

   # Stop the database
   npm run db:down

   # Reset the database (removes all data)
   npm run db:reset

   # View database logs
   npm run db:logs
   ```

   ### Option B: Manual PostgreSQL Setup

   If you prefer to use a local PostgreSQL installation:

   - **Start PostgreSQL**  
     Make sure your PostgreSQL server is running.

   - **Create the Database**  
     Connect via psql or your GUI of choice (e.g., pgAdmin) and run:

     ```sql
     CREATE DATABASE "Music Library";
     ```

     _Note: The quotes are important if your database name contains spaces._

   - **Create Tables**  
     Run the code inside `backend/schema.sql` manually in psql or using the Query Tool in pgAdmin.

4. **Environment Variables**

   - **Backend**  
     In the `backend` folder, create a file named `.env`:

     ```ini
     # PostgreSQL connection URL
     # For Docker: use the default credentials below
     # For manual setup: replace with your own PostgreSQL credentials
     # (encode space in "Music Library" as %20)
     DATABASE_URL=postgresql://postgres:postgres@localhost:5432/Music%20Library

     # IMPORTANT: Change this to a strong, unique secret for JWT
     JWT_SECRET=your-very-strong-and-secret-key-please-change

     # Port the backend server will run on
     PORT=4000
     ```

   - **Frontend**  
     In the `frontend` folder, create a file named `.env`:
     ```ini
     # URL of the backend API
     VITE_API_URL=http://localhost:4000
     ```

5. **Running the Application**  
   From the root project directory, simply run:

   ```bash
   npm run dev
   ```

   This will:

   - Start the PostgreSQL database (Docker)
   - Create the uploads directory automatically (if it doesn't exist)
   - Start both your backend and the frontend development server concurrently

   Once everything is up, open your browser and navigate to the URL provided by Vite (e.g., `http://localhost:5173`).

   _Note: The uploads directory is created automatically when the backend starts. It's included in the `.gitignore`, so it won't be tracked by Git._

---

## Quick Start Summary

```bash
# 1. Install dependencies
npm run install:all

# 2. Create .env files (see step 4 above)
# Backend: backend/.env
# Frontend: frontend/.env

# 3. Run the application (starts database automatically)
npm run dev
```

The database and uploads directory are created automatically when you run `npm run dev`.
