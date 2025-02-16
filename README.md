# Leaftask
A simple fullstack todolist application. Frontend was made with HTML, CSS and JS. Backend was made with the Django Rest Framework and PostgreSQL. The application is deployed on AWS and can be visited via the URL: https://leaftask.click/

Otherwise, this repository can be cloned and run via the Docker command `docker compose up --build`. Please ensure Docker is installed on your computer beforehand.

The environment variables that must be set before running are:
- `DJANGO_ENV` which should either have a value of `production` or `development`
- `SECRET_KEY` which is the Django secret key that can be generated using Django's `django.core.management.utils.get_random_secret_key()` function.
- `DEV_DB_NAME` which is the name of the database.
- `DEV_DB_USER` which is the username of the database user.
- `DEV_DB_PASSWORD` which is the password of the database user.
- `DEV_DB_HOST` which is the host of the database user.
  
It is recommended to define these environment variables in a `.env` file.
  


