from django.contrib import admin
from .models import Colegios

class ColegiosAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'logo', 'director')
    
admin.site.register(Colegios, ColegiosAdmin)

# Register your models here.
