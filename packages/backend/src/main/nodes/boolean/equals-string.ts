import {
  EqualsStringNodeDef,
  EqualsStringNodeInputs,
  EqualsStringNodeOutputs,
  ServerNodeDef
} from '@masterthesis/shared';

export const EqualsStringNode: ServerNodeDef<
  EqualsStringNodeInputs,
  EqualsStringNodeOutputs
> = {
  name: EqualsStringNodeDef.name,
  onMetaExecution: async (form, inputs, db) => {
    if (
      !inputs.valueA ||
      !inputs.valueB ||
      !inputs.valueA.isPresent ||
      !inputs.valueB.isPresent
    ) {
      return {
        equals: {
          content: {},
          isPresent: false
        }
      };
    }

    return {
      equals: {
        content: {},
        isPresent: true
      }
    };
  },
  onNodeExecution: (form, inputs) =>
    Promise.resolve({
      outputs: {
        equals: inputs.valueA === inputs.valueB
      }
    })
};
