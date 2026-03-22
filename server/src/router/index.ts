import { router } from '../trpc';

export const appRouter = router({
  // Add your tRPC routers here
});

export type AppRouter = typeof appRouter;
