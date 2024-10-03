import got from 'got';
import chalk from 'chalk';

import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { DECIMAL_RADIX } from '../../shared/constants/index.js';

// * `<count>` — обязательный. Количество объявлений для генерации.
// * `<filepath>` — обязательный. Путь к файлу для записи результата.
// * `<url>` — обязательный. URL сервиса (JSON-server).
// Example: ./cli.js --generate 10 ./src/mocks/mock-offers.tsv http://localhost:3123/api
// npm run ts ./src/main.cli.ts -- --generate 100 ./src/mocks/test-data.tsv http://localhost:3123/api
export class GenerateCommand implements Command {
  private initialData?: MockServerData;

  private async write(filepath: string, offerCount: number) {
    if (this.initialData) {
      const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
      const tsvFileWriter = new TSVFileWriter(filepath);

      for (let i = 0; i < offerCount; i++) {
        await tsvFileWriter.write(tsvOfferGenerator.generate());
      }
    }
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  public getName(): string {
    return '--generate';
  }

  // INFO: Получение параметров из аргументов команды и выполнение команды
  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    if (count && filepath && url) {
      const offerCount = Number.parseInt(count, DECIMAL_RADIX);

      try {
        await this.load(url);
        await this.write(filepath, offerCount);
        console.info(chalk.green(`File ${filepath} was created!`));
      } catch (error: unknown) {
        console.error(chalk.redBright('Can\'t generate data'));

        console.error(getErrorMessage(error));
      }
    }
  }
}
