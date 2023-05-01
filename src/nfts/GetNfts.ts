import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { NodeInfo } from "detect-browser";
import { useEffect, useRef, useState } from "react";

export interface NftInfo {
  creator: string;
  uri: string;
}

export const useGetNfts = () => {
  const { wallet, connected } = useWallet();
  const { connection } = useConnection();
  const nftsRetrieved = useRef(false);
  const [nfts, setNfts] = useState<Array<NftInfo>>([]);

  useEffect(() => {
    if (!connected) return;
    getNfts();
  }, [connected]);
  const getNfts = async (): Promise<void> => {
    if (!wallet?.adapter?.publicKey || !connection || nftsRetrieved.current)
      return;
    console.log("Getting nfts again");
    nftsRetrieved.current = true;
    const nftAccounts = await getParsedNftAccountsByOwner({
      publicAddress: wallet.adapter.publicKey.toBase58(),
      connection,
    });
    const nftInfos = nftAccounts
      .map((nftAccount) => {
        if (
          !nftAccount.data?.creators ||
          !nftAccount.data.creators[0] ||
          !nftAccount.data.uri
        ) {
          return null;
        }
        return {
          creator: nftAccount.data.creators[0].address as string,
          uri: nftAccount.data.uri,
        };
      })
      .filter((nftInfo) => nftInfo !== null) as Array<NftInfo>;
    console.log("setting nfts");
    setNfts(nftInfos);
  };
  return { nfts };
};
