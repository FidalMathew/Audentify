import { client } from './config'
import { uploadJSONToIPFS } from './functions/uploadToIpfs'
import { createHash } from 'crypto'
//@ts-ignore
import { IpMetadata } from '@story-protocol/core-sdk'
import { toHex } from 'viem'

export type IpMetadataResponse = {
    ipMetadataURI: string
    ipMetadataHash: string
    nftMetadataURI: string
    nftMetadataHash: string
}

export const createIpMetadata = async (
    title: string,
    description: string,
    createdAt: string,
    creators: { name: string; address: string; contributionPercent: number }[],
    image: string,
    imageHash: string,
    mediaUrl: string,
    mediaHash: string,
    mediaType: string
) => {
    const ipMetadataJson = {
        title,
        description,
        createdAt,
        creators,
        image,
        imageHash,
        mediaUrl,
        mediaHash,
        mediaType,
    }

    const nftMetadata = {
        name: title,
        description: description,
        image: image,
        animation_url: mediaUrl,
        attributes: creators.map((creator) => ({
            key: creator.name,
            value: creator.address,
        })),
    }

    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata(ipMetadataJson)

    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = `0x${createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')}`
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = `0x${createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')}`

    return {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: ipHash,
        nftMetadataHash: nftHash,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
    }
}
