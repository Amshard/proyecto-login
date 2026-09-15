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


class Linea(models.Model):
    id_linea = models.CharField(max_length=2, primary_key=True)
    dirdelinea1 = models.SmallIntegerField()
    nombre_dirlin1 = models.CharField(max_length=20)
    dirdelinea2 = models.SmallIntegerField()
    nombre_dirlin2 = models.CharField(max_length=20)
    estaciones = models.SmallIntegerField(null=True, blank=True)
    taquillas = models.SmallIntegerField(null=True, blank=True)
    tramos = models.SmallIntegerField(null=True, blank=True)
    id_permanencia = models.CharField(max_length=2, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'cat_lineas'

    def __str__(self):
        return self.id_linea


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


class Taquilla(models.Model):
    id_taquilla = models.CharField(max_length=5, db_column='Id_taquilla')
    turno = models.CharField(max_length=1)
    dirdelinea = models.SmallIntegerField()
    extension_tel = models.CharField(max_length=10, null=True, blank=True)
    id_linea = models.CharField(max_length=2)
    id_estacion = models.CharField(max_length=2)

    pk = models.CompositePrimaryKey('id_taquilla', 'turno')

    class Meta:
        managed = False
        db_table = 'cat_taquillas'

    def __str__(self):
        return f'{self.id_taquilla}-{self.turno}'


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
