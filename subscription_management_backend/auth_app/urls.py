from django.urls import path
from .views import UserRegisterView, LoginView, UserListView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("user-register/", UserRegisterView.as_view(), name="register"),  
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/", UserListView.as_view(), name="user-list"),
]