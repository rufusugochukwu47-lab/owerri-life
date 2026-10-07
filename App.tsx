import { useState } from "react";

type Place = {
  name: string;
  x: number;
  y: number;
  type: string;
};

type Job = {
  name: string;
  pay: number;
  energy: number;
};

const places: Place[] = [
  { name: "Ikenegbu", x: 120, y: 80, type: "Residential" },
  { name: "World Bank", x: 70, y: 170, type: "Residential" },
  { name: "Works Layout", x: 260, y: 130, type: "Business" },
  { name: "Banking Zone", x: 410, y: 210, type: "Business" },
  { name: "Main Market", x: 270, y: 270, type: "Market" },
  { name: "Motor Park", x: 430, y: 330, type: "Transport" },
  { name: "Relief Market", x: 570, y: 160, type: "Market" },
  { name: "Owerri Mall", x: 620, y: 280, type: "Entertainment" },
  { name: "New Owerri", x: 500, y: 410, type: "Residential" },
  { name: "Restaurant Row", x: 300, y: 430, type: "Food" },
  { name: "Nightlife", x: 680, y: 420, type: "Entertainment" },
  { name: "General Hospital", x: 110, y: 360, type: "Health" },
  { name: "Police Station", x: 200, y: 330, type: "Public" },
  { name: "FUTO / University", x: 55, y: 500, type: "Education" },
  { name: "Nekede", x: 45, y: 330, type: "Residential" },
];

const jobs: Job[] = [
  { name: "Gadget Sales Rep", pay: 18000, energy: 28 },
  { name: "Market Trader", pay: 14000, energy: 22 },
  { name: "Office Assistant", pay: 16000, energy: 25 },
  { name: "Restaurant Staff", pay: 13000, energy: 20 },
  { name: "Transport Driver", pay: 19000, energy: 32 },
];

const randomEvents = [
  "You met someone interesting while moving around Owerri.",
  "A friend invited you out for drinks.",
  "You found a small business opportunity.",
  "Traffic slowed you down today.",
  "Someone recommended you for a better opportunity.",
  "You bumped into an old friend.",
];

export default function App() {
  const [money, setMoney] = useState(50000);
  const [energy, setEnergy] = useState(82);
  const [happiness, setHappiness] = useState(70);
  const [reputation, setReputation] = useState(10);
  const [hunger, setHunger] = useState(75);
  const [day, setDay] = useState(1);
  const [place, setPlace] = useState("Ikenegbu");
  const [job, setJob] = useState(0);

  const [log, setLog] = useState<string[]>([
    "Welcome to Owerri Life. Your story starts today.",
  ]);

  const addLog = (message: string) => {
    setLog((current) => [message, ...current].slice(0, 7));
  };

  const travel = (destination: Place) => {
    if (destination.name === place) {
      addLog(`You are already in ${destination.name}.`);
      return;
    }

    if (energy < 5) {
      addLog("You are too tired to travel.");
      return;
    }

    setEnergy((value) => Math.max(0, value - 5));
    setHunger((value) => Math.max(0, value - 3));
    setPlace(destination.name);

    addLog(`🚶 You travelled to ${destination.name}.`);
  };

  const work = () => {
    const selectedJob = jobs[job];

    if (energy < selectedJob.energy) {
      addLog("⚠️ You are too tired to work this shift.");
      return;
    }

    setMoney((value) => value + selectedJob.pay);
    setEnergy((value) => Math.max(0, value - selectedJob.energy));
    setHunger((value) => Math.max(0, value - 12));
    setReputation((value) => value + 3);

    addLog(
      `💼 Worked as ${selectedJob.name}: +₦${selectedJob.pay.toLocaleString()}`
    );
  };

  const eat = () => {
    if (money < 2500) {
      addLog("💸 You don't have enough money for food.");
      return;
    }

    setMoney((value) => value - 2500);
    setEnergy((value) => Math.min(100, value + 15));
    setHunger((value) => Math.min(100, value + 30));
    setHappiness((value) => Math.min(100, value + 5));

    addLog("🍛 You ate a good meal.");
  };

  const socialize = () => {
    if (energy < 5) {
      addLog("You are too tired to socialize.");
      return;
    }

    setEnergy((value) => Math.max(0, value - 5));
    setHappiness((value) => Math.min(100, value + 12));
    setReputation((value) => value + 1);

    addLog("🧑🏽‍🤝‍🧑🏽 You linked up with friends.");
  };

  const activity = () => {
    const event =
      randomEvents[Math.floor(Math.random() * randomEvents.length)];

    setHappiness((value) => Math.min(100, value + 4));
    setReputation((value) => value + 1);

    addLog(`🎲 ${event}`);
  };

  const sleep = () => {
    const nextDay = day + 1;

    setDay(nextDay);
    setEnergy(100);
    setHunger((value) => Math.max(0, value - 10));
    setHappiness((value) => Math.min(100, value + 5));

    addLog(`🌅 Good morning! Day ${nextDay} begins.`);
  };

  const currentPlace = places.find((item) => item.name === place);

  return (
    <div className="app">
      <header>
        <div>
          <small>OWERRI • IMO STATE</small>
          <h1>Owerri Life</h1>
          <p>Live the city. Make your choices. Build your story.</p>
        </div>

        <div>
          <b>DAY {day}</b>
          <br />
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
          <strong>{happiness}%</strong>
        </div>

        <div>
          ⭐ Reputation
          <strong>{reputation}</strong>
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

          <div className="maparea">
            <div className="road road-one" />
            <div className="road road-two" />

            {places.map((item) => (
              <button
                key={item.name}
                style={{
                  left: item.x,
                  top: item.y,
                  background:
                    item.name === place ? "#f97316" : "#2785bd",
                }}
                onClick={() => travel(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </section>

        <aside>
          <div className="card">
            <small>CURRENT LOCATION</small>

            <h2>{place}</h2>

            <p>
              {currentPlace?.type} area. Explore, work, eat, socialize and
              build your life.
            </p>

            <p>
              <b>Travel:</b> -5 Energy
            </p>
          </div>

          <div className="card">
            <small>YOUR CAREER</small>

            <select
              value={job}
              onChange={(event) => setJob(Number(event.target.value))}
            >
              {jobs.map((item, index) => (
                <option key={item.name} value={index}>
                  {item.name} — ₦{item.pay.toLocaleString()}
                </option>
              ))}
            </select>

            <button className="primary" onClick={work}>
              💼 Work a Shift
            </button>
          </div>

          <div className="actions">
            <button onClick={eat}>🍛 Eat — ₦2,500</button>

            <button onClick={socialize}>
              🧑🏽‍🤝‍🧑🏽 Socialize
            </button>

            <button onClick={activity}>
              🎲 Do Something
            </button>

            <button onClick={sleep}>
              🛏️ Sleep / Next Day
            </button>
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

      <footer>
        Owerri Life • A Nigerian city life simulation
      </footer>
    </div>
  );
}
