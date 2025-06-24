# Echo - Minimal Music Web App

**Overview**

Echo is a full-stack web application designed to provide a seamless, modern music listening experience. Users can explore a rich catalog of music, manage personal playlists, and enjoy a responsive interface with a persistent audio player. The project features a complete admin panel for content management and is built with a clean, scalable architecture.

-----

**Features**

The application is packed with features for both users and administrators:

#### Core Music Experience

  * **Browse & Discover**: Explore detailed pages for artists, albums, and songs.
  * **Persistent Audio Player**: A site-wide player that continues playback as you navigate. It includes play/pause, skip, volume controls, and a draggable progress bar.
  * **Context-Aware Playback**: The player understands the source of the music, showing the "playing" status only for the specific album or playlist you've selected.
  * **Light & Dark Modes**: A theme toggle in the header allows users to switch between light and dark modes, with the preference saved locally.
  * **Responsive Design**: The interface is fully responsive, providing an optimal experience on devices of all sizes.
  * **Header Search**: A functional search bar in the header allows users to initiate searches from anywhere in the app.

#### User & Playlist Management

  * **Secure Authentication**: Users can register and log in securely, with sessions managed by JSON Web Tokens (JWT).
  * **Personal Library**: Logged-in users have a private library page to view and manage their created playlists.
  * **Full Playlist Control**: Users can create new playlists, delete their existing playlists, and add any song to them through an intuitive modal.

#### Administrative Features

  * **Protected Admin Dashboard**: A secure, role-protected admin area for complete site management.
  * **Comprehensive Content Management**: Admins have full CRUD (Create, Read, Update, Delete) capabilities for artists, albums, songs, and users through a unified dashboard interface.
  * **Dedicated Management Forms**: Easy-to-use forms for adding and editing all content types, including fields for images, social links, genres, and assigning songs to albums.

-----

**Stack**

  * **Backend:** Node.js, Express, MongoDB, Mongoose, Dotenv, CORS, JWT (for authentication), Bcryptjs (for password hashing).
  * **Frontend:** React, Vite, React Router DOM, Axios, FontAwesome.

-----

**Project Structure**

The project is organized into two main parts: a backend API and a frontend client.

  * `/backend` — The Node.js API responsible for business logic and data persistence.
      * `/src/controllers` - Handles request logic for different resources (e.g., `userController.js`, `songController.js`).
      * `/src/models` - Defines Mongoose schemas and data models (e.g., `userModel.js`, `songModel.js`).
      * `/src/middlewares` - Contains custom middleware for authentication (`protect`) and authorization (`admin`).
      * `/src/routes` - Defines all API endpoints and connects them to the appropriate controllers.
      * `/src/services` - Includes a script for seeding the database with initial data.
  * `/frontend` — The React single-page application that consumes the backend API.
      * `/src/api` - Contains functions for making API calls to the backend.
      * `/src/components` - Features reusable UI components like the Player, Header, Cards, and Modals.
      * `/src/context` - Manages global state using React Context for Authentication (`AuthContext`) and the music player (`PlayerContext`).
      * `/src/hooks` - Includes custom hooks for audio playback (`useAudio`) and player logic (`usePlayer`).
      * `/src/pages` - Contains top-level page components for different routes, including the Home page, Artist page, and Admin dashboard.

-----

**API Endpoints Overview**

The main API router is defined in `backend/src/routes/api.js`. Key endpoints include:

  * `GET /api/`: Returns a list of available endpoints.
  * `/api/auth/`: Routes for user registration, login, and fetching the current user profile (`/me`).
  * `/api/artists`: CRUD operations for artists.
  * `/api/songs`: CRUD operations for songs.
  * `/api/albums`: CRUD operations for albums, including fetching albums by a specific artist.
  * `/api/users`: Routes for admin to manage users.
  * `/api/playlists`: Full CRUD for playlists and for adding/removing songs from them.

*(Refer to `backend/src/routes/api.js` for the complete list and controller mappings.)*

-----

**Getting Started**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/efdourado/echo.git
    cd echo
    ```

2.  **Install dependencies:**
    The root `package.json` is configured to install dependencies for both the backend and frontend simultaneously.

    ```bash
    npm install
    ```

    *(Note: The `build` script in the root `package.json` was likely intended for installation. I've simplified this to `npm install` which is more conventional. You may adjust your scripts if needed.)*

3.  **Set up Backend Environment Variables:**
    Navigate to the `/backend` directory and create a `.env` file. Add the following variables:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    DB_NAME=echo_db
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=2h
    PORT=3000
    ```

4.  **Seed Initial Data (Optional but Recommended):**
    The backend includes a script to seed the database with sample data.

    ```bash
    node backend/src/services/dbSeed.js
    ```

-----

**Usage**

  * **Run Frontend Development Server:**
    This will start the Vite dev server for the React app.

    ```bash
    npm run dev --prefix frontend
    ```

  * **Start Backend Server:**
    This will start the Node.js API server.

    ```bash
    npm start --prefix backend
    ```

  * **Build For Production:**
    To build the frontend for production, run:

    ```bash
    npm run build --prefix frontend
    ```

  * **Run in Production Mode:**
    After building the frontend, the root start command will serve both the API and the static frontend files.

    ```bash
    npm start
    ```

-----

**Future Features**

With the admin panel and playlist management now implemented, here are some potential next steps:

  * **Enhanced Search & Discovery:** Implement a dedicated search results page and add filtering capabilities.
  * **User Interactions:** Add features for liking songs/albums and following artists/users.
  * **Player Enhancements:** Implement a song queue, repeat, and shuffle controls.
  * **Testing:** Add unit and integration tests for both the frontend and backend to ensure reliability.