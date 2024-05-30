from django.shortcuts import render
from asistencias.models import Grado, Seccion, Alumnos, Asistencia
from django.http import JsonResponse
from django.db import transaction, connection
import calendar, locale


# Create your views here.
def reportes_index(request):

    t_grados = Grado.objects.all().order_by("nombre")
    grados = [
        {
            "id": registro.id,
            "nombre": registro.nombre,
        }
        for registro in t_grados
    ]
    contexto = {
        "titulo": "Resportes importantes",
        "grados": grados,
    }
    return render(request, "paginas/reportes.html", contexto)


def get_alumnos_grado_seccion(request, gradoId, seccionId):
    try:
        if request.method == "GET":
            with transaction.atomic():

                grado_id = Grado.objects.get(id=gradoId)
                seccion_id = Seccion.objects.get(id=seccionId)

                t_alumnos = Alumnos.objects.filter(grado=grado_id, seccion=seccion_id).order_by("apellidos")
                alumnos = [
                    {
                        "id": registro.id,
                        "nombre_completo": f"{registro.apellidos} {registro.nombre}",
                    }
                    for registro in t_alumnos
                ]

                data = {
                    "icono": True,
                    "msg": "Datos obtenidos correctamente",
                    "alumnosGS": alumnos,
                }
                return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"icono": False, "error": "error " + str(e)})


def asistencias_alumno(request):
    try:

        if request.method == "POST":
            alumnoId = request.POST.get("alumnoId")

            alumno_id = Alumnos.objects.get(id=alumnoId)

            with connection.cursor() as cursor:
                cursor.callproc("obtener_asistencias_mes_actual", [alumno_id.id])
                resultados = cursor.fetchall()

            asistencias2 = []

            for item in resultados:
                data_a = {
                    "id": item[0],
                    "fecha": item[1],
                    "hora": item[4],
                    "detalle": item[2],
                }
                asistencias2.append(data_a)

            print(asistencias2)

            d_alumno = {
                "nombre_completo": f"{alumno_id.apellidos}  {alumno_id.nombre}",
                "grado": f"{alumno_id.grado}°",
                "seccion": f"{alumno_id.seccion}",
            }

            t_asistencias = Asistencia.objects.filter(id_alumno=alumno_id)

            asistencias = [
                {"id": registro.id, "fecha": registro.fecha, "registro": registro.asistencia}
                for registro in t_asistencias
            ]

            with transaction.atomic():

                data = {
                    "icono": True,
                    "msg": "datos obtenidos correctamente",
                    "asistencias": asistencias,
                    "alumno": d_alumno,
                    "asistencias2": asistencias2,
                }

                return JsonResponse(data)

    except Exception as e:
        return JsonResponse({"icono": False, "error": str(e)})
    
    
def asistencias_alumno_anual(request):
    try:

        if request.method == "POST":
            alumnoId = request.POST.get("alumnoId")
            mesNumerico = request.POST.get("nameMes")

            locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8')
            # mesNumerico = list(calendar.month_name).index(nameMes.capitalize())
            nombre_mes = calendar.month_name[int(mesNumerico)]
            
            print(nombre_mes)
            
            alumno_id = Alumnos.objects.get(id=alumnoId)

            with connection.cursor() as cursor:
                cursor.callproc("SP_asistencias_anuales", [alumno_id.id, mesNumerico])
                resultados = cursor.fetchall()

            asistencias2 = []

            for item in resultados:
                data_a = {
                    "id": item[0],
                    "fecha": item[1].strftime("%d %B %y"),
                    "hora": item[4].strftime("%I:%M %p"),
                    "detalle": item[2],
                }
                asistencias2.append(data_a)

            print(asistencias2)

            d_alumno = {
                "nombre_completo": f"{alumno_id.apellidos}  {alumno_id.nombre}",
                "grado": f"{alumno_id.grado}°",
                "seccion": f"{alumno_id.seccion}",
            }

            t_asistencias = Asistencia.objects.filter(id_alumno=alumno_id)

            asistencias = [
                {"id": registro.id, "fecha": registro.fecha, "registro": registro.asistencia}
                for registro in t_asistencias
            ]

            with transaction.atomic():

                data = {
                    "icono": True,
                    "msg": "datos obtenidos correctamente",
                    "asistencias": asistencias,
                    "alumno": d_alumno,
                    "asistencias2": asistencias2,
                    "name_mes" : nombre_mes,
                }

                return JsonResponse(data)

    except Exception as e:
        return JsonResponse({"icono": False, "error": str(e)})

