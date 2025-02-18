# Leaftask
A simple full-stack todolist application.
- **Frontend**: HTML, CSS and JS.
- **Backend**: Django Rest Framework and PostgreSQL.
- **Deployment**: AWS (Backend: Fargate, Frontend: S3 and CloudFront) 

The website can be visited via the URL: https://leaftask.click/

## Running Locally With Docker

This repository can be cloned and run via the Docker command:

`docker compose up --build`. 

Please ensure Docker is installed on your computer beforehand.

## Environment Variables

The environment variables that must be set before running are:
- `DJANGO_ENV`: This should have a value of `production` or `development`
- `SECRET_KEY`: The Django secret key that can be generated using Django's `django.core.management.utils.get_random_secret_key()` function.
- `DEV_DB_NAME`: The name of the database.
- `DEV_DB_USER`: The username of the database user.
- `DEV_DB_PASSWORD`: The password of the database user.
- `DEV_DB_HOST`: The host of the database user.

For production, `replace DEV_DB_*` variables with `PROD_DB_*` as needed. It is recommended to define these environment variables in a `.env` file.
  


