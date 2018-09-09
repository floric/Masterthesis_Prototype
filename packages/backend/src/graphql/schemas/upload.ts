const UploadDef = `scalar Upload`;

const UploadErrorDef = `
  type UploadError {
    name: String!
    message: String!
    count: Int!
  }
`;

const UploadProcessDef = `
  type UploadProcess {
    id: String!
    start: Date!
    finish: Date
    datasetId: String!
    errors: [UploadError!]!
    state: String!
    addedEntries: Int!
    failedEntries: Int!
    invalidEntries: Int!
    fileNames: [String!]!
  }
`;

export default () => [UploadDef, UploadErrorDef, UploadProcessDef];
