import { z } from 'zod'

import { procedure, router } from '../trpc'
import prisma from '../db'

const fundsRouter = router({
  /* Finding funds matching keystrokes by user */
  findFunds: procedure
    .input(
      z
        .object({
          name: z.string(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const funds = await prisma.funds.findMany({
        where: {
          name: {
            startsWith: input?.name,
            mode: 'insensitive',
          },
        },
        select: {
          isin_code: true,
          name: true,
        },
        take: 5,
      })

      return funds
    }),
  /* Finding funds by their unique ISIN code */
  findByIsin: procedure
    .input(
      z
        .object({
          isinCode: z.string(),
        })
        .required()
    )
    .query(async ({ input }) => {
      const result = prisma.funds.findUnique({
        where: {
          isin_code: input.isinCode,
        },
        include: {
          rates: {
            select: {
              subscription_fee: true,
              mgt_fee: true,
              redemption_fee: true,
            },
          },
          managers: {
            select: {
              manager_name: true,
              logo_url: true,
            },
          },
          categories: {
            select: {
              name: true,
            },
          },
          legal_types: {
            select: {
              name: true,
            },
          },
          periodicities: {
            select: {
              name: true,
            },
          },
          performances: {
            select: {
              vl_value: true,
              an_value: true,
              date: true,
            },
            orderBy: {
              date: 'desc',
            },
            take: 7,
          },
        },
      })

      return result
    }),
})

export default fundsRouter
