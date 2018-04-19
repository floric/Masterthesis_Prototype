import * as React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { connect } from 'react-redux';

import { withPageHeaderHoC } from '../components/PageHeaderHoC';
import { actions } from '../state/actions/data';
import { Dispatch } from 'redux';
import { Entry } from '../model/entry';
import { Value } from '../model/value';
import { IRootState } from '../state/reducers/root';

class DataPage extends React.Component<{
  entries: ReadonlyArray<Entry>;
  onAddEntry: () => void;
}> {
  private handleClick = () => this.props.onAddEntry();

  public render() {
    return (
      <Row>
        <Col>
          <Card bordered={false}>
            Create or import new Data here
            <Button onClick={this.handleClick}>Click me</Button>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state: IRootState) => ({
  entries: state.data.entries
});

const mapDispatchToProps = (dispatch: Dispatch<IRootState>) => ({
  onAddEntry: () => {
    const newEntry = new Entry();
    newEntry.addVal(new Value<number>('testA', 9.9));
    dispatch(actions.add(newEntry));
  }
});

export default withPageHeaderHoC({ title: 'Data' })(
  connect(mapStateToProps, mapDispatchToProps)(DataPage)
);
