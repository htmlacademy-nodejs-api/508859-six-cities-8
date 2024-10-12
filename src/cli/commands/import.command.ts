import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Offer } from '../../shared/types/offer.interface.js';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { UserModel, UserService } from '../../shared/modules/user/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';

export class ImportCommand implements Command {

  private userService!: UserService;
  private offerService!: OfferService;
  private databaseClient!: DatabaseClient;
  private logger!: Logger;
  private salt!: string;

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  // private onImportedOffer(offer: Offer): void {
  //   console.info(offer);
  // }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    // const categories: string[] = [];
    const user = await this.userService.findOrCreate({
      ...offer.author, // offer.user
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    // for (const { name } of offer.categories) {
    //   const existCategory = await this.categoryService.findByCategoryNameOrCreate(name, { name });
    //   categories.push(existCategory.id);
    // }

    await this.offerService.create({
      // categories,
      title: offer.title,
      description: offer.description,
      publicationDate: offer.publicationDate,
      city: offer.city,
      previewImg: offer.previewImg,
      images: offer.images,
      isPremium: offer.isPremium,
      rating: offer.rating,
      type: offer.type,
      flatCount: offer.flatCount,
      guestCount: offer.guestCount,
      cost: offer.cost,
      conveniences: offer.conveniences,
      author: user.id, // userId
      commentCount: offer.commentCount,
      coordinate: offer.coordinate,
    });

  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

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


  // public async execute(...parameters: string[]): Promise<void> {
  //   const [filename] = parameters;

  //   let fileReader;
  //   if (filename) {
  //     fileReader = new TSVFileReader(filename.trim());

  //     fileReader.on('line', this.onImportedOffer);
  //     fileReader.on('end', this.onCompleteImport);
  //   }

  //   try {
  //     fileReader?.read();
  //   } catch (err) {
  //     console.error(chalk.red(`Can't import data from file: ${filename}`));
  //     console.error(getErrorMessage(err));
  //   }
  // }
// }
