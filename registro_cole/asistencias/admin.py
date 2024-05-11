from django.contrib import admin
from .models import *
from .forms import *

class AlumnosAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellidos', 'asistencias')
    
admin.site.register(Alumnos, AlumnosAdmin)

class GradoAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    
admin.site.register(Grado, GradoAdmin)

class SeccionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'grado')
    
admin.site.register(Seccion, SeccionAdmin)
# Register your models here.
