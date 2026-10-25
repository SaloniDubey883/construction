import { useEffect, useState } from "react";
import { api } from "./api";
import { ErrorBoundary } from "./ui";
import Safety from "./features/Safety";
import Cracks from "./features/Cracks";
import Valuation from "./features/Valuation";
import Planning from "./features/Planning";
import Assistant from "./features/Assistant";
import Weather from "./features/Weather";
import Knowledge from "./features/Knowledge";

// Simple 24px line icons, one per tool, so tabs are recognisable at a glance.
const ICONS = {
  safety: "M5 15a7 7 0 0 1 14 0 M3 15h18 M12 8v4 M5 15v2h14v-2",
  cracks: "M4 4h16v16H4z M13 4l-3 5 4 3-3 4 1 4",
  valuation: "M5 21V5l7-3 7 3v16 M3 21h18 M9 9h2 M13 9h2 M9 13h2 M13 13h2 M10 21v-4h4v4",
  planning: "M3 3v18 M7 6h7 M10 12h9 M7 18h6",
  assistant: "M9 4h6v3H9z M7 5H5v16h14V5h-2 M9 12h6 M9 16h4",
  weather: "M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8.5 3.8 3.8 0 0 1 17 18z",
  knowledge: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 21V5 M9 7h6",
};
const Icon = ({ id }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d={ICONS[id]} />
  </svg>
);

// Brand mark: a structural grid with one column marker highlighted.
const Mark = () => (
  <svg aria-hidden="true" viewBox="0 0 32 32" className="h-9 w-9 shrink-0">
    <g stroke="#fff" strokeWidth="1.5" fill="none"><path d="M10 3v26 M22 3v26 M3 10h26 M3 22h26" /></g>
    <circle cx="10" cy="10" r="4.5" fill="#ffc21a" stroke="#0b1f4a" strokeWidth="1.5" />
  </svg>
);

const FEATURES = [
  { id: "safety", name: "Site safety", about: "AI reviews a site photo for PPE and visible hazards. Not a certified inspection.", C: Safety },
  { id: "cracks", name: "Crack analysis", about: "AI describes a crack photo, possible causes and next steps. Not a structural diagnosis.", C: Cracks },
  { id: "valuation", name: "Property valuation", about: "An indicative, AI-generated value range, rent and return. Not verified market data.", C: Valuation },
  { id: "planning", name: "Project planning", about: "A computed timeline plus approximate AI-estimated materials and costs.", C: Planning },
  { id: "assistant", name: "Daily site assistant", about: "Ask site questions or turn today's activities into a daily plan.", C: Assistant },
  { id: "weather", name: "Weather advisory", about: "Live forecast or your own conditions, with GO / CAUTION / NO-GO guidance.", C: Weather },
  { id: "knowledge", name: "Knowledge assistant", about: "Materials, methods and terminology explained.", C: Knowledge },
];

export default function App() {
  const [active, setActive] = useState("safety");
  const [health, setHealth] = useState(null);
  useEffect(() => {
    api("/api/health").then((r) => setHealth(r.data.ai)).catch((e) => setHealth({ error: e.message }));
  }, []);
  const f = FEATURES.find((x) => x.id === active);
  const dot = !health ? "bg-white/50" : health.error ? "bg-red-400" : "bg-emerald-400";

  return (
    <div className="min-h-screen">
      <header className="blueprint on-print text-white">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-5">
            <div className="flex items-center gap-3">
              <Mark />
              <h1 className="text-xl leading-tight sm:text-2xl">Construction Intelligence</h1>
            </div>
            <div role="status" className="flex max-w-md items-start gap-2 rounded-sm border border-white/25 bg-print/80 px-3 py-1.5 text-sm text-blue-100">
              <span aria-hidden="true" className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
              <span>{!health ? "Checking backend…" : health.error ? health.error : health.detail}</span>
            </div>
          </div>
          <nav aria-label="Features" className="-mb-px flex gap-0.5 overflow-x-auto">
            {FEATURES.map((x) => (
              <button key={x.id} onClick={() => setActive(x.id)} aria-current={x.id === active ? "page" : undefined}
                className="tab flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[15px] font-medium">
                <Icon id={x.id} />{x.name}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4 pt-8 sm:px-8 sm:pb-12">
        <div className="space-y-6">
          <header>
            <h2 className="text-2xl text-navy sm:text-3xl">{f.name}</h2>
            <p className="mt-1 max-w-prose text-mute">{f.about}</p>
          </header>
          <ErrorBoundary key={f.id}><f.C /></ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
