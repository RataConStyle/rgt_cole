from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.reportes_index, name='reportes'),
    path('verAlumnosGradoSeccion/<int:gradoId>/<int:seccionId>', views.get_alumnos_grado_seccion, name='verAlumnosGradoSeccion'),
    path('asistenciasAlumno/', views.asistencias_alumno, name='asistenciasAlumno'),
    path('asistenciasAlumnoAnual/', views.asistencias_alumno_anual, name='asistenciasAlumnoAnual'),
]