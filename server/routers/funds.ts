
import { z } from 'zod';
import { Prisma } from '@prisma/client'


import { procedure, router } from '../trpc';
import { prisma } from '../db'

const defaultFundSelect = Prisma.validator<Prisma.fundsSelect>()({
    isin_code: true,
    name: true
});

const fundsRouter = router({
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
    })
})

export default fundsRouter;