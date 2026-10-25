import { Component, useState } from "react";
import { api } from "./api";

export const arr = (x) => (Array.isArray(x) ? x : []);
export const text = (x) => (x === null || x === undefined ? "" : String(x));

export function useRequest() {
  const [state, set] = useState({ loading: false, error: null, result: null });
  const run = async (path, opts) => {
    set({ loading: true, error: null, result: null });
    try { set({ loading: false, error: null, result: await api(path, opts) }); }
    catch (e) { set({ loading: false, error: e.message, result: null }); }
  };
  const reset = () => set({ loading: false, error: null, result: null });
  return { ...state, run, reset };
}

export const Panel = ({ title, children, className = "" }) => (
  <section className={`rounded-sm border border-line bg-paper ${className}`}>
    {title && <h2 className="border-b border-line bg-tint px-5 py-2.5 text-base text-navy">{title}</h2>}
    <div className="p-5">{children}</div>
  </section>
);

const inputCls = "w-full rounded-sm border border-line bg-white px-3 py-2 text-base text-navy placeholder:text-mute/70 focus:border-blue";
export const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-semibold text-navy">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-sm text-mute">{hint}</span>}
  </label>
);
export const Input = (p) => <input className={inputCls} {...p} />;
export const Select = ({ options, ...p }) => (
  <select className={inputCls} {...p}>
    {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
  </select>
);
export const Textarea = (p) => <textarea className={inputCls} {...p} />;

export const Button = ({ loading, children, secondary, ...p }) => (
  <button
    disabled={loading || p.disabled}
    className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 font-semibold disabled:opacity-50 ${
      secondary ? "border border-navy bg-paper text-navy hover:bg-tint" : "btn bg-marker text-navy hover:bg-marker-d"}`}
    {...p}
  >
    {loading && <Spinner small />}{children}
  </button>
);

export const Spinner = ({ small }) => (
  <span role="status" aria-label="Loading"
    className={`spin inline-block rounded-full border-2 border-current border-t-transparent ${small ? "h-4 w-4" : "h-6 w-6"}`} />
);

export const ErrorBox = ({ message }) => message ? (
  <div role="alert" className="rounded-sm border border-l-4 border-bad bg-red-50 px-4 py-3 text-bad">{message}</div>
) : null;

export const Notice = ({ children }) => children ? (
  <div role="status" className="rounded-sm border border-l-4 border-warn bg-amber-50 px-4 py-3 text-warn">{children}</div>
) : null;

const MODE = {
  ai: ["AI generated", "bg-good text-white"],
  partial: ["Partial result: AI part unavailable", "bg-warn text-white"],
};
export function ResultMeta({ result }) {
  if (!result) return null;
  const [label, cls] = MODE[result.mode] || MODE.ai;
  return (
    <div className="mb-3 space-y-2">
      <span className={`inline-block rounded-sm px-2 py-0.5 text-sm font-semibold ${cls}`}>{label}</span>
      {arr(result.notes).map((n, i) => <p key={i} className="text-sm text-mute">{n}</p>)}
    </div>
  );
}

export const List = ({ items }) => (
  <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-blue">{arr(items).map((t, i) => <li key={i}>{text(t)}</li>)}</ul>
);

/** Heading + bullet list; renders nothing when there are no items. */
export const Block = ({ title, items, note }) => arr(items).length ? (
  <div>
    <h3 className="border-b border-line pb-1 text-lg text-navy">{title}</h3>
    {note && <p className="mt-1 mb-1 text-sm text-mute">{note}</p>}
    <List items={items} />
  </div>
) : null;

export const Empty = ({ children }) => (
  <div className="rounded-sm border border-dashed border-mute/50 bg-tint/60 p-6 text-mute">{children}</div>
);

export const inr = (n) => (n === null || n === undefined || Number.isNaN(Number(n)) ? "n/a" : `₹ ${Number(n).toLocaleString("en-IN")}`);
export const label = (s) => text(s).replace(/_/g, " ");

/** Keeps one broken result from blanking the whole app. */
export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.error("UI render error", err); }
  render() {
    return this.state.failed ? (
      <div role="alert" className="rounded-sm border border-l-4 border-bad bg-red-50 p-4 text-bad">
        Something went wrong while showing this result. Please try again.{" "}
        <button className="underline" onClick={() => this.setState({ failed: false })}>Dismiss</button>
      </div>
    ) : this.props.children;
  }
}
