from django.db import models


class Grado(models.Model):
    nombre = models.IntegerField(default=0)
    
    def __str__(self):
        return str(self.nombre)
    
    class Meta:
        db_table = 'grado_alumnos'

class Seccion(models.Model):
    nombre = models.CharField(max_length=2)
    grado = models.ForeignKey(Grado, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'seccion_alumnos'

class Alumnos(models.Model):
    nombre = models.CharField(max_length=50, null=True)
    apellidos = models.CharField(max_length=100, null=True)
    id_unico = models.CharField(null=True, max_length=12)
    asistencias = models.IntegerField(default=0)
    faltas = models.IntegerField(default=0)
    tardanzas = models.IntegerField(default=0)
    grado = models.ForeignKey(Grado, on_delete=models.CASCADE)
    seccion = models.ForeignKey(Seccion, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.nombre} {self.apellidos}"

    class Meta:
        db_table = 'alumnos'



class Asistencia(models.Model):
    id_alumno = models.ForeignKey(Alumnos, on_delete=models.CASCADE, verbose_name="Detalles del alumno")
    fecha = models.DateField(null=True)
    hora = models.TimeField(null=True)
    ASISTENCIA_CHOICES = (
        (0, 'Ausente'),
        (1, 'Presente'),
    )
    asistencia = models.IntegerField(choices=ASISTENCIA_CHOICES, default=0)
    
    def __str__(self):
        return self.fecha
    
    class Meta:
        db_table = 'a_asistencias'
# Create your models here.
