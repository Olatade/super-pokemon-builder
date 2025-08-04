# Super Pokémon Team Builder

A Pokémon team-building web application built using an **NX monorepo** structure. This app allows users to browse Pokémon, create teams, and (eventually) manage their profile and authentication. Designed with extensibility in mind for both users and admins.

---

## 🧱 Monorepo Structure

This project uses [Nx](https://nx.dev) to manage two applications:

- **UI (React + Tailwind)** — located at `./apps/ui`
- **API (Next.js with TypeORM + PostgreSQL)** — located at `./apps/api`

```bash
├── apps/
│   ├── api/    # Next.js API routes and backend logic
│   └── ui/     # React frontend (Tailwind, Redux planned)
├── docker-compose.yml
├── .env
└──
```

## 🚀Getting Started

## Prerequisites

Node.js (v18+)
Docker (for PostgreSQL container)
Nx CLI: `npm install -g nx`

## Start the Development Environment

`npm run dev`

This runs the following concurrently:
docker-compose up — Starts PostgreSQL container
nx serve api — Runs the Next.js API app
nx serve ui — Runs the React frontend

## Environment Variables

Located in .env at the root:
• DATABASE_URL — PostgreSQL connection string (e.g., postgres://user:pass@localhost:5432/pokemondb)
• Any other variables for JWT/auth, ports, etc., should be placed here as needed.
🧩 Features

✅ Implemented:
• Postgres schema with TypeORM entities
• Nx monorepo setup
• Tailwind installed in frontend
• Dockerized PostgreSQL database

🔜 Planned:
• User & Admin authentication (JWT-based)
• Profile creation and management
• Team building (create, update, delete teams)
• Add/remove Pokémon from teams
• Admin dashboard for global stats and moderation

⚙️ Tech Stack
Frontend - React, TailwindCSS, Redux (planned)
Backend - Nest.js API Routes
ORM TypeORM
DB PostgreSQL (via Docker)
Infra Nx Monorepo

🗃️ Database Schema Summary

Profile
• id, username, email, role, created_at
• One-to-many with Team, ProfilePokemon

Team
• id, profile_id, name
• One-to-many with TeamPokemon

Pokemon
• id, name, image_url, category, height, weight
• One-to-many with PokemonType, PokemonAbility, ProfilePokemon, TeamPokemon

TeamPokemon
• team_id, pokemon_id, created_at

ProfilePokemon
• profile_id, pokemon_id, created_at

PokemonType / PokemonAbility
• Type and ability metadata per Pokémon
📡 API Routes (Planned)

Auth

/auth
• POST /register — Register a user
• POST /login — Log in and receive token
• POST /logout — Log out
• GET /me — Get current authenticated user

Pokemon

/pokemon
• GET / — List all Pokémon
• GET /:id — Get specific Pokémon

Profile

/profile
• GET / — (Admin) List all users
• GET /:id — (Admin) View user
• PATCH /:id — Update user info
• DELETE /:id — Delete user

Team

/team
• GET / — List current user’s teams
• POST / — Create a new team
• GET /:id — Get a specific team
• PATCH /:id — Update team name/details
• DELETE /:id — Delete a team

Team Pokémon

/teams/:teamId/pokemon
• GET / — List Pokémon in a team
• POST / — Add a Pokémon (max 6)
• PATCH /:pokemonId — Edit Pokémon in team
• DELETE /:pokemonId — Remove Pokémon from team

Admin (Restricted)

/admin
• GET /stats — View global stats
• GET /teams — View all user teams
• GET /pokemons — View all Pokémon in all teams

🔐 Authentication (Planned)

JWT-based token authentication is planned. No auth logic is currently implemented. There will be two roles:
• user — default role
• admin — elevated permissions to view/delete profiles, view all teams, etc.
