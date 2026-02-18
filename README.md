# 🅿️ IoT Smart Parking Management System (IoT-SPMS)

A real-time smart parking management system built for **Ho Chi Minh City University of Technology (HCMUT)**.

## Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Frontend    | React (Vite), React Router, Axios   |
| Backend     | Node.js, Express.js                 |
| Database    | Supabase (PostgreSQL)               |
| Realtime    | Supabase Realtime / WebSockets      |
| Auth        | Mock HCMUT_SSO with JWT             |
| Payments    | Mock BKPay Gateway                  |
| IoT Sim     | Node.js Sensor Simulator            |

## Project Structure

```
/iot-spms
├── /backend          # Express.js API server
├── /frontend         # React client (Vite)
├── /docs             # Design docs, diagrams, ERDs
├── /scripts          # Utility scripts (DB seeding, deployment)
├── package.json      # Root workspace config
├── pnpm-workspace.yaml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 8

### Installation
```bash
pnpm install
```

### Development
```bash
# Start both backend and frontend
pnpm dev

# Backend only
pnpm dev:backend

# Frontend only
pnpm dev:frontend

# Run IoT sensor simulator
pnpm simulate
```

## Architecture

The system follows a **Three-Tier Architecture** with an event-driven layer:

1. **Presentation Tier** — React SPA (Admin Dashboard, User Portal, Public Signage)
2. **Logic Tier** — Express.js API (Auth, Parking, Payment services)
3. **Data Tier** — Supabase PostgreSQL with Realtime
4. **Simulation Tier** — Node.js IoT sensor simulator

## License

MIT
