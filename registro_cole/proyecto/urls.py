from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.index, name='inicio'),
    path('registrarDatosCole/', views.registrar_datos_cole, name='registrarDatosCole'),

]