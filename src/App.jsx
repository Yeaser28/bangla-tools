import { useMemo, useState } from "react";

/* ---------- Conversion logic ---------- */

const W = [
  "শূন্য","এক","দুই","তিন","চার","পাঁচ","ছয়","সাত","আট","নয়",
  "দশ","এগারো","বারো","তেরো","চৌদ্দ","পনেরো","ষোলো","সতেরো","আঠারো","ঊনিশ",
  "বিশ","একুশ","বাইশ","তেইশ","চব্বিশ","পঁচিশ","ছাব্বিশ","সাতাশ","আঠাশ","ঊনত্রিশ",
  "ত্রিশ","একত্রিশ","বত্রিশ","তেত্রিশ","চৌত্রিশ","পঁয়ত্রিশ","ছত্রিশ","সাঁইত্রিশ","আটত্রিশ","ঊনচল্লিশ",
  "চল্লিশ","একচল্লিশ","বিয়াল্লিশ","তেতাল্লিশ","চুয়াল্লিশ","পঁয়তাল্লিশ","ছেচল্লিশ","সাতচল্লিশ","আটচল্লিশ","ঊনপঞ্চাশ",
  "পঞ্চাশ","একান্ন","বায়ান্ন","তিপ্পান্ন","চুয়ান্ন","পঞ্চান্ন","ছাপ্পান্ন","সাতান্ন","আটান্ন","ঊনষাট",
  "ষাট","একষট্টি","বাষট্টি","তেষট্টি","চৌষট্টি","পঁয়ষট্টি","ছেষট্টি","সাতষট্টি","আটষট্টি","ঊনসত্তর",
  "সত্তর","একাত্তর","বাহাত্তর","তিয়াত্তর","চুয়াত্তর","পঁচাত্তর","ছিয়াত্তর","সাতাত্তর","আটাত্তর","ঊনআশি",
  "আশি","একাশি","বিরাশি","তিরাশি","চুরাশি","পঁচাশি","ছিয়াশি","সাতাশি","আটাশি","ঊননব্বই",
  "নব্বই","একানব্বই","বিরানব্বই","তিরানব্বই","চুরানব্বই","পঁচানব্বই","ছিয়ানব্বই","সাতানব্বই","আটানব্বই","নিরানব্বই",
];

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

// Bangla digits -> English digits, remove commas/spaces
const normalize = (s) =>
  s
    .replace(/[০-৯]/g, (d) => BN_DIGITS.indexOf(d))
    .replace(/[,\s]/g, "");

const belowThousand = (n) => {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts = [];
  if (h) parts.push(W[h] + "শত");
  if (r) parts.push(W[r]);
  return parts.join(" ");
};

const intToWords = (n) => {
  if (n === 0) return W[0];
  const parts = [];
  const koti = Math.floor(n / 1e7);
  n %= 1e7;
  const lakh = Math.floor(n / 1e5);
  n %= 1e5;
  const hazar = Math.floor(n / 1e3);
  n %= 1e3;
  if (koti) parts.push(intToWords(koti) + " কোটি");
  if (lakh) parts.push(W[lakh] + " লক্ষ");
  if (hazar) parts.push(W[hazar] + " হাজার");
  if (n) parts.push(belowThousand(n));
  return parts.join(" ");
};

const convert = (raw, taka) => {
  const s = normalize(raw);
  if (!s) return { text: "" };
  if (!/^\d+(\.\d*)?$/.test(s))
    return { error: "শুধু সংখ্যা লিখুন (যেমন 1250.50 বা ১২৫০)।" };

  const [intStr, decStr = ""] = s.split(".");
  if (intStr.replace(/^0+/, "").length > 15)
    return { error: "সংখ্যাটি অনেক বড়। সর্বোচ্চ ১৫ অঙ্ক পর্যন্ত লিখুন।" };

  const intPart = Number(intStr);
  const dec = decStr.padEnd(2, "0").slice(0, 2);
  const paisa = Number(dec);

  if (!taka) {
    let text = intToWords(intPart);
    if (decStr) {
      const digits = decStr.split("").map((d) => W[Number(d)]).join(" ");
      text += " দশমিক " + digits;
    }
    return { text };
  }

  const parts = [];
  if (intPart || !paisa) parts.push(intToWords(intPart) + " টাকা");
  if (paisa) parts.push(intToWords(paisa) + " পয়সা");
  return { text: parts.join(" ") + " মাত্র" };
};

/* ---------- UI ---------- */

const FAQ = [
  {
    q: "বাংলায় ১২৩৪৫৬৭ কীভাবে লিখব?",
    a: "বাংলা গণনায় সংখ্যা ভাগ হয় হাজার, লক্ষ ও কোটিতে। ১২,৩৪,৫৬৭ হলো বারো লক্ষ চৌত্রিশ হাজার পাঁচশত সাতষট্টি।",
  },
  {
    q: "চেকে টাকার অঙ্ক কথায় কীভাবে লিখতে হয়?",
    a: "অঙ্কের পর কথায় লিখে শেষে “মাত্র” যোগ করুন। উপরের “টাকা মোডে” টিক দিলে এটি নিজে থেকেই হয়ে যায়।",
  },
  {
    q: "পয়সা থাকলে কী হবে?",
    a: "দশমিকের পরের দুই অঙ্ক পয়সা ধরা হয়। যেমন ১২৫০.৫০ হলো এক হাজার দুইশত পঞ্চাশ টাকা পঞ্চাশ পয়সা মাত্র।",
  },
  {
    q: "ইংরেজি অঙ্ক দিলে কাজ করবে?",
    a: "হ্যাঁ। ইংরেজি (123) ও বাংলা (১২৩) দুই ধরনের অঙ্কই কাজ করে।",
  },
];

export default function App() {
  const [value, setValue] = useState("1250.50");
  const [taka, setTaka] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => convert(value, taka), [value, taka]);

  const copy = async () => {
    if (!result.text) return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  return (
    <>
      <style>{css}</style>
      <main className="page">
        <header>
          <h1>সংখ্যা থেকে বাংলা কথা</h1>
          <p className="lead">
            যেকোনো অঙ্ক লিখুন, চেক বা ভাউচারের জন্য কথায় লেখা পেয়ে যাবেন।
            সাইন-আপ লাগবে না।
          </p>
        </header>

        <section className="slip" aria-label="রূপান্তর টুল">
          <label htmlFor="num">অঙ্ক</label>
          <input
            id="num"
            inputMode="decimal"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="যেমন 125000 বা ১২৫০০০"
          />

          <label className="check">
            <input
              type="checkbox"
              checked={taka}
              onChange={(e) => setTaka(e.target.checked)}
            />
            টাকা মোড (শেষে “টাকা … মাত্র”)
          </label>

          <div className="out" aria-live="polite">
            {result.error ? (
              <p className="err">{result.error}</p>
            ) : result.text ? (
              <p className="words">{result.text}</p>
            ) : (
              <p className="hint">উপরে একটি সংখ্যা লিখুন।</p>
            )}
          </div>

          <button onClick={copy} disabled={!result.text}>
            {copied ? "কপি হয়েছে" : "কথাটি কপি করুন"}
          </button>
        </section>

        <section className="info">
          <h2>বাংলায় সংখ্যা গণনার নিয়ম</h2>
          <p>
            বাংলাদেশে সংখ্যা ইংরেজি মিলিয়ন-বিলিয়ন পদ্ধতিতে নয়, হাজার, লক্ষ ও
            কোটি পদ্ধতিতে গোনা হয়। এক লক্ষ মানে ১,০০,০০০ এবং এক কোটি মানে
            ১,০০,০০,০০০। এই টুল সেই নিয়ম মেনেই লেখে।
          </p>
          <p>
            বাংলায় ১ থেকে ৯৯ পর্যন্ত প্রতিটি সংখ্যার আলাদা নাম আছে, যেমন
            ২৯ হলো ঊনত্রিশ এবং ৯৯ হলো নিরানব্বই। এই টুলে সেগুলো ঠিকভাবে
            বসানো আছে, তাই বানান নিয়ে চিন্তা করতে হয় না।
          </p>

          <h2>প্রশ্ন ও উত্তর</h2>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}

/* ---------- Styles ---------- */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600&family=Noto+Serif+Bengali:wght@500;700&display=swap');

:root {
  --paper: #eef3ec;
  --ink: #16352b;
  --muted: #5a6f66;
  --line: #a9bfb2;
  --accent: #1d5e46;
  --err: #a1302a;
  --card: #f9fbf7;
}
@media (prefers-color-scheme: dark) {
  :root {
    --paper: #101a16; --ink: #e3efe7; --muted: #93aa9e;
    --line: #34493f; --accent: #6fc39d; --err: #ff9a90; --card: #16241e;
  }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink);
  font-family: 'Hind Siliguri', system-ui, sans-serif; line-height: 1.7; }
.page { max-width: 680px; margin: 0 auto; padding: 40px 18px 64px; }
h1 { font-family: 'Noto Serif Bengali', serif; font-size: clamp(1.7rem, 5vw, 2.3rem);
  margin: 0 0 8px; line-height: 1.3; }
h2 { font-family: 'Noto Serif Bengali', serif; font-size: 1.25rem; margin: 32px 0 8px; }
.lead { color: var(--muted); margin: 0 0 24px; }

.slip { background: var(--card); border: 1px solid var(--line);
  border-left: 6px solid var(--accent); border-radius: 4px; padding: 22px; }
.slip > label { display: block; font-weight: 600; margin-bottom: 6px; }
.slip input[type=text], .slip input:not([type]), .slip input[inputmode] {
  width: 100%; font: inherit; font-size: 1.4rem; padding: 10px 12px;
  border: 1px solid var(--line); border-radius: 4px; background: transparent; color: inherit; }
.slip input:focus-visible, button:focus-visible, summary:focus-visible {
  outline: 3px solid var(--accent); outline-offset: 2px; }
.check { display: flex; gap: 8px; align-items: center; margin: 12px 0 0;
  color: var(--muted); font-size: .95rem; cursor: pointer; }
.out { margin: 18px 0; padding: 16px 0; border-top: 1px dashed var(--line);
  border-bottom: 1px dashed var(--line); min-height: 84px; }
.words { font-family: 'Noto Serif Bengali', serif; font-weight: 500;
  font-size: 1.35rem; line-height: 1.7; margin: 0; }
.hint { color: var(--muted); margin: 0; }
.err { color: var(--err); margin: 0; }
button { font: inherit; font-weight: 600; padding: 10px 18px; border-radius: 4px;
  border: 0; background: var(--accent); color: var(--paper); cursor: pointer; }
button:disabled { opacity: .45; cursor: not-allowed; }

.info p { max-width: 62ch; }
details { border-bottom: 1px solid var(--line); padding: 10px 0; }
summary { cursor: pointer; font-weight: 600; }
details p { margin: 8px 0 0; color: var(--muted); }
`;
