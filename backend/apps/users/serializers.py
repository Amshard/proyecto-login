from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from datetime import datetime

from apps.users.models import RolVigente

User = get_user_model()


class RolVigenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolVigente
        fields = ['nombre_rol', 'meses_q_califica', 'fecha_ini', 'fecha_fin']


class UserSerializer(serializers.ModelSerializer):
    must_change_password = serializers.BooleanField(read_only=True)
    rol_vigente = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id_usuario', 'nombre', 'must_change_password', 'fecha_modif', 'rol_vigente']

    def get_rol_vigente(self, obj):
        rol_vigente = RolVigente.objects.order_by('-fecha_ini').first()
        return RolVigenteSerializer(rol_vigente).data if rol_vigente else None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, max_length=16)

    class Meta:
        model = User
        fields = ['id_usuario', 'nombre', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, max_length=16)
    confirm_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('La contraseña actual es incorrecta')
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError('Las contraseñas no coinciden')
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.fecha_modif = datetime.now()
        user.save(using=user._state.db, update_fields=['password', 'fecha_modif'])
        return user
