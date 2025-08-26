from django.urls import path
from .views import SubscriptionListCreateView, SubscriptionDetailView

urlpatterns = [
    path("subscriptions/", SubscriptionListCreateView.as_view(), name="subscription-list"),
    path("subscriptions/<int:pk>/", SubscriptionDetailView.as_view(), name="subscription-detail"),
]