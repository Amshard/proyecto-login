from datetime import datetime

from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.users.serializers import (
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UsuarioSerializer,
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'detail': 'refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(refresh_token)
        except TokenError:
            return Response({'detail': 'invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_205_RESET_CONTENT)


class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Contraseña actualizada'}, status=status.HTTP_200_OK)


class UsuarioListView(generics.ListAPIView):
    """GET the users; POST adds one. A new user must change the password on first login."""

    queryset = User.objects.order_by('id_usuario')
    serializer_class = UsuarioSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        if User.objects.filter(id_usuario=data['id_usuario']).exists():
            return Response({'detail': 'Ya existe un usuario con esa clave.'}, status=status.HTTP_409_CONFLICT)
        if not data.get('password'):
            return Response({'detail': 'El campo Password está vacío.'}, status=status.HTTP_400_BAD_REQUEST)
        user = User(**data, sistema='TAQUILLA', usuario_alta=request.user.id_usuario, fecha_alta=datetime.now())
        if user.estatus == 'B':
            user.fecha_baja = user.fecha_alta
        user.save(force_insert=True)
        return Response(self.get_serializer(user).data, status=status.HTTP_201_CREATED)


class UsuarioItemView(APIView):
    """PUT changes the name, type, status or password; DELETE removes the user. Nobody can delete themselves.
    A new password makes the user change it on the next login."""

    def get_user(self, id_usuario):
        return User.objects.filter(id_usuario=id_usuario).first()

    def put(self, request, id_usuario):
        user = self.get_user(id_usuario)
        if user is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UsuarioSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user.nombre = data.get('nombre', user.nombre)
        user.tipo_usuario = data.get('tipo_usuario', user.tipo_usuario)
        user.descri_usuario = data.get('descri_usuario', user.descri_usuario)
        user.usuario_modif = request.user.id_usuario
        estatus = data.get('estatus', user.estatus)
        if estatus != user.estatus:
            user.fecha_baja = datetime.now() if estatus == 'B' else None
        user.estatus = estatus
        password = data.get('password')
        if password and password != user.password:
            user.password = password
            user.fecha_modif = None
        user.save(update_fields=[
            'nombre', 'tipo_usuario', 'descri_usuario', 'estatus', 'fecha_baja', 'password', 'fecha_modif', 'usuario_modif',
        ])
        return Response(UsuarioSerializer(user).data)

    def delete(self, request, id_usuario):
        if id_usuario == request.user.id_usuario:
            return Response({'detail': 'No puede eliminar su propio usuario.'}, status=status.HTTP_400_BAD_REQUEST)
        user = self.get_user(id_usuario)
        if user is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
