import { useEffect, useRef } from "react";
import Phaser from "phaser";

type Location = {
  name: string;
  x: number;
  y: number;
  type: string;
};

type Props = {
  currentPlace: string;
  energy: number;
  onTravel: (location: Location) => void;
};

const locations: Location[] = [
  { name: "Ikenegbu", x: 350, y: 220, type: "Residential" },
  { name: "World Bank", x: 180, y: 360, type: "Residential" },
  { name: "Works Layout", x: 560, y: 260, type: "Business" },
  { name: "Banking Zone", x: 820, y: 380, type: "Business" },
  { name: "Main Market", x: 560, y: 520, type: "Market" },
  { name: "Motor Park", x: 850, y: 650, type: "Transport" },
  { name: "Relief Market", x: 1080, y: 300, type: "Market" },
  { name: "Owerri Mall", x: 1120, y: 520, type: "Entertainment" },
  { name: "New Owerri", x: 900, y: 800, type: "Residential" },
  { name: "Restaurant Row", x: 570, y: 800, type: "Food" },
  { name: "Nightlife", x: 1200, y: 800, type: "Entertainment" },
  { name: "General Hospital", x: 250, y: 650, type: "Health" },
  { name: "Police Station", x: 420, y: 620, type: "Public" },
  { name: "FUTO / University", x: 180, y: 920, type: "Education" },
  { name: "Nekede", x: 100, y: 650, type: "Residential" },
];

class OwerriScene extends Phaser.Scene {
  private props!: Props;
  private player!: Phaser.GameObjects.Container;
  private locationObjects: Phaser.GameObjects.Container[] = [];

  constructor() {
    super("OwerriScene");
  }

  init(props: Props) {
    this.props = props;
  }

  create() {
    const camera = this.cameras.main;

    camera.setBackgroundColor("#9bc78a");

    // City background
    this.add.rectangle(700, 550, 1400, 1100, 0x9bc78a);

    // Small city blocks
    for (let x = 60; x < 1350; x += 120) {
      for (let y = 80; y < 1050; y += 120) {
        const block = this.add.rectangle(
          x,
          y,
          90,
          75,
          0xb9d49f
        );

        block.setStrokeStyle(2, 0x8caf78, 0.8);
      }
    }

    this.createRoads();
    this.createLocations();
    this.createPlayer();

    camera.setBounds(0, 0, 1400, 1100);
    camera.setZoom(0.72);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.downElement?.tagName === "BUTTON") return;
    });
  }

  createRoads() {
    // Major horizontal road
    this.add.rectangle(
      700,
      550,
      1400,
      90,
      0x565c63
    );

    // Major vertical road
    this.add.rectangle(
      700,
      550,
      90,
      1100,
      0x565c63
    );

    // Secondary roads
    this.add.rectangle(
      700,
      270,
      1250,
      35,
      0x70767c
    );

    this.add.rectangle(
      700,
      820,
      1250,
      35,
      0x70767c
    );

    this.add.rectangle(
      320,
      550,
      35,
      950,
      0x70767c
    );

    this.add.rectangle(
      1050,
      550,
      35,
      950,
      0x70767c
    );

    // Road markings
    for (let x = 20; x < 1380; x += 70) {
      this.add.rectangle(
        x,
        550,
        35,
        5,
        0xf3d36b
      );
    }

    for (let y = 20; y < 1080; y += 70) {
      this.add.rectangle(
        700,
        y,
        5,
        35,
        0xf3d36b
      );
    }
  }

  createLocations() {
    locations.forEach((location) => {
      const container = this.add.container(
        location.x,
        location.y
      );

      const shadow = this.add.ellipse(
        0,
        22,
        70,
        20,
        0x000000,
        0.18
      );

      const marker = this.add.circle(
        0,
        0,
        25,
        0x2785bd
      );

      marker.setStrokeStyle(
        4,
        0xffffff
      );

      const label = this.add.text(
        0,
        38,
        location.name,
        {
          fontFamily: "Arial",
          fontSize: "18px",
          color: "#172033",
          backgroundColor: "#ffffff",
          padding: {
            left: 7,
            right: 7,
            top: 4,
            bottom: 4,
          },
        }
      );

      label.setOrigin(0.5);

      container.add([
        shadow,
        marker,
        label,
      ]);

      container.setSize(80, 80);
      container.setInteractive();

      container.on("pointerdown", () => {
        this.props.onTravel(location);
      });

      this.locationObjects.push(container);
    });
  }

  createPlayer() {
    const current = locations.find(
      (location) =>
        location.name === this.props.currentPlace
    );

    const x = current?.x ?? 350;
    const y = current?.y ?? 220;

    this.player = this.add.container(x, y - 55);

    const shadow = this.add.ellipse(
      0,
      25,
      40,
      15,
      0x000000,
      0.25
    );

    const body = this.add.circle(
      0,
      0,
      20,
      0xf97316
    );

    body.setStrokeStyle(
      4,
      0xffffff
    );

    const head = this.add.circle(
      0,
      -28,
      13,
      0xf1c27d
    );

    this.player.add([
      shadow,
      body,
      head,
    ]);

    this.player.setDepth(10);
  }

  movePlayer(place: string) {
    const target = locations.find(
      (location) =>
        location.name === place
    );

    if (!target || !this.player) return;

    this.tweens.add({
      targets: this.player,
      x: target.x,
      y: target.y - 55,
      duration: 500,
      ease: "Power2",
    });

    this.cameras.main.pan(
      target.x,
      target.y,
      500,
      "Power2"
    );
  }
}

export default function OwerriMap({
  currentPlace,
  energy,
  onTravel,
}: Props) {
  const gameRef =
    useRef<HTMLDivElement>(null);

  const gameInstance =
    useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,

      parent: gameRef.current,

      width: 1000,
      height: 650,

      backgroundColor: "#9bc78a",

      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },

      scene: {
        create() {
          // Phaser creates the real scene below.
        },
      },
    });

    game.destroy(true);

    const realGame = new Phaser.Game({
      type: Phaser.AUTO,

      parent: gameRef.current,

      width: 1000,
      height: 650,

      backgroundColor: "#9bc78a",

      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },

      scene: OwerriScene,
    });

    realGame.scene.start(
      "OwerriScene",
      {
        currentPlace,
        energy,
        onTravel,
      }
    );

    gameInstance.current = realGame;

    return () => {
      realGame.destroy(true);
      gameInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const scene =
      gameInstance.current?.scene.getScene(
        "OwerriScene"
      ) as OwerriScene | undefined;

    if (scene) {
      scene.movePlayer(currentPlace);
    }
  }, [currentPlace]);

  return (
    <div
      ref={gameRef}
      className="owerri-phaser-map"
    />
  );
}
