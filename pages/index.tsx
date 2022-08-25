import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import toast, { Toaster } from "react-hot-toast";
import abi from "../public/config/abi.json";
import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core'
import { Contract, ethers, getDefaultProvider } from 'ethers'
import { motion } from 'framer-motion';

const Home: NextPage = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers()
  const [mintAmount, setMintAmount] = useState(1);
  const [totalSupply, setTotalSupply] = useState("0");
  const [whitelist, setWhitelist] = useState(false)

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      toast.error("Max mintable amount is 10");
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  // const cost = 3000000000000000;
  //
  const CONTRACT_ADDRESS = "0xec82993014d026c19864d5c2e90eFfB5175b35B1";//0xC8CbFDaa405A959902e8204474d45646461f96cf";
  const provider = getDefaultProvider("mainnet")

  const SmartContract = new Contract(CONTRACT_ADDRESS, abi, provider)

  const GetSupply = async () => {
    // if (account != undefined) {
    console.log("Fetching supply...")
    const supply = await SmartContract.totalSupply()
    setTotalSupply(supply.toString())
  }

  useEffect(() => {
    GetSupply()
  }, [account])

  const MintNft = async () => {
    toast("Here it comes...")
    //during whitelist check for proof
    const isWhitelist = await SmartContract.isWhitelist()
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());

    const cost = await SmartContract.getCost(mintAmount, account)
    const totalWeiValue = String(cost[0] as unknown as number);

    if (isWhitelist) {
      const resp = await fetch(`/api/proof/${account}`, {
        headers: {
          Accept: 'application/json',
        },
      })
      if (resp.status == 200) {
        const response = await resp.json()
        WLMintNft(response.proof, signer, totalWeiValue)
      }
      else
        toast.error("Not whitelisted. Please wait for public sale.")
    } else
      PublicMintNft(signer, totalWeiValue)
  }

  const WLMintNft = async (proof: any, signer: any, totalWeiValue: any) => {

    console.log("WL Minting...");
    try {
      const tx = await SmartContract.connect(signer).mintWithSignature(mintAmount, proof, { value: totalWeiValue })
      toast.promise(tx.wait(), {
        loading: "Minting...",
        success: "Successfully minted !",
        error: "Minting failed. Please verify that contract is not paused"
      })
    } catch (e) {
      toast.error("Minting failed. Please verify that contract is not paused")
    }
  }

  const PublicMintNft = async (signer: any, totalWeiValue: any) => {
    console.log("Public Minting...");
    try {
      const tx = await SmartContract.connect(signer).mint(mintAmount, { value: totalWeiValue })
      toast.promise(tx.wait(), {
        loading: "Minting...",
        success: "Successfully minted !",
        error: "Minting failed. Please verify that contract is not paused"
      })
    } catch (e) {
      toast.error("Minting failed. Please verify that contract is not paused")
    }
  };

  return (
    <div className='h-full z-20' style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <Head>
        <title>{"Shade NFT"}</title>
        <meta name="description" content="Shade NFT Collection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex flex-col justify-center items-center'>
        <Toaster
          toastOptions={{
            className: "font-attack text-3xl"
          }}
        />
        <motion.div className='pt-20'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Image alt={"logo"} src={"/images/shade_cropped.png"} width="700" height="300" />
        </motion.div>

        <div className='mt-20 text-center w-full bg-cover h-full' >
          <div >
            <h1 className='text-white text-4xl sm:text-6xl font-attack'>{totalSupply} / 7777</h1>

            {totalSupply != "7777" ?
              <>
                <p className='text-white text-3xl font-tiy mt-4'>1 SHADE COSTS 0.005 ETH. <br />1 free mint per whitelist up to 1777 !</p>

                <div className='my-10'>
                  {account === undefined ? (
                    <button className='bg-transparent border border-white rounded-xl text-6xl
              font-attack px-4 pb-1 text-white'
                      onClick={activateBrowserWallet}>
                      Connect
                    </button>
                  ) :
                    <div className='text-white'>
                      <div className='text-white'>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="text-3xl mx-6 font-attack ">{mintAmount}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <button className='bg-transparent border border-white rounded-xl text-6xl
                     font-attack px-4 pb-1 hover:scale-110'
                        onClick={MintNft}>
                        Mint
                      </button>
                    </div>
                  }
                </div>
              </>
              :
              <>
                <p className='text-white text-3xl font-tiy mt-4'>Sold out !</p>
                <a className='bg-transparent border border-white rounded-xl text-3xl text-white
                     font-attack px-4 pb-1'
                  href="https://opensea.io/collection/shade-gen1"
                  target="_blank"
                  rel="noreferrer">
                  Buy on Opensea
                </a>
              </>
            }
          </div>
        </div>
      </div>
    </div >
  )
}

export default Home
