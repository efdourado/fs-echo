# Echo - Minimal Music Web App

**Overview**

Echo is a full-stack web application designed to provide a seamless music listening experience. Users can explore music, artists, and albums, listen to songs, and (future functionality) create playlists. The project aims to deliver a clean, modern interface with a robust backend.

---

**Features**

* User authentication (register, login)
* Browse artists and their albums/songs
* Explore albums and their tracks
* Listen to songs with a persistent player
* View song details
* User profiles

---

**Stack**

* **Backend:** Node.js, Express, MongoDB, Mongoose, Dotenv, CORS, JWT (for authentication), Bcryptjs (for password hashing)
* **Frontend:** React, Vite, React Router DOM, Axios, FontAwesome

---

**Prerequisites**

Before you begin, ensure you have the following installed:

* Node.js (which includes npm)
* MongoDB (either a local instance or a cloud-hosted solution like MongoDB Atlas)

---

**Getting Started**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/efdourado/echo.git](https://github.com/efdourado/echo.git)
    cd echo
    ```

2.  **Install dependencies for both backend and frontend:**
    ```bash
    npm run build
    # OR manually:
    # cd backend
    # npm install
    # cd ../frontend
    # npm install
    # cd ..
    ```

3.  **Set up Environment Variables (Backend):**
    Navigate to the `/backend` directory and create a `.env` file. Add the following variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string # e.g., mongodb:mongodb+srv://...
    DB_NAME=echo_db # Or your preferred database name
    JWT_SECRET=your_secret_jwt_key
    JWT_EXPIRES_IN=2h # Or your preferred expiration time
    PORT=3000 # Or any port you prefer for the backend
    ```
    *You can find database connection setup in `backend/src/config/db.js` and JWT setup in `backend/src/controllers/userController.js`.*

4.  **Seed Initial Data (Optional but Recommended):**
    The backend includes a script to seed the database with initial data for artists, songs, etc.
    ```bash
    cd backend
    node src/services/dbSeed.js
    cd ..
    ```
    *Review `backend/src/services/dbSeed.js` to see what data is being added and to uncomment collections you wish to seed.*

---

**Usage**

* **Install all dependencies (if not done already):**
    ```bash
    npm run build
    ```

* **Run Frontend Development Server:**
    ```bash
    cd frontend
    npm run dev
    ```
    *(This command is defined in `frontend/package.json`)*

* **Build Frontend for Production:**
    ```bash
    cd frontend
    npm run build
    ```
    *(This command is defined in `frontend/package.json`)*

* **Start Backend Server:**
    ```bash
    cd backend
    npm run start
    ```
    *(This command is defined in `backend/package.json` and runs `node src/server.js`)*

* **Start Both (Production-like after build):**
    From the root directory:
    ```bash
    npm run start
    # The backend is configured to serve the static frontend build from `frontend/dist`
    ```

---

**Project Structure**

* `/backend` — Contains the Node.js API, database models, controllers, routes, and server logic.
    * `/src/config` - DB connection.
    * `/src/controllers` - Request handling logic for different resources.
    * `/src/middlewares` - Authentication and authorization middleware.
    * `/src/models` - Mongoose schemas and models.
    * `/src/routes` - API route definitions.
    * `/src/services` - Data seeding scripts and sample data.
* `/frontend` — Contains the React application, components, pages, styles, and assets.
    * `/src/api` - Functions for making API calls to the backend.
    * `/src/components` - Reusable UI components (layout, player, song items).
    * `/src/context` - React context for global state management (Auth, Player).
    * `/src/hooks` - Custom React hooks (useAudio, usePlayer).
    * `/src/pages` - Top-level page components.
    * `/src/styles` - CSS files.

---

**API Endpoints Overview**

The main API router is defined in `backend/src/routes/api.js`. Key endpoints include:

* `GET /api/`: Returns a list of available endpoints.
* `/api/auth/`: Routes for user registration, login, and fetching current user.
* `/api/artists`: Get all artists, Get artist by ID.
* `/api/songs`: Get all songs, Get song by ID.
* `/api/users`: Get all users, Get user by ID, Update user, Delete user.
* `/api/albums`: CRUD operations for albums, Get albums by artist.
* `/api/playlists`: CRUD operations for playlists, Add/remove songs from playlist, Get playlists by owner.

*(Refer to `backend/src/routes/api.js` for the complete list and controller mappings.)*

---

**Application Flow**

* **Home Page (`/`):** Explore music, artists, albums. Features a hero section, carousels for latest songs and featured artists, and a featured collection (album/playlist).
* **Artist Page (`/artist/:id`):** Displays artist information, their popular songs, and albums.
* **Song Page (`/song/:id`):** Shows song details and initiates playback.
* **Login/Register Pages (`/login`, `/register`):** User authentication.
* **Profile Page (`/profile`):** (Protected) Displays current user's information.

---

**Future Features**

* **Advanced Playlist Management:**
    * Full CRUD operations for user-created playlists (create, rename, delete, add/remove songs, reorder songs).
    * Public/Private playlist visibility.
    * Collaborative playlists.
* **Enhanced Search & Discovery:**
    * Global search across songs, artists, and albums with filtering and sorting.
    * "Related Artists" and "Similar Songs" recommendations.
* **User Interactions:**
    * Liking songs, albums, and artists.
    * Following other users and artists.
    * Sharing content to social media.
* **Player Enhancements:**
    * Song queue management (view, add, remove, reorder).
    * Repeat and shuffle controls.
    * Lyrics display (potentially synchronized).
* **Admin Panel:**
    * Dedicated interface for managing users, content, and site settings.
* **Testing & Robustness:**
    * Comprehensive unit and integration tests for both frontend and backend.
    * Enhanced error handling and input validation on the backend.
    * Frontend error boundaries and improved loading states.