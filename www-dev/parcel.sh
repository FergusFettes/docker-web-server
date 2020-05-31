#!/usr/bin/env bash

set -e

base_dir=/home/ffettes/docker-web-server/config/www
move=0
index=0

while getopts ":f:pi" opt; do
  case ${opt} in
    f )
      file=$OPTARG
      echo $file
      ;;
    p )
      move=1
      ;;
    i )
      move=1
      index=1
      ;;
    \? )
      echo "Invalid option: $OPTARG" 1>&2
      ;;
    : )
      echo "Invalid option: $OPTARG requires an argument" 1>&2
      ;;
  esac
done
shift $((OPTIND -1))

dir=$(dirname $file)
echo dirname is $dir

rm -rf prod
parcel build -d prod --no-source-maps $file

if [ $move -eq 1 ]
then
  mkdir $base_dir/$dir -p
  mv prod/main* $base_dir/$dir/main.js
  echo built here and moved to $base_dir/$dir/main.js
else
  echo built here
fi

if [ $index -eq 1 ]
then
  cat prod/index.html | sed -e "s^src=.*main.*\.js^src=\"https://experiments.schau-wien.at/$dir/main.js^" \
    > $base_dir/$dir/index.html
  echo built here and moved to $base_dir/$dir/index.html with a little sedding
fi
