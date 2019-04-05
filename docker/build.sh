#!/bin/bash

NODE_ENV=production

export APPLICATION_VERSION=$(jq -r ".version" package.json)

yarn locales:import

docker build \
    --target WEBSITE_APP \
    --file ./Dockerfile \
    --tag takemetrip/website:$APPLICATION_VERSION \
    --tag takemetrip/website .

docker build \
    --target API_APP \
    --file ./Dockerfile \
    --tag takemetrip/api:$APPLICATION_VERSION \
    --tag takemetrip/api .
