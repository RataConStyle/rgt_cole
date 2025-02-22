"""
URL configuration for registo_cole project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('proyecto.urls')),
    path('asistencias/', include('asistencias.urls')),
    path('reportes/', include('reportes.urls')),
    
    # path('asistencias/', views.alumnos, name="asistencias"),
    # path('registroAlumnos/', registroAlumno, name="registroAlumno"),
    # path('editar/<int:idAlumno>/', editarAlumno, name="editAlumno"),
    # path('eliminar/<int:idAlumno>/', eliminarAlumno, name="deleteAlumno"),
    # path('verAsistencias/<int:idAlumno>/', verAsistencias, name="asistenciasAlumno"),
]
