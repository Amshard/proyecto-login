from django.db import connection, transaction
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalogos import models
from apps.catalogos.serializers import serializer_for

UNAUDITED = {models.PersonalGaceta}


def _keys(model):
    return [field.name for field in model._meta.pk_fields]


def _columns(model, names):
    return [model._meta.get_field(name).column for name in names]


def _where(columns):
    return ' AND '.join(f'{column} = %s' for column in columns)


def _fetch(sql, params=()):
    """Runs a query and returns its rows as dicts keyed by column name."""
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


class CatalogoListView(generics.ListAPIView):
    """GET the catalog; POST inserts a row, stamping usuario_alta / fecha_alta."""

    def post(self, request):
        model = self.queryset.model
        keys = _keys(model)
        if model.objects.filter(**{key: request.data.get(key) for key in keys}).exists():
            return Response({'detail': 'Ya existe un registro con esa clave.'}, status=status.HTTP_409_CONFLICT)
        serializer = self.get_serializer(data=request.data)
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


def _list_view(model, *ordering, base=CatalogoListView):
    return type(f'{model.__name__}ListView', (base,), {
        'queryset': model.objects.order_by(*ordering) if ordering else model.objects.all(),
        'serializer_class': serializer_for(model),
    })


PermanenciaListView = _list_view(models.Permanencia)
LineaListView = _list_view(models.Linea, 'id_linea')
EstacionListView = _list_view(models.Estacion, 'id_linea', 'id_estacion')
DescansoListView = _list_view(models.Descanso, 'id_descansos')
PersonalGacetaListView = _list_view(models.PersonalGaceta, 'exp')
TaquillaListView = _list_view(models.Taquilla, 'id_taquilla', 'turno')
# Read only.
PersonalRespaldoListView = _list_view(models.PersonalRespaldo, 'id_expediente', base=generics.ListAPIView)


class PersonalTaquillaListView(_list_view(models.PersonalTaquilla, 'nombre')):
    """POST also takes `numero`, the free rol_taquilla position the new person is assigned to,
    in the same transaction: without a free position nothing is saved."""

    def post(self, request):
        try:
            numero = int(request.data.get('numero'))
        except (TypeError, ValueError):
            numero = None
        with transaction.atomic():
            response = super().post(request)
            if response.status_code != status.HTTP_201_CREATED:
                return response
            with connection.cursor() as cursor:
                cursor.execute(
                    'UPDATE rol_taquilla SET id_expediente = %s, usuario_modif = %s, fecha_modif = GETDATE() '
                    'WHERE numero = %s AND id_expediente = 0',
                    [response.data['id_expediente'], request.user.id_usuario, numero],
                )
                if cursor.rowcount == 0:
                    # Look the position up before marking the rollback: no query can run after it.
                    cursor.execute('SELECT TOP 1 1 FROM rol_taquilla WHERE numero = %s', [numero])
                    message = (
                        'Esta Posición esta ocupada en el ROL Verifique'
                        if cursor.fetchone() else 'Debe asignar a un Rol disponible'
                    )
                    transaction.set_rollback(True)
                    return Response({'detail': message}, status=status.HTTP_409_CONFLICT)
        return response


class QueryView(APIView):
    """GET the rows of `sql`."""

    sql = ''

    def get(self, request):
        return Response(_fetch(self.sql))


class TaquillaOperacionView(QueryView):
    sql = (
        'SELECT DISTINCT(id_taquilla) id_taquilla, turno, linea, nombre_estacion '
        'FROM rol_taquilla_trabajo, cat_estaciones '
        "WHERE id_taquilla <> '00000' "
        'AND (id_estacion = substring(rol_taquilla_trabajo.id_taquilla,3,2)) '
        'AND (rol_taquilla_trabajo.linea = cat_estaciones.id_linea) '
        'ORDER BY id_taquilla, linea, rol_taquilla_trabajo.turno asc, nombre_estacion ASC'
    )


class RolTaquillaView(QueryView):
    """The rol_taquilla positions; id_expediente 0 marks a free one."""

    sql = (
        'SELECT numero, id_expediente, id_tramo, faltas, id_taquilla, categoria, id_descansos, '
        'lugar, calificacion, turno, id_permanencia FROM rol_taquilla ORDER BY numero'
    )


class SinCtoView(QueryView):
    """Each expediente's SinCto from rol_taquilla_trabajo, leaving out blank ones."""

    sql = (
        'SELECT id_expediente, RTRIM(SinCto) AS sincto FROM rol_taquilla_trabajo '
        "WHERE id_expediente <> 0 AND RTRIM(ISNULL(SinCto, '')) <> ''"
    )


class CalificaProvisionalView(APIView):
    """POST sets roles en línea and en turno to 4 in calificacion_taq for every provisional expediente."""

    def post(self, request):
        table = models.PersonalGaceta._meta.db_table
        exp = models.PersonalGaceta._meta.get_field('exp').column
        with transaction.atomic(), connection.cursor() as cursor:
            cursor.execute(
                'UPDATE calificacion_taq SET id_roles_enlinea = 4, id_roles_enturno = 4 '
                f'WHERE id_expediente IN (SELECT {exp} FROM {table} WHERE {exp} <> 0)'
            )
            updated = cursor.rowcount
        return Response({'updated': updated})


class CatalogoItemView(APIView):
    """PUT (modify) or DELETE one catalog row, addressed by its primary key columns.

    URL kwargs are named after the key fields. `links` are (table, columns, message) checked
    in order with the same key values before a delete; the first table with a matching row
    refuses the delete with its message. A PUT also stamps usuario_modif with
    the user and fecha_modif with today (except UNAUDITED tables).
    """

    model = None
    links: tuple[tuple[str, tuple[str, ...], str], ...] = ()

    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.keys = _keys(self.model)
        self.serializer_class = serializer_for(self.model)
        self.table = self.model._meta.db_table
        self.where = _where(_columns(self.model, self.keys))

    def put(self, request, **kwargs):
        lookup = {key: kwargs[key] for key in self.keys}
        instance = self.model.objects.filter(**lookup).first()
        if instance is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        changes = {name: value for name, value in serializer.validated_data.items() if name not in self.keys}
        assignments = [f'{column} = %s' for column in _columns(self.model, changes)]
        values = list(changes.values())
        if self.model not in UNAUDITED:
            assignments += ['usuario_modif = %s', 'fecha_modif = GETDATE()']
            values.append(request.user.id_usuario)
        if assignments:
            with connection.cursor() as cursor:
                cursor.execute(
                    f'UPDATE {self.table} SET {", ".join(assignments)} WHERE {self.where}',
                    values + list(lookup.values()),
                )
        return Response(self.serializer_class(self.model.objects.get(**lookup)).data)

    def delete(self, request, **kwargs):
        values = [kwargs[key] for key in self.keys]
        with transaction.atomic(), connection.cursor() as cursor:
            for table, columns, message in self.links:
                cursor.execute(f'SELECT TOP 1 1 FROM {table} WHERE {_where(columns)}', values)
                if cursor.fetchone():
                    return Response({'detail': message}, status=status.HTTP_409_CONFLICT)
            cursor.execute(f'DELETE FROM {self.table} WHERE {self.where}', values)
            if cursor.rowcount == 0:
                return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


def _item_view(model, *links):
    return type(f'{model.__name__}ItemView', (CatalogoItemView,), {'model': model, 'links': links})


PermanenciaItemView = _item_view(
    models.Permanencia,
    ('cat_lineas', ('id_permanencia',), 'No procede la baja, esta asignada a líneas.'),
)
LineaItemView = _item_view(
    models.Linea,
    ('cat_taquillas', ('id_linea',), 'No procede la baja, hay taquillas con esta clave.'),
)
EstacionItemView = _item_view(
    models.Estacion,
    ('cat_taquillas', ('id_linea', 'id_estacion'), 'No procede la baja, hay taquillas con esta clave.'),
)
DescansoItemView = _item_view(
    models.Descanso,
    ('rol_taquilla', ('id_descansos',), 'No procede la baja, esta asignado en el rol de taquilla.'),
)
TaquillaItemView = _item_view(
    models.Taquilla,
    ('rol_taquilla', ('id_taquilla', 'turno'), 'Existe en el Rol de Taquilla, Primero debe darla de baja en el Rol'),
)
PersonalGacetaItemView = _item_view(models.PersonalGaceta)


class PersonalTaquillaItemView(_item_view(models.PersonalTaquilla)):
    """DELETE also frees the person's rol_taquilla position, in the same transaction."""

    def delete(self, request, **kwargs):
        with transaction.atomic():
            response = super().delete(request, **kwargs)
            if response.status_code == status.HTTP_204_NO_CONTENT:
                with connection.cursor() as cursor:
                    cursor.execute(
                        'UPDATE rol_taquilla SET id_expediente = 0, faltas = 0, calificacion = 0.00, '
                        'usuario_modif = %s, fecha_modif = GETDATE() WHERE id_expediente = %s',
                        [request.user.id_usuario, kwargs['id_expediente']],
                    )
        return response
