FROM python:alpine


RUN mkdir /app
RUN mkdir /app/static
RUN mkdir /app/templates


ADD damnthepage.py /app
ADD keybase.txt /app
ADD manifest.json /app
ADD run.sh /app


ADD static /app/static
ADD templates /app/templates

ADD requirements.txt /app


WORKDIR /app
RUN pip install -r requirements.txt


EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "damnthepage:damn"]
