import chalk from 'chalk';

import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Offer } from '../../shared/types/offer.interface.js';
import { getErrorMessage } from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private onImportedOffer(offer: Offer): void {
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }


  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;

    let fileReader;
    if (filename) {
      fileReader = new TSVFileReader(filename.trim());

      fileReader.on('line', this.onImportedOffer);
      fileReader.on('end', this.onCompleteImport);
    }

    try {
      fileReader?.read();
    } catch (err) {
      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(getErrorMessage(err));
    }
  }
}
