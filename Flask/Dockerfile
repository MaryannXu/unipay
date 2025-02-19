FROM python:3.10

RUN pip install Flask gunicorn

WORKDIR /app

COPY . .

# Copy the requirements.txt file to the container
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir flask flask-cors 

ENV PORT 8080 

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app