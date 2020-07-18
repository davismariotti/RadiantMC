#!/bin/bash

echo "host: $RCON_HOST" >> /home/.rcon-cli.yaml
echo "port: $RCON_PORT" >> /home/.rcon-cli.yaml
echo "password: $RCON_PASSWORD" >> /home/.rcon-cli.yaml

cron && : >> /var/log/cron.log && tail -f /var/log/cron.log
