import { createCommercialRemixTerms, SPGNFTContractAddress } from '../../utils/utils'
import { client, networkInfo } from '../../utils/config'
import { uploadJSONToIPFS } from '../../utils/functions/uploadToIpfs'
import { createHash } from 'crypto'
//@ts-ignore
import { IpMetadata } from '@story-protocol/core-sdk'

export const registerIP = async function (
    title: string,
    description: string,
    createdAt: string,
    creators: { name: string; address: string; contributionPercent: number }[],
    image: string,
    imageHash: string,
    mediaUrl: string,
    mediaHash: string,
    mediaType: string
) {
    // 1. Set up your IP Metadata
    //
    // Docs: https://docs.story.foundation/concepts/ip-asset/ipa-metadata-standard
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
        title: title,
        description: description,
        createdAt: createdAt,

        creators: creators,
        image: image,
        imageHash: imageHash,
        mediaUrl: mediaUrl,
        mediaHash: mediaHash,
        mediaType: mediaType,
    })

    // {
    //     title: 'Midnight Marriage',
    //     description: 'This is a house-style song generated on suno.',
    //     createdAt: '1740005219',
    //     creators: [
    //         {
    //             name: 'Jacob Tucker',
    //             address: '0xA2f9Cf1E40D7b03aB81e34BC50f0A8c67B4e9112',
    //             contributionPercent: 100,
    //         },
    //     ],
    //     image: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
    //     imageHash: '0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc',
    //     mediaUrl: 'https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3',
    //     mediaHash: '0xb52a44f53b2485ba772bd4857a443e1fb942cf5dda73c870e2d2238ecd607aee',
    //     mediaType: 'audio/mpeg',
    // }

    // 2. Set up your NFT Metadata
    //
    // Docs: https://docs.opensea.io/docs/metadata-standards#metadata-structure
    // const nftMetadata = {
    //     name: 'Midnight Marriage',
    //     description: 'This is a house-style song generated on suno. This NFT represents ownership of the IP Asset.',
    //     image: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
    //     animation_url: 'https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3',
    //     attributes: [
    //         {
    //             key: 'Suno Artist',
    //             value: 'amazedneurofunk956',
    //         },
    //         {
    //             key: 'Artist ID',
    //             value: '4123743b-8ba6-4028-a965-75b79a3ad424',
    //         },
    //         {
    //             key: 'Source',
    //             value: 'Suno.com',
    //         },
    //     ],
    // }

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

    // 3. Upload your IP and NFT Metadata to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

    // 4. Register the NFT as an IP Asset
    //
    // Docs: https://docs.story.foundation/sdk-reference/ip-asset#mintandregisterip
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [
            {
                terms: createCommercialRemixTerms({ defaultMintingFee: 1, commercialRevShare: 5 }),
            },
        ],
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
    })
    console.log('Root IPA created:', {
        'Transaction Hash': response.txHash,
        'IPA ID': response.ipId,
        'License Terms IDs': response.licenseTermsIds,
    })
    console.log(`View on the explorer: ${networkInfo.protocolExplorer}/ipa/${response.ipId}`)

    return `${networkInfo.protocolExplorer}/ipa/${response.ipId}`
}
