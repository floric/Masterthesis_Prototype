import {
  MultiplicationNodeDef,
  MultiplicationNodeInputs,
  MultiplicationNodeOutputs,
  ServerNodeDef
} from '@masterthesis/shared';

export const MultiplicationNode: ServerNodeDef<
  MultiplicationNodeInputs,
  MultiplicationNodeOutputs
> = {
  type: MultiplicationNodeDef.type,
  onMetaExecution: async (form, inputs) => {
    if (
      inputs.a == null ||
      inputs.b == null ||
      !inputs.a.isPresent ||
      !inputs.b.isPresent
    ) {
      return {
        product: { content: {}, isPresent: false }
      };
    }

    return {
      product: { content: {}, isPresent: true }
    };
  },
  onNodeExecution: (form, values) =>
    Promise.resolve({
      outputs: {
        product: values.a * values.b
      }
    })
};
