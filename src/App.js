import { useEffect, useMemo, useRef } from "react";
import * as Phaser from "phaser";

import { Game } from "./Game";

const App = () => {
  const game = useRef(null);

  const phaserConfig = useMemo(
    () => ({
      type: Phaser.WEBGL,
      width: 960,
      height: 720,
      backgroundColor: "#25304A",
      parent: "phaser",
      scene: Game,
    }),
    []
  );

  useEffect(() => {
    game.current = new Phaser.Game(phaserConfig);
  }, [phaserConfig]);

  return <div id="phaser" ref={game} />;
};

export default App;
