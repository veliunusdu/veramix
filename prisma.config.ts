import path from 'node:path'
import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    adapter: async () => {
      const { PrismaPg } = await import('@prisma/adapter-pg')
      return new PrismaPg({ connectionString: process.env.DIRECT_URL! })
    },
  },
  datasource: {
    url: process.env.DIRECT_URL!,
  },
migrations: {
  seed: 'tsx prisma/seed.ts',
},
})