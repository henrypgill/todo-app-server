export function getDbClientConfig() {
  const config = {
    user: process.env.PGUSER, // default process.env.PGUSER || process.env.USER
    password: process.env.PGUSER, //default process.env.PGPASSWORD
    host: process.env.PGUSER, // default process.env.PGHOST
    database: process.env.PGUSER, // default process.env.PGDATABASE || user
    port: process.env.PGUSER, // default process.env.PGPORT
    connectionString: process.env.PGUSER, // e.g. postgres://user:password@host:5432/database
    ssl: { rejectUnauthorized: false }, // passed directly to node.TLSSocket, supports all tls.connect options
    // types?: any, // custom type parsers
    // statement_timeout?: number, // number of milliseconds before a statement in query will time out, default is no timeout
    // query_timeout?: number, // number of milliseconds before a query call will timeout, default is no timeout
    // application_name?: string, // The name of the application that created this Client instance
    // connectionTimeoutMillis?: number, // number of milliseconds to wait for connection, default is no timeout
    // idle_in_transaction_session_timeout?: number // number of milliseconds before terminating any session with an open idle transaction, default is no timeout
  };
  return config;
}
