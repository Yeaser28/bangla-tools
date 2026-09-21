import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import BanglaNumber from "./App.jsx"; // your first tool
import InvoiceGenerator from "./InvoiceGenerator.jsx";

// Sets a unique <title> and meta description per page (good for SEO)
function Page({ title, description, children }) {
  useEffect(() => {
    document.title = title;
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "description";
      document.head.appendChild(m);
    }
    m.content = description;
  }, [title, description]);
  return children;
}

function Nav() {
  return (
    <nav className="site-nav no-print">
      <NavLink to="/invoice-generator">Invoice Generator</NavLink>
      <NavLink to="/bangla-number-to-words">Bangla Number to Words</NavLink>
    </nav>
  );
}

function Home() {
  return (
    <Page
      title="Free Online Tools for Freelancers and Bangla Users"
      description="Free invoice generator and Bangla number to words converter. No signup."
    >
      <main className="home">
        <h1>Free online tools</h1>
        <p>Simple tools that run in your browser. No signup.</p>
        <ul>
          <li><NavLink to="/invoice-generator">Free Invoice Generator</NavLink></li>
          <li><NavLink to="/bangla-number-to-words">Bangla Number to Words</NavLink></li>
        </ul>
      </main>
    </Page>
  );
}

function App() {
  return (
    <BrowserRouter>
      <style>{`
        .site-nav { display: flex; gap: 18px; flex-wrap: wrap; padding: 12px 16px;
          background: #101828; font-family: system-ui, sans-serif; }
        .site-nav a { color: #cfd8e6; text-decoration: none; font-size: .95rem; padding: 4px 0; }
        .site-nav a.active { color: #fff; border-bottom: 2px solid #6ea0ff; }
        .site-nav a:focus-visible { outline: 3px solid #6ea0ff; outline-offset: 2px; }
        .home { max-width: 640px; margin: 48px auto; padding: 0 16px; font-family: system-ui, sans-serif; }
        .home a { color: #1f4fd8; }
        @media print { .no-print { display: none !important; } }
      `}</style>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/invoice-generator"
          element={
            <Page
              title="Free Invoice Generator for Freelancers (No Signup, PDF)"
              description="Create a professional invoice in your browser and download it as a PDF. Free, no signup, no watermark."
            >
              <InvoiceGenerator />
            </Page>
          }
        />
        <Route
          path="/bangla-number-to-words"
          element={
            <Page
              title="সংখ্যা থেকে বাংলা কথা | Bangla Number to Words Converter"
              description="যেকোনো সংখ্যা বাংলায় কথায় লিখুন। চেকের টাকার অঙ্ক কথায়, হাজার-লক্ষ-কোটি পদ্ধতিতে। ফ্রি।"
            >
              <BanglaNumber />
            </Page>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
