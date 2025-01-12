import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import '@/drizzle/envConfig';
import * as schema from "@/drizzle/schema"

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema: schema, logger: true });
