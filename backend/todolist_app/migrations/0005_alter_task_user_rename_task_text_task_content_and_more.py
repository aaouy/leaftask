# Generated by Django 5.1.4 on 2025-01-09 12:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todolist_app', '0004_user_email'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.RenameField(
            model_name='task',
            old_name='task_text',
            new_name='content',
        ),
        migrations.DeleteModel(
            name='User',
        ),
    ]
