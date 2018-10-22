import { ApolloContext, NodeInstance, NodeState } from '@masterthesis/shared';
import { Db, MongoClient } from 'mongodb';
import MongodbMemoryServer from 'mongodb-memory-server';

export const VALID_OBJECT_ID = '5b07b3129ba658500b75a29a';

export const NeverGoHereError = new Error('Should never reach this line!');

export const doTestWithDb = async (op: (db: Db) => Promise<void>) => {
  jest.setTimeout(10000);
  jest.resetAllMocks();

  const dbName = `jest-${Math.random() * 1000}`;
  const mongodbServer = new MongodbMemoryServer({
    instance: {
      dbName
    }
  });
  const uri = await mongodbServer.getConnectionString();
  const client = await MongoClient.connect(
    uri,
    { useNewUrlParser: true }
  );
  const database = await client.db(dbName);

  try {
    await op(database);
  } catch (err) {
    await cleanDatabase(client, mongodbServer);
    throw err;
  }

  await cleanDatabase(client, mongodbServer);
};

const cleanDatabase = async (
  client: MongoClient,
  server: MongodbMemoryServer
) => {
  if (client.isConnected() && server.isRunning) {
    await client.close(true);
  }
  if (server.isRunning) {
    await server.stop();
  }
};

export const NODE: NodeInstance = {
  id: VALID_OBJECT_ID,
  contextIds: [],
  form: {},
  inputs: [],
  outputs: [],
  type: '',
  workspaceId: VALID_OBJECT_ID,
  x: 0,
  y: 9,
  state: NodeState.VALID,
  progress: null,
  variables: {}
};

export interface QueryTestCase {
  id: string;
  query: string;
  expected: object;
  beforeTest: (
    reqContext: ApolloContext
  ) => Promise<{ variables?: object; reqContext?: ApolloContext }>;
}

export interface MutationTestCase {
  id: string;
  mutation: {
    query: string;
    expected: any;
  };
  query: {
    query: string;
    expected: any;
  };
  beforeTest: (
    reqContext: ApolloContext
  ) => Promise<{ variables?: object; reqContext?: ApolloContext }>;
}
