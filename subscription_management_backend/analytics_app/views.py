from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now, timedelta
from django.db import models
from subscription_app.models import Subscription
from .utils import generate_ai_suggestions


class UpcomingRenewalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = now().date()
        next_week = today + timedelta(days=7)
        renewals = Subscription.objects.filter(
         user=request.user, renewal_date__range=(today, next_week)  # ✅ Fixed
        )
        data = [{"service": r.service_name, "renewal_date": r.renewal_date} for r in renewals]
        return Response(data)


class SubscriptionSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subs = Subscription.objects.filter(user=request.user)
        total = subs.count()
        total_spent = sum([s.cost for s in subs])  # ✅ Fixed
        return Response({"total_subscriptions": total, "total_spent": total_spent})


class AISuggestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == "admin":
            subs = Subscription.objects.all()
        else:
            subs = Subscription.objects.filter(
                models.Q(user=request.user) | models.Q(is_shared=True)
            )

        if not subs.exists():
            return Response({"suggestions": "No subscriptions found."})

        suggestions = generate_ai_suggestions(subs)
        return Response({"suggestions": suggestions})