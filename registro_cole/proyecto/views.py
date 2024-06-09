from django.shortcuts import render
from django.http import JsonResponse
from django.db import transaction
from .models import Colegios
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
import uuid
# Create your views here.

def index(request):
    contexto = {
        "titulo" : "Inicio de la pagina",
    }
    #reques, url del archivo de la vista, y un array si es necesario
    return render(request, "proyecto/index.html", contexto)

def registrar_datos_cole(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                nombre_colegio = request.POST.get('nombreEscuela')
                imagen_colegio = request.FILES.get('imagenEscuela')
                director_nombre = request.POST.get('nombreDirector')
                director_password = f"admin{nombre_colegio}"
                
                unique_id = uuid.uuid4().hex[:8]
                username = f"{director_nombre}_{unique_id}"
                
                # Crear un nuevo usuario
                director_colegio = User.objects.create_user(
                    first_name=director_nombre,
                    username=username,
                    password=director_password
                )
                
                registrar_cole = Colegios(
                    nombre=nombre_colegio,
                    logo=imagen_colegio,
                    director=director_colegio
                )
                
                registrar_cole.save()
                
                # Autenticar y iniciar sesión con el nuevo usuario
                user = authenticate(username=username, password=director_password)
                
                if user is not None:
                    login(request, user)
                    data = {
                        'estado': True,
                        'msg': 'Registro exitoso de datos del colegio y sesión iniciada'
                    }
                else:
                    data = {
                        'estado': False,
                        'msg': 'Error al iniciar sesión'
                    }
                
                return JsonResponse(data)
                
        except Exception as e:
            return JsonResponse({"estado": False, "msg": str(e)})