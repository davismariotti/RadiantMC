FROM ubuntu:latest

RUN  apt-get update \
  && apt-get install -y wget cron \
  && rm -rf /var/lib/apt/lists/*

ENV RCON_HOST=localhost
ENV RCON_PORT=25575
ENV RCON_PASSWORD=minecraft

RUN mkdir -p rcon
RUN cd rcon && wget https://github.com/itzg/rcon-cli/releases/download/1.4.8/rcon-cli_1.4.8_linux_amd64.tar.gz && tar -xvf *.tar.gz
RUN rm -r rcon/*.tar.gz
RUN mv /rcon/rcon-cli /bin/rcon-cli

COPY cron.txt /etc/cron.d/backup-cron
COPY backup.sh /backup.sh
RUN chmod 0744 /backup.sh
RUN chmod 0644 /etc/cron.d/backup-cron
RUN crontab /etc/cron.d/backup-cron
RUN touch /var/log/cron.log

COPY start.sh /start.sh
RUN chmod 0744 /start.sh

VOLUME /backup
VOLUME /server

CMD ["/start.sh"]
