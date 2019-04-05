import fs from 'fs';
import get from 'lodash/get';
import yaml, { DocumentLoadResult } from 'js-yaml';
import deepAssign from 'deep-assign';

export type ConfigValue = object | string | number | null | undefined;

export default class ConfigRepository {
    private config: Record<string, ConfigValue> = {};

    public get<T = ConfigValue>(key: string | string[], defaultValue: T | undefined = undefined): T {
        return get(this.config, key, defaultValue);
    }

    public set<T = ConfigValue>(key: string, value: T): ConfigRepository {
        this.merge({ [key]: value });

        return this;
    }

    public merge(newValues: DocumentLoadResult): ConfigRepository {
        this.config = deepAssign({}, this.config, newValues);

        return this;
    }

    public loadYmlFile(filePath: string): ConfigRepository {
        try {
            const configValue = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
            this.merge(configValue);
        } catch (error) {
            console.warn({
                msg: 'Load config file error',
                filePath: filePath,
                error: error.toString(),
            });
        }

        return this;
    }
}
