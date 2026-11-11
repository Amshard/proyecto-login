from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.views import (
    ChangePasswordView,
    CustomTokenObtainPairView,
    LogoutView,
    MeView,
    UsuarioItemView,
    UsuarioListView,
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('usuarios/', UsuarioListView.as_view(), name='usuarios'),
    path('usuarios/<str:id_usuario>/', UsuarioItemView.as_view(), name='usuario-item'),
]
