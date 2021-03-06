import {
  DatasetSocket,
  DataType,
  SocketState,
  SoundChartDef
} from '@masterthesis/shared';

import { getDynamicEntryContextInputs } from '../../../../src/main/nodes/entries/utils';
import { SoundChartNode } from '../../../../src/main/nodes/visualizations/sound-chart';
import { NODE } from '../../../test-utils';

jest.mock('../../../../src/main/nodes/entries/utils');
jest.mock('../../../../src/main/workspace/dataset');

describe('SoundChart', () => {
  test('should have correct properties', () => {
    expect(SoundChartNode.type).toBe(SoundChartDef.type);
    expect(SoundChartNode.isFormValid).toBeDefined();
    expect(SoundChartNode.isInputValid).toBeUndefined();
  });

  test('should have invalid form', async () => {
    let res = await SoundChartNode.isFormValid({
      name: '',
      description: ''
    });
    expect(res).toBe(false);

    res = await SoundChartNode.isFormValid({
      name: null,
      description: null
    });
    expect(res).toBe(false);
  });

  test('should have valid form', async () => {
    const res = await SoundChartNode.isFormValid({
      name: 'test',
      description: null
    });
    expect(res).toBe(true);
  });

  test('should call getDynamicEntryContextInputs', async () => {
    (getDynamicEntryContextInputs as jest.Mock).mockReturnValue({});
    const res = await SoundChartNode.transformInputDefsToContextInputDefs(
      { dataset: DatasetSocket('Ds') },
      { dataset: { content: { schema: [] }, isPresent: true } },
      { description: '', name: 'test' },
      { db: null, userId: '' }
    );
    expect(res).toEqual({});
    expect(getDynamicEntryContextInputs as jest.Mock).toHaveBeenCalledTimes(1);
  });

  test('should have label and value outputs', async () => {
    const res = await SoundChartNode.transformContextInputDefsToContextOutputDefs(
      { dataset: DatasetSocket('Ds') },
      { dataset: { content: { schema: [] }, isPresent: true } },
      {},
      {},
      { description: '', name: 'a' },
      { db: null, userId: '' }
    );
    expect(res).toEqual({
      source: {
        dataType: DataType.STRING,
        displayName: 'Source',
        state: SocketState.STATIC
      },
      destination: {
        dataType: DataType.STRING,
        displayName: 'Destination',
        state: SocketState.STATIC
      },
      fromWestToEast: {
        dataType: DataType.BOOLEAN,
        displayName: 'Is from West to East',
        state: SocketState.STATIC
      },
      sortingValue: {
        dataType: 'Number',
        displayName: 'Sorting Value',
        state: 'Static'
      },
      value: {
        dataType: DataType.NUMBER,
        displayName: 'Value',
        state: SocketState.STATIC
      }
    });
  });

  test('should have empty meta result', async () => {
    const res = await SoundChartNode.onMetaExecution(
      { description: 'test', name: 'test' },
      { dataset: { content: { schema: [] }, isPresent: true } },
      { db: null, userId: '' }
    );
    expect(res).toEqual({});
  });

  test('should get parameters for sound visualization', async () => {
    let call = 0;
    const res = await SoundChartNode.onNodeExecution(
      { name: 'a', description: '' },
      {
        dataset: {
          entries: [{}, {}, {}],
          schema: [
            {
              name: 'source',
              type: DataType.STRING,
              fallback: '',
              required: true,
              unique: false
            },
            {
              name: 'destination',
              type: DataType.STRING,
              fallback: '',
              required: true,
              unique: false
            },
            {
              name: 'fromWestToEast',
              type: DataType.BOOLEAN,
              fallback: 'true',
              required: true,
              unique: false
            },
            {
              name: 'value',
              type: DataType.NUMBER,
              fallback: '0',
              required: true,
              unique: false
            }
          ]
        }
      },
      {
        reqContext: { db: null, userId: '' },
        node: NODE,
        contextFnExecution: () => {
          if (call === 0) {
            call++;
            return Promise.resolve({
              outputs: {
                source: 'a',
                destination: 'b',
                fromWestToEast: true,
                sortingValue: 2,
                value: 5
              }
            });
          } else if (call === 1) {
            call++;
            return Promise.resolve({
              outputs: {
                source: 'a',
                destination: 'b',
                fromWestToEast: true,
                sortingValue: 2,
                value: 25
              }
            });
          }

          return Promise.resolve({
            outputs: {
              source: 'b',
              destination: 'c',
              fromWestToEast: false,
              sortingValue: 3,
              value: 15
            }
          });
        }
      }
    );

    expect(res).toEqual({
      outputs: {},
      results: {
        description: '',
        name: 'a',
        type: 'Vis',
        value: {
          type: 'SoundChart',
          values: {
            cities: {
              east: {
                b: {
                  exportVolume: 15,
                  importVolume: 30,
                  isWest: false,
                  sortingValue: 3
                }
              },
              west: {
                a: {
                  exportVolume: 30,
                  importVolume: 0,
                  isWest: true,
                  sortingValue: 2
                },
                c: {
                  exportVolume: 0,
                  importVolume: 15,
                  isWest: true,
                  sortingValue: 3
                }
              }
            },
            passages: [
              { destination: 'b', isEastPassage: true, source: 'a', value: 5 },
              { destination: 'b', isEastPassage: true, source: 'a', value: 25 },
              { destination: 'c', isEastPassage: false, source: 'b', value: 15 }
            ]
          }
        }
      }
    });
  });
});
