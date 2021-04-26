FROM python:3.7-slim-stretch@sha256:6ad0b058ae4e48e5ee48f337e29c4e6ca57abe898d9e68fcd618fd108b258d5e

# For running as non-root user
ARG USER=app
ARG GROUP=app
ARG UID=1000
ARG GID=1000
ARG HOME=/usr/src/app

ENV HOME=${HOME}
ENV FLASK_APP=app.py

WORKDIR /usr/src/app

RUN chown ${UID}:${GID} $HOME \
  && groupadd -g ${GID} ${GROUP} \
  && useradd -d ${HOME} -u ${UID} -g ${GROUP} -m -s /bin/bash ${USER}

RUN apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests wget make && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/hadolint/hadolint/releases/download/v1.15.0/hadolint-Linux-x86_64 -O /usr/local/bin/hadolint && chmod +x /usr/local/bin/hadolint

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

USER ${UID}:${GID}

COPY . .

HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD wget wget --no-check-certificate https://localhost:5000/healthz -q -O - > /dev/null 2>&1 || exit 1

EXPOSE 5000

# TODO: Use a proper wsgi server instead of Flask's dev server
CMD ["python", "-u", "-m", "flask", "run", "--cert=adhoc", "--host=0.0.0.0"]
