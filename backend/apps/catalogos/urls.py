from django.urls import path

from apps.catalogos.views import (
    DescansoItemView,
    DescansoListView,
    EstacionItemView,
    EstacionListView,
    LineaItemView,
    LineaListView,
    PermanenciaItemView,
    PermanenciaListView,
    PersonalGacetaItemView,
    PersonalGacetaListView,
    PersonalRespaldoListView,
    PersonalTaquillaItemView,
    PersonalTaquillaListView,
    TaquillaItemView,
    TaquillaListView,
)

urlpatterns = [
    path('permanencias/', PermanenciaListView.as_view(), name='permanencias'),
    path('lineas/', LineaListView.as_view(), name='lineas'),
    path('estaciones/', EstacionListView.as_view(), name='estaciones'),
    path('descansos/', DescansoListView.as_view(), name='descansos'),
    path('personal-taquilla/', PersonalTaquillaListView.as_view(), name='personal-taquilla'),
    path('personal-respaldo/', PersonalRespaldoListView.as_view(), name='personal-respaldo'),
    path('personal-gaceta/', PersonalGacetaListView.as_view(), name='personal-gaceta'),
    path('taquillas/', TaquillaListView.as_view(), name='taquillas'),
    path('permanencias/<str:id_permanencia>/', PermanenciaItemView.as_view(), name='permanencia-item'),
    path('lineas/<str:id_linea>/', LineaItemView.as_view(), name='linea-item'),
    path('estaciones/<str:id_linea>/<str:id_estacion>/', EstacionItemView.as_view(), name='estacion-item'),
    path('descansos/<str:id_descansos>/', DescansoItemView.as_view(), name='descanso-item'),
    path('taquillas/<str:id_taquilla>/<str:turno>/', TaquillaItemView.as_view(), name='taquilla-item'),
    path(
        'personal-taquilla/<int:id_expediente>/',
        PersonalTaquillaItemView.as_view(),
        name='personal-taquilla-item',
    ),
    path('personal-gaceta/<int:exp>/', PersonalGacetaItemView.as_view(), name='personal-gaceta-item'),
]
