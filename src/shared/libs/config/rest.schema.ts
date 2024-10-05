import convict from 'convict';
import validator from 'convict-format-with-validator';
import { IRestSchema } from './rest.schema.interface.js';

convict.addFormats(validator);

export const configRestSchema = convict<IRestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: null
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null
  },
});
