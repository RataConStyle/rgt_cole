# Generated by Django 5.0.6 on 2024-06-09 22:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Colegios',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100, verbose_name='Nombre del colegio')),
                ('logo', models.ImageField(null=True, upload_to='core/static/img', verbose_name='Logo del colegio')),
            ],
            options={
                'db_table': 'colegios',
            },
        ),
    ]
