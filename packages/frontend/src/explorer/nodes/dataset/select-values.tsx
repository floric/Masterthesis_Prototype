import * as React from 'react';

import {
  SelectValuesNodeDef,
  SelectValuesNodeForm,
  SelectValuesNodeInputs,
  SelectValuesNodeOutputs
} from '@masterthesis/shared';
import { Form, Select } from 'antd';

import { ClientNodeDef } from '../all-nodes';
import { getValueOrDefault } from '../utils';

export const SelectValuesNode: ClientNodeDef<
  SelectValuesNodeInputs,
  SelectValuesNodeOutputs,
  SelectValuesNodeForm
> = {
  name: SelectValuesNodeDef.name,
  renderFormItems: ({
    form,
    form: { getFieldDecorator },
    nodeForm,
    inputs
  }) => {
    const dsInput = inputs.dataset;
    if (!dsInput) {
      return <p>Error</p>;
    }

    const options = dsInput.isPresent ? dsInput.content.schema : [];
    return (
      <Form.Item label="Input">
        {getFieldDecorator('values', {
          initialValue: getValueOrDefault(nodeForm, 'values', [])
        })(
          <Select
            mode="multiple"
            showSearch
            style={{ width: 200 }}
            placeholder="Select values"
          >
            {options.map(o => (
              <Select.Option value={o.name} key={o.name}>
                {o.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    );
  }
};