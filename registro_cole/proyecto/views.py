from django.shortcuts import render

# Create your views here.

def index(request):
    contexto = {
        "titulo" : "Inicio de la pagina",
    }
    #reques, url del archivo de la vista, y un array si es necesario
    return render(request, "proyecto/index.html", contexto)