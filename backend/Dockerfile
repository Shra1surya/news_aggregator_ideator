FROM python:3.11-slim

# Accept build args
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

ENV HTTP_PROXY="http://proxy-dmz.intel.com:911"
ENV HTTPS_PROXY="http://proxy-dmz.intel.com:912"
ENV NO_PROXY="localhost,127.0.0.0/8"
# Configure apt to use proxy
RUN echo 'Acquire::http::Proxy "'"${HTTP_PROXY}"'";' > /etc/apt/apt.conf.d/00proxy && \
    echo 'Acquire::https::Proxy "'"${HTTPS_PROXY}"'";' >> /etc/apt/apt.conf.d/00proxy

RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
