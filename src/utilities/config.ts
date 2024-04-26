import { parseNumber } from "./parse-number";

const environmentVars = {};

const configItems = { ...environmentVars };
class configHandler {
  configItems: any = {};
  constructor(configItems: any) {
    this.configItems = {};
    for (const key in configItems) {
      const value = configItems[key];
      this.add(key, value);
    }
  }

  add(key: string, value: any) {
    this.configItems[key.toLowerCase()] = value;
  }

  get(key: string, def: any = null): any {
    def = process.env[key?.toUpperCase()] ?? def;
    if (this.configItems != null) {
      key = key.toLowerCase();
      return this.configItems[key] ?? def;
    }
    return def;
  }
  getNumber(key: string, def: number | null = null): any {
    return parseNumber(this.get(key, def));
  }

  getAll() {
    return this.configItems;
  }
}

export const ApplicationConfig = new configHandler(configItems);

export type ConfigurationKeys = "";

export function getConfigValue(key: ConfigurationKeys, def: any = null) {
  return ApplicationConfig.get(key, def);
}
