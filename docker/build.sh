#!/bin/bash

NODE_ENV=production

export APPLICATION_VERSION=$(jq -r ".version" package.json)

yarn locales:import

docker build \
    --file ./Dockerfile \
    --tag takemeplz/website:$APPLICATION_VERSION \
    --tag takemeplz/website .
