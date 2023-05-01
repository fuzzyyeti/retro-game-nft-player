import styles from "@/styles/Top.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { NftInfo, useGetNfts } from "@/nfts/GetNfts";
import { GameInfo, getImageAndRom } from "@/nfts/GetImageAndRom";
import GameCard from "@/components/GameCard";
import Emulator from "@/components/Emulator";

declare global {
  interface Window {
    rom: string;
    go: () => Promise<void>;
  }
}
export const Top = () => {
  const [rom, setRom] = useState<string | null>(null);
  const [romKey, setRomKey] = useState(0);
  const { wallet } = useWallet();
  const { nfts } = useGetNfts();
  const [games, setGames] = useState<GameInfo[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  const populateGames = useCallback(async () => {
    console.log("nfts", nfts);
    if (nfts.length === 0) return;
    const games = await getImageAndRom(
      nfts.filter(
        (nft) => nft.creator === process.env.NEXT_PUBLIC_CREATOR_ADDRESS!
      )
    );
    setGames(games);
  }, [nfts, setGames]);
  useEffect(() => {
    console.log("wallet", wallet?.adapter.publicKey?.toBase58());
    if (wallet && wallet.adapter.publicKey) {
      populateGames();
    }
  }, [wallet?.adapter.publicKey, populateGames]);

  return (
    <>
      <Emulator
        rom={rom}
        romKey={romKey}
        showDialog={showDialog}
        onDismiss={() => {
          console.log("dismissing");
          setShowDialog(false);
        }}
      />
      <div className={styles.gridWrapper}>
        <h1
          style={{
            fontFamily: "'Press Start 2P', cursive",
            margin: "auto",
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          My Retro-style Games
        </h1>
        <div className={styles.grid}>
          {games.length > 0 &&
            games.map((game, index) => {
              return (
                <div key={index} className={styles.gridItem}>
                  {" "}
                  <GameCard
                    onClick={() => {
                      setRomKey((prevCount) => prevCount + 1);
                      setRom(games[index].rom);
                      setShowDialog(true);
                    }}
                    key={index}
                    game={game}
                  />
                </div>
              );
            })}
        </div>
        {games.length === 0 && (
          <>
            <p
              style={{
                fontFamily: "'Press Start 2P', cursive",
                margin: "auto",
                marginTop: "100px",
                textAlign: "center",
              }}
            >
              It looks like you don&apos;t have any games yet.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  margin: "auto",
                  marginTop: "100px",
                  textAlign: "center",
                }}
              >
                Go to Exchange.art to find games!
              </p>
              <button
                style={{
                  margin: "100px",
                  width: "200px",
                  height: "50px",
                  cursor: "pointer",
                }}
                onClick={() => window.open("https://exchange.art/shanksy/nfts")}
              >
                Exchange.art
              </button>
            </div>{" "}
          </>
        )}
      </div>
    </>
  );
};

//default export Top
export default Top;
