import "dotenv/config"
import { defineConfig } from "prisma/config"


export default defineConfig({
  migrations: {
    seed: 'ts-node ./prisma/seed_levels.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
