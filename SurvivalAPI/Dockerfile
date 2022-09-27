FROM python:3.9

WORKDIR /app/
COPY requirements.txt /app/requirements.txt
RUN pip install -Ur requirements.txt

COPY . /app/

EXPOSE 5050

CMD ["python", "/app/src/app.py"]
