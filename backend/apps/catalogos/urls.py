from django.urls import path

from apps.catalogos.views import (
    DescansoListView,
    EstacionListView,
    PermanenciaListView,
    PersonalTaquillaListView,
)

urlpatterns = [
    path('permanencias/', PermanenciaListView.as_view(), name='permanencias'),
    path('estaciones/', EstacionListView.as_view(), name='estaciones'),
    path('descansos/', DescansoListView.as_view(), name='descansos'),
    path('personal-taquilla/', PersonalTaquillaListView.as_view(), name='personal-taquilla'),
]
