import * as React from 'react';
import { ApolloQueryResult } from 'apollo-client';
import { Row, Col, Card, Upload, Button, Icon } from 'antd';
import { Mutation, MutationFn } from 'react-apollo';
import gql from 'graphql-tag';

import { Dataset } from '../../utils/model';
import { UploadFile } from 'antd/lib/upload/interface';
import { tryOperation } from '../../utils/form';

const UPLOAD_ENTRIES_CSV = gql`
  mutation($files: [Upload!]!, $datasetId: String!) {
    uploadEntriesCsv(files: $files, datasetId: $datasetId)
  }
`;

export interface DataActionsProps {
  dataset: Dataset;
  refetch: () => Promise<ApolloQueryResult<any>>;
}

export interface DataActionsState {
  fileList: Array<UploadFile>;
  uploading: boolean;
}

export class DatasetActions extends React.Component<
  DataActionsProps,
  DataActionsState
> {
  public componentWillMount() {
    this.setState({
      fileList: [],
      uploading: false
    });
  }

  private handleUpload = async (
    uploadEntriesCsv: MutationFn<
      any,
      { files: Array<UploadFile>; datasetId: string }
    >
  ) => {
    const { fileList } = this.state;
    const { dataset } = this.props;

    tryOperation({
      op: async () => {
        this.setState({
          uploading: true,
          fileList: []
        });

        await uploadEntriesCsv({
          variables: {
            files: fileList,
            datasetId: dataset.id
          }
        });

        this.setState({
          uploading: false
        });
      },
      onFail: () => this.setState({ uploading: false }),
      failedTitle: 'Upload failed',
      successTitle: 'Upload successfull',
      failedMessage: 'Upload has failed.',
      successMessage: `Upload of ${
        fileList.length > 1 ? `${fileList.length} files` : 'file'
      } successfull.`
    });
  };

  public render() {
    const uploadProps = {
      onRemove: file => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      },
      beforeUpload: file => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file]
        }));
        return false;
      },
      fileList: this.state.fileList,
      multiple: true
    };

    const { uploading } = this.state;

    return (
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 12 }} xl={{ span: 8 }}>
          <Card bordered={false}>
            <h3>Entry upload</h3>
            <Mutation mutation={UPLOAD_ENTRIES_CSV}>
              {uploadEntriesCsv => (
                <>
                  <Row style={{ marginBottom: 12 }}>
                    <Col>
                      <Upload {...uploadProps}>
                        <Button>
                          <Icon type="upload" /> Select CSV file
                        </Button>
                      </Upload>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        type="primary"
                        onClick={() => this.handleUpload(uploadEntriesCsv)}
                        disabled={this.state.fileList.length === 0}
                        loading={uploading}
                      >
                        {uploading ? 'Uploading' : 'Start Upload'}
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Mutation>
          </Card>
        </Col>
      </Row>
    );
  }
}
