import * as React from 'react';

import { Colors } from '@masterthesis/shared';
import { Card, Col, Layout, Row } from 'antd';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import { RegistrationForm } from './forms/RegistrationForm';

const FLEX_SIZE = {
  xs: {
    span: 24,
    offset: 0
  },
  md: {
    span: 12,
    offset: 6
  }
};

export interface RegistrationPageProps extends RouteComponentProps<{}> {}

export default class RegistrationPage extends React.Component<
  RegistrationPageProps
> {
  public render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Content style={{ background: Colors.Background }}>
          <Row>
            <Col {...FLEX_SIZE}>
              <Card bordered={false}>
                <h1>Registration</h1>
                <p>
                  If you already have an account, you can{' '}
                  <Link to="/login">login</Link> instead.
                </p>
                <RegistrationForm history={this.props.history} />
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    );
  }
}