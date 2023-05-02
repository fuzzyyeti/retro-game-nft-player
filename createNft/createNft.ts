import {keypairIdentity, Metaplex} from "@metaplex-foundation/js";
import {Connection, clusterApiUrl, Keypair, PublicKey} from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();

const connection = new Connection(process.env.NEXT_PUBLIC_RPC!)
const wallet = Keypair.fromSecretKey(Uint8Array.from(Uint8Array.from(JSON.parse(process.env.MINT_KEY!))));
const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))

const mintAddress = Keypair.generate();
export const createNft = async () => {
    const result = await metaplex.nfts().create({
        useNewMint: mintAddress,
        name: "Devnet A Day at the Lake",
        symbol: "FYGB",
        uri: "https://arweave.net/vbHIpyeNZafkVDfOal2OQJvhKgieKovP12qGzWbUlM0",
        sellerFeeBasisPoints: 100,
        creators: [
            {
                address: wallet.publicKey,
                share: 100,
            }]
    }, {commitment: "finalized"});
    console.log(result);
}
createNft();


