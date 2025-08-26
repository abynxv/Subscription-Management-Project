from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('auth_app.urls')),
    path('api/', include('subscription_app.urls')),
    path("analytics/", include("analytics_app.urls")),
]
