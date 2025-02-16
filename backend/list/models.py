from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Task(models.Model):
    author = models.ForeignKey(User, on_delete = models.CASCADE)
    content = models.CharField(max_length = 500)
    def __str__(self):
        return self.content
    