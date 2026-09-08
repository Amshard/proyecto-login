from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models


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

    def set_password(self, raw_password):
        # The legacy USUARIOS table stores passwords in plain text (nvarchar(16));
        # other systems read this same table, so we can't switch to hashing here.
        self.password = raw_password

    def check_password(self, raw_password):
        return raw_password == self.password
