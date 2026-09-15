from rest_framework import serializers

from apps.catalogos.models import (
    Descanso,
    Estacion,
    Linea,
    Permanencia,
    PersonalRespaldo,
    PersonalTaquilla,
    Taquilla,
)


class PermanenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permanencia
        fields = ['id_permanencia', 'nombre_perma', 'descripcion', 'siglas']


class LineaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Linea
        fields = [
            'id_linea',
            'dirdelinea1',
            'nombre_dirlin1',
            'dirdelinea2',
            'nombre_dirlin2',
            'estaciones',
            'taquillas',
            'tramos',
            'id_permanencia',
        ]


class EstacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estacion
        fields = ['id_linea', 'id_estacion', 'nombre_estacion']


class DescansoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Descanso
        fields = ['id_descansos', 'iniciales', 'descanso1', 'descanso2']


class PersonalTaquillaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalTaquilla
        fields = ['id_expediente', 'nombre', 'fecha_ingreso', 'prejubilacion', 'sexo']


class PersonalRespaldoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalRespaldo
        fields = ['id_expediente', 'fecha_ingreso']


class TaquillaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Taquilla
        fields = ['id_taquilla', 'turno', 'dirdelinea', 'extension_tel', 'id_linea', 'id_estacion']
