import '../styles/globals.css'

import type { AppType } from 'next/app'
import trpc from '../utils/trpc'
import Layout from '../components/Layout'

// eslint-disable-next-line react/function-component-definition, react/prop-types
const MyApp: AppType = ({ Component, pageProps }) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
)

export default trpc.withTRPC(MyApp)
