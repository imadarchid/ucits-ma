import '../styles/globals.css'

import { trpc } from '../utils/trpc';
import { Layout } from '../components/Layout';

import type { AppType } from 'next/app'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
};

export default trpc.withTRPC(MyApp);
