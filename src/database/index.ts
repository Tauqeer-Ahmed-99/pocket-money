import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const database = drizzle({ client: pool });

export default database;
