import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import toast, { Toaster } from "react-hot-toast";
import abi from "../public/config/abi.json";
import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core'
import { Contract, getDefaultProvider } from 'ethers'
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
    if (newMintAmount > 5) {
      toast.error("Max mintable amount is 5 per transaction");
      newMintAmount = 5;
    }
    setMintAmount(newMintAmount);
  };

  // const cost = 3000000000000000;
  //
  const CONTRACT_ADDRESS = "0x203Da24FE5939e58393C038892b64538a8382143";//0xC8CbFDaa405A959902e8204474d45646461f96cf";

  const SmartContract = new Contract(CONTRACT_ADDRESS, abi, getDefaultProvider("mainnet"))

  const GetSupply = async () => {
    const options = {
      // chain: "mainnet",
      contractAddress: CONTRACT_ADDRESS,
      functionName: "totalSupply",
      abi: abi
    };
    // if (account != undefined) {
    console.log("Fetching supply...")
    const supply = await SmartContract.totalSupply()
    setTotalSupply(supply.toString())
  }

  useEffect(() => {
    GetSupply()
    // IsWhiteList()
    console.log(account)
  }, [account])

  const IsWhiteList = async () => {
    const isWhitelist = await SmartContract.isWhitelist()
    setWhitelist(isWhitelist)
  }

  const MintNft = async () => {
    //during whitelist check for proof
    if (whitelist) {
      const resp = await fetch(`/api/proof/${account}`, {
        headers: {
          Accept: 'application/json',
        },
      })
      const response = await resp.json()
      if (response != undefined)
        WLMintNft(response.proof)
      else
        toast.error("Not whitelisted. Please wait for public sale.")
    } else
      PublicMintNft()
  }

  const WLMintNft = async (proof: any) => {
    console.log("WL Minting...");
    const cost = await SmartContract.getCost(mintAmount, account)
    const totalWeiValue = String(cost as unknown as number);
    console.log(totalWeiValue)
    toast.promise(SmartContract.mintWithSignature(mintAmount, proof, { value: totalWeiValue }), {
      loading: "Minting...",
      success: "Successfully minted !",
      error: "Minting failed. Please verify that contract is not paused"
    })

  }

  const PublicMintNft = async () => {
    console.log("Public Minting...");
    const cost = await SmartContract.getCost(mintAmount, account)
    const totalWeiValue = String(cost as unknown as number);
    console.log(totalWeiValue)

    toast.promise(SmartContract.mint(mintAmount, { value: totalWeiValue }), {
      loading: "Minting...",
      success: "Successfully minted !",
      error: "Minting failed. Please verify that contract is not paused"
    })
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
                     font-attack px-4 pb-1'
                    onClick={MintNft}>
                    Mint
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Home
