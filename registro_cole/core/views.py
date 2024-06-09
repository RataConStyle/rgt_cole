from django.shortcuts import render
from proyecto.models import Colegios
# Create your views here.
def head(request):
    user = request.user
    
    colegio = Colegios.objects.get(director = user)
    
    datos_cole ={
        'colegio_nombre' : colegio.nombre,
        'imagen_colegio' : colegio.logo
    }
    
    return render(request, 'head.html')