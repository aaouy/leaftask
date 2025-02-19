from .base import *
import os

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'testserver', '0.0.0.0']

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv('DEV_DB_NAME'),
        "USER": os.getenv('DEV_DB_USER'),
        "PASSWORD": os.getenv('DEV_DB_PASSWORD'),
        "HOST": os.getenv('DEV_DB_HOST'),
        "PORT": "5432",
    }
}

