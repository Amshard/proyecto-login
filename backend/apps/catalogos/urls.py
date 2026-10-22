from django.urls import path

from apps.catalogos import views

urlpatterns = [
    path('permanencias/', views.PermanenciaListView.as_view(), name='permanencias'),
    path('lineas/', views.LineaListView.as_view(), name='lineas'),
    path('estaciones/', views.EstacionListView.as_view(), name='estaciones'),
    path('descansos/', views.DescansoListView.as_view(), name='descansos'),
    path('personal-taquilla/', views.PersonalTaquillaListView.as_view(), name='personal-taquilla'),
    path('personal-respaldo/', views.PersonalRespaldoListView.as_view(), name='personal-respaldo'),
    path('personal-gaceta/', views.PersonalGacetaListView.as_view(), name='personal-gaceta'),
    path('personal-gaceta/califica/', views.CalificaProvisionalView.as_view(), name='personal-gaceta-califica'),
    path('taquillas/', views.TaquillaListView.as_view(), name='taquillas'),
    path('taquillas/operacion/', views.TaquillaOperacionView.as_view(), name='taquillas-operacion'),
    path('rol-taquilla/', views.RolTaquillaView.as_view(), name='rol-taquilla'),
    path('rol-taquilla/sincto/', views.SinCtoView.as_view(), name='rol-taquilla-sincto'),
    path('permanencias/<str:id_permanencia>/', views.PermanenciaItemView.as_view(), name='permanencia-item'),
    path('lineas/<str:id_linea>/', views.LineaItemView.as_view(), name='linea-item'),
    path('estaciones/<str:id_linea>/<str:id_estacion>/', views.EstacionItemView.as_view(), name='estacion-item'),
    path('descansos/<str:id_descansos>/', views.DescansoItemView.as_view(), name='descanso-item'),
    path('taquillas/<str:id_taquilla>/<str:turno>/', views.TaquillaItemView.as_view(), name='taquilla-item'),
    path('personal-taquilla/<int:id_expediente>/', views.PersonalTaquillaItemView.as_view(), name='personal-taquilla-item'),
    path('personal-gaceta/<int:exp>/', views.PersonalGacetaItemView.as_view(), name='personal-gaceta-item'),
]
