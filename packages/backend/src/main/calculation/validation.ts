import {
  ApolloContext,
  ContextNodeType,
  DatasetRef,
  DataType,
  IOValues,
  NodeInstance,
  parseNodeForm
} from '@masterthesis/shared';

import { Log } from '../../logging';
import { getMetaInputs } from '../calculation/meta-execution';
import { tryGetNodeType } from '../nodes/all-nodes';
import { getInputDefs } from '../workspace/nodes-detail';

export const isNodeInMetaValid = async (
  node: NodeInstance,
  reqContext: ApolloContext
) => {
  let isValidForm = true;
  if (
    node.type !== ContextNodeType.INPUT &&
    node.type !== ContextNodeType.OUTPUT
  ) {
    const type = tryGetNodeType(node.type);
    isValidForm = type.isFormValid
      ? await type.isFormValid(parseNodeForm(node.form))
      : true;
  }

  const metaDefs = await getMetaInputs(node, reqContext);
  const allInputsArePresent = Object.values(metaDefs)
    .filter(a => !!a)
    .map(a => a.isPresent)
    .reduce((a, b) => a && b, true);

  return isValidForm && allInputsArePresent;
};

export const areNodeInputsValid = async (
  node: NodeInstance,
  inputs: IOValues<{}>,
  reqContext: ApolloContext
) => {
  const inputDefs = await getInputDefs(node, reqContext);
  const res = await Promise.all(
    Object.entries(inputDefs).map(p =>
      isInputValid(inputs[p[0]], p[1].dataType, reqContext)
    )
  );
  return res.reduce((a, b) => a && b, true);
};

const validateDataset = async (
  datasetRef: DatasetRef,
  reqContext: ApolloContext
): Promise<boolean> => {
  if (!datasetRef.entries || !datasetRef.schema) {
    return false;
  }

  return datasetRef.schema.length > 0;
};

const validateNumber = (value: any) => {
  return Promise.resolve(typeof value === 'number' && !isNaN(value));
};

const validateString = (value: any) => {
  return Promise.resolve(typeof value === 'string');
};

const validateBoolean = (value: any) => {
  return Promise.resolve(typeof value === 'boolean');
};

const validateDatetime = (value: any) => {
  return Promise.resolve(value instanceof Date);
};

const validateTime = (value: any) => {
  return Promise.resolve(value instanceof Date);
};

const validationMethods: Map<
  string,
  (input: any, reqContext: ApolloContext) => Promise<boolean>
> = new Map([
  [DataType.DATASET, validateDataset],
  [DataType.STRING, validateString],
  [DataType.NUMBER, validateNumber],
  [DataType.BOOLEAN, validateBoolean],
  [DataType.TIME, validateTime],
  [DataType.DATETIME, validateDatetime]
]);

export const isInputValid = async (
  input: any,
  dataType: DataType,
  reqContext: ApolloContext
) => {
  if (input == null) {
    return false;
  }

  if (!validationMethods.has(dataType)) {
    Log.warn('Unsupported data type: ' + dataType);
    return true;
  }

  return await validationMethods.get(dataType)!(input, reqContext);
};
