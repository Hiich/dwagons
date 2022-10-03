import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Mainnet, DAppProvider, useEtherBalance, useEthers, Config } from '@usedapp/core'
import { getDefaultProvider } from 'ethers'

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider('mainnet'),
  },
}

function MyApp({ Component, pageProps }: AppProps) {
  return (

    <DAppProvider config={config}>
      <div className=' bg-no-repeat bg-cover bg-center'
        style={{ backgroundImage: "url('../images/bg.jpg')", height: "100vh" }}
      >
        <Component {...pageProps} />
      </div>
    </DAppProvider>
  )
}

export default MyApp
