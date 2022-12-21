
import { z } from 'zod';
import { Prisma } from '@prisma/client'

import { procedure, router } from '../trpc';
import { prisma } from '../db'

const defaultFundSelect = Prisma.validator<Prisma.fundsSelect>()({
    isin_code: true,
    name: true
});

const fundsRouter = router({
    /* Finding funds matching keystrokes by user */
    findFunds: procedure
    .input(
        z.object({
            name: z.string()
        })
        .optional()
    )
    .query(async ({input}) => { 
        const funds = await prisma.funds.findMany({
            where: {
                name: {
                    startsWith: input?.name,
                    mode: 'insensitive'
                }
            },
            select: defaultFundSelect,
            take: 5
        })

        if (funds) {
            return funds
        }
    }),
    /* Finding funds by their unique ISIN code */
    findByIsin: procedure
    .input(
        z.object({
            isin_code: z.string()
        })
        .required()
    )
    .query(async ({input}) => {
        const result = prisma.funds.findUnique({
            where: {
                isin_code: input.isin_code,
            },
            include: {
                rates: {
                    select: {
                        subscription_fee: true,
                        mgt_fee: true,
                        redemption_fee: true
                    }
                },
                managers: {
                    select: {
                        manager_name: true,
                        logo_url: true
                    }
                },
                categories: {
                    select: {
                        name: true
                    }
                },
                legal_types: {
                    select: {
                        name: true
                    }
                },
                performances: {
                    select: {
                        vl_value: true,
                        an_value: true,
                        date: true
                    },
                    orderBy: {
                        date: 'asc',
                    },
                }
            }
        })

        return result
    })
})

export default fundsRouter;