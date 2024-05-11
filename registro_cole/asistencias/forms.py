from django import forms
from .models import *

class AlumnoForm(forms.ModelForm):
    class Meta:
        model = Alumnos
        fields = ['nombre', 'apellidos', 'id_unico', 'faltas', 'asistencias', 'tardanzas', 'grado', 'seccion']
        
class GradoForm(forms.ModelForm):
    class Meta:
        model = Grado
        fields = ['nombre']
        
class SeccionForm(forms.ModelForm):
    class Meta:
        model = Seccion
        fields = ['nombre', 'grado']