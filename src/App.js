import { useEffect, useMemo, useRef } from "react";
import * as Phaser from "phaser";

import { Game } from "./scene/Game";

const App = () => {
  const game = useRef(null);

  const fps = 120;
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
