# =======================
# Install npm deps
# =======================
FROM node:10.14.0-alpine AS NODE_MODULES

WORKDIR /usr/src/takemetrip
COPY package.json yarn.lock ./

RUN yarn install && \
    # Remove extra resources
    rm -rf package.json yarn.lock




# =======================
# Pull and push locales
# =======================
FROM node:10.14.0-alpine AS LOCALES

ARG LOCO_READ_KEY
ARG LOCO_WRITE_KEY

WORKDIR /usr/src/takemetrip
COPY --from=NODE_MODULES /usr/src/takemetrip/node_modules node_modules/
COPY package.json gulpfile.js pot-extractor.js ./
COPY config/locales.json config/locales.json

RUN apk update && apk add --no-cache gettext && \
    # Install, build, remove dev deps
    yarn locales:import && \
    yarn locales:export && \
    # Remove extra resources
    rm -rf \
    node_modules \
    src \
    config \
    build \
    package.json \
    gulpfile.js \
    pot-extractor.js




# =======================
# Build client app image
# =======================
FROM node:10.14.0-alpine as WEBSITE_APP

ENV NODE_ENV=production \
    API_HOST=localhost \
    API_PORT=80 \
    API_INNER_HOST=localhost \
    HOST=localhost \
    PORT=80 \
    SECURE=true \
    GTM_KEY="GTM-111111" \
    LOG_PATH="/var/log/docker/takemetrip-website" \
    API_LOG_PATH="/var/log/docker/takemetrip-api"

WORKDIR /usr/src/takemetrip

COPY --from=NODE_MODULES /usr/src/takemetrip/node_modules node_modules/
COPY resources resources/
COPY --from=LOCALES /usr/src/takemetrip/resources/locales resources/locales/
COPY docker docker/
COPY webpack webpack/
COPY config config/
COPY src src/
COPY package.json gulpfile.js pot-extractor.js tsconfig.json webpack.*.js ./

RUN apk update && \
    # Install packages
    apk add --no-cache gettext dumb-init && \
    yarn copy && \
    yarn build && \
    # Remove extra resources
    rm -rf \
    .cache-loader \
    resources \
    src \
    gulpfile.js \
    pot-extractor.js \
    tsconfig.json \
    webpack.*.js

RUN envsubst < /usr/src/takemetrip/docker/.env.template.yml > /usr/src/takemetrip/.env.yml

EXPOSE 80

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/bin/sh", "-c", "envsubst < /usr/src/takemetrip/docker/.env.template.yml > /usr/src/takemetrip/.env.yml && yarn start"]





# =======================
# Build API app image
# =======================
FROM node:10.14.0-alpine as API_APP

ENV NODE_ENV=production \
    API_HOST=localhost \
    API_PORT=80 \
    API_INNER_HOST=localhost \
    HOST=localhost \
    PORT=80 \
    SECURE=true \
    LOG_PATH="/var/log/docker/takemetrip-website" \
    API_LOG_PATH="/var/log/docker/takemetrip-api"

WORKDIR /usr/src/takemetrip

COPY --from=NODE_MODULES /usr/src/takemetrip/node_modules node_modules/
COPY resources resources/
COPY --from=LOCALES /usr/src/takemetrip/resources/locales resources/locales/
COPY docker docker/
COPY webpack webpack/
COPY config config/
COPY src src/
COPY package.json gulpfile.js pot-extractor.js tsconfig.json webpack.*.js ./

RUN apk update && \
    # Install packages
    apk add --no-cache gettext dumb-init && \
    yarn copy && \
    yarn build -- --config ./webpack.config.api.js && \
    # Remove extra resources
    rm -rf \
    .cache-loader \
    resources \
    src \
    gulpfile.js \
    pot-extractor.js \
    tsconfig.json \
    webpack.*.js

RUN envsubst < /usr/src/takemetrip/docker/.env.template.yml > /usr/src/takemetrip/.env.yml

EXPOSE 80

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/bin/sh", "-c", "envsubst < /usr/src/takemetrip/docker/.env.template.yml > /usr/src/takemetrip/.env.yml && yarn api-start"]
