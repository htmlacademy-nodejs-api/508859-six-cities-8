import { PackageJSONConfig } from './types.js';

export function isPackageJSONConfig(value: unknown): asserts value is PackageJSONConfig {
  if (!(typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.hasOwn(value, 'version'))) {
    throw new Error('Failed to parse json content.');
  }
}
