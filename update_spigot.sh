#!/bin/bash

service survivalserver stop

SERVER_DIR=$(realpath $1)

cd $SERVER_DIR/..
tar -czvf archive.tar.gz $SERVER_DIR
cd $SERVER_DIR/BuildTools/
java -jar BuildTools.jar --rev $2
cp $SERVER_DIR/BuildTools/spigot-$2.jar $SERVER_DIR
sed -i "" "s/spigot.*\.jar/spigot-$2.jar/g" $SERVER_DIR/start.sh
mv $SERVER_DIR/plugins/dynmap.jar $SERVER_DIR/plugins/unused/

service survivalserver start
