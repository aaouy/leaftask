import os

envrionment = os.getenv('DJANGO_ENV', 'development')

if envrionment == 'production':
    from .production import *
else:
    from .development import *


