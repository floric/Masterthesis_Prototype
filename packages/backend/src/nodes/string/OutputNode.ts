import { ServerNodeDef } from '../AllNodes';
import { StringSocket } from '../Sockets';

export const StringOutputNode: ServerNodeDef = {
  title: 'String Output',
  inputs: [StringSocket('String')],
  outputs: [],
  keywords: [],
  path: ['String'],
  onServerExecution: (form, values) =>
    Promise.resolve({
      outputs: new Map([['Result', values.get('String')!]])
    })
};
