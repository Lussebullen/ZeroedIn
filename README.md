# ZeroedIn
ETH Global Project

## How to run

Navigate to the infrastructure folder and run
```bash
docker compose up
```

## Project Structure
```
/ZeroedIn
│
├── /backend                    # FastAPI application folder
│   ├── /app                    # Core FastAPI application
│   │   ├── __init__.py         # Package init
│   │   ├── main.py             # FastAPI entry point
│   │   ├── config.py           # App configuration (env variables, settings)
│   │   ├── db.py               # Database connection setup
│   │   ├── models.py           # SQLAlchemy models
│   │   ├── routers             # API routes
│   │   │   ├── __init__.py
│   │   │   └── users.py        # Example API routes
│   │   ├── services            # Business logic
│   │   ├── schemas.py          # Pydantic models
│   │   └── utils.py            # Helper functions
│   ├── /migrations             # Alembic migrations for PostgreSQL
│   └── Dockerfile              # Backend Dockerfile
│
├── /frontend                   # Frontend application folder
│   ├── /src                    # Source code for the frontend (React, Vue, etc.)
│   │   ├── components          # UI components
│   │   ├── pages               # Different frontend pages
│   │   ├── services            # API interaction logic
│   ├── /public                 # Static assets
│   └── Dockerfile              # Frontend Dockerfile
│
├── /blockchain                 # Mina blockchain interactions
│   ├── /protokit               # Protokit specific code
│   │   ├── zk_app.ts           # Mina zkApp logic
│   │   ├── config.ts           # Mina config
│   ├── tests                   # Unit tests for blockchain interactions
│   └── Dockerfile              # Dockerfile for blockchain interaction
│
├── /infra                      # Infrastructure files for Docker Compose
│   ├── docker-compose.yml      # Main Docker Compose file
│   ├── .env                    # Environment variables for different services
│   └── init.sql                # Postgres initialization script
│
├── README.md                   # Project documentation
└── .gitignore                  # Git ignore file
```