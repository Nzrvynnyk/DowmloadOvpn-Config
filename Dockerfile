FROM python:3.8-slim-buster

WORKDIR /app

RUN apt-get update && apt-get install -y \
  nano \
  wget \
  git \
  zip \ 
  unzip\ 
  xvfb \ 
  libxi6 \
  libgconf-2-4 \
  libnss3
RUN wget https://chromedriver.storage.googleapis.com/107.0.5304.62/chromedriver_linux64.zip && unzip chromedriver_linux64.zip && mv chromedriver /usr/bin/chromedriver && chmod +x /usr/bin/chromedriver
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install


COPY bgnkhhnnamicmpeenaelnjfhikgbkllg bgnkhhnnamicmpeenaelnjfhikgbkllg
COPY requirements.txt requirements.txt
COPY solveRecaptcha.py solveRecaptcha.py
COPY opencpnget.py opencpnget.py
COPY move.sh move.sh
RUN chmod +x move.sh
RUN pip3 install -r requirements.txt
