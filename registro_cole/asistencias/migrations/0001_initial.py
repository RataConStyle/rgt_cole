# Generated by Django 5.0.4 on 2024-05-04 20:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Alumnos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50, null=True)),
                ('apellidos', models.CharField(max_length=100, null=True)),
                ('id_unico', models.CharField(max_length=12, null=True)),
                ('asistencias', models.IntegerField(default=0)),
                ('faltas', models.IntegerField(default=0)),
                ('tardanzas', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'alumnos',
            },
        ),
        migrations.CreateModel(
            name='Grado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'grado_alumnos',
            },
        ),
        migrations.CreateModel(
            name='Asistencia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField()),
                ('asistencia', models.IntegerField(choices=[(0, 'Ausente'), (1, 'Presente')], default=0)),
                ('id_alumno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asistencias.alumnos', verbose_name='Detalles del alumno')),
            ],
            options={
                'db_table': 'a_asistencias',
            },
        ),
        migrations.AddField(
            model_name='alumnos',
            name='grado',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asistencias.grado'),
        ),
        migrations.CreateModel(
            name='Seccion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=2)),
                ('grado', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asistencias.grado')),
            ],
            options={
                'db_table': 'seccion_alumnos',
            },
        ),
        migrations.AddField(
            model_name='alumnos',
            name='seccion',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asistencias.seccion'),
        ),
    ]
