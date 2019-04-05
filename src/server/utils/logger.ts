import makeLogger from 'backend-utils/logger';

const logDir = process.env.LOG_PATH || '/var/log/docker/takemetrip-website';

export default makeLogger(logDir);
