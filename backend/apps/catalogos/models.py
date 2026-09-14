from django.db import models


class Permanencia(models.Model):
    id_permanencia = models.CharField(max_length=2, primary_key=True)
    nombre_perma = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=255)
    siglas = models.CharField(max_length=8)

    class Meta:
        managed = False
        db_table = 'cat_permanencias'

    def __str__(self):
        return self.nombre_perma


class Estacion(models.Model):
    id_linea = models.CharField(max_length=2)
    id_estacion = models.CharField(max_length=2)
    nombre_estacion = models.CharField(max_length=25)

    pk = models.CompositePrimaryKey('id_linea', 'id_estacion')

    class Meta:
        managed = False
        db_table = 'cat_estaciones'

    def __str__(self):
        return self.nombre_estacion


class Descanso(models.Model):
    id_descansos = models.CharField(max_length=2, primary_key=True)
    iniciales = models.CharField(max_length=2)
    descanso1 = models.CharField(max_length=10)
    descanso2 = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'cat_descansos'

    def __str__(self):
        return self.iniciales


class PersonalTaquilla(models.Model):
    id_expediente = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=50)
    fecha_ingreso = models.DateField()
    prejubilacion = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'cat_personal_taquilla'

    def __str__(self):
        return self.nombre
