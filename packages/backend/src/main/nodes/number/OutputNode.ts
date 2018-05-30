import {
  NumberOutputNodeDef,
  NumberOutputNodeInputs,
  NumberOutputNodeResults,
  ServerNodeDef
} from '@masterthesis/shared';
import { validateNumber } from './utils';

export const NumberOutputNode: ServerNodeDef<
  NumberOutputNodeInputs,
  {},
  {},
  NumberOutputNodeResults
> = {
  name: NumberOutputNodeDef.name,
  isInputValid: async input => validateNumber(input.value),
  onServerExecution: (form, inputs) =>
    Promise.resolve({
      outputs: {},
      results: {
        value: inputs.value
      }
    })
};
