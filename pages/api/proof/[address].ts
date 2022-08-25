// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    proof: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const wallet = req.query.address
    const resp = await fetch(
        `https://opensea.mypinata.cloud/ipfs/QmQrmnNeGN2tjRoJvsBBTLp335TBgCWXf3tg7RojUbyXkz/${wallet}.json`
    )
    const proof = await resp.json()
    res.status(200).json({ proof: proof.proof })
}
