# Generated by Django 5.1.4 on 2025-01-09 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('list', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='task_text',
            field=models.CharField(max_length=500),
        ),
    ]
