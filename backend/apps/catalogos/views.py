from rest_framework import generics, permissions

from apps.catalogos.models import Descanso, Estacion, Linea, Permanencia, PersonalTaquilla, Taquilla
from apps.catalogos.serializers import (
    DescansoSerializer,
    EstacionSerializer,
    LineaSerializer,
    PermanenciaSerializer,
    PersonalTaquillaSerializer,
    TaquillaSerializer,
)


class PermanenciaListView(generics.ListAPIView):
    queryset = Permanencia.objects.all()
    serializer_class = PermanenciaSerializer
    permission_classes = [permissions.IsAuthenticated]


class LineaListView(generics.ListAPIView):
    queryset = Linea.objects.all().order_by('id_linea')
    serializer_class = LineaSerializer
    permission_classes = [permissions.IsAuthenticated]


class EstacionListView(generics.ListAPIView):
    queryset = Estacion.objects.all().order_by('id_linea', 'id_estacion')
    serializer_class = EstacionSerializer
    permission_classes = [permissions.IsAuthenticated]


class DescansoListView(generics.ListAPIView):
    queryset = Descanso.objects.all().order_by('id_descansos')
    serializer_class = DescansoSerializer
    permission_classes = [permissions.IsAuthenticated]


class PersonalTaquillaListView(generics.ListAPIView):
    queryset = PersonalTaquilla.objects.all().order_by('nombre')
    serializer_class = PersonalTaquillaSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaquillaListView(generics.ListAPIView):
    queryset = Taquilla.objects.all().order_by('id_taquilla', 'turno')
    serializer_class = TaquillaSerializer
    permission_classes = [permissions.IsAuthenticated]
