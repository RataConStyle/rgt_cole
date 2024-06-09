from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Colegios(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre del colegio", null=True)
    logo = models.ImageField(upload_to='core/static/img', null=True, verbose_name="Logo del colegio")
    director = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    class Meta:
        db_table = 'colegios'
    def __str__(self):
        return self.nombre