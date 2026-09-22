from django.urls import path

from apps.catalogos.views import (
    DescansoListView,
    EstacionListView,
    LineaListView,
    PermanenciaListView,
    PersonalGacetaListView,
    PersonalRespaldoListView,
    PersonalTaquillaListView,
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
]
