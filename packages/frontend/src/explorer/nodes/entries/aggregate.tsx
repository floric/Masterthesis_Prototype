import React from 'react';

import {
  AggregateEntriesNodeDef,
  AggregateEntriesNodeForm,
  AggregateEntriesNodeInputs,
  AggregateEntriesNodeOutputs,
  AggregationEntriesType,
  DataType
} from '@masterthesis/shared';
import { Form, Select } from 'antd';

import { NoDatasetInputWarning } from '../../../components/Warnings';
import { ClientNodeDef } from '../all-nodes';
import { getValueOrDefault } from '../utils';

export const AggregateEntriesNode: ClientNodeDef<
  AggregateEntriesNodeInputs,
  AggregateEntriesNodeOutputs,
  AggregateEntriesNodeForm
> = {
  type: AggregateEntriesNodeDef.type,
  renderFormItems: ({ form: { getFieldDecorator }, nodeForm, inputs }) => {
    const dsInput = inputs.dataset;
    if (!dsInput || !dsInput.isPresent) {
      return <NoDatasetInputWarning />;
    }

    const options = dsInput.isPresent
      ? dsInput.content.schema
          .filter(s => s.type === DataType.NUMBER)
          .map(s => s.name)
      : [];
    return (
      <>
        <Form.Item label="Value">
          {getFieldDecorator('valueName', {
            initialValue: getValueOrDefault(nodeForm, 'valueName', undefined)
          })(
            <Select style={{ width: 200 }} placeholder="Value">
              {options.map(o => (
                <Select.Option value={o} key={o}>
                  {o}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Type">
          {getFieldDecorator('type', {
            initialValue: getValueOrDefault(
              nodeForm,
              'type',
              AggregationEntriesType.SUM
            )
          })(
            <Select style={{ width: 200 }} placeholder="Aggregation Type">
              {Object.values(AggregationEntriesType).map(o => (
                <Select.Option value={o} key={o}>
                  {o}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </>
    );
  }
};
