from django.shortcuts import render
from asistencias.models import Grado, Seccion, Alumnos, Asistencia
from django.http import JsonResponse
from django.db import transaction

# Create your views here.
def reportes_index(request):
    
    t_grados = Grado.objects.all().order_by('nombre')
    grados = [{
            'id' : registro.id,
            'nombre' : registro.nombre,
        } for registro in t_grados]
    contexto = {
        'titulo' : 'Resportes importantes',
        'grados' : grados,
    }
    return render(request, "paginas/reportes.html", contexto)

def get_alumnos_grado_seccion(request, gradoId, seccionId):
    try:
        if request.method == 'GET':
            with transaction.atomic():
                                
                grado_id = Grado.objects.get(id=gradoId)
                seccion_id = Seccion.objects.get(id=seccionId)
                
                t_alumnos = Alumnos.objects.filter(grado = grado_id, seccion = seccion_id).order_by('apellidos')
                alumnos = [{
                        'id' : registro.id,
                        'nombre_completo' : f"{registro.apellidos} {registro.nombre}",
                    } for registro in t_alumnos]
                
                data = {
                    'icono' : True,
                    'msg' : 'Datos obtenidos correctamente',
                    'alumnosGS' : alumnos,
                }
                return JsonResponse(data)
    except Exception as e:
        return JsonResponse({'icono' : False, 'error' : 'error ' + str(e)})

def asistencias_alumno(request):
    try:
        if request.method == 'POST':
            alumnoId = request.POST.get('alumnoId')
            
            alumno_id = Alumnos.objects.get(id = alumnoId)
            
            t_asistencias = Asistencia.objects.filter(id_alumno=alumno_id)
            
            asistencias = [{'id' : registro.id, 'fecha': registro.fecha, 'registro' : registro.asistencia} for registro in t_asistencias]
            
            with transaction.atomic():                
                data = {
                    'icono' : True,
                    'msg' : 'datos obtenidos correctamente',
                    'asistencias' : asistencias,
                }
                return JsonResponse(data)  
          
    except Exception as e:
        return JsonResponse({'icono' : False, 'error' : str(e)})