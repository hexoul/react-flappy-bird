import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useCookies } from "react-cookie";
import * as Phaser from "phaser";

import { Game } from "./scene/Game";

const client = new ApolloClient({
  uri: "https://gateway.kinolights.com/",
  cache: new InMemoryCache(),
});

const query = gql`
  query QueryAllReviews(
    $limit: Int!
    $orderBy: AllReviewsOrderType!
    $orderOption: OrderOptionType!
  ) {
    allReviews(limit: $limit, orderBy: $orderBy, orderOption: $orderOption) {
      id
      createdAt
      movieId
      userId
      reviewTitle
    }
  }
`;

const App = () => {
  const [cookies] = useCookies(["KL_AES"]);
  const game = useRef(null);

  const onGameOver = useCallback(
    (score) => {
      client
        .query({
          query,
          variables: { limit: 2, orderBy: "CREATED_AT", orderOption: "ASC" },
        })
        .then((result) => console.log(result));
      console.log(`ok ${score} ${cookies.KL_AES}`);
    },
    [cookies.KL_AES]
  );

  const fps = 30;
  const phaserConfig = useMemo(
    () => ({
      type: Phaser.AUTO,
      width: 288,
      height: 512,
      parent: "phaser",
      input: { keyboard: true },
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 300 } },
      },
      render: { pixelArt: true },
      fps: { min: fps, target: fps, limit: fps },
      scene: new Game(onGameOver),
    }),
    [onGameOver]
  );

  useEffect(() => {
    game.current = new Phaser.Game(phaserConfig);
  }, [phaserConfig]);

  return <div id="phaser" ref={game} />;
};

export default App;
