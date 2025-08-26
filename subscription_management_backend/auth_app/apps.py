from django.apps import AppConfig


class AuthAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'auth_app'
# auth_app/apps.py
from django.apps import AppConfig
from django.conf import settings

class AuthAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'auth_app'

    def ready(self):
        # Avoid running multiple times in migrations or tests
        if settings.RUN_CREATE_ADMIN_ON_STARTUP:
            from django.contrib.auth import get_user_model

            User = get_user_model()
            email = "admin@sm.com"
            if not User.objects.filter(email=email).exists():
                User.objects.create_superuser(
                    email=email,
                    username="admin",
                    password="admin",
                    role="admin"
                )

