import { useState } from "react";
import OwerriMap from "./OwerriMap";

type Location = {
  name: string;
  x: number;
  y: number;
  type: string;
};

const jobs: [string, number, number][] = [
  ["📱 Gadget Sales Rep", 18000, 28],
  ["🛒 Market Trader", 14000, 22],
  ["💼 Office Assistant", 16000, 25],
  ["🍽️ Restaurant Staff", 13000, 20],
  ["🚕 Transport Driver", 19000, 32],
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

  const add = (message: string) => {
    setLog((current) => [
      message,
      ...current,
    ].slice(0, 6));
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

    setEnergy((value) =>
      Math.max(0, value - 5)
    );

    setHunger((value) =>
      Math.max(0, value - 3)
    );

    setPlace(location.name);

    add(
      `🚶 You travelled to ${location.name}.`
    );
  };

  const work = () => {
    const selected = jobs[job];

    if (energy < selected[2]) {
      add("⚡ You are too tired to work.");
      return;
    }

    setMoney(
      (value) => value + selected[1]
    );

    setEnergy(
      (value) =>
        Math.max(0, value - selected[2])
    );

    setHunger(
      (value) =>
        Math.max(0, value - 12)
    );

    setRep(
      (value) => value + 3
    );

    add(
      `💼 Worked as ${selected[0]}: +₦${selected[1].toLocaleString()}`
    );
  };

  const eat = () => {
    if (money < 2500) {
      add("💸 Not enough money for food.");
      return;
    }

    setMoney(
      (value) => value - 2500
    );

    setHunger(
      (value) =>
        Math.min(100, value + 30)
    );

    setEnergy(
      (value) =>
        Math.min(100, value + 15)
    );

    setHappy(
      (value) =>
        Math.min(100, value + 5)
    );

    add("🍛 You ate a good meal.");
  };

  const socialize = () => {
    if (energy < 5) {
      add("⚡ You are too tired.");
      return;
    }

    setEnergy(
      (value) =>
        Math.max(0, value - 5)
    );

    setHappy(
      (value) =>
        Math.min(100, value + 12)
    );

    setRep(
      (value) => value + 1
    );

    add(
      "🧑🏽‍🤝‍🧑🏽 You linked up with friends."
    );
  };

  const sleep = () => {
    setDay(
      (value) => value + 1
    );

    setEnergy(100);

    setHunger(
      (value) =>
        Math.max(0, value - 10)
    );

    setHappy(
      (value) =>
        Math.min(100, value + 5)
    );

    add(
      `🌅 Good morning! Day ${
        day + 1
      } begins.`
    );
  };

  return (
    <div className="app">

      <header>
        <div>
          <small>
            OWERRI • IMO STATE
          </small>

          <h1>
            Owerri Life
          </h1>

          <p>
            Live the city. Make your
            choices. Build your story.
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
          <strong>
            ₦{money.toLocaleString()}
          </strong>
        </div>

        <div>
          ⚡ Energy
          <strong>
            {energy}%
          </strong>
        </div>

        <div>
          ❤️ Happiness
          <strong>
            {happy}%
          </strong>
        </div>

        <div>
          ⭐ Reputation
          <strong>
            {rep}
          </strong>
        </div>

        <div>
          🍛 Hunger
          <strong>
            {hunger}%
          </strong>
        </div>

        <div>
          📍 Location
          <strong>
            {place}
          </strong>
        </div>

      </div>

      <main>

        <section className="map">

          <h2>
            🗺️ OWERRI CITY
          </h2>

          <OwerriMap
            currentPlace={place}
            energy={energy}
            onTravel={travel}
          />

        </section>

        <aside>

          <div className="card">

            <small>
              CURRENT LOCATION
            </small>

            <h2>
              {place}
            </h2>

            <p>
              Explore the city,
              work, eat, socialize
              and build your story.
            </p>

            <p>
              🚶 Travel costs
              <b> 5 Energy</b>
            </p>

          </div>

          <div className="card">

            <small>
              YOUR CAREER
            </small>

            <select
              value={job}
              onChange={(event) =>
                setJob(
                  Number(
                    event.target.value
                  )
                )
              }
            >
              {jobs.map(
                (item, index) => (
                  <option
                    key={index}
                    value={index}
                  >
                    {item[0]} — ₦
                    {item[1].toLocaleString()}
                  </option>
                )
              )}
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

            <button
              onClick={socialize}
            >
              🧑🏽‍🤝‍🧑🏽 Socialize
            </button>

            <button onClick={sleep}>
              🛏️ Sleep / Next Day
            </button>

          </div>

          <div className="card">

            <small>
              LIFE LOG
            </small>

            <ul>
              {log.map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}
            </ul>

          </div>

        </aside>

      </main>

      <footer>
        Owerri Life • City Life Simulation
      </footer>

    </div>
  );
}
