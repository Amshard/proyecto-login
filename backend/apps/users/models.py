from django.contrib.auth.models import AbstractUser
from django.db import models


#class User(AbstractUser):
#    email = models.EmailField(unique=True)
#
#    USERNAME_FIELD = 'email'
#    REQUIRED_FIELDS = ['username']

#    def __str__(self):
#        return self.email

class LegacyUser(models.Model):
    id = models.AutoField(db_column='id_usuario', primary_key=True)
    username = models.CharField(db_column='nombre', max_lenght=100, unique=True)
    password_hash = models.CharField(db_column='password', max_lenght=255)
    is_active = models.BooleanField(db_column='estatus', default=True)

    class Meta:
        managed = False
        db_table = ''


#Ajusta db_column y db_table a los nombres reales de tu esquema 
# python manage.py inspectdb --database=default > legacy_models.py