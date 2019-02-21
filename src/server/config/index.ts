import path from 'path';
import { ConfigRepository } from './config-repository';

const config = new ConfigRepository();
const rootPath = process.cwd();
const configPath = path.resolve(rootPath, './config/');

config
    .loadYmlFile(path.resolve(configPath, 'app.yml'))

    // Loading .env.yml file from root repository
    .loadYmlFile(path.resolve(rootPath, '.env.yml'));

export { config };
export default config;
