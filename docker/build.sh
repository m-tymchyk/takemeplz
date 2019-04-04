#!/bin/bash

NODE_ENV=production

export APPLICATION_VERSION=$(jq -r ".version" package.json)

yarn locales:import

docker build \
    --file ./Dockerfile \
    --tag takemetrip/website:$APPLICATION_VERSION \
    --tag takemetrip/website .
