import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useCookies } from "react-cookie";
import * as Phaser from "phaser";

import { Game } from "./scene/Game";

const query = gql`
  query QueryExistUnreadNotification {
    existUnreadNotification
  }
`;

const mutation = gql`
  mutation AddGameScore($game: Game!, $score: Int!) {
    addGameScore(game: $game, score: $score)
  }
`;

const App = () => {
  const [cookies] = useCookies(["KL_AES"]);
  const game = useRef(null);

  const onGameOver = useCallback(
    (score) => {
      const client = new ApolloClient({
        uri: "https://gateway.kinolights.com/graphql",
        headers: { Authorization: `Bearer ${cookies.KL_AES}` },
        cache: new InMemoryCache(),
      });

      // client.mutate({ mutation, variables: { game: '', score } });
      client.query({ query }).then((result) => console.log(result));
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
