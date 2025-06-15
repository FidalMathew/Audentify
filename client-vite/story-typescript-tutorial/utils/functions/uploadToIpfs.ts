import { PinataSDK } from 'pinata'

const pinata = new PinataSDK({
    // @ts-ignore
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    // pinataGateway: 'lavender-intensive-mouse-745.mypinata.cloud',
})

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    // const { cid: IpfsHash } = await pinata.upload.public.json(jsonMetadata)
    return 'bafkreiclg7l4llqugmqbngcompahpll4kwbwvpnycbu5r2fpsrz6z452ky'
}

// could use this to upload music (audio files) to IPFS
// export async function uploadFileToIPFS(filePath: string, fileName: string, fileType: string): Promise<string> {
export async function uploadFileToIPFS(file: File): Promise<string> {
    // const fullPath = path.join(process.cwd(), filePath)
    // const blob = new Blob([fs.readFileSync(fullPath)])
    // const file = new File([blob], fileName, { type: fileType })
    console.log('received')
    console.log('objects file', file)
    const { cid: IpfsHash } = await pinata.upload.public.file(file)
    console.log(IpfsHash, 'file uploaded to IPFS')
    return IpfsHash
}

// export async function uploadFileToIPFS(file: File): Promise<string> {
//     const formData = new FormData()
//     formData.append('file', file) // key MUST be 'file' as per Pinata API

//     const response = await axios.post('https://uploads.pinata.cloud/v3/files', formData, {
//         headers: {
//             Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
//             // DO NOT manually set 'Content-Type' — let Axios handle it
//         },
//     })

//     console.log('File uploaded to IPFS:', response.data.data.cid) // or .IpfsHash depending on Pinata's response
//     return response.data.data.cid // Or .IpfsHash depending on Pinata's response
// }
