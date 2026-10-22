from functools import cache

from rest_framework import serializers


@cache
def serializer_for(model):
    """A ModelSerializer with all of the model's fields, made once per model."""
    meta = type('Meta', (), {'model': model, 'fields': '__all__'})
    return type(f'{model.__name__}Serializer', (serializers.ModelSerializer,), {'Meta': meta})
