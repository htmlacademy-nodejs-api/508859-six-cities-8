import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import chalk from 'chalk';

import { Command } from './command.interface.js';

import { isPackageJSONConfig } from '../../shared/utils/isPackageJSONConfig/index.js';

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = 'package.json'
  ) {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    isPackageJSONConfig(importedContent);

    return importedContent.version;
  }

  public getName(): string {
    return '--version';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.info(chalk.green(version));
    } catch (error) {
      console.error(chalk.red(`Failed to read version from ${this.filePath}`));

      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
    }
  }
}