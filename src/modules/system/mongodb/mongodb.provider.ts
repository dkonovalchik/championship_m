import { MongoClient } from 'mongodb';
import { MONGODB_CONNECTION } from 'src/lib/constants';

export const MongodbProvider = {
  provide: MONGODB_CONNECTION,
  useFactory: async () => {
    const client = new MongoClient(process.env.MONGODB_URL);
    await client.connect();
    return client.db(process.env.MONGODB_NAME);
  },
};
