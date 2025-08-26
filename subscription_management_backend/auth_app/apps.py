# auth_app/apps.py
from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.contrib.auth import get_user_model

class AuthAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'auth_app'

    def ready(self):
        from django.conf import settings

        def create_admin(sender, **kwargs):
            User = get_user_model()
            email = 'admin@sm.com'
            if not User.objects.filter(email=email).exists():
                User.objects.create_superuser(
                    email=email,
                    username='admin',
                    password='admin',
                    role='admin'
                )

        post_migrate.connect(create_admin, sender=self)
