from django.shortcuts import render
from django.http import JsonResponse

from .models import *
import random
import string
from datetime import datetime, timedelta

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

# Create your views here.

def alumnos(request):
    
    grados = Grado.objects.all().order_by('id')
    
    contexto = {
        "titulo" : "Listado de alumnos",
        "grados" : grados,
    }
    
    return render(request, "paginas/alumnos.html", contexto)

def asistencias(request):
    try:
        if request.method == "GET":
            data = Alumnos.objects.all().values('id', 'nombre', 'apellidos', 'id_unico', 'grado__nombre', 'seccion__nombre')
            return JsonResponse(list(data), safe=False)
    except Exception as e:
        # Capturar cualquier excepción y devolver un mensaje de error
        return JsonResponse({"msg": str(e), "icono": "warning"}, status=500)
    
def registroAlumno(request):
    try:
        if request.method == "POST":
            id = request.POST.get("id")
            nombre = request.POST.get("nombreAlumno")
            apellidos = request.POST.get("apellidosAlumno")
            grado = int(request.POST.get("gradoAlumno"))
            seccion = int(request.POST.get("seccionAlumno"))
            
            grado_id = Grado.objects.get(id=grado)
            seccion_id = Seccion.objects.get(id=seccion)
            
            if not id:
                
                longitud = 8
                # Generar código aleatorio compuesto únicamente por números
                idUnico = ''.join(random.choice(string.digits) for _ in range(longitud))
            
                if Alumnos.objects.filter(id_unico=idUnico).exists():
                    idUnico = ''.join(random.choice(string.digits) for _ in range(longitud))
                else:
                    
                    
                    codigo_a = f"JCM{idUnico}"
                    nuevo_alumno = Alumnos(
                        nombre=nombre,
                        apellidos=apellidos,
                        id_unico=codigo_a,
                        grado=grado_id,
                        seccion=seccion_id,
                    )
                    nuevo_alumno.save()
                                        
                    respuesta = {
                        "msg" : "Alumno registrado correctamente",
                        "icono" : "success",
                    }
                
            else:
                alumno = Alumnos.objects.get(id=id)
                #cambiar los campos del alumno
                alumno.nombre = nombre
                alumno.apellidos = apellidos
                alumno.grado = grado_id
                alumno.seccion = seccion_id
                alumno.save()
                respuesta = {
                    "mensaje" : "Alumno editado correctamente",
                    "icono" : "success",
                }          
            
            return JsonResponse(respuesta, safe=False)
            
    except Exception as e:
        respuesta = {
            "msg" : str(e) + "Algo salio mal",
            "icono" : "error",
        }
        # Capturar cualquier excepción y devolver un mensaje de error
        return JsonResponse(respuesta, safe=False)
    
def editarAlumno(request, idAlumno):
    try:
        if request.method == "GET":
            t_alumno = Alumnos.objects.get(id=idAlumno)
            t_grado = Grado.objects.get(id=t_alumno.grado.id)
            t_seccion = Seccion.objects.get(id=t_alumno.seccion.id)
            t_secciones_grado = Seccion.objects.filter(grado=t_grado).order_by('nombre')
            t_secciones = [{'id' : registro.id, 'nombre' : registro.nombre} for registro in t_secciones_grado]

            data_alumno = {
                'id': t_alumno.id,
                'nombre': t_alumno.nombre,
                'apellidos': t_alumno.apellidos,
                'grado' : t_grado.nombre,
                'seccion' : t_seccion.nombre,
                'grado_id' : t_grado.id,
                'seccion_id' : t_seccion.id,
                'secciones' : t_secciones
            }

            data = {
                'icono' : True,
                'msg' : 'datos obtenidos',
                'alumno' : data_alumno,                
            }
            
            return JsonResponse(data)
                   
    except Exception as e:
        
        # Capturar cualquier excepción y devolver un mensaje de error
        return JsonResponse({
            "error" : str(e) + "Algo salio mal",
            "icono" : False,
        })
    
def eliminarAlumno(request, idAlumno):
    try:
        if request.method == "GET":
            if int(idAlumno):
                Alumnos.objects.get(id=idAlumno).delete()
                respuesta = {
                    "msg" : "Alumno eliminado con exito",
                    "icono" : "success",
                }
                return JsonResponse(respuesta, safe=False)  
                      
    except Exception as e:
        respuesta = {
            "msg" : str(e) + "Algo salio mal",
            "icono" : "error",
        }
        # Capturar cualquier excepción y devolver un mensaje de error
        return JsonResponse(respuesta, safe=False)
    
def verAsistencias(request, idAlumno):
    try:
        if request.method == "GET":
            
            today = datetime.today()
            start_of_week = today - timedelta(days=today.weekday())

            # Obtener la fecha de fin de la semana actual (viernes)
            end_of_week = start_of_week + timedelta(days=4)

            # Filtrar las asistencias para la semana actual
            try:
                asistencias_semana_actual = {
                    'lunes': 'X' if Asistencia.objects.filter(id_alumno=idAlumno, fecha=start_of_week).exists() else '',
                    'martes': 'X' if Asistencia.objects.filter(id_alumno=idAlumno, fecha=start_of_week + timedelta(days=1)).exists() else '',
                    'miercoles': 'X' if Asistencia.objects.filter(id_alumno=idAlumno, fecha=start_of_week + timedelta(days=2)).exists() else '',
                    'jueves': 'X' if Asistencia.objects.filter(id_alumno=idAlumno, fecha=start_of_week + timedelta(days=3)).exists() else '',
                    'viernes': 'X' if Asistencia.objects.filter(id_alumno=idAlumno, fecha=end_of_week).exists() else '',
                }
            except ObjectDoesNotExist:
                asistencias_semana_actual = {
                    'lunes': '',
                    'martes': '',
                    'miercoles': '',
                    'jueves': '',
                    'viernes': '',
                }
            
            data = {
                "datos" : Alumnos.objects.values().get(id=idAlumno),
                "asis" : asistencias_semana_actual,
            }
             # Obtiene el unico valor con el idAlumno
            return JsonResponse(data, safe=False)
                    
    except Exception as e:
        respuesta = {
            "msg" : str(e) + "Algo salio mal",
            "icono" : "error",
        }
        # Capturar cualquier excepción y devolver un mensaje de error
        return JsonResponse(respuesta, safe=False)
    
def tomarAsistencia(request, codigoAlumno):
    if request.method == 'GET':
        try:
            alumno = Alumnos.objects.get(id_unico=codigoAlumno)
            
            nombre_alumno = alumno.nombre
            apellido_alumno = alumno.apellidos
            codigo_alumno = alumno.id_unico
            id_alumno = alumno.id
            
            nombre_completo = apellido_alumno + ' ' + nombre_alumno
            
            data = {
                'icono' : True,
                'msg' : 'datos obtenidos correctamente',
                'id': id_alumno,
                'nombreCompleto' : nombre_completo,
                'codigoAlumno' : codigo_alumno,
            }
            
            return JsonResponse(data)
            
        except Exception as e:
            return JsonResponse({'icono': False, 'msg' : 'Error fatal', 'error' : str(e)})

def get_secciones(request, gradoId):
    if request.method == 'GET':
        try:
            
            todas_secciones = Seccion.objects.filter(grado=gradoId).order_by('nombre')
            
            secciones = [{'id' : registro.id, 'nombre'  : registro.nombre} for registro in todas_secciones]
            
            data = {
                'icono' : True,
                'msg' : 'datos obtenidos',
                'secciones' : secciones,
            }
            
            return JsonResponse(data)
            
        except Exception as e:
            return JsonResponse({'icono': False, 'error':str(e)})


def get_grados_secciones(request):
    
    todos_grados = Grado.objects.all().order_by('nombre')
    
    grados = [{'id' : registro.id, 'nombre' : registro.nombre} for registro in todos_grados]
    
    contexto = {
        'grados' : grados,
        'titulo' : 'Secciones y grados'
    }
    
    return render(request, "paginas/gradosSecciones.html", contexto)

def get_alumnos_grados_secciones(request, gradoId, seccionId):
    
    try:
        if request.method == 'GET':
            
            with transaction.atomic():
                
                grado_id = Grado.objects.get(id=gradoId)
                seccion_id = Seccion.objects.get(id=seccionId)
                
                alumnos_g_s = Alumnos.objects.filter(grado = grado_id, seccion = seccion_id).order_by('apellidos')
                
                alumnos = [{'id': registro.id, 'nombre_completo' : registro.apellidos + ' ' + registro.nombre, 'codigo' : registro.id_unico,
                            'grado' : registro.grado.nombre, 'seccion' : registro.seccion.nombre} for registro in alumnos_g_s]
                
                data = {
                    'icono' : True,
                    'alumnos' : alumnos,
                }
                
                return JsonResponse(data)
            
    except Exception as e:
        return JsonResponse({'icono' : False, 'msg' : str(e)})
        
