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

  const CONTRACT_ADDRESS = "0x16ea3317ecffb089742dd2ad253f9865d74e05c6";//0xC8CbFDaa405A959902e8204474d45646461f96cf";
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
    //during whitelist check for proof
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
    const cost = String(0.1 * mintAmount)
    const totalWeiValue = ethers.utils.parseEther(cost);
    console.log(totalWeiValue)
    PublicMintNft(signer, totalWeiValue)
  }

  const PublicMintNft = async (signer: any, totalWeiValue: any) => {
    console.log("Public Minting...");
    try {
      const tx = await SmartContract.connect(signer).mint(await signer.getAddress(), mintAmount, { value: totalWeiValue })
      toast.promise(tx.wait(), {
        loading: "Minting...",
        success: "Successfully minted !",
        error: "Minting failed. Please verify that contract is not paused"
      })
    } catch (e) {
      console.log(e)
      toast.error("Minting failed. Please verify that contract is not paused")
    }
  };

  return (
    <div className='h-full z-20' style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <Head>
        <title>{"Baby Tsuka - $Dwagon NFT"}</title>
        <meta name="description" content="Baby Tsuka - $Dwagon NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex flex-col justify-center items-center'>
        <Toaster
          toastOptions={{
            className: "text-3xl"
          }}
        />
        <motion.div className='pt-20'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Image alt={"logo"} src={"/images/logo.png"} width="300" height="300" />
        </motion.div>

        <div className='pt-20 text-center w-full bg-cover h-full font-dragon' >
          <div >
            <h1 className='text-white text-4xl sm:text-6xl'>BabyTsuka</h1>

            {totalSupply != "250" ?
              <>
                <p className='text-white text-3xl  mt-4 '>1 BABY TSUKA COSTS  0.1 ETH.</p>
                <p className='text-white text-3xl  mt-4 '>Minted : {totalSupply} / 250</p>
                {/* <a
                  href="https://etherscan.io/address/0x16ea3317ecffb089742dd2ad253f9865d74e05c6" target="_blank" rel="noreferrer"
                  className='text-white   mt-8'>
                  Smart contract address : 0x16ea3317ecffb089742dd2ad253f9865d74e05c6
                </a> */}

                <div className='my-10'>
                  {account === undefined ? (
                    <button className='bg-transparent border border-white rounded-xl text-6xl
                       px-4 pt-3 text-white'
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
                        <span className="text-3xl mx-6  ">{mintAmount}</span>
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
                      px-4 pt-3 hover:scale-125'
                        // onClick={MintNft}
                        >
                        Mint
                      </button>
                    </div>
                  }
                </div>
              </>
              :
              <>
                <p className='text-white text-3xl  pt-4'>Sold out !</p>
                <a className='bg-transparent border border-white rounded-xl text-3xl text-white
                      px-4 pb-1'
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
