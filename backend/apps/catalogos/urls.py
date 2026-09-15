from django.urls import path

from apps.catalogos.views import (
    DescansoListView,
    EstacionListView,
    LineaListView,
    PermanenciaListView,
    PersonalTaquillaListView,
    TaquillaListView,
)

urlpatterns = [
    path('permanencias/', PermanenciaListView.as_view(), name='permanencias'),
    path('lineas/', LineaListView.as_view(), name='lineas'),
    path('estaciones/', EstacionListView.as_view(), name='estaciones'),
    path('descansos/', DescansoListView.as_view(), name='descansos'),
    path('personal-taquilla/', PersonalTaquillaListView.as_view(), name='personal-taquilla'),
    path('taquillas/', TaquillaListView.as_view(), name='taquillas'),
]
