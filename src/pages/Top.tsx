import styles from "@/styles/Top.module.css";
import {  useState } from "react";
import { useGetNfts } from "@/nfts/GetNfts";
import GameCard from "@/components/GameCard";
import Emulator from "@/components/Emulator";

declare global {
  interface Window {
    rom: string;
    go: () => Promise<void>;
  }
}
const creatorAddresses = process.env.NEXT_PUBLIC_CREATOR_ADDRESSES!.split(",");
console.log("creatorAddresses", creatorAddresses);

export const Top = () => {
  const [rom, setRom] = useState<string | null>(null);
  const [romKey, setRomKey] = useState(0);
  const { nfts: games} = useGetNfts();
  const [showDialog, setShowDialog] = useState(false);

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
          {games.length > 0 &&
              <div className={styles.grid}>
                  {games.map((game, index) => {
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
              }
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
