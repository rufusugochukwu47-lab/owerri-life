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

  constructor() {
    super("OwerriScene");
  }

  init(props: Props) {
    this.props = props;
  }

  create() {
    this.cameras.main.setBackgroundColor("#8fc27d");

    // Ground
    this.add.rectangle(
      700,
      550,
      1400,
      1100,
      0x8fc27d
    );

    this.createDistricts();
    this.createRoads();
    this.createBuildings();
    this.createTrees();
    this.createLandmarks();
    this.createLocations();
    this.createPlayer();

    this.cameras.main.setBounds(
      0,
      0,
      1400,
      1100
    );

    this.cameras.main.setZoom(0.72);
  }

  createDistricts() {
    const districts = [
      {
        x: 220,
        y: 190,
        w: 350,
        h: 250,
        color: 0xa8cf91,
      },
      {
        x: 760,
        y: 180,
        w: 420,
        h: 260,
        color: 0xb4d59b,
      },
      {
        x: 220,
        y: 720,
        w: 400,
        h: 300,
        color: 0xa3ca8b,
      },
      {
        x: 900,
        y: 760,
        w: 480,
        h: 300,
        color: 0xb0d398,
      },
    ];

    districts.forEach((district) => {
      const area = this.add.rectangle(
        district.x,
        district.y,
        district.w,
        district.h,
        district.color
      );

      area.setStrokeStyle(
        2,
        0x7fa96e,
        0.45
      );
    });
  }

  createRoads() {
    // Main east-west road
    this.add.rectangle(
      700,
      550,
      1400,
      86,
      0x4f555b
    );

    // Main north-south road
    this.add.rectangle(
      700,
      550,
      86,
      1100,
      0x4f555b
    );

    // Secondary roads
    const roads = [
      [700, 270, 1300, 34],
      [700, 820, 1300, 34],
      [320, 550, 34, 1000],
      [1050, 550, 34, 1000],
      [350, 400, 520, 28],
      [900, 400, 420, 28],
      [430, 700, 650, 28],
      [850, 700, 500, 28],
    ];

    roads.forEach(([x, y, width, height]) => {
      this.add.rectangle(
        x,
        y,
        width,
        height,
        0x6b7075
      );
    });

    // Road centre markings
    for (let x = 20; x < 1380; x += 70) {
      this.add.rectangle(
        x,
        550,
        34,
        5,
        0xf2d15b
      );
    }

    for (let y = 20; y < 1080; y += 70) {
      this.add.rectangle(
        700,
        y,
        5,
        34,
        0xf2d15b
      );
    }

    // Smaller lane markings
    for (let x = 30; x < 1370; x += 80) {
      this.add.rectangle(
        x,
        270,
        32,
        3,
        0xd8dde0
      );

      this.add.rectangle(
        x,
        820,
        32,
        3,
        0xd8dde0
      );
    }
  }

  createBuildings() {
    const buildings = [
      [120, 160, 75, 55],
      [230, 150, 80, 60],
      [430, 150, 70, 55],
      [530, 180, 90, 60],

      [850, 150, 80, 60],
      [970, 150, 75, 55],
      [1100, 180, 90, 65],
      [1220, 150, 70, 55],

      [100, 470, 75, 55],
      [210, 470, 80, 60],
      [430, 450, 75, 55],
      [520, 450, 80, 60],

      [850, 470, 80, 55],
      [960, 470, 75, 60],
      [1140, 450, 90, 60],
      [1250, 470, 75, 55],

      [100, 780, 75, 55],
      [240, 800, 85, 60],
      [430, 850, 75, 55],

      [760, 900, 80, 60],
      [900, 900, 90, 60],
      [1050, 900, 80, 55],
      [1220, 920, 90, 60],
    ];

    buildings.forEach(([x, y, width, height]) => {
      const building = this.add.rectangle(
        x,
        y,
        width,
        height,
        0xd9c7a5
      );

      building.setStrokeStyle(
        3,
        0x927d62
      );

      this.add.rectangle(
        x,
        y - height * 0.15,
        width * 0.72,
        7,
        0x8d6f55
      );
    });
  }

  createTrees() {
    const trees = [
      [80, 90],
      [160, 110],
      [330, 120],
      [620, 130],
      [760, 100],
      [1180, 110],
      [1300, 180],
      [80, 420],
      [1300, 430],
      [80, 760],
      [650, 930],
      [720, 980],
      [1320, 930],
      [300, 1000],
    ];

    trees.forEach(([x, y]) => {
      const shadow = this.add.ellipse(
        x,
        y + 12,
        35,
        12,
        0x000000,
        0.15
      );

      const trunk = this.add.rectangle(
        x,
        y + 4,
        8,
        22,
        0x765334
      );

      const leaves = this.add.circle(
        x,
        y - 8,
        18,
        0x367a45
      );

      shadow.setDepth(1);
      trunk.setDepth(2);
      leaves.setDepth(3);
    });
  }

  createLandmarks() {
    const landmarks = [
      {
        name: "HOSPITAL",
        x: 250,
        y: 700,
        color: 0xe85b5b,
      },
      {
        name: "POLICE",
        x: 420,
        y: 680,
        color: 0x4169a1,
      },
      {
        name: "MALL",
        x: 1120,
        y: 560,
        color: 0xa45cc5,
      },
      {
        name: "MARKET",
        x: 560,
        y: 560,
        color: 0xd99b32,
      },
      {
        name: "PARK",
        x: 760,
        y: 760,
        color: 0x4d9a58,
      },
    ];

    landmarks.forEach((landmark) => {
      this.add.rectangle(
        landmark.x,
        landmark.y,
        58,
        45,
        landmark.color
      ).setStrokeStyle(
        3,
        0xffffff
      );

      this.add.text(
        landmark.x,
        landmark.y,
        landmark.name,
        {
          fontFamily: "Arial",
          fontSize: "9px",
          color: "#ffffff",
          fontStyle: "bold",
        }
      ).setOrigin(0.5);
    });
  }

  createLocations() {
    locations.forEach((location) => {
      const container = this.add.container(
        location.x,
        location.y
      );

      const shadow = this.add.ellipse(
        0,
        23,
        72,
        20,
        0x000000,
        0.2
      );

      const marker = this.add.circle(
        0,
        0,
        27,
        this.getLocationColor(
          location.type
        )
      );

      marker.setStrokeStyle(
        4,
        0xffffff
      );

      const label = this.add.text(
        0,
        40,
        location.name,
        {
          fontFamily: "Arial",
          fontSize: "17px",
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

      container.setSize(90, 90);
      container.setInteractive({
        useHandCursor: true,
      });

      container.on("pointerover", () => {
        marker.setScale(1.15);
      });

      container.on("pointerout", () => {
        marker.setScale(1);
      });

      container.on("pointerdown", () => {
        this.props.onTravel(location);
      });
    });
  }

  getLocationColor(type: string) {
    switch (type) {
      case "Residential":
        return 0x3b82c4;
      case "Business":
        return 0x7c5ac7;
      case "Market":
        return 0xd8922f;
      case "Transport":
        return 0x59636f;
      case "Entertainment":
        return 0xd94f88;
      case "Food":
        return 0xe76f35;
      case "Health":
        return 0xe05252;
      case "Public":
        return 0x3f6ea8;
      case "Education":
        return 0x3d9b69;
      default:
        return 0x2785bd;
    }
  }

  createPlayer() {
    const current = locations.find(
      (location) =>
        location.name === this.props.currentPlace
    );

    const x = current?.x ?? 350;
    const y = current?.y ?? 220;

    this.player = this.add.container(
      x,
      y - 55
    );

    const shadow = this.add.ellipse(
      0,
      27,
      45,
      16,
      0x000000,
      0.25
    );

    const body = this.add.circle(
      0,
      0,
      21,
      0xf97316
    );

    body.setStrokeStyle(
      4,
      0xffffff
    );

    const head = this.add.circle(
      0,
      -29,
      14,
      0xf1c27d
    );

    this.player.add([
      shadow,
      body,
      head,
    ]);

    this.player.setDepth(20);

    this.add.text(
      0,
      -58,
      "YOU",
      {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#111827",
        padding: {
          left: 5,
          right: 5,
          top: 3,
          bottom: 3,
        },
      }
    )
      .setOrigin(0.5)
      .setDepth(21);
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
      duration: 650,
      ease: "Power2",
    });

    this.cameras.main.pan(
      target.x,
      target.y,
      650,
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

    const realGame = new Phaser.Game({
      type: Phaser.AUTO,

      parent: gameRef.current,

      width: 1000,
      height: 650,

      backgroundColor: "#8fc27d",

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
