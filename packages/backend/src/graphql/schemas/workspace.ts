const FormValueDef = `
  type FormValue {
    name: String!
    value: String!
  }
`;

const SocketValueDef = `
  type SocketValue {
    name: String!
    connectionId: String!
  }
`;

const NodeDef = `
  type Node {
    id: String!
    type: String!
    x: Float!
    y: Float!
    inputs: [SocketValue!]!
    outputs: [SocketValue!]!
    contextIds: [String!]!
    state: String!
    form: [FormValue!]!
    workspace: Workspace!
    metaInputs: Meta!
    metaOutputs: Meta!
    hasContextFn: Boolean!
    contextInputDefs: SocketDefs
    contextOutputDefs: SocketDefs
    progress: Float
    inputSockets: SocketDefs
    outputSockets: SocketDefs
  }
`;

const NodeInputDef = `
  input NodeInput {
    id: String!
    type: String!
    x: Float!
    y: Float!
  }
`;

const SocketDef = `
  type Socket {
    nodeId: String!
    name: String!
  }
`;

const SocketInputDef = `
  input SocketInput {
    nodeId: String!
    name: String!
  }
`;

const ConnectionDef = `
  type Connection {
    id: String!
    from: Socket
    to: Socket
    contextIds: [String!]!
    workspace: Workspace!
  }
`;

const ConnectionInputDef = `
  input ConnectionInput {
    from: SocketInput
    to: SocketInput
  }
`;

const OutputResultDef = `
  type OutputResult {
    id: String!
    value: String!
    type: String!
    name: String!
    description: String!
  }
`;

const WorkspaceDef = `
  type Workspace {
    id: String!
    name: String!
    lastChange: Date!
    created: Date!
    description: String!
    nodes: [Node!]!
    connections: [Connection!]!
    results: [OutputResult!]!
  }
`;

const MetaDef = `
  scalar Meta
`;

const SocketDefsDef = `
  scalar SocketDefs
`;

const DateDef = `scalar Date`;

export default () => [
  OutputResultDef,
  DateDef,
  MetaDef,
  SocketDefsDef,
  FormValueDef,
  SocketValueDef,
  NodeDef,
  NodeInputDef,
  SocketDef,
  SocketInputDef,
  ConnectionDef,
  ConnectionInputDef,
  WorkspaceDef
];
