from rest_framework import serializers

from apps.catalogos.models import Descanso, Estacion, Permanencia, PersonalTaquilla


class PermanenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permanencia
        fields = ['id_permanencia', 'nombre_perma', 'descripcion', 'siglas']


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
        fields = ['id_expediente', 'nombre', 'fecha_ingreso', 'prejubilacion']
