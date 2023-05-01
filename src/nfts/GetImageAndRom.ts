import { NftInfo } from "@/nfts/GetNfts";
import axios from "axios";

export interface GameInfo {
  name: string;
  image: string;
  rom: string;
}
export const getImageAndRom = async (
  nfts: Array<NftInfo>
): Promise<Array<GameInfo>> => {
  const metadata = await Promise.all(
    nfts.map(async (nft) => {
      const response = await axios.get(nft.uri);
      return response.data;
    })
  );

  const gameInfos = metadata.map((meta) => {
    if (!meta.image || !meta.name) {
      return null;
    }
    return {
      name: meta.name,
      image: meta.image,
      rom: meta.properties.files.find(
        (f: { type: string; uri: string }) => f.type === "application/x-gb-rom"
      )?.uri,
    };
  });
  return gameInfos.filter((gameInfo) => {
    return gameInfo !== null && gameInfo.rom;
  }) as Array<GameInfo>;
};
