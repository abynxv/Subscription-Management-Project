from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "email", "role"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data["username"],
            email=validated_data.get("email"),
            role="user",
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
