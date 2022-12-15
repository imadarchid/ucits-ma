import '../styles/globals.css'

import type { AppType } from 'next/app'
import { trpc } from '../utils/trpc';

import { Layout } from '../components/Layout';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
};

export default trpc.withTRPC(MyApp);
