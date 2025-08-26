from django.db import models
from auth_app.models import CustomUser


class Subscription(models.Model):
    BILLING_CYCLES = [
        ("monthly", "Monthly"),
        ("yearly", "Yearly"),
        ("weekly", "Weekly"),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="subscriptions")
    service_name = models.CharField(max_length=100)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLES, default="monthly")
    renewal_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    is_shared = models.BooleanField(default=False)  # only Admin can mark

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)