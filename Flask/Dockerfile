FROM python:3.10

RUN pip install Flask gunicorn

COPY src/ main/
WORKDIR /main

ENV PORT 8080 

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app