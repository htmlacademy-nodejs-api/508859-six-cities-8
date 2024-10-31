import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Offer } from '../../shared/types/offer.interface.js';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { UserService } from '../../shared/modules/user/index.js';
import { DefaultOfferService, OfferService } from '../../shared/modules/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { OfferModel, UserModel } from '../../shared/entities/index.js';
import { IRestSchema } from '../../shared/libs/config/rest.schema.interface.js';
import { Config, RestConfig } from '../../shared/libs/config/index.js';
import { DEFAULT_USER_LOGIN, DEFAULT_USER_PASSWORD } from '../cli.constants.js';

export class ImportCommand implements Command {

  private userService!: UserService;
  private offerService!: OfferService;
  private databaseClient!: DatabaseClient;
  private config!: Config<IRestSchema>;
  private logger!: Logger;
  private salt!: string;

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.config = new RestConfig(this.logger);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      email: DEFAULT_USER_LOGIN,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      city: offer.city,
      previewImg: offer.previewImg,
      images: offer.images,
      isPremium: offer.isPremium,
      type: offer.type,
      flatCount: offer.flatCount,
      guestCount: offer.guestCount,
      cost: offer.cost,
      conveniences: offer.conveniences,
      coordinate: offer.coordinate,

      author: user.id,
      commentCount: offer.commentCount || 0,
    });

  }

  // TODO: В --help команду нужно добавить аргументы, которые передаем
  public async execute(filename: string, login: string, password: string, host: string, dbname: string): Promise<void> {
    const uri = getMongoURI(login, password, host, this.config.get('DB_PORT'), dbname);

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}

