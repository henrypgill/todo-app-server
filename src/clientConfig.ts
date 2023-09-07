// import dotenv from "dotenv";

export function getDbClientConfig() {
  const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  };
  console.log(config);
  return config;
}
