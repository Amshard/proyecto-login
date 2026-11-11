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
    nombre = models.CharField(max_length=50, null=True, blank=True)
    fecha_ingreso = models.DateField(null=True, blank=True)
    prejubilacion = models.CharField(max_length=1, null=True, blank=True)
    sexo = models.CharField(max_length=1, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'cat_personal_taquilla'

    def __str__(self):
        return self.nombre or str(self.id_expediente)


class PersonalRespaldo(models.Model):
    id_expediente = models.IntegerField(primary_key=True)
    fecha_ingreso = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'cat_personal_respaldo'

    def __str__(self):
        return str(self.id_expediente)


class PersonalGaceta(models.Model):
    exp = models.IntegerField(primary_key=True, db_column='Exp')
    permiso = models.CharField(max_length=4, db_column='Permiso', blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'PersonalGaceta'

    def __str__(self):
        return str(self.exp)


class Parametro(models.Model):
    """A Parámetros Para Calificación table: a count (clave) and the points it is worth."""

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.clave)


class AntiguedadStc(Parametro):
    clave = models.SmallIntegerField(primary_key=True, db_column='id_años_cumplidos')
    puntos = models.FloatField(db_column='puntos_años_stc')

    class Meta:
        managed = False
        db_table = 'pc_antiguedad_stc'


class Asistencia(Parametro):
    clave = models.SmallIntegerField(primary_key=True, db_column='id_faltas')
    puntos = models.FloatField(db_column='puntos_faltas')

    class Meta:
        managed = False
        db_table = 'pc_asistencia'


class Puntualidad(Parametro):
    clave = models.SmallIntegerField(primary_key=True, db_column='id_retardos')
    puntos = models.FloatField(db_column='puntos_retardos')

    class Meta:
        managed = False
        db_table = 'pc_puntualidad'


class RolesLineaTurno(Parametro):
    clave = models.SmallIntegerField(primary_key=True, db_column='id_roles_enlintur')
    puntos = models.FloatField(db_column='puntos_roles_enlintur')

    class Meta:
        managed = False
        db_table = 'pc_roles_enlintur'


class FaltanteEfectivo(Parametro):
    clave = models.SmallIntegerField(primary_key=True, db_column='id_monto')
    monto_inicial = models.FloatField(db_column='demonto_inicial')
    monto_final = models.FloatField(db_column='amonto_final')
    puntos = models.SmallIntegerField(db_column='puntos_xfaltaefectivo')

    class Meta:
        managed = False
        db_table = 'pc_faltante_efectivo'


class FrecuenciaFe(Parametro):
    clave = models.SmallIntegerField(primary_key=True, db_column='id_frecuencia')
    puntos = models.SmallIntegerField(db_column='puntos_frecuenciafe')

    class Meta:
        managed = False
        db_table = 'pc_frecuencia_fe'


class Sanciones(Parametro):
    clave = models.SmallIntegerField(primary_key=True, db_column='id_sanciones')
    puntos = models.FloatField(db_column='puntos_sanciones')

    class Meta:
        managed = False
        db_table = 'pc_sanciones'


class RolDelAnio(models.Model):
    anio = models.SmallIntegerField(db_column='id_año')
    id_rol_anual = models.SmallIntegerField()
    nombre_rol = models.CharField(max_length=12)
    meses_q_califica = models.CharField(max_length=12)
    fecha_ini = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    estado = models.CharField(max_length=6, blank=True, null=True)

    pk = models.CompositePrimaryKey('anio', 'id_rol_anual')

    class Meta:
        managed = False
        db_table = 'cat_rolesdelaño'

    def __str__(self):
        return f'{self.anio} {self.nombre_rol}'


class Catorcena(models.Model):
    anio = models.SmallIntegerField(db_column='id_año')
    id_catorcena = models.CharField(max_length=2)
    descrip123 = models.CharField(max_length=10)
    mes = models.CharField(max_length=10)
    fecha_ini = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    periodo = models.CharField(max_length=55)
    dia1 = models.CharField(max_length=2, blank=True, null=True)
    idia1 = models.CharField(max_length=1, blank=True, null=True)
    dia2 = models.CharField(max_length=2, blank=True, null=True)
    idia2 = models.CharField(max_length=1, blank=True, null=True)
    dia3 = models.CharField(max_length=2, blank=True, null=True)
    idia3 = models.CharField(max_length=1, blank=True, null=True)
    dia4 = models.CharField(max_length=2, blank=True, null=True)
    idia4 = models.CharField(max_length=1, blank=True, null=True)
    dia5 = models.CharField(max_length=2, blank=True, null=True)
    idia5 = models.CharField(max_length=1, blank=True, null=True)
    dia6 = models.CharField(max_length=2, blank=True, null=True)
    idia6 = models.CharField(max_length=1, blank=True, null=True)
    dia7 = models.CharField(max_length=2, blank=True, null=True)
    idia7 = models.CharField(max_length=1, blank=True, null=True)
    dia8 = models.CharField(max_length=2, blank=True, null=True)
    idia8 = models.CharField(max_length=1, blank=True, null=True)
    dia9 = models.CharField(max_length=2, blank=True, null=True)
    idia9 = models.CharField(max_length=1, blank=True, null=True)
    dia10 = models.CharField(max_length=2, blank=True, null=True)
    idia10 = models.CharField(max_length=1, blank=True, null=True)
    dia11 = models.CharField(max_length=2, blank=True, null=True)
    idia11 = models.CharField(max_length=1, blank=True, null=True)
    dia12 = models.CharField(max_length=2, blank=True, null=True)
    idia12 = models.CharField(max_length=1, blank=True, null=True)
    dia13 = models.CharField(max_length=2, blank=True, null=True)
    idia13 = models.CharField(max_length=1, blank=True, null=True)
    dia14 = models.CharField(max_length=2, blank=True, null=True)
    idia14 = models.CharField(max_length=1, blank=True, null=True)

    pk = models.CompositePrimaryKey('anio', 'id_catorcena')

    class Meta:
        managed = False
        db_table = 'cat_catorcenas'

    def __str__(self):
        return f'{self.anio} {self.id_catorcena}'


class PeriodoVacacional(models.Model):
    anio = models.SmallIntegerField(db_column='id_año')
    id_periodovac = models.CharField(max_length=2)
    fecha_ini = models.DateTimeField(blank=True, null=True)
    fecha_fin = models.DateTimeField(blank=True, null=True)
    periodo = models.CharField(max_length=60, blank=True, null=True)

    pk = models.CompositePrimaryKey('anio', 'id_periodovac')

    class Meta:
        managed = False
        db_table = 'cat_periodos_vacacionales'

    def __str__(self):
        return f'{self.anio} {self.id_periodovac}'
