# Supernova LMS

A modern Learning Management System built with FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- Multi-tenant architecture with school-based isolation
- Role-based access control (Super Admin, School Admin, Teacher, Student)
- Course management with enrollment system
- Modern async API with FastAPI
- PostgreSQL database with SQLAlchemy and Alembic migrations

## Prerequisites

- Python 3.11 or higher
- PostgreSQL 12 or higher
- Poetry for dependency management

## Installation

1. Install Poetry (if not already installed):
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd supernova
   ```

3. Install dependencies:
   ```bash
   poetry install
   ```

4. Create a `.env` file in the `apps/backend` directory:
   ```bash
   cd apps/backend
   cp .env.example .env
   ```

5. Update the `.env` file with your PostgreSQL credentials and other settings:
   ```env
   POSTGRES_SERVER=localhost
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=supernova
   
   # Security
   SECRET_KEY=your-secret-key-here
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   ```

6. Create the database:
   ```bash
   createdb supernova
   ```

7. Run database migrations:
   ```bash
   poetry run alembic upgrade head
   ```

8. Start the development server:
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`. The interactive API documentation (Swagger UI) can be accessed at `http://localhost:8000/docs`.

## Development

- Format code:
  ```bash
  poetry run black .
  poetry run isort .
  ```

- Run linters:
  ```bash
  poetry run flake8
  poetry run mypy .
  ```

- Run tests:
  ```bash
  poetry run pytest
  ```

## License

MIT
