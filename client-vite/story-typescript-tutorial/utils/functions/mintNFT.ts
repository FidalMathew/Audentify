import { Address } from 'viem'
import { NFTContractAddress } from '../utils'
import { publicClient, walletClient, account } from '../config'
import { defaultNftContractAbi } from '../abi/defaultNftContractAbi'

export async function mintNFT(to: Address, uri: string): Promise<number | undefined> {
    console.log('Minting a new NFT...')

    const { request } = await publicClient.simulateContract({
        address: NFTContractAddress,
        functionName: 'mintNFT',
        args: [to, uri],
        abi: defaultNftContractAbi,
    })
    const hash = await walletClient.writeContract({ ...request, account: account })
    const { logs } = await publicClient.waitForTransactionReceipt({
        hash,
    })
    if (logs[0].topics[3]) {
        console.log('NFT minted successfully!')
        console.log('Transaction hash:', hash)
        console.log('NFT ID:', parseInt(logs[0].topics[3], 16))
        return parseInt(logs[0].topics[3], 16)
    }
}
