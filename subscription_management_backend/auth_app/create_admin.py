from django.core.management.base import BaseCommand
from analytics_app.models import CustomUser

class Command(BaseCommand):
    help = "Create superuser with role=admin"

    def handle(self, *args, **options):
        if not CustomUser.objects.filter(email="admin@example.com").exists():
            user = CustomUser.objects.create_superuser(
                email="admin@example.com",
                username="admin",
                password="Admin1234"
            )
            user.role = "admin"
            user.save()
            self.stdout.write(self.style.SUCCESS("Superuser created successfully!"))
        else:
            self.stdout.write(self.style.WARNING("Superuser already exists."))
