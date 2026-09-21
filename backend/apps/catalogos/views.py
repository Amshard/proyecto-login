from rest_framework import generics, permissions

from apps.catalogos import models, serializers


class CatalogoListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]


def _list_view(model, serializer, *ordering):
    return type(f'{model.__name__}ListView', (CatalogoListView,), {
        'queryset': model.objects.order_by(*ordering) if ordering else model.objects.all(),
        'serializer_class': serializer,
    })


PermanenciaListView = _list_view(models.Permanencia, serializers.PermanenciaSerializer)
LineaListView = _list_view(models.Linea, serializers.LineaSerializer, 'id_linea')
EstacionListView = _list_view(models.Estacion, serializers.EstacionSerializer, 'id_linea', 'id_estacion')
DescansoListView = _list_view(models.Descanso, serializers.DescansoSerializer, 'id_descansos')
PersonalTaquillaListView = _list_view(models.PersonalTaquilla, serializers.PersonalTaquillaSerializer, 'nombre')
PersonalRespaldoListView = _list_view(models.PersonalRespaldo, serializers.PersonalRespaldoSerializer, 'id_expediente')
TaquillaListView = _list_view(models.Taquilla, serializers.TaquillaSerializer, 'id_taquilla', 'turno')
