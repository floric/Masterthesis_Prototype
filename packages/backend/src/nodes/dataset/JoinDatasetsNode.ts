import { JoinDatasetsNodeDef, ServerNodeDef } from '@masterthesis/shared';

export const JoinDatasetsNode: ServerNodeDef = {
  name: JoinDatasetsNodeDef.name,
  isInputValid: async inputs => {
    const aVal = inputs.get('Dataset A');
    const bVal = inputs.get('Dataset B');

    if (!aVal || !bVal) {
      return false;
    }

    return true;
  },
  isFormValid: async form => {
    return true;
  },
  onServerExecution: async (form, inputs) => {
    return { outputs: new Map() };
  }
};
