# Generated by Django 5.0.6 on 2024-05-18 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('asistencias', '0002_alter_asistencia_fecha'),
    ]

    operations = [
        migrations.AlterField(
            model_name='asistencia',
            name='fecha',
            field=models.DateTimeField(null=True),
        ),
    ]
