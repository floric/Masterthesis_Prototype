import {
  DatasetOutputNodeDef,
  IOValues,
  NumberInputNodeDef,
  NumberOutputNodeDef,
  ProcessState
} from '@masterthesis/shared';
import { Db } from 'mongodb';

import { executeNode } from '../../../src/main/calculation/execute-node';
import {
  getAllCalculations,
  startCalculation
} from '../../../src/main/calculation/start-process';
import { createNode, getAllNodes } from '../../../src/main/workspace/nodes';
import { createWorkspace } from '../../../src/main/workspace/workspace';
import { getTestMongoDb } from '../../test-utils';

let conn;
let db: Db;
let server;

jest.mock('../../../src/main/calculation/execute-node');

describe('SelectValuesNode', () => {
  beforeAll(async () => {
    const { connection, database, mongodbServer } = await getTestMongoDb();
    conn = connection;
    db = database;
    server = mongodbServer;
  });

  afterAll(async () => {
    await conn.close();
    await server.stop();
  });

  beforeEach(async () => {
    await db.dropDatabase();
    jest.resetAllMocks();
  });

  test('should get empty calculations collection', async () => {
    const ws = await createWorkspace(db, 'test', '');

    const processes = await getAllCalculations(db, ws.id);

    expect(processes.length).toBe(0);
  });

  test('should start new calculation process without any nodes', async () => {
    const ws = await createWorkspace(db, 'test', '');
    (executeNode as jest.Mock).mockImplementation(n =>
      Promise.resolve<IOValues<{}>>({})
    );

    const newProcess = await startCalculation(db, ws.id, true);

    expect(newProcess.state).toBe(ProcessState.STARTED);
    expect(newProcess.finish).toBeNull();
    expect(newProcess.processedOutputs).toBe(0);
    expect(newProcess.totalOutputs).toBe(0);
    expect(newProcess.start).toBeDefined();

    const processes = await getAllCalculations(db, ws.id);
    expect(processes.length).toBe(1);

    const finishedProcess = processes[0];
    expect(finishedProcess.state).toBe(ProcessState.SUCCESSFUL);
    expect(finishedProcess.finish).toBeDefined();
    expect(finishedProcess.processedOutputs).toBe(0);
    expect(finishedProcess.totalOutputs).toBe(0);
    expect(finishedProcess.start).toBeDefined();

    expect((executeNode as jest.Mock).mock.calls.length).toBe(0);
  });

  test('should start new calculation process with one node', async done => {
    const ws = await createWorkspace(db, 'test', '');

    await Promise.all(
      [
        {
          type: NumberOutputNodeDef.name,
          workspaceId: ws.id,
          x: 0,
          y: 0
        },
        {
          type: DatasetOutputNodeDef.name,
          workspaceId: ws.id,
          x: 0,
          y: 0
        },
        {
          type: NumberInputNodeDef.name,
          workspaceId: ws.id,
          x: 0,
          y: 0
        }
      ].map(n => createNode(db, n.type, n.workspaceId, n.x, n.y))
    );

    (executeNode as jest.Mock).mockImplementation(n =>
      Promise.resolve<IOValues<{}>>({})
    );
    const newProcess = await startCalculation(db, ws.id, true);

    expect(newProcess.state).toBe(ProcessState.STARTED);
    expect(newProcess.finish).toBeNull();
    expect(newProcess.processedOutputs).toBe(0);
    expect(newProcess.totalOutputs).toBe(0);
    expect(newProcess.start).toBeDefined();

    const processes = await getAllCalculations(db, ws.id);
    expect(processes.length).toBe(1);

    const finishedProcess = processes[0];
    expect(finishedProcess.state).toBe(ProcessState.SUCCESSFUL);
    expect(finishedProcess.finish).toBeDefined();
    expect(finishedProcess.processedOutputs).toBe(2);
    expect(finishedProcess.totalOutputs).toBe(2);
    expect(finishedProcess.start).toBeDefined();

    expect((executeNode as jest.Mock).mock.calls.length).toBe(2);

    done();
  });

  test('should catch error for failed node execution', async () => {
    const ws = await createWorkspace(db, 'test', '');

    await Promise.all(
      [
        {
          type: NumberOutputNodeDef.name,
          workspaceId: ws.id,
          x: 0,
          y: 0
        }
      ].map(n => createNode(db, n.type, n.workspaceId, n.x, n.y))
    );

    (executeNode as jest.Mock).mockImplementation(n => {
      throw new Error('Something went wrong during node execution.');
    });

    const newProcess = await startCalculation(db, ws.id, true);

    expect(newProcess.state).toBe(ProcessState.STARTED);
    expect(newProcess.finish).toBeNull();
    expect(newProcess.processedOutputs).toBe(0);
    expect(newProcess.totalOutputs).toBe(0);
    expect(newProcess.start).toBeDefined();

    const processes = await getAllCalculations(db, ws.id);
    expect(processes.length).toBe(1);

    const finishedProcess = processes[0];
    expect(finishedProcess.state).toBe(ProcessState.ERROR);
    expect(finishedProcess.finish).toBeDefined();
    expect(finishedProcess.processedOutputs).toBe(0);
    expect(finishedProcess.totalOutputs).toBe(1);
    expect(finishedProcess.start).toBeDefined();

    expect((executeNode as jest.Mock).mock.calls.length).toBe(1);
  });
});