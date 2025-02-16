from .base import *
import os
import requests

DEBUG = False
ALLOWED_HOSTS = ['api.leaftask.click', "leaftask.click", "www.leaftask.click"]

METADATA_URI = os.environ['ECS_CONTAINER_METADATA_URI_V4']
container_metadata = requests.get(METADATA_URI).json()
ALLOWED_HOSTS.append(container_metadata['Networks'][0]['IPv4Addresses'][0])

CORS_ALLOWED_ORIGINS = [
    "https://leaftask.click",
    "https://www.leaftask.click",
    "https://api.leaftask.click",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv('PROD_DB_NAME'), 
        "USER": os.getenv('PROD_DB_USER'),
        "PASSWORD": os.getenv('PROD_DB_PASSWORD'), 
        "HOST": os.getenv('PROD_DB_HOST'),
        "PORT": "5432",
    }
}
