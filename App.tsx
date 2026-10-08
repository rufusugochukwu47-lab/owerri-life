import { useState } from "react";
import OwerriMap from "./OwerriMap";

type Location = {
  name: string;
  x: number;
  y: number;
  type: string;
};

type EventChoice = {
  label: string;
  money?: number;
  energy?: number;
  happy?: number;
  rep?: number;
  hunger?: number;
  message: string;
};

type CityEvent = {
  title: string;
  description: string;
  choices: EventChoice[];
};
type Mission = {
  title: string;
  description: string;
  from: string;
  to: string;
  reward: number;
  energy: number;
  reputation: number;
};
const missions: Mission[] = [
  {
    title: "📦 Phone Delivery",
    description:
      "A customer bought a phone and needs it delivered across town.",
    from: "Works Layout",
    to: "New Owerri",
    reward: 12000,
    energy: 10,
    reputation: 3,
  },
  {
    title: "🍛 Food Delivery",
    description:
      "A restaurant needs an urgent food delivery.",
    from: "Restaurant Row",
    to: "Ikenegbu",
    reward: 8000,
    energy: 8,
    reputation: 2,
  },
  {
    title: "📄 Office Documents",
    description:
      "Important documents need to reach an office before the end of the day.",
    from: "Banking Zone",
    to: "Works Layout",
    reward: 10000,
    energy: 7,
    reputation: 3,
  },
  {
    title: "🛍️ Market Order",
    description:
      "A customer needs groceries picked up from the market.",
    from: "Main Market",
    to: "World Bank",
    reward: 9000,
    energy: 9,
    reputation: 2,
  },
];
const jobs: [string, number, number][] = [
  ["📱 Gadget Sales Rep", 18000, 28],
  ["🛒 Market Trader", 14000, 22],
  ["💼 Office Assistant", 16000, 25],
  ["🍽️ Restaurant Staff", 13000, 20],
  ["🚕 Transport Driver", 19000, 32],
];

const cityEvents: CityEvent[] = [
  {
    title: "📱 Quick Gadget Deal",
    description:
      "Someone in Owerri wants to buy a phone immediately. You know a seller nearby.",
    choices: [
      {
        label: "🤝 Help with the deal",
        money: 7000,
        rep: 2,
        message: "You connected both sides and earned ₦7,000.",
      },
      {
        label: "🚶 Ignore it",
        message: "You decided to mind your business.",
      },
    ],
  },
  {
    title: "🛒 Market Opportunity",
    description:
      "A trader at the market needs someone to help move goods before closing.",
    choices: [
      {
        label: "💪 Help the trader",
        money: 5000,
        energy: -10,
        rep: 3,
        message: "You helped move the goods and earned ₦5,000.",
      },
      {
        label: "❌ Not today",
        message: "You let someone else handle the work.",
      },
    ],
  },
  {
    title: "👛 Lost Wallet",
    description:
      "You notice a wallet on the ground. Nobody seems to be watching.",
    choices: [
      {
        label: "🤝 Return it",
        rep: 6,
        happy: 5,
        message: "You returned the wallet. Your reputation improved.",
      },
      {
        label: "💰 Keep the cash",
        money: 12000,
        rep: -5,
        happy: -3,
        message: "You kept the money, but people would not be impressed.",
      },
    ],
  },
  {
    title: "🌧️ Sudden Rain",
    description:
      "Heavy rain suddenly starts while you're outside.",
    choices: [
      {
        label: "🏃 Find shelter",
        energy: -3,
        happy: -2,
        message: "You found shelter and waited for the rain to ease.",
      },
      {
        label: "😂 Enjoy the rain",
        happy: 8,
        energy: -5,
        message: "You laughed and enjoyed the unexpected rain.",
      },
    ],
  },
  {
    title: "🍛 Free Meal",
    description:
      "A friend calls you over and offers you a free plate of food.",
    choices: [
      {
        label: "🍛 Accept",
        hunger: 20,
        energy: 10,
        happy: 8,
        message: "Free food! You feel much better.",
      },
      {
        label: "🙏 Decline politely",
        rep: 1,
        message: "You thanked your friend and politely declined.",
      },
    ],
  },
];

const npcs = [
  {
    name: "ugochukwu",
    role: "Gadget Dealer",
    place: "Works Layout",
    message:
      "I know where you can get good phones at a decent price.",
  },
  {
    name: "Amaka",
    role: "Market Trader",
    place: "Main Market",
    message:
      "Business is moving today. You should come and see what I have.",
  },
  {
    name: "Emeka",
    role: "Taxi Driver",
    place: "Motor Park",
    message:
      "Owerri traffic can be crazy, but I know all the shortcuts.",
  },
  {
    name: "Ada",
    role: "Student",
    place: "FUTO / University",
    message:
      "There's always something interesting happening around campus.",
  },
];

export default function App() {
  const [money, setMoney] = useState(50000);
  const [energy, setEnergy] = useState(82);
  const [happy, setHappy] = useState(70);
  const [rep, setRep] = useState(10);
  const [hunger, setHunger] = useState(75);
  const [day, setDay] = useState(1);
  const [place, setPlace] = useState("Ikenegbu");
  const [job, setJob] = useState(0);

  const [log, setLog] = useState([
    "Welcome to Owerri Life. Your story starts today.",
  ]);

  const [activeEvent, setActiveEvent] = useState<CityEvent | null>(
    null
  );

  const [eventNumber, setEventNumber] = useState(0);
  const [activeMission, setActiveMission] =
  useState<Mission | null>(null);

const [missionStarted, setMissionStarted] =
  useState(false);

  const add = (message: string) => {
    setLog((current) => [message, ...current].slice(0, 8));
  };

  const changeStat = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    amount: number,
    min = 0,
    max = 100
  ) => {
    setter((value) => Math.min(max, Math.max(min, value + amount)));
  };

  const travel = (location: Location) => {
    if (location.name === place) {
      add(`You are already in ${location.name}.`);
      return;
    }

    if (energy < 5) {
      add("⚡ You are too tired to travel.");
      return;
    }

    setEnergy((value) => Math.max(0, value - 5));
    setHunger((value) => Math.max(0, value - 3));
    setPlace(location.name);

    add(`🚶 You travelled to ${location.name}.`);

    if (Math.random() < 0.35) {
      const event =
        cityEvents[
          Math.floor(Math.random() * cityEvents.length)
        ];

      setActiveEvent(event);
    }
  };

  const work = () => {
    const selected = jobs[job];

    if (energy < selected[2]) {
      add("⚡ You are too tired to work.");
      return;
    }

    setMoney((value) => value + selected[1]);
    setEnergy((value) => Math.max(0, value - selected[2]));
    setHunger((value) => Math.max(0, value - 12));
    setRep((value) => value + 3);

    add(
      `💼 Worked as ${selected[0]}: +₦${selected[1].toLocaleString()}`
    );
  };

  const eat = () => {
    if (money < 2500) {
      add("💸 Not enough money for food.");
      return;
    }

    setMoney((value) => value - 2500);
    setHunger((value) => Math.min(100, value + 30));
    setEnergy((value) => Math.min(100, value + 15));
    setHappy((value) => Math.min(100, value + 5));

    add("🍛 You ate a good meal.");
  };

  const socialize = () => {
    if (energy < 5) {
      add("⚡ You are too tired.");
      return;
    }

    setEnergy((value) => Math.max(0, value - 5));
    setHappy((value) => Math.min(100, value + 12));
    setRep((value) => value + 1);

    add("🧑🏽‍🤝‍🧑🏽 You linked up with friends.");
  };

  const sleep = () => {
    setDay((value) => value + 1);
    setEnergy(100);
    setHunger((value) => Math.max(0, value - 10));
    setHappy((value) => Math.min(100, value + 5));

    add(`🌅 Good morning! Day ${day + 1} begins.`);

    if (Math.random() < 0.6) {
      const event =
        cityEvents[
          Math.floor(Math.random() * cityEvents.length)
        ];

      setActiveEvent(event);
    }
  };

  const handleEventChoice = (choice: EventChoice) => {
    if (choice.money) {
      setMoney((value) =>
        Math.max(0, value + choice.money!)
      );
    }

    if (choice.energy) {
      changeStat(setEnergy, choice.energy);
    }

    if (choice.happy) {
      changeStat(setHappy, choice.happy);
    }

    if (choice.rep) {
      setRep((value) =>
        Math.max(0, Math.min(100, value + choice.rep!))
      );
    }

    if (choice.hunger) {
      changeStat(setHunger, choice.hunger);
    }

    add(choice.message);
    setActiveEvent(null);
    setEventNumber((value) => value + 1);
  };
const startMission = (mission: Mission) => {
  if (place !== mission.from) {
    add(
      `📍 You need to be at ${mission.from} to start this mission.`
    );
    return;
  }

  if (energy < mission.energy) {
    add("⚡ You don't have enough energy for this mission.");
    return;
  }

  setActiveMission(mission);
  setMissionStarted(true);

  add(`🎯 Mission accepted: ${mission.title}`);
};

const completeMission = () => {
  if (!activeMission) return;

  if (place !== activeMission.to) {
    add(
      `📍 Travel to ${activeMission.to} to complete the mission.`
    );
    return;
  }

  setMoney((value) => value + activeMission.reward);

  setEnergy((value) =>
    Math.max(0, value - activeMission.energy)
  );

  setRep((value) =>
    Math.min(100, value + activeMission.reputation)
  );

  setHunger((value) => Math.max(0, value - 5));

  add(
    `🎉 Mission completed! +₦${activeMission.reward.toLocaleString()}`
  );

  setActiveMission(null);
  setMissionStarted(false);
};
  const talkToNpc = (
    name: string,
    role: string,
    message: string
  ) => {
    add(`💬 ${name} (${role}): "${message}"`);

    if (Math.random() < 0.25) {
      setActiveEvent(
        cityEvents[
          Math.floor(Math.random() * cityEvents.length)
        ]
      );
    }
  };

  const cityActivity = () => {
    switch (place) {
      case "Ikenegbu":
      case "World Bank":
      case "New Owerri":
      case "Nekede":
        if (energy < 10) {
          add("⚡ You need more energy to relax.");
          return;
        }

        setEnergy((value) => Math.min(100, value + 12));
        setHappy((value) => Math.min(100, value + 5));
        add(
          `🏠 You relaxed in ${place}. You feel refreshed.`
        );
        break;

      case "Banking Zone":
        if (money < 5000) {
          add(
            "💸 You don't have enough money for this activity."
          );
          return;
        }

        setMoney((value) => value - 5000);
        setRep((value) => value + 2);

        add(
          "🏦 You handled some financial business at the Banking Zone. -₦5,000"
        );
        break;

      case "Main Market":
        if (money < 3000) {
          add("💸 You need ₦3,000 to shop at the market.");
          return;
        }

        setMoney((value) => value - 3000);
        setHunger((value) => Math.min(100, value + 8));
        setHappy((value) => Math.min(100, value + 4));

        add(
          "🛒 You bought food and supplies at Main Market. -₦3,000"
        );
        break;

      case "Relief Market":
        if (money < 4000) {
          add(
            "💸 You need ₦4,000 to shop at Relief Market."
          );
          return;
        }

        setMoney((value) => value - 4000);
        setRep((value) => value + 1);

        add(
          "🛍️ You picked up some useful items at Relief Market. -₦4,000"
        );
        break;

      case "Owerri Mall":
        if (money < 6000) {
          add("💸 You need ₦6,000 for a mall outing.");
          return;
        }

        setMoney((value) => value - 6000);
        setHappy((value) => Math.min(100, value + 15));
        setRep((value) => value + 1);

        add(
          "🛍️ You enjoyed a shopping day at Owerri Mall. -₦6,000"
        );
        break;

      case "Restaurant Row":
        if (money < 5000) {
          add(
            "💸 You need ₦5,000 for a proper meal."
          );
          return;
        }

        setMoney((value) => value - 5000);
        setHunger((value) => Math.min(100, value + 45));
        setEnergy((value) => Math.min(100, value + 10));
        setHappy((value) => Math.min(100, value + 10));

        add(
          "🍽️ You enjoyed a big meal at Restaurant Row. -₦5,000"
        );
        break;

      case "Nightlife":
        if (energy < 10) {
          add("⚡ You are too tired for nightlife.");
          return;
        }

        if (money < 5000) {
          add("💸 You need ₦5,000 for a night out.");
          return;
        }

        setMoney((value) => value - 5000);
        setEnergy((value) => Math.max(0, value - 10));
        setHappy((value) => Math.min(100, value + 20));
        setRep((value) => value + 2);

        add(
          "🌙 You had a great night out in Owerri. -₦5,000"
        );
        break;

      case "General Hospital":
        if (money < 3000) {
          add("💸 You need ₦3,000 for treatment.");
          return;
        }

        setMoney((value) => value - 3000);
        setEnergy((value) => Math.min(100, value + 30));
        setHunger((value) => Math.max(0, value - 3));

        add(
          "🏥 You received treatment and feel much better. -₦3,000"
        );
        break;

      case "Police Station":
        setRep((value) => Math.min(100, value + 5));
        add(
          "👮 You checked in with the police. Your reputation improved."
        );
        break;

      case "FUTO / University":
        if (energy < 15) {
          add(
            "⚡ You need at least 15 Energy to study."
          );
          return;
        }

        setEnergy((value) => Math.max(0, value - 15));
        setRep((value) => value + 4);
        setHappy((value) => Math.min(100, value + 4));

        add(
          "🎓 You attended a useful class at the university."
        );
        break;

      case "Motor Park":
        if (money < 2000) {
          add("💸 You need ₦2,000 for transport.");
          return;
        }

        setMoney((value) => value - 2000);
        setEnergy((value) => Math.max(0, value - 3));

        add(
          "🚌 You arranged transport around Owerri. -₦2,000"
        );
        break;

      case "Works Layout":
        if (energy < 15) {
          add(
            "⚡ You need more energy for business."
          );
          return;
        }

        setEnergy((value) => Math.max(0, value - 15));
        setRep((value) => value + 4);
        setMoney((value) => value + 5000);

        add(
          "💼 You completed a small business deal in Works Layout. +₦5,000"
        );
        break;

      default:
        add(`📍 You explored ${place}.`);
    }
  };

  const getActivityLabel = () => {
    switch (place) {
      case "Banking Zone":
        return "🏦 Handle Banking";
      case "Main Market":
        return "🛒 Shop at Market";
      case "Relief Market":
        return "🛍️ Shop for Supplies";
      case "Owerri Mall":
        return "🛍️ Go Shopping";
      case "Restaurant Row":
        return "🍽️ Have a Big Meal";
      case "Nightlife":
        return "🌙 Enjoy Nightlife";
      case "General Hospital":
        return "🏥 Get Treatment";
      case "Police Station":
        return "👮 Check In";
      case "FUTO / University":
        return "🎓 Attend Class";
      case "Motor Park":
        return "🚌 Arrange Transport";
      case "Works Layout":
        return "💼 Do Business";
      default:
        return "🏠 Relax Here";
    }
  };

  const nearbyNpcs = npcs.filter(
    (npc) => npc.place === place
  );

  return (
    <div className="app">
      <header>
        <div>
          <small>OWERRI • IMO STATE</small>
          <h1>Owerri Life</h1>
          <p>
            Live the city. Make your choices. Build your story.
          </p>
        </div>

        <div className="day">
          <b>DAY {day}</b>
          <small>{place}</small>
        </div>
      </header>

      <div className="stats">
        <div>
          💰 Money
          <strong>₦{money.toLocaleString()}</strong>
        </div>

        <div>
          ⚡ Energy
          <strong>{energy}%</strong>
        </div>

        <div>
          ❤️ Happiness
          <strong>{happy}%</strong>
        </div>

        <div>
          ⭐ Reputation
          <strong>{rep}</strong>
        </div>

        <div>
          🍛 Hunger
          <strong>{hunger}%</strong>
        </div>

        <div>
          📍 Location
          <strong>{place}</strong>
        </div>
      </div>

      <main>
        <section className="map">
          <h2>🗺️ OWERRI CITY</h2>

          <OwerriMap
            currentPlace={place}
            energy={energy}
            onTravel={travel}
          />
        </section>

        <aside>
          <div className="card">
            <small>CURRENT LOCATION</small>

            <h2>{place}</h2>

            <p>
              Explore the city, work, eat, socialize and build
              your story.
            </p>

            <p>
              🚶 Travel costs <b>5 Energy</b>
            </p>
          </div>
     
          {nearbyNpcs.length > 0 && (
            <div className="card">
              <small>PEOPLE NEARBY</small>

              {nearbyNpcs.map((npc) => (
                <button
                  key={npc.name}
                  onClick={() =>
                    talkToNpc(
                      npc.name,
                      npc.role,
                      npc.message
                    )
                  }
                  style={{
                    width: "100%",
                    marginTop: "8px",
                  }}
                >
                  🧑🏽 {npc.name} — {npc.role}
                </button>
              ))}
            </div>
          )}

          <div className="card">
            <small>CITY ACTIVITY</small>

            <h2>{getActivityLabel()}</h2>

            <p>
              Your surroundings affect what you can do in
              Owerri.
            </p>

            <button
              className="primary"
              onClick={cityActivity}
            >
              {getActivityLabel()}
            </button>
          </div>

          <div className="card">
  <small>YOUR CAREER</small>

  <select
    value={job}
    onChange={(event) =>
      setJob(Number(event.target.value))
    }
  >
    {jobs.map((item, index) => (
      <option key={index} value={index}>
        {item[0]} — ₦{item[1].toLocaleString()}
      </option>
    ))}
  </select>

  <button
    className="primary"
    onClick={work}
  >
    💼 Work a Shift
  </button>
</div>

          <div className="actions">
            <button onClick={eat}>
              🍛 Eat — ₦2,500
            </button>

            <button onClick={socialize}>
              🧑🏽‍🤝‍🧑🏽 Socialize
            </button>

            <button onClick={sleep}>
              🛏️ Sleep / Next Day
            </button>
          </div>

          <div className="card">
            <small>📰 CITY NEWS</small>

            <p>
              🚕 Taxis are moving around Owerri.
            </p>

            <p>
              🧑🏽 People are going about their daily business.
            </p>

            <p>
              🏪 Local businesses are open across the city.
            </p>
          </div>

          <div className="card">
            <small>LIFE LOG</small>

            <ul>
              {log.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      {activeEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "24px",
              width: "100%",
              maxWidth: "430px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <small>
              CITY EVENT #{eventNumber + 1}
            </small>

            <h2>{activeEvent.title}</h2>

            <p>{activeEvent.description}</p>

            {activeEvent.choices.map(
              (choice, index) => (
                <button
                  key={index}
                  className={
                    index === 0
                      ? "primary"
                      : undefined
                  }
                  onClick={() =>
                    handleEventChoice(choice)
                  }
                  style={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                >
                  {choice.label}
                </button>
              )
            )}
          </div>
        </div>
      )}

      <footer>
        Owerri Life • City Life Simulation
      </footer>
    </div>
  );
}
