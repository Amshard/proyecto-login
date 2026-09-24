from django.db import connection, transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalogos import models, serializers


# Key fields of each editable catalog; keys are set on insert and never updated.
KEYS = {
    models.Permanencia: ('id_permanencia',),
    models.Linea: ('id_linea',),
    models.Estacion: ('id_linea', 'id_estacion'),
    models.Descanso: ('id_descansos',),
    models.Taquilla: ('id_taquilla', 'turno'),
    models.PersonalTaquilla: ('id_expediente',),
    models.PersonalGaceta: ('exp',),
}

# Tables without usuario_alta / fecha_alta / usuario_modif / fecha_modif columns.
UNAUDITED = {models.PersonalGaceta}


def _where(columns):
    return ' AND '.join(f'{column} = %s' for column in columns)


def _columns(model, names):
    return [model._meta.get_field(name).column for name in names]


class CatalogoListView(generics.ListAPIView):
    """GET the catalog; POST inserts a row, stamping usuario_alta / fecha_alta."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        model = self.queryset.model
        keys = KEYS.get(model)
        if keys is None:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        serializer = self.get_serializer(data=request.data)
        # Checked before validation so a duplicate id gets this message, not the serializer's.
        if model.objects.filter(**{key: request.data.get(key) for key in keys}).exists():
            return Response({'detail': 'Ya existe un registro con esa clave.'}, status=status.HTTP_409_CONFLICT)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        columns = _columns(model, data)
        placeholders = ['%s'] * len(columns)
        values = list(data.values())
        if model not in UNAUDITED:
            columns += ['usuario_alta', 'fecha_alta', 'usuario_modif', 'fecha_modif']
            placeholders += ['%s', 'GETDATE()', 'NULL', 'NULL']
            values.append(request.user.id_usuario)
        with connection.cursor() as cursor:
            cursor.execute(
                f'INSERT INTO {model._meta.db_table} ({", ".join(columns)}) VALUES ({", ".join(placeholders)})',
                values,
            )
        created = model.objects.get(**{key: data[key] for key in keys})
        return Response(self.get_serializer(created).data, status=status.HTTP_201_CREATED)


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
PersonalGacetaListView = _list_view(models.PersonalGaceta, serializers.PersonalGacetaSerializer, 'exp')
TaquillaListView = _list_view(models.Taquilla, serializers.TaquillaSerializer, 'id_taquilla', 'turno')


class CatalogoItemView(APIView):
    """PUT (modify) or DELETE one catalog row, addressed by its key columns.

    URL kwargs are named after the KEYS fields. `links` are (table, columns, reason) checked
    in order with the same key values before a delete. A PUT also stamps usuario_modif with
    the user and fecha_modif with today (except UNAUDITED tables).
    """

    permission_classes = [permissions.IsAuthenticated]
    model = None
    serializer_class = None
    links: tuple[tuple[str, tuple[str, ...], str], ...] = ()

    @property
    def keys(self):
        return KEYS[self.model]

    def put(self, request, **kwargs):
        lookup = {key: kwargs[key] for key in self.keys}
        instance = self.model.objects.filter(**lookup).first()
        if instance is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        fields = self.model._meta
        assignments, values = [], []
        for name, value in serializer.validated_data.items():
            if name not in self.keys:
                assignments.append(f'{fields.get_field(name).column} = %s')
                values.append(value)
        if self.model not in UNAUDITED:
            assignments += ['usuario_modif = %s', 'fecha_modif = GETDATE()']
            values.append(request.user.id_usuario)
        if assignments:
            with connection.cursor() as cursor:
                cursor.execute(
                    f'UPDATE {self._table} SET {", ".join(assignments)} WHERE {self._where}',
                    values + list(lookup.values()),
                )
        return Response(self.serializer_class(self.model.objects.get(**lookup)).data)

    def delete(self, request, **kwargs):
        values = [kwargs[key] for key in self.keys]
        with transaction.atomic(), connection.cursor() as cursor:
            for table, columns, reason in self.links:
                cursor.execute(f'SELECT TOP 1 1 FROM {table} WHERE {_where(columns)}', values)
                if cursor.fetchone():
                    return Response({'detail': f'No procede la baja, {reason}.'}, status=status.HTTP_409_CONFLICT)
            cursor.execute(f'DELETE FROM {self._table} WHERE {self._where}', values)
            if cursor.rowcount == 0:
                return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @property
    def _table(self):
        return self.model._meta.db_table

    @property
    def _where(self):
        return _where(_columns(self.model, self.keys))


def _item_view(model, serializer, *links):
    return type(f'{model.__name__}ItemView', (CatalogoItemView,), {
        'model': model,
        'serializer_class': serializer,
        'links': links,
    })


PermanenciaItemView = _item_view(
    models.Permanencia, serializers.PermanenciaSerializer,
    ('cat_lineas', ('id_permanencia',), 'esta asignada a líneas'),
)
LineaItemView = _item_view(
    models.Linea, serializers.LineaSerializer,
    ('cat_estaciones', ('id_linea',), 'tiene estaciones asignadas'),
    ('cat_taquillas', ('id_linea',), 'tiene taquillas asignadas'),
)
EstacionItemView = _item_view(
    models.Estacion, serializers.EstacionSerializer,
    ('cat_taquillas', ('id_linea', 'id_estacion'), 'tiene taquillas asignadas'),
)
DescansoItemView = _item_view(
    models.Descanso, serializers.DescansoSerializer,
    ('rol_taquilla', ('id_descansos',), 'esta asignado en el rol de taquilla'),
)
TaquillaItemView = _item_view(
    models.Taquilla, serializers.TaquillaSerializer,
    ('rol_taquilla', ('id_taquilla', 'turno'), 'esta asignada en el rol de taquilla'),
)
PersonalTaquillaItemView = _item_view(
    models.PersonalTaquilla, serializers.PersonalTaquillaSerializer,
    ('rol_taquilla', ('id_expediente',), 'esta asignado en el rol de taquilla'),
)
PersonalGacetaItemView = _item_view(models.PersonalGaceta, serializers.PersonalGacetaSerializer)
