import {
  ContextNodeType,
  DataType,
  hasContextFn,
  NodeDef,
  NodeInstance,
  NodeState,
  ServerNodeDefWithContextFn,
  SocketDef,
  SocketState
} from '@masterthesis/shared';
import { Db, ObjectID } from 'mongodb';

import {
  getNodeType,
  hasNodeType,
  tryGetNodeType
} from '../../../src/main/nodes/all-nodes';
import {
  getNode,
  getNodesCollection,
  tryGetContextNode,
  tryGetNode
} from '../../../src/main/workspace/nodes';
import {
  addConnection,
  addOrUpdateFormValue,
  addOrUpdateVariable,
  deleteVariable,
  getContextInputDefs,
  getContextOutputDefs,
  getInputDefs,
  getOutputDefs,
  removeConnection,
  setProgress
} from '../../../src/main/workspace/nodes-detail';
import { updateStates } from '../../../src/main/workspace/nodes-state';
import {
  getTestMongoDb,
  NeverGoHereError,
  VALID_OBJECT_ID
} from '../../test-utils';

let conn;
let db: Db;
let server;

jest.mock('@masterthesis/shared');
jest.mock('../../../src/main/workspace/nodes');
jest.mock('../../../src/main/workspace/nodes-state');
jest.mock('../../../src/main/nodes/all-nodes');
jest.mock('../../../src/main/calculation/validation');
jest.mock('../../../src/main/workspace/connections');

describe('Node Details', () => {
  beforeAll(async () => {
    const { connection, database, mongodbServer } = await getTestMongoDb();
    conn = connection;
    db = database;
    server = mongodbServer;
  });

  afterAll(async () => {
    await conn.close();
    await server.stop();
    db = undefined;
    conn = undefined;
    server = undefined;
  });

  beforeEach(async () => {
    await db.dropDatabase();
    jest.resetAllMocks();
  });

  test('should get null for nodes without contexts', async () => {
    const node: NodeInstance = {
      id: 'testnode',
      contextIds: [],
      form: [],
      inputs: [{ name: 'dataset', connectionId: '123' }],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    (hasNodeType as jest.Mock).mockReturnValue(true);

    const inputRes = await getContextInputDefs(node, {
      db,
      userId: ''
    });
    expect(inputRes).toEqual({});

    const outputRes = await getContextOutputDefs(node, {
      db,
      userId: ''
    });
    expect(outputRes).toEqual({});
  });

  test('should throw error for missing parent node', async () => {
    const node: NodeInstance = {
      id: 'testnode',
      contextIds: ['unknown id'],
      form: [],
      inputs: [{ name: 'dataset', connectionId: '123' }],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    (getNode as jest.Mock).mockResolvedValue(null);
    (hasNodeType as jest.Mock).mockReturnValue(false);

    try {
      await getContextInputDefs(node, {
        db,
        userId: ''
      });
      throw NeverGoHereError;
    } catch (err) {
      expect(err.message).toBe('Parent node missing');
    }
  });

  test('should return null for non context node as parent (should never happen)', async () => {
    const parentNode: NodeInstance = {
      id: 'parentnode',
      contextIds: [],
      form: [],
      inputs: [{ name: 'dataset', connectionId: '123' }],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    const node: NodeInstance = {
      id: 'testnode',
      contextIds: [parentNode.id],
      form: [],
      inputs: [{ name: 'dataset', connectionId: '123' }],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    (getNode as jest.Mock).mockResolvedValue(parentNode);
    (hasNodeType as jest.Mock).mockReturnValue(false);

    const res = await getContextInputDefs(node, {
      db,
      userId: ''
    });

    expect(res).toEqual({});
  });

  test('should get empty context inputs', async () => {
    const parentTypeName = 'p';
    const parentType: ServerNodeDefWithContextFn & NodeDef = {
      type: parentTypeName,
      name: parentTypeName,
      inputs: {
        value: {
          dataType: DataType.STRING,
          displayName: 'value',
          state: SocketState.STATIC
        }
      },
      outputs: {},
      keywords: [],
      path: [],
      isFormValid: async () => false,
      onMetaExecution: async () => ({}),
      onNodeExecution: async () => ({ outputs: {} }),
      transformContextInputDefsToContextOutputDefs: async () => ({}),
      transformInputDefsToContextInputDefs: async () => ({})
    };
    const parentNode: NodeInstance = {
      id: 'parentnode',
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    const inputNode: NodeInstance = {
      id: 'abc',
      contextIds: [parentNode.id],
      form: [],
      inputs: [],
      outputs: [],
      type: ContextNodeType.INPUT,
      workspaceId: '123',
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    (getNode as jest.Mock).mockResolvedValue(parentNode);
    (getNodeType as jest.Mock).mockReturnValue(parentType);
    (tryGetNodeType as jest.Mock).mockReturnValue(parentType);
    (hasContextFn as any).mockReturnValue(true);

    const inputRes = await getContextInputDefs(inputNode, {
      db,
      userId: ''
    });
    expect(inputRes).toEqual({});
  });

  test('should get empty context outputs', async () => {
    const parentTypeName = 'p';
    const parentType: ServerNodeDefWithContextFn & NodeDef = {
      type: parentTypeName,
      name: parentTypeName,
      inputs: {
        value: {
          dataType: DataType.STRING,
          displayName: 'value',
          state: SocketState.STATIC
        }
      },
      outputs: {},
      keywords: [],
      path: [],
      isFormValid: async () => false,
      onMetaExecution: async () => ({ test: { content: {}, isPresent: true } }),
      onNodeExecution: async () => ({ outputs: {} }),
      transformContextInputDefsToContextOutputDefs: async () => ({}),
      transformInputDefsToContextInputDefs: async () => ({})
    };
    const parentNode: NodeInstance = {
      id: 'parentnode',
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    const inputNode: NodeInstance = {
      id: 'abc',
      contextIds: [parentNode.id],
      form: [],
      inputs: [],
      outputs: [],
      type: ContextNodeType.INPUT,
      workspaceId: '123',
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    (getNode as jest.Mock).mockResolvedValue(parentNode);
    (getNodeType as jest.Mock).mockReturnValue(parentType);
    (tryGetNodeType as jest.Mock).mockReturnValue(parentType);
    (tryGetContextNode as jest.Mock).mockResolvedValue(inputNode);
    (hasContextFn as any).mockReturnValue(true);

    const outputRes = await getContextOutputDefs(inputNode, {
      db,
      userId: ''
    });
    expect(outputRes).toEqual({});
  });

  test('should throw error for missing context node in context', async () => {
    const parentTypeName = 'p';
    const parentType: ServerNodeDefWithContextFn & NodeDef = {
      type: parentTypeName,
      name: parentTypeName,
      inputs: {
        value: {
          dataType: DataType.STRING,
          displayName: 'value',
          state: SocketState.STATIC
        }
      },
      outputs: {},
      keywords: [],
      path: [],
      isFormValid: async () => false,
      onMetaExecution: async () => ({ test: { content: {}, isPresent: true } }),
      onNodeExecution: async () => ({ outputs: {} }),
      transformContextInputDefsToContextOutputDefs: async () => ({}),
      transformInputDefsToContextInputDefs: async () => ({})
    };
    const parentNode: NodeInstance = {
      id: 'parentnode',
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    const inputNode: NodeInstance = {
      id: 'abc',
      contextIds: [parentNode.id],
      form: [],
      inputs: [],
      outputs: [],
      type: ContextNodeType.INPUT,
      workspaceId: '123',
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    (getNode as jest.Mock).mockResolvedValue(parentNode);
    (getNodeType as jest.Mock).mockReturnValue(parentType);
    (tryGetNodeType as jest.Mock).mockReturnValue(parentType);
    (tryGetContextNode as jest.Mock).mockImplementation(() => {
      throw new Error('Unknown context node');
    });
    (hasContextFn as any).mockReturnValue(true);

    try {
      await getContextOutputDefs(inputNode, {
        db,
        userId: ''
      });
      throw NeverGoHereError;
    } catch (err) {
      expect(err.message).toBe('Unknown context node');
    }
  });

  test('should throw error for node without context', async () => {
    const node: NodeInstance = {
      id: 'abc',
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: ContextNodeType.INPUT,
      workspaceId: '123',
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };

    try {
      await getContextOutputDefs(node, {
        db,
        userId: ''
      });
      throw NeverGoHereError;
    } catch (err) {
      expect(err.message).toBe('Node doesnt have context');
    }
  });

  test('should throw error for empty value names', async () => {
    try {
      await addOrUpdateFormValue(VALID_OBJECT_ID, '', 'test', {
        db,
        userId: ''
      });
      throw NeverGoHereError;
    } catch (err) {
      expect(err.message).toBe('No form value name specified');
    }
  });

  test('should throw error for invalid node id', async () => {
    (tryGetNode as jest.Mock).mockImplementation(() => {
      throw new Error('Node not found');
    });

    try {
      await addOrUpdateFormValue(VALID_OBJECT_ID, 'test', 'test', {
        db,
        userId: ''
      });
      throw NeverGoHereError;
    } catch (err) {
      expect(err.message).toBe('Node not found');
    }
  });

  test('should get input defs for ContextOutputNode from context output defs from parent node', async () => {
    const parentTypeName = 'parentnode';
    const parentNode: NodeInstance = {
      id: parentTypeName,
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    const parentType: ServerNodeDefWithContextFn & NodeDef = {
      type: parentTypeName,
      name: parentTypeName,
      inputs: {},
      outputs: {},
      keywords: [],
      path: [],
      isFormValid: async () => false,
      onMetaExecution: async () => ({ test: { content: {}, isPresent: true } }),
      onNodeExecution: async () => ({ outputs: {} }),
      transformContextInputDefsToContextOutputDefs: async () => ({
        test: {
          dataType: DataType.DATETIME,
          displayName: 'date',
          state: SocketState.DYNAMIC
        }
      }),
      transformInputDefsToContextInputDefs: async () => ({})
    };
    const contextInputNode: NodeInstance = {
      id: 'abc',
      type: ContextNodeType.INPUT,
      contextIds: [parentNode.id],
      form: [],
      inputs: [],
      outputs: [],
      workspaceId: 'abc',
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    (getNode as jest.Mock).mockResolvedValueOnce(parentNode);
    (tryGetNodeType as jest.Mock).mockReturnValue(parentType);
    (hasNodeType as jest.Mock).mockReturnValueOnce(false);
    (hasContextFn as any).mockReturnValueOnce(true).mockReturnValueOnce(false);
    (tryGetContextNode as jest.Mock).mockReturnValue(contextInputNode);

    const res = await getInputDefs(
      {
        id: 'abc',
        type: ContextNodeType.OUTPUT,
        contextIds: [parentNode.id],
        form: [],
        inputs: [],
        outputs: [],
        workspaceId: 'abc',
        x: 0,
        y: 0,
        state: NodeState.VALID,
        variables: {}
      },
      null
    );
    expect(hasContextFn).toHaveBeenCalledTimes(2);
    expect(res).toEqual({
      test: {
        dataType: DataType.DATETIME,
        displayName: 'date',
        state: SocketState.DYNAMIC
      }
    });
  });

  test('should get input defs for ContextInputNode from context input defs from parent node', async () => {
    const parentTypeName = 'parentnode';
    const parentNode: NodeInstance = {
      id: parentTypeName,
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };

    const res = await getInputDefs(
      {
        id: 'abc',
        type: ContextNodeType.INPUT,
        contextIds: [parentNode.id],
        form: [],
        inputs: [{ connectionId: 'abc', name: 'test' }],
        outputs: [],
        workspaceId: 'abc',
        x: 0,
        y: 0,
        state: NodeState.VALID,
        variables: {}
      },
      null
    );
    expect(res).toEqual({});
  });

  test('should set progress', async () => {
    (getNodesCollection as jest.Mock).mockReturnValue({
      updateOne: jest.fn()
    });

    let res = await setProgress(VALID_OBJECT_ID, 0.5, {
      db,
      userId: ''
    });
    expect(res).toBe(true);

    res = await setProgress(VALID_OBJECT_ID, 0, {
      db,
      userId: ''
    });
    expect(res).toBe(true);

    res = await setProgress(VALID_OBJECT_ID, 1, {
      db,
      userId: ''
    });
    expect(res).toBe(true);

    res = await setProgress(null, 1, {
      db,
      userId: ''
    });
    expect(res).toBe(true);

    expect(getNodesCollection(db).updateOne).toHaveBeenCalledTimes(4);
  });

  test('should throw for invalid progress value', async () => {
    (getNodesCollection as jest.Mock).mockReturnValue({
      updateOne: jest.fn()
    });

    try {
      await setProgress(VALID_OBJECT_ID, 1.2, {
        db,
        userId: ''
      });
      throw NeverGoHereError;
    } catch (err) {
      expect(err.message).toBe('Invalid progress value');
    }

    try {
      await setProgress(VALID_OBJECT_ID, -0.2, {
        db,
        userId: ''
      });
      throw NeverGoHereError;
    } catch (err) {
      expect(err.message).toBe('Invalid progress value');
    }

    expect(getNodesCollection(db).updateOne).toHaveBeenCalledTimes(0);
  });

  test('should add and remove connection from  node', async () => {
    (getNodesCollection as jest.Mock).mockReturnValue({
      updateOne: jest.fn()
    });
    const node: NodeInstance = {
      id: 'node',
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    (tryGetNode as jest.Mock).mockResolvedValue(node);

    const nodeId = VALID_OBJECT_ID;
    await addConnection(
      { name: 'test', nodeId },
      { name: 'test', nodeId: VALID_OBJECT_ID },
      'input',
      VALID_OBJECT_ID,
      {
        db,
        userId: ''
      }
    );
    await addConnection(
      { name: 'test', nodeId },
      { name: 'test', nodeId: VALID_OBJECT_ID },
      'output',
      VALID_OBJECT_ID,
      {
        db,
        userId: ''
      }
    );
    await removeConnection({ name: 'test', nodeId }, 'input', VALID_OBJECT_ID, {
      db,
      userId: ''
    });
    await removeConnection(
      { name: 'test', nodeId },
      'output',
      VALID_OBJECT_ID,
      {
        db,
        userId: ''
      }
    );
    expect(getNodesCollection(db).updateOne).toHaveBeenCalledTimes(4);
  });

  test('should add variable if connection is a variable connection', async () => {
    const targetNode: NodeInstance = {
      id: VALID_OBJECT_ID,
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    const sourceNode: NodeInstance = {
      id: VALID_OBJECT_ID,
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    const inputSocketDef: SocketDef = {
      displayName: 'abc',
      state: SocketState.STATIC,
      dataType: DataType.STRING
    };
    const contextNodeType: ServerNodeDefWithContextFn & NodeDef = {
      type: 'type',
      name: 'name',
      inputs: {},
      outputs: { test: inputSocketDef },
      keywords: [],
      path: [],
      isFormValid: async () => false,
      onMetaExecution: async () => ({}),
      onNodeExecution: async () => ({ outputs: {} }),
      transformContextInputDefsToContextOutputDefs: async () => ({}),
      transformInputDefsToContextInputDefs: async () => ({})
    };

    (getNodesCollection as jest.Mock).mockReturnValue({
      updateOne: jest.fn()
    });
    (tryGetNode as jest.Mock)
      .mockResolvedValueOnce(targetNode)
      .mockResolvedValueOnce(sourceNode);
    (getNodeType as jest.Mock).mockReturnValue(contextNodeType);
    (tryGetNodeType as jest.Mock).mockReturnValue(contextNodeType);
    (hasContextFn as any).mockReturnValue(true);

    await addConnection(
      { name: 'test', nodeId: targetNode.id },
      { name: 'test', nodeId: VALID_OBJECT_ID },
      'input',
      VALID_OBJECT_ID,
      { db, userId: '' }
    );

    expect(updateStates).toHaveBeenCalledTimes(1);
    expect(getNodesCollection(db).updateOne).toHaveBeenCalledTimes(2);
  });

  test('should add or update variable', async () => {
    const node: NodeInstance = {
      id: VALID_OBJECT_ID,
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    (getNodesCollection as jest.Mock).mockReturnValue({
      updateOne: jest.fn()
    });

    const res = await addOrUpdateVariable(
      '123',
      'test',
      DataType.STRING,
      node,
      { db, userId: '' }
    );

    expect(res).toBe(true);
    expect(updateStates).toHaveBeenCalledTimes(1);
    expect(getNodesCollection(db).updateOne).toHaveBeenCalledTimes(1);
    expect(getNodesCollection(db).updateOne).toHaveBeenCalledWith(
      { _id: new ObjectID(VALID_OBJECT_ID) },
      {
        $set: {
          [`variables.123`]: {
            displayName: 'test',
            dataType: DataType.STRING,
            state: SocketState.VARIABLE
          }
        }
      }
    );
  });

  test('should delete variable', async () => {
    const node: NodeInstance = {
      id: VALID_OBJECT_ID,
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    (getNodesCollection as jest.Mock).mockReturnValue({
      updateOne: jest.fn()
    });

    const res = await deleteVariable('123', node, {
      db,
      userId: ''
    });

    expect(res).toBe(true);
    expect(updateStates).toHaveBeenCalledTimes(1);
    expect(getNodesCollection(db).updateOne).toHaveBeenCalledTimes(1);
    expect(getNodesCollection(db).updateOne).toHaveBeenCalledWith(
      { _id: new ObjectID(VALID_OBJECT_ID) },
      {
        $unset: { [`variables.123`]: '' }
      }
    );
  });

  test('should also delete variable when deleting variable connection', async () => {
    const node: NodeInstance = {
      id: VALID_OBJECT_ID,
      contextIds: [],
      form: [],
      inputs: [],
      outputs: [],
      type: 'type',
      workspaceId: VALID_OBJECT_ID,
      x: 0,
      y: 0,
      state: NodeState.VALID,
      variables: {}
    };
    const contextNodeType: ServerNodeDefWithContextFn & NodeDef = {
      type: 'type',
      name: 'name',
      inputs: {},
      outputs: {},
      keywords: [],
      path: [],
      isFormValid: async () => false,
      onMetaExecution: async () => ({}),
      onNodeExecution: async () => ({ outputs: {} }),
      transformContextInputDefsToContextOutputDefs: async () => ({}),
      transformInputDefsToContextInputDefs: async () => ({})
    };
    (getNodesCollection as jest.Mock).mockReturnValue({
      updateOne: jest.fn()
    });
    (tryGetNode as jest.Mock).mockResolvedValue(node);
    (getNodeType as jest.Mock).mockReturnValue(contextNodeType);
    (hasContextFn as any).mockReturnValue(true);

    await removeConnection(
      { name: 'test', nodeId: VALID_OBJECT_ID },
      'input',
      VALID_OBJECT_ID,
      { db, userId: '' }
    );

    expect(updateStates).toHaveBeenCalledTimes(1);
    expect(getNodesCollection(db).updateOne).toHaveBeenCalledTimes(2);
  });
});
