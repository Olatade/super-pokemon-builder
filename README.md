# Assessment Submission – Super Pokémon Team Builder

## About the Submission

Welcome to the **Super Pokémon Team Builder** project!

This is a **full-stack application** that allows you to:

- Build and manage Pokémon teams
- Explore various Pokémon data

## 🛠️ Tech Stack

### Frontend

- **React** – User Interface
- **Tailwind CSS** – Styling
- **Redux Toolkit** – UI State Management
- **TypeScript** – Static typing and improved developer experience

### Backend

- **Node.js** with **NestJS** – API and server logic
- **PostgreSQL** – Relational database (containerized)
- **Nx Monorepo** – Unified workspace for frontend and backend

### Development & Deployment

- **Docker** / **Docker Desktop** – Containerization

## 📋 Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js**: `v22.17.0`
- **npm** (Node Package Manager): `10.9.2`
- **Docker**

## 🛠️ Installing Prerequisites

1. [Install nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

Use this command to install node and npm comes with it.

```bash
nvm install --lts
```

2. [Install Docker / Docker Desktop](https://www.docker.com/products/docker-desktop/)

3. Start Docker Desktop and ensure that it is running

## 🚀 Getting Started with the Repository

Clone this repository and run the commands below to get started:

1. **Install dependencies**

   ```bash
   npm install
   ```

   This will install all the relevant dependencies needed to run the application.

2. **Start development environment**

   ```bash
   npm run dev
   ```

   This single command will run three processes:

   - `docker compose up` – Starts the PostgreSQL server.
   - `nx serve ui` – Starts the React UI application (on port **4200**).
   - `nx serve api` – Starts the NestJS API application (on port **3000**).

   **Note:** You only need to run `npm run dev`.

3. **Stop all services**
   ```bash
   npm run dev:stop
   ```

---

## 📋 Populating the database

To populate the database, run `npm run populate:database`

This command does the following:

1. Fetch and save pokemon data from https://pokeapi.co to a json file
2. Adds pokemons to the database
3. Creates user profiles and teams and adds pokemons to the teams

---

### 🔌 Making API calls

The API documentation is available in a [Public postman collection](https://www.postman.com/speeding-crater-749361/workspace/tade-s-public-apis/collection/3891352-94e67b76-e725-423e-b13b-4ae63d9f734a?action=share&creator=3891352)

Somethings you can do:

1. create a user profile: POST - http://localhost:3000/profile
2. create a team: POST - http://localhost:3000/team
3. add pokemon to a team - http://localhost:3000/team/:teamid/pokemon

---

### 🔌 Connecting with the Database via a UI

The application will automatically connect to the database, however if you want to connect via a UI layer, following are your variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=super_pokemon_db
```

---

## 📋 Using the UI layer - React Application

The UI layer will be available on [http://localhost:4200/](http://localhost:4200/) when you run the application.

The UI layer is a simple but powerful application that uses Redux for performance and reactive logic to manage the application state.

### 📋 How to Login

There are several users available in the database. You can use the following credentials to log in:

| Username | Password |
| -------- | -------- |
| user1    | user1    |
| user2    | user2    |
| user3    | user3    |
| user4    | user4    |

---

### 📋 Features

- **Create Profile**: Create your own user profile.
- **Login**: Login with your profile.
- **Create a Team**: Create a new Pokémon team.
- **Manage Team**: Add up to six Pokémon to your team and remove them.
