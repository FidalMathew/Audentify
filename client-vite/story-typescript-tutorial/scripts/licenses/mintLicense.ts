import { Address } from 'viem'
import { client } from '../../utils/config'

// TODO: Replace with your own IP ID and license terms id

export const mintLicenseToken = async function (
    IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5',
    LICENSE_TERMS_ID: string = '1'
) {
    // 1. Mint License Tokens
    //
    // Docs: https://docs.story.foundation/sdk-reference/license#mintlicensetokens
    const response = await client.license.mintLicenseTokens({
        licenseTermsId: LICENSE_TERMS_ID,
        licensorIpId: IP_ID,
        amount: 1,
        maxMintingFee: BigInt(0), // disabled
        maxRevenueShare: 100, // default
        txOptions: { waitForTransaction: true },
    })

    console.log('License minted:', {
        'Transaction Hash': response.txHash,
        'License Token IDs': response.licenseTokenIds,
    })
}
