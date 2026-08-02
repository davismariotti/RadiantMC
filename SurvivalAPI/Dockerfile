FROM python:3.9-slim

WORKDIR /app/
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -Ur requirements.txt

COPY . /app/

EXPOSE 5050

CMD ["python", "/app/src/app.py"]
