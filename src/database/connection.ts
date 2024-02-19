import {Pool} from 'pg';


const pool = new Pool( {
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "masterkey",
  database: "movie",
  max: 20,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 10000
});

export default pool;