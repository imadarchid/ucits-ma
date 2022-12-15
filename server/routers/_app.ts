import { z } from 'zod';
import { procedure, router } from '../trpc';

import fundsRouter from './funds';

export const appRouter = router({
  funds: fundsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;