#!/usr/bin/env bash

DIR=/home/ffettes/docker-web-server/config/www

rm -rf prod
parcel build -d prod --no-source-maps index.html

if [ -z $1 ]
then
  echo built here
else
  mv prod/main* $DIR/$1/main.js
  echo built here and moved to $DIR/$1/main.js
fi
