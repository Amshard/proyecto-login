from rest_framework import serializers

from apps.catalogos import models


def _serializer(model):
    meta = type('Meta', (), {'model': model, 'fields': '__all__'})
    return type(f'{model.__name__}Serializer', (serializers.ModelSerializer,), {'Meta': meta})


PermanenciaSerializer = _serializer(models.Permanencia)
LineaSerializer = _serializer(models.Linea)
EstacionSerializer = _serializer(models.Estacion)
DescansoSerializer = _serializer(models.Descanso)
PersonalTaquillaSerializer = _serializer(models.PersonalTaquilla)
PersonalRespaldoSerializer = _serializer(models.PersonalRespaldo)
TaquillaSerializer = _serializer(models.Taquilla)
