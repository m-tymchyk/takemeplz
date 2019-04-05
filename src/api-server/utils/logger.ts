import makeLogger from 'backend-utils/logger';

const logDir = process.env.API_LOG_PATH || '/var/log/docker/takemetrip-api';

export default makeLogger(logDir);
