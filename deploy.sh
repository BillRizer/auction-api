#!/bin/bash
clear

if [ "$1" = "" ] || [ "$1" = "--help" ]; then
    echo -e "==========\n> Use one parameter above:\n=========="
    echo "--clean : clean container before start"
    echo "--dev : use dev env"
    echo "--prod : use prod env"
    exit 0
fi
# if [ $1 == "--clean" ]; then
#     echo "If exists, remove..."
#     docker-compose -f "./.docker/docker-compose.yml" --env-file ./.docker/.env.dev --remove-orphans
#     exit 0
# fi

TAG_VERSION="0."`git rev-list --full-history --all | wc -l`
ENV="prod"

echo "starting ..."

if [ $1 == "--dev" ]; then
    ENV="dev"
fi
if [ $1 == "--prod" ]; then
    ENV="prod"
fi

echo "> Set ENV=${ENV}, TAG_VERSION=${TAG_VERSION}..."
export ENV=$ENV
export TAG_VERSION=$TAG_VERSION

docker-compose -f './docker-compose.yml' up --build -V

sleep 2
echo "------------------"
docker ps -a
echo "------------------"