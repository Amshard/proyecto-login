import datetime

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone

PASSWORD_MAX_AGE_DAYS = 91


class UserManager(BaseUserManager):
    def create_user(self, id_usuario, password=None, **extra_fields):
        if not id_usuario:
            raise ValueError('El id_usuario es obligatorio')
        extra_fields.setdefault('estatus', 'A')
        user = self.model(id_usuario=id_usuario, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, id_usuario, password=None, **extra_fields):
        return self.create_user(id_usuario, password, **extra_fields)


class User(AbstractBaseUser):
    id_usuario = models.CharField(max_length=5, primary_key=True)
    password = models.CharField(max_length=16)
    nombre = models.CharField(max_length=60)
    estatus = models.CharField(max_length=1, blank=True, null=True)
    fecha_alta = models.DateTimeField(blank=True, null=True)
    fecha_baja = models.DateTimeField(blank=True, null=True)
    fecha_modif = models.DateTimeField(blank=True, null=True)

    last_login = None

    USERNAME_FIELD = 'id_usuario'
    REQUIRED_FIELDS = ['nombre']

    objects = UserManager()

    class Meta:
        managed = False
        db_table = 'usuarios'

    def __str__(self):
        return self.id_usuario

    @property
    def is_active(self):
        return self.estatus == 'A'

    @property
    def must_change_password(self):
        if not self.fecha_modif:
            return True
        now = datetime.datetime.now() if timezone.is_naive(self.fecha_modif) else timezone.now()
        return (now - self.fecha_modif) >= datetime.timedelta(days=PASSWORD_MAX_AGE_DAYS)

    def set_password(self, raw_password):
        # The legacy USUARIOS table stores passwords in plain text (nvarchar(16));
        # other systems read this same table, so we can't switch to hashing here.
        self.password = raw_password

    def check_password(self, raw_password):
        return raw_password == self.password


class RolVigente(models.Model):
    id_rol_anual = models.SmallIntegerField(primary_key=True)
    nombre_rol = models.CharField(max_length=12)
    meses_q_califica = models.CharField(max_length=12, blank=True, null=True)
    fecha_ini = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    fecha_modif = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'rolvigente'

    def __str__(self):
        return self.nombre_rol
