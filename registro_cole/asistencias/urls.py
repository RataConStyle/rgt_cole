from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.alumnos, name='alumnos'),
    
    path('verAsistencias/', views.asistencias, name='verAsistencias'),
    path('registroAlumnos/', views.registroAlumno, name='registroAlumnos'),
    path('editar/<int:idAlumno>/', views.editarAlumno, name='editAlumno'),
    path('eliminar/<int:idAlumno>/', views.eliminarAlumno, name='deleteAlumno'),
    path('verAsistencias/<int:idAlumno>/', views.verAsistencias, name='asistenciasAlumno'),
    path('tomarAsistencia/<str:codigoAlumno>/', views.tomarAsistencia, name='tomarAsistencia'),
    path('verSecciones/<int:gradoId>/', views.get_secciones, name='verSecciones'),
    path('gradosSecciones/', views.get_grados_secciones, name='gradosSecciones'),
    path('alumnosGradosSecciones/<int:gradoId>/<int:seccionId>/', views.get_alumnos_grados_secciones, name='alumnosGradosSecciones'),
    path('asistenciasAlumnos/', views.asistencias_alumnos, name='asistenciasAlumnos'),
    path('getAsistenciasAlumnos/', views.get_asistencias_alumnos, name='getAsistenciasAlumnos'),
    path('getAsistencia/', views.get_asistencia, name='getAsistencia'),
    path('editarAsistencia/', views.editar_asistencia, name='editarAsistencia'),
    path('deleteAsistencia/', views.delete_asistencia, name='deleteAsistencia'),
    
]