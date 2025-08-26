from django.urls import path
from .views import UpcomingRenewalsView, SubscriptionSummaryView, AISuggestionsView


urlpatterns = [
    path("upcoming-renewals/", UpcomingRenewalsView.as_view(), name="upcoming-renewals"),
    path("summary/", SubscriptionSummaryView.as_view(), name="summary"),
    path("ai-suggestions/", AISuggestionsView.as_view(), name="ai-suggestions"),
]