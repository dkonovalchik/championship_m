import { MongoClient } from 'mongodb';
import { MONGODB_CONNECTION } from '../../../lib/constants';

export const MongodbProvider = {
  provide: MONGODB_CONNECTION,
  useFactory: async () => {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    return client.db('championship');
  },
};
