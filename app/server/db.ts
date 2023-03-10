/* Intitiating a Prisma instance to be used accross all the project */

import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line
  var prisma: PrismaClient | undefined
}

const prisma =
  global.prisma ||
  new PrismaClient({
    // log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
