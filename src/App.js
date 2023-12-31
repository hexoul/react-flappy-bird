import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useCookies } from "react-cookie";
import * as Phaser from "phaser";

import { Game } from "./scene/Game";

const mutation = gql`
  mutation AddGameScore($game: Game!, $score: Int!) {
    addGameScore(game: $game, score: $score)
  }
`;

const App = () => {
  const [cookies, setCookie] = useCookies(["KL_AES", "_klid", "fb_sound_effect", "fb_bgm"]);
  const game = useRef(null);

  const onGameStart = useCallback(() => {
    if (!cookies.KL_AES) return;

    axios.post(
      "https://log.kinolights.com/log/activity",
      {
        action: "start",
        target: "game",
        stage: "start-flappybird",
        klid: cookies._klid,
      },
      { headers: { Authorization: `Bearer ${cookies.KL_AES}` } }
    );
  }, [cookies.KL_AES, cookies._klid]);

  const ping = useCallback(() => {
    if (!cookies.KL_AES) return;

    axios.post(
      "https://log.kinolights.com/log/activity",
      {
        action: "ping",
        target: "game",
        stage: "ping-flappybird",
        klid: cookies._klid,
      },
      { headers: { Authorization: `Bearer ${cookies.KL_AES}` } }
    );
  }, [cookies.KL_AES, cookies._klid]);

  const onGameOver = useCallback(
    (score) => {
      if (!cookies.KL_AES) return;

      const client = new ApolloClient({
        uri: "https://gateway.kinolights.com/graphql",
        headers: { Authorization: `Bearer ${cookies.KL_AES}` },
        cache: new InMemoryCache(),
      });

      client.mutate({ mutation, variables: { game: "FLAPPY_BIRD", score } });

      axios.post(
        "https://log.kinolights.com/log/activity",
        {
          action: "end",
          target: "game",
          stage: "end-flappybird",
          klid: cookies._klid,
        },
        { headers: { Authorization: `Bearer ${cookies.KL_AES}` } }
      );
    },
    [cookies.KL_AES, cookies._klid]
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
      scene: new Game(onGameStart, ping, onGameOver, cookies, setCookie),
    }),
    [onGameStart, ping, onGameOver]
  );

  useEffect(() => {
    game.current = new Phaser.Game(phaserConfig);
  }, [phaserConfig]);

  return <div id="phaser" ref={game} />;
};

export default App;
