# Subscription Management Project

A full-stack subscription management system with admin and user roles, powered by Django REST Framework (backend) and React (frontend). This project includes automated AI suggestions using OpenAI API and role-based access management.

---

## Features

### Backend (Django + DRF)
- Custom user model with `role` field (`admin` / `user`)
- Superuser creation
- Role-based access control
- REST API endpoints for:
  - User authentication (login/signup)
  - Subscription management
  - Analytics & AI suggestions
- Integration with OpenAI API for subscription insights
- PostgreSQL database
- CORS enabled for frontend communication

### Frontend (React)
- Login and signup pages
- Dashboard for managing subscriptions
- Role-based UI (Admin / User)
- Dynamic analytics display

---

## Tech Stack
- **Backend:** Django 4.2, Django REST Framework, psycopg2, djangorestframework-simplejwt
- **Frontend:** React, Vite (or Create React App), TailwindCSS (optional)
- **Database:** PostgreSQL
- **Async tasks & caching:** Celery, Redis (optional)
- **APIs:** OpenAI API for AI suggestions
- **Deployment:** Render


---

## Setup Instructions

### Backend

1. Clone the repo:

```bash
git clone <repo_url>
cd subscription_management_backend
```
2. Create and activate virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```
4. Add environment variables:

DATABASE_URL=postgres://user:password@host:port/dbname
OPENAI_API_KEY=your_openai_api_key

5. Apply migrations:
```bash
python manage.py migrate
```
6. Create superuser (if not using auto-create):
```bash
python manage.py createsuperuser
```
7. Run the backend:
```bash
python manage.py runserver
```

### Frontend

    Navigate to frontend directory:

cd frontend

    Install dependencies:

npm install

    Run development server:

npm run dev

    Build for production:

npm run build

    Deploy the build folder (for Render or other static hosting)

Deployment Notes (Render)

    Set ALLOWED_HOSTS in settings.py or via environment variable:
    ALLOWED_HOSTS = ["subscription-management-project.onrender.com"]


Important Notes

    Roles: admin has full access; user has limited access.

    AI Suggestions: Requires valid OPENAI_API_KEY.

    Database: PostgreSQL recommended in production. SQLite only for local testing.

    Security: Ensure secret keys and API keys are never committed to the repo.

## Admin UI
<img width="1854" height="982" alt="Screenshot from 2025-08-27 05-39-56" src="https://github.com/user-attachments/assets/d1ab3c1f-5c1e-4823-b543-b9df5a8149f2" />
<img width="1854" height="982" alt="Screenshot from 2025-08-27 05-35-26" src="https://github.com/user-attachments/assets/e1a8136d-235f-4d01-83e4-500c05dde352" />

## User Interface
<img width="1854" height="982" alt="Screenshot from 2025-08-27 05-38-43" src="https://github.com/user-attachments/assets/afd6e034-35f8-4ef2-a88e-e096f2008b40" />
<img width="1854" height="982" alt="Screenshot from 2025-08-27 05-38-54" src="https://github.com/user-attachments/assets/0e963aff-9e43-4c18-9df1-a27aa0f9ba66" />
<img width="1854" height="982" alt="Screenshot from 2025-08-27 05-37-42" src="https://github.com/user-attachments/assets/f626b012-95bb-4f8d-85c5-0bda1c4a82d2" />

