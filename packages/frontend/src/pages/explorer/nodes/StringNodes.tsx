import { StringSocket, NumberSocket } from './Sockets';
import { NodeOptions } from './BasicNodes';

export const StringLengthNode: NodeOptions = {
  title: 'String Length',
  inputs: [StringSocket('String', 'input')],
  outputs: [NumberSocket('Length', 'output')],
  path: ['String', 'Operators']
};

export const SubStringNode: NodeOptions = {
  title: 'Substring',
  inputs: [StringSocket('String', 'input')],
  outputs: [StringSocket('String', 'output')],
  path: ['String', 'Operators']
};

export const AllStringNodes = [StringLengthNode, SubStringNode];
