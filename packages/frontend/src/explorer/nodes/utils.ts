import {
  ConnectionInstance,
  FormValues,
  parseNodeForm,
  SocketDef,
  SocketMetaDef,
  SocketMetas
} from '@masterthesis/shared';

import { EditorContext, nodeTypes } from './all-nodes';

export const getInputNode = (
  socketName: string,
  nodeId: string,
  connections: Array<ConnectionInstance>
) => {
  const inputs = connections.filter(
    n => n.to && n.to.nodeId === nodeId && n.to.name === socketName
  );
  if (inputs.length !== 1) {
    return null;
  }

  return inputs[0].from;
};

const emptyConnection = {
  content: {},
  isPresent: false
};

export const getInputInformation = (
  context: EditorContext
): SocketMetas<any> => {
  const node = nodeTypes.get(context.node.type);
  if (!node) {
    throw new Error('Unknown node type: ' + context.node.type);
  }

  const output = {};

  Array.from<[string, SocketDef]>(Object.entries(node.inputs))
    .map<{ name: string; output: SocketMetaDef }>(i => {
      const inputSocketName = i[0];
      const inputConnection = context.state.connections.find(
        n =>
          n.to !== null &&
          n.to.nodeId === context.node.id &&
          n.to.name === inputSocketName
      );
      if (!inputConnection || inputConnection.from === null) {
        return {
          name: inputSocketName,
          output: emptyConnection
        };
      }

      const inputNode = context.state.nodes.find(
        n => n.id === inputConnection.from!.nodeId
      );
      if (!inputNode) {
        throw new Error('Invalid connection with unknown node.');
      }

      // This happens for context input nodes!
      const nodeInputType = nodeTypes.get(inputNode.type);
      if (!nodeInputType) {
        return {
          name: inputSocketName,
          output: emptyConnection
        };
      }

      const inputs = getInputInformation({
        node: inputNode,
        state: context.state
      });
      const nodeForm = parseNodeForm(inputNode);

      const outputs = nodeInputType.onClientExecution
        ? nodeInputType.onClientExecution(inputs, nodeForm, {
            state: context.state,
            node: inputNode
          })
        : {};

      return {
        name: inputSocketName,
        output: outputs[inputConnection.from.name] || emptyConnection
      };
    })
    .forEach(v => {
      output[v.name] = v.output;
    });

  return output;
};

export const getValueOrDefault = <T, Name extends keyof T>(
  form: FormValues<T>,
  valueName: Name,
  defaultVal: FormValues<T>[Name]
) => {
  return form[valueName] !== null ? form[valueName] : defaultVal;
};
