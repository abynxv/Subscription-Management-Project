from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.db import models
from .models import Subscription
from .serializers import SubscriptionSerializer


class SubscriptionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == "admin":
            subs = Subscription.objects.all()
        else:
            subs = Subscription.objects.filter(
                models.Q(user=request.user) | models.Q(is_shared=True)
            )
        serializer = SubscriptionSerializer(subs, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != "user":
            return Response(
                {"detail": "Only users can create subscriptions."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = SubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, is_shared=False)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubscriptionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        sub = get_object_or_404(Subscription, pk=pk)
        if user.role == "admin" or sub.user == user or sub.is_shared:
            return sub
        return None

    def get(self, request, pk):
        sub = self.get_object(pk, request.user)
        if not sub:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        return Response(SubscriptionSerializer(sub).data)

    def put(self, request, pk):
        sub = self.get_object(pk, request.user)
        if not sub:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        if request.user.role == "user":
            if sub.user != request.user:
                return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
            data.pop("is_shared", None)

        serializer = SubscriptionSerializer(sub, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        sub = self.get_object(pk, request.user)
        if not sub:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        if request.user.role == "user" and sub.user != request.user:
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        sub.delete()
        return Response({"detail": "Deleted"}, status=status.HTTP_204_NO_CONTENT)
