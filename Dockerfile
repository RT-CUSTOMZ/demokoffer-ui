FROM node:10-slim AS BUILD


COPY package* /build/

WORKDIR /build

RUN npm install

COPY . /build

RUN npm run build



FROM nginx:1.15.2

COPY --from=BUILD /build/build /usr/share/nginx/html

#ENV DEBIAN_FRONTEND noninteractive
#
## Install packages
#RUN apt-get update && \
#    apt-get install -y \
#    npm \
#    && \
#    apt-get clean && \
#    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
#
#EXPOSE 80

#CMD /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf