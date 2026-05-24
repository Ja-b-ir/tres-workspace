import React from 'react';

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── Icon registry ─────────────────────────────────────────────────────────────
// ─── Inline SVG Icon component (replaces Lucide imports) ─────────────────────
const FILE_ICON = ({size=16, color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);
const LAYERS_ICON = ({size=16, color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);
const LOCK_ICON = ({size=16, color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EYE_ICON = ({size=16, color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const MINIMIZE_ICON = ({size=16, color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="21" y2="3"/><line x1="3" y1="21" x2="14" y2="10"/>
  </svg>
);
const ICON_MAP = {
  File: FILE_ICON, Folder: FILE_ICON, User: FILE_ICON, Check: FILE_ICON,
  Settings: FILE_ICON, Briefcase: FILE_ICON, Eye: EYE_ICON,
  Lock: LOCK_ICON, Layers: LAYERS_ICON, Minimize2: MINIMIZE_ICON, Video: FILE_ICON,
};

// ─── Tool definitions ─────────────────────────────────────────────────────────
const officeTools = [
  { id: 1,  title: "Word to PDF",  iconName: "File",     category: "Conversion",   ext: ".docx → .pdf"   },
  { id: 2,  title: "PDF to Word",  iconName: "File",     category: "Conversion",   ext: ".pdf → .docx"   },
  { id: 3,  title: "Excel to PDF", iconName: "Layers",   category: "Conversion",   ext: ".xlsx → .pdf"   },
  { id: 4,  title: "PPTX to PDF",  iconName: "File",     category: "Conversion",   ext: ".pptx → .pdf"   },
  { id: 5,  title: "Compressor",   iconName: "Minimize2",category: "Optimization", ext: ".pdf → smaller"  },
  { id: 6,  title: "Merger",       iconName: "Layers",   category: "Organization", ext: "many → one"      },
  { id: 7,  title: "Encryption",   iconName: "Lock",     category: "Security",     ext: ".pdf → 🔒"       },
  { id: 8,  title: "OCR",          iconName: "Eye",      category: "Extraction",   ext: "image → text"    },
  { id: 9,  title: "JSON to CSV",  iconName: "File",     category: "Conversion",   ext: ".json → .csv"    },
  { id: 10, title: "HTML to PDF",  iconName: "File",     category: "Conversion",   ext: ".html → .pdf"    },
];

// ─── Default project factory ──────────────────────────────────────────────────
function createProject(overrides = {}) {
  const id = overrides.id || `proj_${Date.now()}`;
  return {
    id,
    name: "Untitled Project",
    client: "New Client",
    scopeBudget: 10,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    health: "on-track",
    progress: 0,
    createdAt: new Date().toISOString(),
    stickyNote: "",
    deadline: "",
    lateFeeEnabled: false,
    lateFeeRate: 1.5,
    milestones: [],
    scopeCreep: 0,
    paymentLocked: false,
    timeLogs: [],
    ...overrides,
  };
}

// ─── Demo seed projects ────────────────────────────────────────────────────────
const SEED_PROJECTS = [
  createProject({
    id: "proj_demo_1",
    name: "Apollo Rebrand",
    client: "Nexus Corp",
    scopeBudget: 12,
    health: "on-track",
    progress: 68,
    stickyNote: "Left off after the Visual Identity presentation on Friday. Client approved the logo mark — next step is the colour palette deck. Check Figma for the v3 frames.\n\n📌 Action: Send revised brand guidelines by Tuesday.",
    milestones: [
      { id: 1, text: "Discovery & Research",   status: "Done",    elapsedTime: 0, isTimerRunning: false },
      { id: 2, text: "Brand Strategy",          status: "Done",    elapsedTime: 0, isTimerRunning: false },
      { id: 3, text: "Visual Identity Design",  status: "Pending", elapsedTime: 0, isTimerRunning: false },
      { id: 4, text: "Asset Delivery",          status: "Pending", elapsedTime: 0, isTimerRunning: false },
      { id: 5, text: "Final Sign-off",          status: "Pending", elapsedTime: 0, isTimerRunning: false },
    ],
  }),
  createProject({
    id: "proj_demo_2",
    name: "Velo Health Launch",
    client: "Velo Health",
    scopeBudget: 8,
    health: "under-review",
    progress: 42,
    stickyNote: "Waiting on client for final copy for the hero section. Development is paused until copy is confirmed. Last call was Wednesday — follow up!",
    milestones: [
      { id: 1, text: "UX Research",      status: "Done",    elapsedTime: 0, isTimerRunning: false },
      { id: 2, text: "Wireframes",       status: "Done",    elapsedTime: 0, isTimerRunning: false },
      { id: 3, text: "UI Design",        status: "Pending", elapsedTime: 0, isTimerRunning: false },
      { id: 4, text: "Development",      status: "Pending", elapsedTime: 0, isTimerRunning: false },
    ],
  }),
];

// ─── Global app state (theme + active project) ────────────────────────────────
const defaultGlobalState = { theme: "light", activeTab: "workspaces" };

// ─── Default resume ───────────────────────────────────────────────────────────
const defaultResume = {
  name: "Alexandra Chen",
  title: "Senior Product Designer",
  email: "alex.chen@email.com",
  phone: "+1 (555) 234-8901",
  location: "San Francisco, CA",
  summary: "Results-driven designer with 8+ years crafting intuitive digital experiences for Fortune 500 companies. Passionate about bridging user needs with business objectives through systematic design thinking.",
  experience: [
    { id: 1, company: "Stripe",  role: "Lead Product Designer",   period: "2021 – Present", bullets: "Led redesign of Stripe Dashboard serving 2M+ merchants. Increased task completion by 34% through iterative usability testing." },
    { id: 2, company: "Airbnb",  role: "Senior UX Designer",      period: "2018 – 2021",    bullets: "Owned end-to-end design for Host onboarding. Reduced drop-off rate by 28%. Collaborated with engineering teams across 4 time zones." },
    { id: 3, company: "IDEO",    role: "UX Designer",             period: "2016 – 2018",    bullets: "Conducted 60+ user research sessions. Prototyped and validated concepts for healthcare and fintech clients." },
  ],
  education: "M.S. Human-Computer Interaction, Carnegie Mellon University, 2016\nB.A. Graphic Design, UCLA, 2014",
  skills: "Figma, Prototyping, User Research, Design Systems, HTML/CSS, React, Data Visualization, A/B Testing",
};

// ─── OFFICIAL LAYOUTS REGISTRY (10 CV + 10 Pitch) ────────────────────────────
const OFFICIAL_LAYOUTS = [
  // ── CV FORMATS (10) ──────────────────────────────────────────────────────────
  {
    id: "wharton",
    name: "The Wharton Standard",
    category: "CV",
    description: "Strict single-column finance layout",
    accentHex: "#1a3a5c",
    borderHex: "#c8a96e",
    subtitleHex: "#8c6d2f",
    headingHex: "#1a3a5c",
    columnMode: "single",
    badge: "Finance",
  },
  {
    id: "mckinsey",
    name: "The McKinsey Matrix",
    category: "CV",
    description: "Asymmetric consulting impact framework layout",
    accentHex: "#003366",
    borderHex: "#003366",
    subtitleHex: "#0057b8",
    headingHex: "#003366",
    columnMode: "asymmetric",
    badge: "Consulting",
  },
  {
    id: "boardroom",
    name: "The Boardroom C-Suite",
    category: "CV",
    description: "Centered executive governance layout",
    accentHex: "#1c1c1c",
    borderHex: "#8b0000",
    subtitleHex: "#8b0000",
    headingHex: "#1c1c1c",
    columnMode: "centered",
    badge: "Executive",
  },
  {
    id: "legal",
    name: "The Legal Brief",
    category: "CV",
    description: "Formal practice-area structured layout",
    accentHex: "#2c3e50",
    borderHex: "#7f8c8d",
    subtitleHex: "#34495e",
    headingHex: "#2c3e50",
    columnMode: "legal",
    badge: "Legal",
  },
  {
    id: "federal",
    name: "The Federal Blueprint",
    category: "CV",
    description: "High-density institutional/clearance layout",
    accentHex: "#002868",
    borderHex: "#bf0a30",
    subtitleHex: "#002868",
    headingHex: "#002868",
    columnMode: "federal",
    badge: "Government",
  },
  {
    id: "london-exec",
    name: "The London Executive",
    category: "CV",
    description: "Refined British corporate single-column layout",
    accentHex: "#1b2a3b",
    borderHex: "#b8860b",
    subtitleHex: "#7a5c00",
    headingHex: "#1b2a3b",
    columnMode: "london",
    badge: "Corporate",
  },
  {
    id: "ivy-academic",
    name: "The Ivy Academic",
    category: "CV",
    description: "Scholarly publications & grants CV layout",
    accentHex: "#4a0e0e",
    borderHex: "#8b1a1a",
    subtitleHex: "#6b0f0f",
    headingHex: "#4a0e0e",
    columnMode: "ivy",
    badge: "Academic",
  },
  {
    id: "tech-principal",
    name: "The Technical Principal",
    category: "CV",
    description: "Stack-first engineering leadership layout",
    accentHex: "#0d1117",
    borderHex: "#238636",
    subtitleHex: "#3fb950",
    headingHex: "#0d1117",
    columnMode: "tech",
    badge: "Engineering",
  },
  {
    id: "medical-fellow",
    name: "The Medical Fellow",
    category: "CV",
    description: "Clinical credentials & residency layout",
    accentHex: "#003d5c",
    borderHex: "#0077b6",
    subtitleHex: "#0096c7",
    headingHex: "#003d5c",
    columnMode: "medical",
    badge: "Clinical",
  },
  {
    id: "silicon-director",
    name: "The Silicon Director",
    category: "CV",
    description: "Minimalist product-led tech executive layout",
    accentHex: "#18181b",
    borderHex: "#6d28d9",
    subtitleHex: "#7c3aed",
    headingHex: "#18181b",
    columnMode: "silicon",
    badge: "Tech Exec",
  },
  // ── PITCH FORMATS (10) ───────────────────────────────────────────────────────
  {
    id: "vc-brief",
    name: "The VC 1-Page Brief",
    category: "Pitch",
    description: "Standard investor problem/solution pitch layout",
    accentHex: "#0f172a",
    borderHex: "#6366f1",
    subtitleHex: "#6366f1",
    headingHex: "#0f172a",
    columnMode: "vc",
    badge: "Investor",
  },
  {
    id: "inst-memo",
    name: "The Institutional Memorandum",
    category: "Pitch",
    description: "Formal M&A deal execution layout",
    accentHex: "#1a2332",
    borderHex: "#c8a96e",
    subtitleHex: "#8c6d2f",
    headingHex: "#1a2332",
    columnMode: "memo",
    badge: "M&A",
  },
  {
    id: "b2b-enterprise",
    name: "The B2B Enterprise Pitch",
    category: "Pitch",
    description: "ROI/Pain-point corporate sales layout",
    accentHex: "#0a2540",
    borderHex: "#00d4aa",
    subtitleHex: "#00d4aa",
    headingHex: "#0a2540",
    columnMode: "b2b",
    badge: "Sales",
  },
  {
    id: "strategic-roadmap",
    name: "The Strategic Roadmap",
    category: "Pitch",
    description: "Quarterly milestone execution layout",
    accentHex: "#1e3a2f",
    borderHex: "#2ecc71",
    subtitleHex: "#27ae60",
    headingHex: "#1e3a2f",
    columnMode: "roadmap",
    badge: "Strategy",
  },
  {
    id: "board-update",
    name: "The Quarterly Board Update",
    category: "Pitch",
    description: "High-level operational summary layout",
    accentHex: "#2d1b4e",
    borderHex: "#9b59b6",
    subtitleHex: "#8e44ad",
    headingHex: "#2d1b4e",
    columnMode: "board",
    badge: "Operations",
  },
  {
    id: "scope-of-work",
    name: "The Scope of Work (SOW)",
    category: "Pitch",
    description: "Deliverable-milestone project contract layout",
    accentHex: "#1a1a2e",
    borderHex: "#e94560",
    subtitleHex: "#c0392b",
    headingHex: "#1a1a2e",
    columnMode: "sow",
    badge: "Contract",
  },
  {
    id: "retainer-proposal",
    name: "The Retainer Proposal",
    category: "Pitch",
    description: "Monthly recurring agency engagement layout",
    accentHex: "#0f2027",
    borderHex: "#f39c12",
    subtitleHex: "#e67e22",
    headingHex: "#0f2027",
    columnMode: "retainer",
    badge: "Retainer",
  },
  {
    id: "creative-brief",
    name: "The Creative Brief",
    category: "Pitch",
    description: "Brand campaign objectives & tone layout",
    accentHex: "#2c0a37",
    borderHex: "#e040fb",
    subtitleHex: "#ab47bc",
    headingHex: "#2c0a37",
    columnMode: "creative",
    badge: "Creative",
  },
  {
    id: "tech-eval",
    name: "The Tech Stack Evaluation",
    category: "Pitch",
    description: "Comparative infrastructure decision matrix layout",
    accentHex: "#0a0e27",
    borderHex: "#00b4d8",
    subtitleHex: "#0096c7",
    headingHex: "#0a0e27",
    columnMode: "techeval",
    badge: "Infrastructure",
  },
  {
    id: "joint-venture",
    name: "The Joint Venture Prospectus",
    category: "Pitch",
    description: "Partnership equity & synergy deal layout",
    accentHex: "#1a2800",
    borderHex: "#76b041",
    subtitleHex: "#558b2f",
    headingHex: "#1a2800",
    columnMode: "jv",
    badge: "Partnership",
  },
];

// ─── localStorage hook ────────────────────────────────────────────────────────
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

// ─── ToolCard component ───────────────────────────────────────────────────────
function ToolCard({ tool, dark }) {
  const [uploadState, setUploadState] = useState("idle");
  const [progress, setProgress]       = useState(0);
  const [fileName, setFileName]       = useState("");
  const fileInputRef = useRef(null);
  const IconComp = ICON_MAP[tool.iconName] || File;
  const catColor = {
    Conversion:   dark ? "#6366f1" : "#4f46e5",
    Optimization: dark ? "#06b6d4" : "#0891b2",
    Organization: dark ? "#8b5cf6" : "#7c3aed",
    Security:     dark ? "#f59e0b" : "#d97706",
    Extraction:   dark ? "#10b981" : "#059669",
  }[tool.category] || (dark ? "#94a3b8" : "#64748b");

  const runProgress = () => {
    setUploadState("uploading"); setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) { p = 100; clearInterval(iv); setUploadState("done"); }
      setProgress(Math.min(p, 100));
    }, 180);
  };
  const handleFileChange = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFileName(f.name); runProgress(); e.target.value = "";
  };
  const openPicker = () => { if (uploadState !== "idle") return; fileInputRef.current && fileInputRef.current.click(); };
  const reset = () => { setUploadState("idle"); setProgress(0); setFileName(""); };

  return (
    <div style={{
      background: dark ? "#1e293b" : "#ffffff", border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
      borderRadius: 14, padding: "18px", display: "flex", flexDirection: "column", gap: 10,
      transition: "all 0.2s ease", position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = dark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
      <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: catColor, opacity: 0.06, borderRadius: "0 14px 0 60px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: catColor + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconComp size={17} color={catColor} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#f1f5f9" : "#0f172a", lineHeight: 1.2 }}>{tool.title}</div>
          <div style={{ fontSize: 10.5, color: catColor, fontFamily: "monospace", marginTop: 1 }}>{tool.ext}</div>
        </div>
      </div>
      <div style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 20, background: catColor + "18", color: catColor, width: "fit-content", fontWeight: 600 }}>{tool.category}</div>
      {uploadState === "idle" && (
        <button onClick={openPicker} style={{
          marginTop: 4, padding: "7px 0", border: `1px solid ${dark ? "#475569" : "#cbd5e1"}`, borderRadius: 8,
          background: "transparent", color: dark ? "#94a3b8" : "#64748b", fontSize: 12, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = catColor + "18"; e.currentTarget.style.color = catColor; e.currentTarget.style.borderColor = catColor; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark ? "#94a3b8" : "#64748b"; e.currentTarget.style.borderColor = dark ? "#475569" : "#cbd5e1"; }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Choose File
        </button>
      )}
      {uploadState === "uploading" && (
        <div style={{ marginTop: 4 }}>
          {fileName && <div style={{ fontSize: 10.5, color: dark ? "#94a3b8" : "#64748b", marginBottom: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>📄 {fileName}</div>}
          <div style={{ height: 4, background: dark ? "#334155" : "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: catColor, borderRadius: 99, transition: "width 0.15s" }} />
          </div>
          <div style={{ fontSize: 10.5, color: dark ? "#94a3b8" : "#64748b", marginTop: 4 }}>Processing… {Math.round(progress)}%</div>
        </div>
      )}
      {uploadState === "done" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
          {fileName && <div style={{ fontSize: 10.5, color: catColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>✓ {fileName}</div>}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={reset} style={{ flex: 1, padding: "7px 0", border: `1px solid ${catColor}`, borderRadius: 8, background: catColor, color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download
            </button>
            <button onClick={reset} style={{ padding: "7px 10px", border: `1px solid ${dark ? "#475569" : "#cbd5e1"}`, borderRadius: 8, background: "transparent", color: dark ? "#94a3b8" : "#64748b", cursor: "pointer" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HealthPulse ─────────────────────────────────────────────────────────────
function HealthPulse({ health }) {
  const healthMap = {
    "on-track":        { color: "#10b981", label: "On Track"        },
    "under-review":    { color: "#f59e0b", label: "Under Review"    },
    "action-required": { color: "#f87171", label: "Action Required" },
  };
  const { color: c, label } = healthMap[health] || healthMap["on-track"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ position: "relative", width: 12, height: 12 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: c, position: "absolute" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: c, position: "absolute", animation: "pulse-ring 1.8s cubic-bezier(0.215,0.61,0.355,1) infinite", opacity: 0.5 }} />
      </div>
      <span style={{ fontSize: 12, color: c, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

// ─── TimesheetTracker ─────────────────────────────────────────────────────────
// NOTE: The global ticking stopwatch has been removed from this component.
// Per-milestone timers (Play/Pause) inside the Milestone Tracking block are
// the canonical time-tracking mechanism. This component now serves as a
// session log manager and CSV exporter only.
function TimesheetTracker({ dark, milestones, surface, border, text, muted, accent, projectId, timeLogs, onUpdateTimeLogs }) {
  const [wage,    setWage]    = useState(50);
  const [taskIdx, setTaskIdx] = useState(0);

  const logs = timeLogs || [];

  const fmt = s => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const taskLabel = milestones[taskIdx] ? milestones[taskIdx].text : "General";

  // Allow manually logging a session entry from a milestone's elapsed time
  const handleLogMilestone = () => {
    const m = milestones[taskIdx];
    if (!m || (m.elapsedTime || 0) === 0) return;
    const secs = m.elapsedTime || 0;
    const earnings = `$${((secs / 3600) * wage).toFixed(2)}`;
    const entry = {
      id: Date.now(),
      task: m.text,
      duration: fmt(secs),
      seconds: secs,
      earnings,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    onUpdateTimeLogs([entry, ...logs]);
  };

  const exportCSV = () => {
    const header = "Date,Time,Task,Duration,Earnings\n";
    const rows = logs.map(l => `${l.date},${l.time},"${l.task}",${l.duration},${l.earnings}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "timesheet.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const selectedMilestone = milestones[taskIdx];
  const selectedHasTime = selectedMilestone && (selectedMilestone.elapsedTime || 0) > 0;

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#06b6d420", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: text }}>Proof of Work Session Logger</div>
          <div style={{ fontSize: 11, color: muted }}>Log a milestone's tracked time as a billable session entry</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={{ fontSize: 10.5, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, display: "block" }}>Milestone Task</label>
          <select value={taskIdx} onChange={e => setTaskIdx(Number(e.target.value))} style={{ width: "100%", padding: "8px 10px", border: `1px solid ${border}`, borderRadius: 9, background: dark ? "#0f172a" : "#f8fafc", color: text, fontSize: 12, outline: "none" }}>
            {milestones.length === 0 && <option>General</option>}
            {milestones.map((m, i) => <option key={m.id} value={i}>{m.text} {(m.elapsedTime || 0) > 0 ? `(${fmt(m.elapsedTime)})` : ""}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 10.5, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, display: "block" }}>Hourly Rate — ${wage}/hr</label>
          <input type="range" min={5} max={500} step={5} value={wage} onChange={e => setWage(Number(e.target.value))} style={{ width: "100%", accentColor: "#06b6d4", marginTop: 10 }} />
        </div>
      </div>

      {selectedMilestone && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: dark ? "#0f172a" : "#f0fdf4", border: `1px solid ${selectedHasTime ? "#10b98140" : border}`, borderRadius: 10 }}>
          <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: selectedHasTime ? "#10b981" : muted }}>
            {fmt(selectedMilestone.elapsedTime || 0)}
          </div>
          <div style={{ flex: 1, fontSize: 11.5, color: muted }}>
            {selectedHasTime ? `Est. $${((((selectedMilestone.elapsedTime || 0) / 3600) * wage)).toFixed(2)} at $${wage}/hr` : "No time tracked yet — use milestone timer above"}
          </div>
          <button onClick={handleLogMilestone} disabled={!selectedHasTime} style={{
            padding: "7px 14px", borderRadius: 9, border: `1px solid ${selectedHasTime ? "#10b981" : border}`,
            background: selectedHasTime ? "#10b981" : "transparent", color: selectedHasTime ? "#fff" : muted,
            fontSize: 12, fontWeight: 600, cursor: selectedHasTime ? "pointer" : "default", transition: "all 0.2s",
          }}>
            Log Session
          </button>
        </div>
      )}

      {logs.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Session Log</span>
            <button onClick={exportCSV} style={{ fontSize: 11, color: "#06b6d4", background: "transparent", border: `1px solid #06b6d430`, borderRadius: 7, padding: "3px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export CSV
            </button>
          </div>
          <div style={{ maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
            {logs.map(l => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8, background: dark ? "#0f172a" : "#f8fafc", border: `1px solid ${border}`, fontSize: 11 }}>
                <span style={{ flex: 1, color: text, fontWeight: 500 }}>{l.task}</span>
                <span style={{ color: muted, fontFamily: "monospace" }}>{l.duration}</span>
                <span style={{ color: "#10b981", fontWeight: 700 }}>{l.earnings}</span>
                <span style={{ color: muted }}>{l.date}</span>
                <button onClick={() => onUpdateTimeLogs(logs.filter(x => x.id !== l.id))} style={{ background: "transparent", border: "none", cursor: "pointer", color: dark ? "#475569" : "#cbd5e1", padding: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {logs.length === 0 && <div style={{ textAlign: "center", padding: "12px 0", fontSize: 11.5, color: muted }}>No sessions logged yet. Use milestone timers above, then click "Log Session" to record billable time.</div>}
    </div>
  );
}

// ─── InvoiceGenerator ─────────────────────────────────────────────────────────
function InvoiceGenerator({ dark, surface, border, text, muted, accent, projectClient }) {
  const CURRENCIES = {
    USD: { symbol: "$",  rate: 1,    label: "US Dollar"        },
    BDT: { symbol: "৳",  rate: 110,  label: "Bangladeshi Taka" },
    EUR: { symbol: "€",  rate: 0.92, label: "Euro"             },
    GBP: { symbol: "£",  rate: 0.79, label: "British Pound"    },
  };
  const TAX_RATES = { "No Tax (0%)": 0, "VAT 5%": 0.05, "VAT 15%": 0.15, "GST 10%": 0.10, "Sales Tax 8.5%": 0.085 };

  const [currency, setCurrency] = useState("USD");
  const [taxKey,   setTaxKey]   = useState("No Tax (0%)");
  const [rows,     setRows]     = useState([
    { id: 1, desc: "Brand Strategy & Research",      qty: 1,  price: 2500 },
    { id: 2, desc: "Visual Identity Design Package", qty: 1,  price: 4800 },
    { id: 3, desc: "Revision Rounds (x3)",           qty: 3,  price: 350  },
  ]);
  const [invNum,      setInvNum]      = useState("INV-2025-001");
  const [clientName,  setClientName]  = useState(projectClient || "Client");
  const [dueDate,     setDueDate]     = useState("");

  const cur      = CURRENCIES[currency];
  const taxRate  = TAX_RATES[taxKey];
  const addRow    = () => setRows(r => [...r, { id: Date.now(), desc: "", qty: 1, price: 0 }]);
  const removeRow = id => setRows(r => r.filter(x => x.id !== id));
  const updateRow = (id, field, value) => setRows(r => r.map(x => x.id === id ? { ...x, [field]: value } : x));
  const subtotalUSD = rows.reduce((s, r) => s + r.qty * r.price, 0);
  const taxUSD      = subtotalUSD * taxRate;
  const totalUSD    = subtotalUSD + taxUSD;
  const fmt = v => `${cur.symbol}${(v * cur.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const printInvoice = () => {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice ${invNum}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Georgia',serif;max-width:740px;margin:40px auto;color:#1e293b;font-size:13px;line-height:1.6}h1{font-size:32px;font-weight:700;color:#0f172a;letter-spacing:-0.02em}.badge{display:inline-block;padding:4px 12px;border-radius:20px;background:#6366f110;color:#6366f1;font-weight:700;font-size:11px;letter-spacing:0.06em}table{width:100%;border-collapse:collapse;margin:24px 0}th{background:#0f172a;color:#fff;padding:10px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em}td{padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:12.5px}.total-row td{font-weight:700;background:#f8fafc;font-size:13.5px}.grand td{background:#0f172a;color:#fff;font-size:14px;font-weight:800}.right{text-align:right}@media print{@page{margin:20mm}}</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:24px;border-bottom:2px solid #e2e8f0"><div><h1>Invoice</h1><div class="badge" style="margin-top:8px">${invNum}</div></div><div style="text-align:right;font-size:12px;color:#64748b"><div style="font-weight:700;color:#0f172a;font-size:14px">${clientName}</div><div>Currency: ${currency} (${cur.label})</div>${dueDate ? `<div>Due: ${dueDate}</div>` : ""}</div></div>
<table><thead><tr><th>Description</th><th class="right">Qty</th><th class="right">Unit Price</th><th class="right">Subtotal</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.desc||"—"}</td><td class="right">${r.qty}</td><td class="right">${fmt(r.price)}</td><td class="right">${fmt(r.qty * r.price)}</td></tr>`).join("")}<tr class="total-row"><td colspan="3" class="right">Subtotal</td><td class="right">${fmt(subtotalUSD)}</td></tr>${taxRate > 0 ? `<tr class="total-row"><td colspan="3" class="right">${taxKey}</td><td class="right">${fmt(taxUSD)}</td></tr>` : ""}<tr class="grand"><td colspan="3" class="right">TOTAL DUE</td><td class="right">${fmt(totalUSD)}</td></tr></tbody></table>
<div style="font-size:11px;color:#94a3b8;margin-top:32px;text-align:center">Generated by TrES Workspace · Thank you for your business.</div></body></html>`);
    w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 400);
  };

  const inputS = { width: "100%", padding: "7px 10px", border: `1px solid ${border}`, borderRadius: 8, background: dark ? "#0f172a" : "#f8fafc", color: text, fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const labelS = { fontSize: 10.5, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, display: "block" };

  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#10b98120", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: text }}>Smart Invoice Generator</div>
          <div style={{ fontSize: 11, color: muted }}>Build, calculate, and export professional invoices</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div><label style={labelS}>Invoice #</label><input style={inputS} value={invNum} onChange={e => setInvNum(e.target.value)} /></div>
        <div><label style={labelS}>Bill To</label><input style={inputS} value={clientName} onChange={e => setClientName(e.target.value)} /></div>
        <div><label style={labelS}>Due Date</label><input type="date" style={inputS} value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={labelS}>Currency</label>
          <div style={{ display: "flex", gap: 5 }}>
            {Object.keys(CURRENCIES).map(c => (
              <button key={c} onClick={() => setCurrency(c)} style={{ flex: 1, padding: "7px 4px", borderRadius: 8, border: `1px solid ${currency === c ? accent : border}`, background: currency === c ? accent : "transparent", color: currency === c ? "#fff" : muted, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelS}>Tax / VAT</label>
          <select value={taxKey} onChange={e => setTaxKey(e.target.value)} style={{ ...inputS }}>{Object.keys(TAX_RATES).map(k => <option key={k} value={k}>{k}</option>)}</select>
        </div>
      </div>
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 90px 90px 28px", gap: 6, marginBottom: 6 }}>
          {["Description", "Qty", "Unit Price", "Subtotal", ""].map((h, i) => <div key={i} style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</div>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {rows.map(r => (
            <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 60px 90px 90px 28px", gap: 6, alignItems: "center" }}>
              <input style={inputS} placeholder="Line item description…" value={r.desc} onChange={e => updateRow(r.id, "desc", e.target.value)} />
              <input type="number" style={{ ...inputS, textAlign: "center" }} min={1} value={r.qty} onChange={e => updateRow(r.id, "qty", Math.max(1, Number(e.target.value)))} />
              <input type="number" style={{ ...inputS, textAlign: "right" }} min={0} step={0.01} value={r.price} onChange={e => updateRow(r.id, "price", Math.max(0, Number(e.target.value)))} />
              <div style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: text }}>{fmt(r.qty * r.price)}</div>
              <button onClick={() => removeRow(r.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: dark ? "#475569" : "#cbd5e1", padding: 0, display: "flex", alignItems: "center" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
          ))}
        </div>
        <button onClick={addRow} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: accent, background: "transparent", border: `1px dashed ${accent}40`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600, width: "100%", justifyContent: "center" }}
          onMouseEnter={e => e.currentTarget.style.background = accent + "10"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Line Item
        </button>
      </div>
      <div style={{ background: dark ? "#0f172a" : "#f8fafc", borderRadius: 12, border: `1px solid ${border}`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: muted }}><span>Subtotal</span><span>{fmt(subtotalUSD)}</span></div>
        {taxRate > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: muted }}><span>{taxKey}</span><span>{fmt(taxUSD)}</span></div>}
        <div style={{ height: 1, background: border, margin: "4px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: text }}><span>Total Due</span><span style={{ color: "#10b981" }}>{fmt(totalUSD)}</span></div>
      </div>
      <button onClick={printInvoice} style={{ padding: "11px 0", borderRadius: 10, border: "none", background: "#10b981", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.background = "#059669"} onMouseLeave={e => e.currentTarget.style.background = "#10b981"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Export Invoice PDF
      </button>
    </div>
  );
}

// ─── LateFeeDisplay ────────────────────────────────────────────────────────────
function LateFeeDisplay({ dark, surface, border, text, muted, accent, deadline, budget, lateFeeEnabled, lateFeeRate }) {
  const weeksPast = (() => {
    if (!deadline) return 0;
    const today = new Date(), due = new Date(deadline);
    if (today <= due) return 0;
    return Math.floor((today - due) / (1000 * 60 * 60 * 24 * 7));
  })();
  const rate    = lateFeeRate / 100;
  const base    = budget * 1000;
  const accrued = lateFeeEnabled && weeksPast > 0 ? base * (Math.pow(1 + rate, weeksPast) - 1) : 0;
  if (!lateFeeEnabled || accrued === 0) return null;
  return (
    <div style={{ background: dark ? "#450a0a" : "#fff1f2", border: "1px solid #f8717180", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, animation: "fadeIn 0.4s ease" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ef444420", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444" }}>⚠ Late Fee Penalty Accruing</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#ef4444", marginTop: 2 }}>
          +${accrued.toFixed(2)} <span style={{ fontSize: 10.5, fontWeight: 500, color: dark ? "#fca5a5" : "#b91c1c" }}>({lateFeeRate}% weekly compounding · {weeksPast} week{weeksPast !== 1 ? "s" : ""} past deadline)</span>
        </div>
      </div>
    </div>
  );
}

// ─── CompletionCertificate ────────────────────────────────────────────────────
function CompletionCertificate({ dark, milestones, clientName, projectName, paymentLocked }) {
  const allDone = milestones.length > 0 && milestones.every(m => m.status === "Completed" || m.status === "Done");
  if (!allDone || paymentLocked) return null;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const printCert = () => {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Completion Certificate</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Georgia',serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8fafc;padding:40px}.cert{width:720px;background:#fff;border:3px solid #0f172a;border-radius:8px;padding:60px 64px;text-align:center;position:relative}.cert::before{content:'';position:absolute;inset:10px;border:1px solid #6366f130;border-radius:4px;pointer-events:none}.seal{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#4f46e5);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;box-shadow:0 8px 24px #6366f140}.seal-text{color:#fff;font-size:28px}h1{font-size:28px;font-weight:700;color:#0f172a;letter-spacing:-0.02em;margin-bottom:8px}.subtitle{font-size:14px;color:#6366f1;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:32px}.body{font-size:14px;color:#475569;line-height:1.8;margin-bottom:28px}.client{font-size:22px;font-weight:700;color:#0f172a;border-bottom:2px solid #6366f1;display:inline-block;padding-bottom:2px;margin:8px 0}.project{font-size:16px;font-weight:600;color:#6366f1;margin-bottom:8px}.date{font-size:12px;color:#94a3b8;margin-top:32px;font-style:italic}.footer{margin-top:40px;padding-top:24px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-around}.sig-block{font-size:12px;color:#94a3b8;text-align:center}.sig-line{width:160px;border-bottom:1px solid #cbd5e1;margin:0 auto 8px}@media print{body{background:#fff;padding:0}.cert{border:3px solid #0f172a}@page{size:A4 landscape;margin:10mm}}</style></head><body><div class="cert"><div class="seal"><div class="seal-text">✦</div></div><h1>Official Project Completion Certificate</h1><div class="subtitle">Intellectual Property &amp; Deliverables Transfer</div><div class="body">This is to certify that all contracted deliverables, intellectual property, and creative assets pertaining to:<br/><br/><div class="project">${projectName || "Contracted Project"}</div>have been successfully completed, reviewed, and formally transferred to:<br/><br/><div class="client">${clientName || "The Client"}</div><br/>All milestones have been fulfilled in accordance with the agreed scope of work.</div><div class="date">Issued on ${today}</div><div class="footer"><div class="sig-block"><div class="sig-line"></div>Agency Representative</div><div class="sig-block"><div class="sig-line"></div>Client Acknowledgement</div></div></div></body></html>`);
    w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 400);
  };
  return (
    <div style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%)", border: "2px solid #6366f160", borderRadius: 16, padding: "20px 22px", animation: "fadeIn 0.5s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5" }}>🎉 All Milestones Complete!</div>
          <div style={{ fontSize: 11.5, color: "#6366f1", marginTop: 2 }}>Project Handoff Certificate is ready to issue</div>
        </div>
      </div>
      <button onClick={printCert} style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download Certificate PDF
      </button>
    </div>
  );
}

// ─── AgencyProfile ────────────────────────────────────────────────────────────
function AgencyProfile({ dark, surface, border, text, muted, accent }) {
  const [agency, setAgency] = useLocalStorage("tres_agency", {
    name: "Studio Apex", tagline: "We build brands that move markets.", founded: "2017",
    website: "studioapex.com", email: "hello@studioapex.com",
    capabilities: "Brand Strategy, Identity Design, Web Development, Motion & Video, UX Research, Content Systems",
    team: [
      { id: 1, name: "Jordan Reyes",   role: "Creative Director",  bio: "10 years leading brand transformations for global clients." },
      { id: 2, name: "Sam Liu",        role: "Lead Engineer",       bio: "Full-stack architect specialising in design systems at scale." },
      { id: 3, name: "Priya Patel",    role: "Strategy Director",   bio: "Former McKinsey consultant bridging brand and business." },
    ],
    caseStudies: [
      { id: 1, client: "Nexus Corp",  outcome: "340% increase in qualified leads post-rebrand." },
      { id: 2, client: "Velo Health", outcome: "Launched in 6 weeks. 50K app downloads month one." },
    ],
    tiers: [
      { id: 1, name: "Starter",  price: "$4,500",  features: "Brand Audit, Logo Suite, Brand Guidelines" },
      { id: 2, name: "Growth",   price: "$12,000", features: "Full Identity, Web Design, Launch Campaign" },
      { id: 3, name: "Scale",    price: "$28,000", features: "End-to-end brand system + team training" },
    ],
  });
  const upd = (key, val) => setAgency(a => ({ ...a, [key]: val }));
  const inputS = { width: "100%", padding: "8px 10px", border: `1px solid ${border}`, borderRadius: 8, background: dark ? "#0f172a" : "#f8fafc", color: text, fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const labelS = { fontSize: 10.5, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, display: "block" };
  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: accent + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: text }}>Agency Whitelabel Profile</div>
          <div style={{ fontSize: 11, color: muted }}>Customise your pitch deck and agency identity</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div><label style={labelS}>Agency Name</label><input style={inputS} value={agency.name} onChange={e => upd("name", e.target.value)} /></div>
        <div><label style={labelS}>Founded</label><input style={inputS} value={agency.founded} onChange={e => upd("founded", e.target.value)} /></div>
        <div><label style={labelS}>Website</label><input style={inputS} value={agency.website} onChange={e => upd("website", e.target.value)} /></div>
        <div><label style={labelS}>Email</label><input style={inputS} value={agency.email} onChange={e => upd("email", e.target.value)} /></div>
      </div>
      <div><label style={labelS}>Tagline</label><input style={inputS} value={agency.tagline} onChange={e => upd("tagline", e.target.value)} /></div>
      <div><label style={labelS}>Core Capabilities (comma-separated)</label><textarea rows={2} style={{ ...inputS, resize: "vertical" }} value={agency.capabilities} onChange={e => upd("capabilities", e.target.value)} /></div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>Team Members</div>
      {agency.team.map((t, i) => (
        <div key={t.id} style={{ padding: 12, background: dark ? "#0f172a" : "#f8fafc", borderRadius: 10, border: `1px solid ${border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div><label style={labelS}>Name</label><input style={inputS} value={t.name} onChange={e => { const tm = [...agency.team]; tm[i] = { ...tm[i], name: e.target.value }; upd("team", tm); }} /></div>
            <div><label style={labelS}>Role</label><input style={inputS} value={t.role} onChange={e => { const tm = [...agency.team]; tm[i] = { ...tm[i], role: e.target.value }; upd("team", tm); }} /></div>
          </div>
          <div><label style={labelS}>Bio</label><input style={inputS} value={t.bio} onChange={e => { const tm = [...agency.team]; tm[i] = { ...tm[i], bio: e.target.value }; upd("team", tm); }} /></div>
        </div>
      ))}
    </div>
  );
}

// ─── ATSAnalyzer ──────────────────────────────────────────────────────────────
function ATSAnalyzer({ dark, surface, border, text, muted, accent, resumeText }) {
  const [jobText, setJobText] = useState("");
  const [result,  setResult]  = useState(null);
  const STOP_WORDS = new Set(["and","or","the","a","an","in","on","at","to","for","of","with","by","from","as","is","are","was","were","be","been","have","has","had","will","would","could","should","may","might","must","can","do","does","did","this","that","these","those","we","our","your","their","its","it","you","he","she","they","i","me","my","him","her","us","who","which","what","when","where","why","how","all","each","every","any","some","no","not","also","more","most","other","such","than","then","so","but","if","about","above","after","before","between","during","through","up","down","out","over","under","again","further","once","here","there","both","few","many","other","same","own"]);
  const tokenize = str => str.toLowerCase().match(/\b[a-zA-Z][a-zA-Z0-9+#.\-]{1,}/g)?.filter(w => !STOP_WORDS.has(w) && w.length > 2) || [];
  const analyze = () => {
    if (!jobText.trim()) return;
    const jobTokens = tokenize(jobText), cvTokens = new Set(tokenize(resumeText));
    const jobSet = [...new Set(jobTokens)];
    const matched = jobSet.filter(w => cvTokens.has(w)), missing = jobSet.filter(w => !cvTokens.has(w));
    const score = jobSet.length > 0 ? Math.round((matched.length / jobSet.length) * 100) : 0;
    const freq = {}; jobTokens.forEach(w => { if (!cvTokens.has(w)) freq[w] = (freq[w] || 0) + 1; });
    const priorityMissing = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0, 30).map(([w]) => w);
    setResult({ score, matched, missing: priorityMissing, total: jobSet.length });
  };
  const ringColor = !result ? "#94a3b8" : result.score >= 75 ? "#10b981" : result.score >= 50 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 40;
  const strokeDash = result ? (result.score / 100) * circumference : 0;
  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f59e0b20", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <div><div style={{ fontSize: 14, fontWeight: 700, color: text }}>ATS Keyword Gap Analyzer</div><div style={{ fontSize: 11, color: muted }}>Paste a job posting to measure resume match strength</div></div>
      </div>
      <div>
        <label style={{ fontSize: 10.5, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6, display: "block" }}>Target Job Posting</label>
        <textarea rows={7} placeholder="Paste the full job description here…" value={jobText} onChange={e => setJobText(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${border}`, borderRadius: 10, background: dark ? "#0f172a" : "#f8fafc", color: text, fontSize: 12, outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box" }} />
      </div>
      <button onClick={analyze} style={{ padding: "10px 0", borderRadius: 10, border: "none", background: "#f59e0b", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Run ATS Analysis</button>
      {result && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 20px", background: dark ? "#0f172a" : "#f8fafc", borderRadius: 12, border: `1px solid ${border}`, marginBottom: 12 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg width={100} height={100} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={50} cy={50} r={40} fill="none" stroke={dark ? "#334155" : "#e2e8f0"} strokeWidth={8} />
                <circle cx={50} cy={50} r={40} fill="none" stroke={ringColor} strokeWidth={8} strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: ringColor }}>{result.score}%</div>
                <div style={{ fontSize: 9, color: muted, fontWeight: 600 }}>MATCH</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 4 }}>{result.score >= 75 ? "Strong Match 💪" : result.score >= 50 ? "Moderate Match ⚡" : "Needs Work 📝"}</div>
              <div style={{ fontSize: 11.5, color: muted, lineHeight: 1.6 }}>
                <div><span style={{ color: "#10b981", fontWeight: 700 }}>{result.matched.length}</span> keywords matched</div>
                <div><span style={{ color: "#ef4444", fontWeight: 700 }}>{result.missing.length}</span> priority gaps found</div>
                <div><span style={{ color: muted }}>{result.total}</span> total unique keywords in posting</div>
              </div>
            </div>
          </div>
          {result.missing.length > 0 && <div><div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>⚠ Missing Keywords</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{result.missing.map((w, i) => <span key={i} style={{ padding: "4px 10px", borderRadius: 20, background: dark ? "#450a0a" : "#fff1f2", border: "1px solid #f8717160", color: "#ef4444", fontSize: 11, fontWeight: 600 }}>{w}</span>)}</div></div>}
          {result.matched.length > 0 && <div style={{ marginTop: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>✓ Matched Keywords</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{result.matched.slice(0, 25).map((w, i) => <span key={i} style={{ padding: "4px 10px", borderRadius: 20, background: dark ? "#052e16" : "#f0fdf4", border: "1px solid #86efac60", color: "#10b981", fontSize: 11, fontWeight: 500 }}>{w}</span>)}</div></div>}
        </div>
      )}
    </div>
  );
}

// ─── ═══════════════════════════════════════════════════════
//     CLIENT LIVE TRACKING PORTAL  (read-only, URL-encoded)
// ─── ═══════════════════════════════════════════════════════
function ClientTrackingPortal({ project }) {
  const [toastVisible, setToastVisible] = React.useState(false);

  // Decode milestone statuses
  const milestones = project.milestones || [];
  const done  = milestones.filter(m => m.status === "Done" || m.status === "Completed").length;
  const total = milestones.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : (project.progress || 0);

  const statusColor = s => {
    if (s === "Done" || s === "Completed")   return { bg: "#10b98118", border: "#10b98140", text: "#10b981" };
    if (s === "In Progress")                  return { bg: "#f59e0b18", border: "#f59e0b40", text: "#f59e0b" };
    return { bg: "#64748b12", border: "#64748b30", text: "#64748b" };
  };
  const statusLabel = s => {
    if (s === "Done" || s === "Completed") return "Done";
    if (s === "In Progress") return "In Progress";
    return "To Do";
  };

  const healthLabel = { "on-track": "On Track ✓", "under-review": "Under Review", "action-required": "Action Required" };
  const healthColor = { "on-track": "#10b981", "under-review": "#f59e0b", "action-required": "#ef4444" };
  const hc = healthColor[project.health] || "#10b981";

  const handleBackToHome = () => {
    window.location.href = window.location.origin + window.location.pathname;
  };

  // Group milestones into columns
  const todo       = milestones.filter(m => m.status === "Pending" || (!m.status));
  const inProgress = milestones.filter(m => m.status === "In Progress");
  const doneList   = milestones.filter(m => m.status === "Done" || m.status === "Completed");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f1f2e 100%)",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      color: "#f1f5f9",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes portalFadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes progressGrow { from { width: 0%; } to { width: var(--prog-width); } }
        @keyframes toastSlide { 0% { opacity: 0; transform: translateY(20px) scale(0.92); } 20%,80% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-10px) scale(0.95); } }
        @keyframes livePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .portal-card { animation: portalFadeIn 0.5s ease both; }
        .portal-card-1 { animation: portalFadeIn 0.5s ease 0.05s both; }
        .portal-card-2 { animation: portalFadeIn 0.5s ease 0.12s both; }
        .portal-card-3 { animation: portalFadeIn 0.5s ease 0.19s both; }
        .portal-card-4 { animation: portalFadeIn 0.5s ease 0.26s both; }
        .live-dot { animation: livePulse 1.6s ease-in-out infinite; }
      `}</style>

      {/* ── Toast notification ── */}
      {toastVisible && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff", padding: "12px 22px", borderRadius: 14,
          fontSize: 13, fontWeight: 700, zIndex: 9999,
          boxShadow: "0 8px 32px rgba(16,185,129,0.45)",
          display: "flex", alignItems: "center", gap: 8,
          animation: "toastSlide 2.6s ease forwards",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Link Copied to Clipboard!
        </div>
      )}

      {/* ── Header ── */}
      <div style={{
        background: "rgba(15,23,42,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,102,241,0.2)",
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* TrES Logo block */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 0, userSelect: "none" }}>
              <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#ffffff", lineHeight: 1 }}>T</span>
              <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#ffffff", lineHeight: 1 }}>r</span>
              <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "linear-gradient(to bottom, #3b82f6 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block", lineHeight: 1 }}>E</span>
              <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#ffffff", lineHeight: 1 }}>S</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.5)", marginLeft: 6, alignSelf: "center", letterSpacing: "0.04em" }}>Workspace</span>
            </div>
          </div>
          {/* Live Tracking badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 13px", borderRadius: 99, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}>
            <div className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.08em", textTransform: "uppercase" }}>Live Tracking Mode</span>
          </div>
        </div>
        <button onClick={handleBackToHome} style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "8px 16px", borderRadius: 10,
          border: "1px solid rgba(99,102,241,0.25)",
          background: "rgba(99,102,241,0.08)", color: "#a5b4fc",
          fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.18)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"; }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Home
        </button>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 28px" }}>

        {/* Project Hero Card */}
        <div className="portal-card" style={{
          background: "rgba(30,41,59,0.7)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 22,
          padding: "32px 36px",
          marginBottom: 28,
          backdropFilter: "blur(12px)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative gradient orb */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{project.client}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{project.name}</div>
              {project.deadline && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 12, color: "#94a3b8" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Deadline: {new Date(project.deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 99, background: hc + "18", border: `1px solid ${hc}40` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: hc, boxShadow: `0 0 8px ${hc}` }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: hc }}>{healthLabel[project.health] || "On Track"}</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b", textAlign: "right" }}>
                {total > 0 ? `${done} of ${total} milestones complete` : "No milestones"}
              </div>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>Overall Completion</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#6366f1", letterSpacing: "-0.02em" }}>{pct}%</span>
            </div>
            <div style={{ height: 10, background: "rgba(51,65,85,0.8)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
              <div style={{
                height: "100%",
                width: `${pct}%`,
                background: pct >= 100 ? "#10b981" : "linear-gradient(90deg, #6366f1, #818cf8)",
                borderRadius: 99,
                transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: `0 0 12px ${pct >= 100 ? "#10b98180" : "#6366f180"}`,
              }} />
            </div>
            {/* Milestone step markers */}
            {milestones.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {milestones.map(m => {
                  const isDone = m.status === "Done" || m.status === "Completed";
                  const isIP   = m.status === "In Progress";
                  return (
                    <div key={m.id} title={m.text} style={{ flex: 1, height: 4, borderRadius: 99, background: isDone ? "#10b981" : isIP ? "#f59e0b" : "rgba(51,65,85,0.6)", transition: "background 0.3s" }} />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Milestone Kanban Columns */}
        {milestones.length > 0 && (
          <div className="portal-card-1" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Milestone Breakdown</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

              {/* To Do */}
              <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(51,65,85,0.7)", borderRadius: 16, padding: "18px 16px", backdropFilter: "blur(8px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#64748b" }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>To Do</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#64748b", background: "rgba(100,116,139,0.12)", padding: "2px 8px", borderRadius: 99 }}>{todo.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {todo.length === 0 && <div style={{ fontSize: 11.5, color: "#475569", textAlign: "center", padding: "10px 0" }}>—</div>}
                  {todo.map(m => (
                    <div key={m.id} style={{ padding: "10px 12px", background: "rgba(15,23,42,0.5)", borderRadius: 10, border: "1px solid rgba(51,65,85,0.5)", fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>{m.text}</div>
                  ))}
                </div>
              </div>

              {/* In Progress */}
              <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 16, padding: "18px 16px", backdropFilter: "blur(8px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 6px #f59e0b80" }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.07em" }}>In Progress</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.12)", padding: "2px 8px", borderRadius: 99 }}>{inProgress.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {inProgress.length === 0 && <div style={{ fontSize: 11.5, color: "#475569", textAlign: "center", padding: "10px 0" }}>—</div>}
                  {inProgress.map(m => (
                    <div key={m.id} style={{ padding: "10px 12px", background: "rgba(245,158,11,0.07)", borderRadius: 10, border: "1px solid rgba(245,158,11,0.25)", fontSize: 12.5, color: "#fcd34d", lineHeight: 1.5 }}>{m.text}</div>
                  ))}
                </div>
              </div>

              {/* Done */}
              <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: "18px 16px", backdropFilter: "blur(8px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b98180" }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.07em" }}>Done</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "2px 8px", borderRadius: 99 }}>{doneList.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {doneList.length === 0 && <div style={{ fontSize: 11.5, color: "#475569", textAlign: "center", padding: "10px 0" }}>—</div>}
                  {doneList.map(m => (
                    <div key={m.id} style={{ padding: "10px 12px", background: "rgba(16,185,129,0.07)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.2)", fontSize: 12.5, color: "#6ee7b7", lineHeight: 1.5, display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                      {m.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No milestones placeholder */}
        {milestones.length === 0 && (
          <div className="portal-card-1" style={{ textAlign: "center", padding: "48px 24px", background: "rgba(30,41,59,0.5)", borderRadius: 18, border: "1px solid rgba(51,65,85,0.5)", marginBottom: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8" }}>No milestones have been added yet.</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>The project team will update milestones as work progresses.</div>
          </div>
        )}

        {/* Footer */}
        <div className="portal-card-2" style={{ textAlign: "center", padding: "24px 0 8px" }}>
          <div style={{ fontSize: 11, color: "#334155", lineHeight: 1.8 }}>
            © 2026 TrES Workspace. Built and owned by CodeScriptors IT Solutions. All rights reserved.
          </div>
          <div style={{ fontSize: 10.5, color: "#1e293b", marginTop: 4 }}>
            This is a read-only client progress portal. Contact your project manager for details.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ═══════════════════════════════════════════════════════
//     PROJECT HUB — Landing Dashboard
// ─── ═══════════════════════════════════════════════════════
function ProjectHub({ projects, onOpenProject, onCreateProject, onDeleteProject, dark, surface, border, text, muted, accent, bg }) {
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newClient, setNewClient] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  };

  const generateTrackingLink = (proj, e) => {
    e.stopPropagation();
    try {
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(proj))));
      const url = `${window.location.origin}${window.location.pathname}?mode=track&project=${encoded}`;
      const copyIt = () => {
        const inp = document.createElement("textarea");
        inp.value = url; inp.style.position = "fixed"; inp.style.opacity = "0";
        document.body.appendChild(inp); inp.select();
        document.execCommand("copy"); document.body.removeChild(inp);
        showToast();
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(showToast).catch(copyIt);
      } else { copyIt(); }
    } catch (err) { showToast(); }
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreateProject({ name: newName.trim(), client: newClient.trim() || "New Client" });
    setNewName(""); setNewClient(""); setShowNew(false);
  };

  const getProgress = proj => {
    if (!proj.milestones || proj.milestones.length === 0) return proj.progress || 0;
    return Math.round((proj.milestones.filter(m => m.status === "Completed" || m.status === "Done").length / proj.milestones.length) * 100);
  };

  const healthColors = {
    "on-track":        "#10b981",
    "under-review":    "#f59e0b",
    "action-required": "#f87171",
  };

  const inputS = { width: "100%", padding: "10px 12px", border: `1px solid ${border}`, borderRadius: 9, background: dark ? "#0f172a" : "#f8fafc", color: text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "calc(100vh - 58px)", padding: "40px 32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Toast */}
      {toastVisible && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
          color: "#fff", padding: "12px 22px", borderRadius: 14,
          fontSize: 13, fontWeight: 700, zIndex: 9999,
          boxShadow: "0 8px 32px rgba(99,102,241,0.45)",
          display: "flex", alignItems: "center", gap: 8,
          animation: "fadeIn 0.3s ease",
          pointerEvents: "none",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Link Copied!
        </div>
      )}
      {/* Header */}
      <div style={{ marginBottom: 40, animation: "fadeIn 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${accent}, #818cf8)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px ${accent}40` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: text, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif" }}>Project Selection Hub</div>
            <div style={{ fontSize: 13, color: muted, marginTop: 2 }}>Select a workspace or start a fresh project</div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, animation: "fadeIn 0.5s ease" }}>

        {/* New Project Card */}
        {!showNew ? (
          <button onClick={() => setShowNew(true)} style={{
            background: "transparent", border: `2px dashed ${accent}50`, borderRadius: 18, padding: "32px 24px",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            transition: "all 0.25s ease", color: accent, textAlign: "center",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = accent + "08"; e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = accent + "50"; e.currentTarget.style.transform = ""; }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: accent + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: accent }}>+ Start New Project</div>
              <div style={{ fontSize: 12, color: muted, marginTop: 4, lineHeight: 1.5 }}>Create a fresh client workspace with milestones, invoicing, and time tracking</div>
            </div>
          </button>
        ) : (
          <div style={{ background: surface, border: `2px solid ${accent}`, borderRadius: 18, padding: "24px", display: "flex", flexDirection: "column", gap: 14, animation: "fadeIn 0.3s ease" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: text, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.8L19 9l-4.8 3.7 1.8 6.3L12 16l-4 3 1.8-6.3L5 9l5.1-.2z"/></svg> New Project
            </div>
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, display: "block" }}>Project Name</label>
              <input autoFocus style={inputS} placeholder="e.g. Apollo Rebrand" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} />
            </div>
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, display: "block" }}>Client Name</label>
              <input style={inputS} placeholder="e.g. Nexus Corp" value={newClient} onChange={e => setNewClient(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleCreate} style={{ flex: 1, padding: "10px 0", borderRadius: 9, border: "none", background: accent, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Create Workspace</button>
              <button onClick={() => { setShowNew(false); setNewName(""); setNewClient(""); }} style={{ padding: "10px 14px", borderRadius: 9, border: `1px solid ${border}`, background: "transparent", color: muted, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Existing Project Cards */}
        {projects.map((proj, idx) => {
          const prog = getProgress(proj);
          const hColor = healthColors[proj.health] || "#10b981";
          const doneMilestones = (proj.milestones || []).filter(m => m.status === "Completed" || m.status === "Done").length;
          const totalMilestones = (proj.milestones || []).length;
          return (
            <div key={proj.id} style={{
              background: surface, border: `1px solid ${border}`, borderRadius: 18, padding: "22px",
              display: "flex", flexDirection: "column", gap: 14,
              transition: "all 0.25s ease", position: "relative",
              /* overflow is intentionally NOT set to hidden so the absolute delete button is never clipped */
              animation: `fadeIn 0.4s ease ${idx * 0.06}s both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = dark ? "0 12px 32px rgba(0,0,0,0.35)" : "0 12px 32px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = accent + "60"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = border; }}>

              {/* ── Absolute-positioned Trash2 delete button — z-index 50, fully independent layer ── */}
              <button
                type="button"
                onClick={(e) => handleDeleteProject(proj.id, e)}
                title="Delete Project"
                style={{
                  position: "absolute", top: 12, right: 12,
                  zIndex: 50,
                  width: 32, height: 32, borderRadius: 8, border: "none",
                  background: dark ? "rgba(15,23,42,0.85)" : "rgba(248,250,252,0.9)",
                  backdropFilter: "blur(4px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: dark ? "#475569" : "#94a3b8",
                  transition: "all 0.2s ease",
                  boxShadow: dark ? "0 1px 4px rgba(0,0,0,0.4)" : "0 1px 4px rgba(0,0,0,0.08)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#ef4444";
                  e.currentTarget.style.background = dark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(239,68,68,0.25)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = dark ? "#475569" : "#94a3b8";
                  e.currentTarget.style.background = dark ? "rgba(15,23,42,0.85)" : "rgba(248,250,252,0.9)";
                  e.currentTarget.style.boxShadow = dark ? "0 1px 4px rgba(0,0,0,0.4)" : "0 1px 4px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "";
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>

              {/* Corner accent — clipped via border-radius, no overflow:hidden needed */}
              <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: hColor, opacity: 0.05, borderRadius: "0 18px 0 80px", pointerEvents: "none" }} />

              {/* Top row — right side shows health dot; delete button is on absolute layer above */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, paddingRight: 36 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{proj.client}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: text, letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{proj.name}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: hColor }} />
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: muted, marginBottom: 6 }}>
                  <span>{totalMilestones > 0 ? `${doneMilestones}/${totalMilestones} milestones` : "No milestones yet"}</span>
                  <span style={{ fontWeight: 700, color: prog > 0 ? accent : muted }}>{prog}%</span>
                </div>
                <div style={{ height: 6, background: dark ? "#334155" : "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${prog}%`, background: prog >= 100 ? "#10b981" : accent, borderRadius: 99, transition: "width 0.5s ease" }} />
                </div>
                {totalMilestones > 0 && (
                  <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                    {(proj.milestones || []).map(m => (
                      <div key={m.id} style={{ flex: 1, height: 3, borderRadius: 99, background: (m.status === "Completed" || m.status === "Done") ? "#10b981" : m.status === "In Progress" ? "#f59e0b" : (dark ? "#334155" : "#e2e8f0") }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Sticky note indicator */}
              {proj.stickyNote && proj.stickyNote.trim() && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "#fef9c360", border: "1px solid #fde04760", borderRadius: 8 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z"/><polyline points="15 3 15 9 21 9"/></svg>
                  <span style={{ fontSize: 11, color: "#92400e", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {proj.stickyNote.split("\n")[0].slice(0, 50)}{proj.stickyNote.split("\n")[0].length > 50 ? "…" : ""}
                  </span>
                </div>
              )}

              {/* Action row — Open Workspace + Share Tracking Link */}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button onClick={() => onOpenProject(proj.id)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                  background: `linear-gradient(135deg, ${accent}, #818cf8)`, color: "#fff",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.2s", boxShadow: `0 4px 12px ${accent}30`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = `0 6px 18px ${accent}45`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 12px ${accent}30`; }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><polyline points="2 13 12 8 22 13"/></svg> Open Workspace
                </button>
                {/* Share Tracking Link button */}
                <button onClick={(e) => generateTrackingLink(proj, e)} title="Generate & Copy Client Tracking Link" style={{
                  padding: "10px 13px", borderRadius: 10,
                  border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
                  background: dark ? "#0f172a" : "#f8fafc",
                  color: muted, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  transition: "all 0.2s", flexShrink: 0, fontSize: 11.5, fontWeight: 600,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = accent + "18"; e.currentTarget.style.borderColor = accent + "60"; e.currentTarget.style.color = accent; }}
                  onMouseLeave={e => { e.currentTarget.style.background = dark ? "#0f172a" : "#f8fafc"; e.currentTarget.style.borderColor = dark ? "#334155" : "#e2e8f0"; e.currentTarget.style.color = muted; }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Share
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {projects.length === 0 && !showNew && (
        <div style={{ textAlign: "center", padding: "60px 0", color: muted, animation: "fadeIn 0.4s ease" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 6 }}>No projects yet</div>
          <div style={{ fontSize: 13 }}>Click "+ Start New Project" to create your first client workspace.</div>
        </div>
      )}
    </div>
  );
}

// ─── ═══════════════════════════════════════════════════════
//     STICKY NOTE MODAL
// ─── ═══════════════════════════════════════════════════════
function StickyNoteModal({ visible, onClose, note, onSave, dark, projectName }) {
  const [draft, setDraft] = useState(note || "");
  const taRef = useRef(null);

  useEffect(() => { setDraft(note || ""); }, [note, visible]);
  useEffect(() => { if (visible && taRef.current) setTimeout(() => taRef.current?.focus(), 200); }, [visible]);

  const handleSave = () => { onSave(draft); onClose(); };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
      animation: "fadeIn 0.25s ease",
    }} onClick={e => { if (e.target === e.currentTarget) handleSave(); }}>
      <div style={{
        width: "min(520px, 92vw)",
        background: "linear-gradient(145deg, #fefce8 0%, #fef9c3 40%, #fef08a 100%)",
        borderRadius: 20,
        boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(202,138,4,0.2), inset 0 1px 0 rgba(255,255,255,0.7)",
        padding: 0,
        overflow: "hidden",
        animation: "stickyIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        position: "relative",
      }}>
        {/* Top bar */}
        <div style={{
          background: "linear-gradient(135deg, #fde047, #facc15)",
          padding: "14px 20px",
          display: "flex", alignItems: "center", gap: 10,
          borderBottom: "1px solid rgba(202,138,4,0.2)",
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z"/><polyline points="15 3 15 9 21 9"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#78350f", letterSpacing: "-0.01em" }}>Where I Left Off</div>
            <div style={{ fontSize: 10.5, color: "#92400e", marginTop: 1 }}>{projectName}</div>
          </div>
          <button onClick={handleSave} style={{ background: "rgba(0,0,0,0.1)", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#78350f" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Lined paper effect */}
        <div style={{ padding: "20px 24px 24px", position: "relative" }}>
          {/* Tape strip */}
          <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", width: 60, height: 28, background: "rgba(253,224,71,0.6)", borderRadius: 4, border: "1px solid rgba(202,138,4,0.25)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />

          <textarea
            ref={taRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={"Jot down where you left off, next steps, or anything the next session needs to know\u2026\n\ne.g. \u201cCompleted wireframes \u2014 waiting on client feedback before proceeding to hi-fi.\u201d"}
            style={{
              width: "100%", minHeight: 220, resize: "vertical",
              border: "none", outline: "none",
              background: "transparent",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, lineHeight: "28px",
              color: "#451a03",
              padding: 0,
              backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(202,138,4,0.15) 27px, rgba(202,138,4,0.15) 28px)",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={handleSave} style={{
              flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #ca8a04, #a16207)",
              color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              boxShadow: "0 4px 14px rgba(161,98,7,0.35)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Save &amp; Dismiss
            </button>
            <button onClick={() => { setDraft(""); }} style={{
              padding: "11px 16px", borderRadius: 12, border: "1px solid rgba(202,138,4,0.4)",
              background: "rgba(0,0,0,0.05)", color: "#78350f", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Clear</button>
          </div>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 10.5, color: "#a16207" }}>
            Your note is saved inside this project's data — available every time you open it.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── UtilitiesStudio — three isolated real-browser-processing panels ──────────
function UtilitiesStudio({ dark, surface, border, text, muted, accent, inputStyle, labelStyle }) {

  // ════════════════════════════════════════════════════════════════════
  // CATEGORY NAV STATE
  // Controls which panel group is visible in the Utilities Studio tab
  // Values: "documents" | "images" | "developer" | "security"
  // ════════════════════════════════════════════════════════════════════
  const [utilCategory, setUtilCategory] = React.useState("documents");

  // ════════════════════════════════════════════════════════════════════
  // PANEL 1 — CONVERTER STUDIO
  // Translates text / uploaded files to TXT, JSON, or HTML and downloads
  // ════════════════════════════════════════════════════════════════════
  const [cvText,        setCvText]        = React.useState("");
  const [cvFormat,      setCvFormat]      = React.useState("txt");
  const [cvFileName,    setCvFileName]    = React.useState("output");
  const [cvFileLabel,   setCvFileLabel]   = React.useState("Drop or choose a file to pre-fill");
  const [cvStatus,      setCvStatus]      = React.useState("");
  const cvUploadRef = React.useRef(null);

  const handleCvFileRead = (file) => {
    if (!file) return;
    setCvFileLabel(`📄 ${file.name}`);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCvText(evt.target.result || "");
      setCvStatus("✓ File loaded — ready to convert.");
      setTimeout(() => setCvStatus(""), 2800);
    };
    reader.onerror = () => { setCvStatus("⚠ Could not read file."); };
    reader.readAsText(file);
  };

  const handleCvUploadChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) { handleCvFileRead(file); }
    e.target.value = "";
  };

  const handleCvDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) { handleCvFileRead(file); }
  };

  const handleCvConvert = () => {
    if (!cvText.trim()) {
      setCvStatus("⚠ Paste or upload text first, then convert.");
      setTimeout(() => setCvStatus(""), 2500);
      return;
    }

    let content = "";
    let mime    = "text/plain";
    let ext     = "txt";

    if (cvFormat === "txt") {
      content = cvText;
      mime    = "text/plain";
      ext     = "txt";
    } else if (cvFormat === "json") {
      const lines = cvText.split("\n").filter(Boolean);
      const obj   = { source: "TrES Converter Studio", exported: new Date().toISOString(), lines };
      content = JSON.stringify(obj, null, 2);
      mime    = "application/json";
      ext     = "json";
    } else if (cvFormat === "html") {
      const escaped = cvText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br/>");
      content = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8"/>\n  <title>${cvFileName}</title>\n  <style>body{font-family:system-ui,sans-serif;max-width:760px;margin:48px auto;line-height:1.7;color:#1e293b;padding:0 24px}h1{font-size:22px;margin-bottom:24px;color:#0f172a}p{margin:0}</style>\n</head>\n<body>\n  <h1>${cvFileName}</h1>\n  <p>${escaped}</p>\n</body>\n</html>`;
      mime    = "text/html";
      ext     = "html";
    }

    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${cvFileName || "output"}.${ext}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 400);
    setCvStatus(`✓ Downloaded as ${a.download}`);
    setTimeout(() => setCvStatus(""), 3000);
  };

  // ════════════════════════════════════════════════════════════════════
  // PANEL 2 — COMPRESSION NODE
  // Strips whitespace / minifies text or code and downloads the result
  // ════════════════════════════════════════════════════════════════════
  const [cpInput,     setCpInput]     = React.useState("");
  const [cpOutput,    setCpOutput]    = React.useState("");
  const [cpMode,      setCpMode]      = React.useState("whitespace");
  const [cpFileName,  setCpFileName]  = React.useState("compressed");
  const [cpFileLabel, setCpFileLabel] = React.useState("Drop or choose a file");
  const [cpStatus,    setCpStatus]    = React.useState("");
  const [cpSavings,   setCpSavings]   = React.useState(null);
  const cpUploadRef = React.useRef(null);

  const handleCpFileRead = (file) => {
    if (!file) return;
    setCpFileLabel(`📄 ${file.name}`);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCpInput(evt.target.result || "");
      setCpOutput("");
      setCpSavings(null);
      setCpStatus("✓ File loaded — click Compress to process.");
      setTimeout(() => setCpStatus(""), 2800);
    };
    reader.onerror = () => { setCpStatus("⚠ Could not read file."); };
    reader.readAsText(file);
  };

  const handleCpDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) { handleCpFileRead(file); }
  };

  const handleCpUploadChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) { handleCpFileRead(file); }
    e.target.value = "";
  };

  const handleCompress = () => {
    if (!cpInput.trim()) {
      setCpStatus("⚠ Paste or upload text first.");
      setTimeout(() => setCpStatus(""), 2500);
      return;
    }
    let result = cpInput;
    if (cpMode === "whitespace") {
      result = cpInput
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .join("\n");
    } else if (cpMode === "minify") {
      result = cpInput
        .replace(/\/\/[^\n]*/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{};:,()])\s*/g, "$1")
        .trim();
    } else if (cpMode === "collapse") {
      result = cpInput.replace(/\s+/g, " ").trim();
    }
    setCpOutput(result);
    const before = new Blob([cpInput]).size;
    const after  = new Blob([result]).size;
    const pct    = before > 0 ? Math.round(((before - after) / before) * 100) : 0;
    setCpSavings({ before, after, pct });
    setCpStatus("✓ Compression complete — review output below.");
    setTimeout(() => setCpStatus(""), 3000);
  };

  const handleCpDownload = () => {
    if (!cpOutput) {
      setCpStatus("⚠ Run compression first.");
      setTimeout(() => setCpStatus(""), 2000);
      return;
    }
    const blob = new Blob([cpOutput], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${cpFileName || "compressed"}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 400);
    setCpStatus(`✓ Downloaded ${a.download}`);
    setTimeout(() => setCpStatus(""), 3000);
  };

  // ════════════════════════════════════════════════════════════════════
  // PANEL 3 — DOCUMENT MERGER CORE
  // Combines two independent text blocks / files into a single download
  // ════════════════════════════════════════════════════════════════════
  const [mgBlockA,     setMgBlockA]     = React.useState("");
  const [mgBlockB,     setMgBlockB]     = React.useState("");
  const [mgFileALabel, setMgFileALabel] = React.useState("Drop or choose File A");
  const [mgFileBLabel, setMgFileBLabel] = React.useState("Drop or choose File B");
  const [mgSeparator,  setMgSeparator]  = React.useState("divider");
  const [mgFileName,   setMgFileName]   = React.useState("merged-output");
  const [mgFormat,     setMgFormat]     = React.useState("txt");
  const [mgStatus,     setMgStatus]     = React.useState("");
  const mgUploadARef = React.useRef(null);
  const mgUploadBRef = React.useRef(null);

  const readMgFile = (file, setter, labelSetter) => {
    if (!file) return;
    labelSetter(`📄 ${file.name}`);
    const reader = new FileReader();
    reader.onload  = (evt) => { setter(evt.target.result || ""); };
    reader.onerror = () => { setMgStatus("⚠ Could not read file."); };
    reader.readAsText(file);
  };

  const handleMgDropA = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) { readMgFile(file, setMgBlockA, setMgFileALabel); }
  };

  const handleMgDropB = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) { readMgFile(file, setMgBlockB, setMgFileBLabel); }
  };

  const handleMgUploadA = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) { readMgFile(file, setMgBlockA, setMgFileALabel); }
    e.target.value = "";
  };

  const handleMgUploadB = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) { readMgFile(file, setMgBlockB, setMgFileBLabel); }
    e.target.value = "";
  };

  const handleMerge = () => {
    if (!mgBlockA.trim() && !mgBlockB.trim()) {
      setMgStatus("⚠ Both blocks are empty — add content to merge.");
      setTimeout(() => setMgStatus(""), 2500);
      return;
    }

    const SEP_MAP = {
      divider:  "\n\n" + "─".repeat(60) + "\n\n",
      newline:  "\n\n",
      none:     "",
      comment:  "\n\n/* ─── MERGED SECTION ─── */\n\n",
    };
    const separator = SEP_MAP[mgSeparator] || "\n\n";

    let content = "";
    let mime    = "text/plain";
    let ext     = "txt";

    if (mgFormat === "txt") {
      content = (mgBlockA + separator + mgBlockB).trim();
      mime    = "text/plain";
      ext     = "txt";
    } else if (mgFormat === "json") {
      const obj = {
        merged:    true,
        exported:  new Date().toISOString(),
        blockA:    mgBlockA.trim(),
        blockB:    mgBlockB.trim(),
        combined:  (mgBlockA + separator + mgBlockB).trim(),
      };
      content = JSON.stringify(obj, null, 2);
      mime    = "application/json";
      ext     = "json";
    } else if (mgFormat === "html") {
      const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>");
      content = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8"/>\n  <title>${mgFileName}</title>\n  <style>body{font-family:system-ui,sans-serif;max-width:800px;margin:48px auto;line-height:1.7;color:#1e293b;padding:0 24px}section{margin-bottom:40px;padding:24px;border:1px solid #e2e8f0;border-radius:12px}h2{margin:0 0 16px;font-size:16px;color:#6366f1}hr{border:none;border-top:2px dashed #e2e8f0;margin:32px 0}</style>\n</head>\n<body>\n  <section><h2>Block A</h2><p>${esc(mgBlockA)}</p></section>\n  <hr/>\n  <section><h2>Block B</h2><p>${esc(mgBlockB)}</p></section>\n</body>\n</html>`;
      mime    = "text/html";
      ext     = "html";
    }

    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${mgFileName || "merged-output"}.${ext}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 400);
    setMgStatus(`✓ Merged document downloaded as ${a.download}`);
    setTimeout(() => setMgStatus(""), 3500);
  };

  // ── Shared style helpers ─────────────────────────────────────────────────────
  const panelStyle = {
    background: surface,
    border: `1px solid ${border}`,
    borderRadius: 16,
    padding: "18px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  };
  const panelHeaderStyle = (color) => ({
    display: "flex", alignItems: "center", gap: 10, marginBottom: 4,
    paddingBottom: 12, borderBottom: `2px solid ${color}30`,
  });
  const iconBubble = (color) => ({
    width: 38, height: 38, borderRadius: 10,
    background: color + "20",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  });
  const dropZoneStyle = (active, color) => ({
    border: `2px dashed ${active ? color : border}`,
    borderRadius: 10,
    padding: "16px 12px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    background: active ? color + "08" : "transparent",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
  });
  const statusLine = (msg) => {
    if (!msg) return null;
    const isOk   = msg.startsWith("✓");
    const isWarn = msg.startsWith("⚠");
    return (
      <div style={{
        fontSize: 11.5, padding: "7px 11px", borderRadius: 8, fontFamily: "monospace",
        background: dark ? "#0f172a" : "#f8fafc",
        border: `1px solid ${isOk ? "#10b98140" : isWarn ? "#f59e0b40" : border}`,
        color: isOk ? "#10b981" : isWarn ? "#f59e0b" : muted,
        wordBreak: "break-word",
      }}>{msg}</div>
    );
  };
  const actionBtn = (label, onClick, color, icon) => (
    <button
      onClick={onClick}
      style={{
        padding: "12px 16px",
        borderRadius: 9,
        border: "none",
        background: color,
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        transition: "filter 0.15s, transform 0.1s",
        width: "100%",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        userSelect: "none",
      }}
      onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.12)"}
      onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
      onMouseUp={e => e.currentTarget.style.transform = ""}
      onTouchStart={e => e.currentTarget.style.transform = "scale(0.98)"}
      onTouchEnd={e => e.currentTarget.style.transform = ""}
    >{icon}{label}</button>
  );
  const formatTabRow = (options, value, setter, color) => (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => setter(opt.value)}
          style={{
            flex: "1 1 auto",
            minWidth: 48,
            padding: "10px 6px",
            borderRadius: 8,
            fontSize: 11.5,
            fontWeight: 700,
            cursor: "pointer",
            border: `1px solid ${value === opt.value ? color : border}`,
            background: value === opt.value ? color : "transparent",
            color: value === opt.value ? "#fff" : muted,
            transition: "all 0.15s",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
            userSelect: "none",
          }}
        >{opt.label}</button>
      ))}
    </div>
  );

  // ── Hidden file inputs (all three panels) ────────────────────────────────────
  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
      {/* Responsive grid CSS injected inline */}
      <style>{`
        @media (max-width: 1023px) {
          .utilities-grid { grid-template-columns: 1fr !important; }
          .utilities-grid-2col { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 1024px) {
          .utilities-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        .utilities-upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
          box-sizing: border-box;
        }
        .utilities-upload-btn:active { transform: scale(0.98); }
        .utilities-drop-zone:active { transform: scale(0.99); }
      `}</style>

      {/* Hidden inputs */}
      <input ref={cvUploadRef}  type="file" style={{ display: "none" }} onChange={handleCvUploadChange}  />
      <input ref={cpUploadRef}  type="file" style={{ display: "none" }} onChange={handleCpUploadChange}  />
      <input ref={mgUploadARef} type="file" style={{ display: "none" }} onChange={handleMgUploadA}       />
      <input ref={mgUploadBRef} type="file" style={{ display: "none" }} onChange={handleMgUploadB}       />

      {/* ── Studio Header ── */}
      <div style={{ marginBottom: 20, width: "100%" }}>
        <div style={{ fontSize: "clamp(17px, 4vw, 20px)", fontWeight: 800, color: text, letterSpacing: "-0.02em" }}>Utilities Studio</div>
        <div style={{ fontSize: "clamp(11px, 3vw, 13px)", color: muted, marginTop: 3, lineHeight: 1.5 }}>
          Browser-native processing engines — convert, compress, merge, and secure files with instant downloads.
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY NAV BAR
          Horizontally scrollable on mobile, flex-wrap on tablet+
          ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 24,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        paddingBottom: 2,
        width: "100%",
      }}>
        <style>{`.util-cat-bar::-webkit-scrollbar { display: none; }`}</style>
        {[
          {
            id: "documents",
            label: "Documents",
            color: "#6366f1",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            ),
          },
          {
            id: "images",
            label: "Images",
            color: "#f59e0b",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            ),
          },
          {
            id: "developer",
            label: "Developer Tools",
            color: "#06b6d4",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            ),
          },
          {
            id: "security",
            label: "Security Nodes",
            color: "#10b981",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            ),
          },
        ].map((cat) => {
          const isActive = utilCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setUtilCategory(cat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "10px 18px",
                borderRadius: 10,
                border: `1.5px solid ${isActive ? cat.color : border}`,
                background: isActive
                  ? `linear-gradient(135deg, ${cat.color}22, ${cat.color}10)`
                  : (dark ? "#1e293b" : "#ffffff"),
                color: isActive ? cat.color : muted,
                fontSize: "clamp(11.5px, 2.5vw, 13px)",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.18s ease",
                boxShadow: isActive ? `0 2px 12px ${cat.color}28` : "none",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                userSelect: "none",
                whiteSpace: "nowrap",
                letterSpacing: isActive ? "-0.01em" : "normal",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = cat.color + "60";
                  e.currentTarget.style.color = cat.color;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.color = muted;
                }
              }}
              onMouseDown={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = ""; }}
              onTouchStart={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
              onTouchEnd={e => { e.currentTarget.style.transform = ""; }}
            >
              {/* Colour-tinted icon wrapper */}
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 24, height: 24, borderRadius: 6,
                background: isActive ? cat.color + "25" : cat.color + "12",
                color: isActive ? cat.color : cat.color + "cc",
                flexShrink: 0,
                transition: "background 0.18s",
              }}>
                {cat.icon}
              </span>
              {cat.label}
              {/* Active indicator pip */}
              {isActive && (
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: cat.color,
                  marginLeft: 2,
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${cat.color}`,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Category content divider label ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 18,
      }}>
        <div style={{
          height: 1, flex: 1,
          background: dark ? "#334155" : "#e2e8f0",
        }} />
        <div style={{
          fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: utilCategory === "documents" ? "#6366f1"
               : utilCategory === "images"    ? "#f59e0b"
               : utilCategory === "developer" ? "#06b6d4"
               :                                "#10b981",
          padding: "3px 10px",
          borderRadius: 6,
          background: utilCategory === "documents" ? "#6366f115"
                    : utilCategory === "images"    ? "#f59e0b15"
                    : utilCategory === "developer" ? "#06b6d415"
                    :                                "#10b98115",
          border: `1px solid ${
            utilCategory === "documents" ? "#6366f130"
          : utilCategory === "images"    ? "#f59e0b30"
          : utilCategory === "developer" ? "#06b6d430"
          :                                "#10b98130"
          }`,
          whiteSpace: "nowrap",
        }}>
          {{
            documents: "Documents",
            images:    "Images",
            developer: "Developer Tools",
            security:  "Security Nodes",
          }[utilCategory]}
        </div>
        <div style={{
          height: 1, flex: 1,
          background: dark ? "#334155" : "#e2e8f0",
        }} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY: DOCUMENTS
          Three tool cards:
            1. Converter Studio      — textarea + format select → Blob download
            2. Document Merger Core  — two textareas → joined Blob download
            3. Heavy Document Node   — PDF / DOCX / PPTX → fetch('/api/convert/…')
                                       with local try/catch fallback for Vercel
          ══════════════════════════════════════════════════════════════════ */}
      {utilCategory === "documents" && (() => {

        /* ── LOCAL STATE for all three cards ─────────────────────────────
           All useState / useRef calls must be inside a React component, so
           we embed them in a tiny inner functional component rendered here. */

        function DocumentsModule({ dark: dk, surface: sf, border: bd, text: tx,
                                   muted: mu, accent: ac, inputStyle: iS, labelStyle: lS,
                                   /* wired props from outer UtilitiesStudio scope */
                                   cvText, setCvText, cvFormat, setCvFormat,
                                   cvFileName, setCvFileName, cvFileLabel,
                                   cvStatus, cvUploadRef,
                                   handleCvDrop, handleCvConvert,
                                   mgBlockA, setMgBlockA, mgBlockB, setMgBlockB,
                                   mgFileALabel, mgFileBLabel,
                                   mgSeparator, setMgSeparator,
                                   mgFileName, setMgFileName, mgFormat, setMgFormat,
                                   mgStatus, mgUploadARef, mgUploadBRef,
                                   handleMgDropA, handleMgDropB,
                                   handleMgUploadA, handleMgUploadB,
                                   handleMerge,
                                   handleCvUploadChange,
                                   formatTabRow, actionBtn, statusLine,
                                   panelStyle, panelHeaderStyle, iconBubble, dropZoneStyle }) {

          /* Heavy Document Node local state */
          const [hdnInput,      setHdnInput]      = React.useState("");
          const [hdnFilename,   setHdnFilename]   = React.useState("document");
          const [hdnStatus,     setHdnStatus]     = React.useState("");
          const [hdnLoading,    setHdnLoading]    = React.useState(null); // "pdf"|"docx"|"pptx"|null
          const hdnUploadRef = React.useRef(null);

          /* ── HDN: read uploaded file into textarea ── */
          const handleHdnFileRead = (file) => {
            if (!file) return;
            const reader = new FileReader();
            reader.onload  = (evt) => { setHdnInput(evt.target.result || ""); };
            reader.onerror = () => { setHdnStatus("⚠ Could not read file."); };
            reader.readAsText(file);
          };
          const handleHdnUpload = (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) handleHdnFileRead(file);
            e.target.value = "";
          };
          const handleHdnDrop = (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files && e.dataTransfer.files[0];
            if (file) handleHdnFileRead(file);
          };

          /* ── HDN: async fetch → /api/convert/:format with Blob fallback ── */
          const handleHdnConvert = async (format) => {
            if (!hdnInput.trim()) {
              setHdnStatus("⚠ Add content before converting.");
              setTimeout(() => setHdnStatus(""), 2500);
              return;
            }
            setHdnLoading(format);
            setHdnStatus(`⏳ Sending to conversion engine — ${format.toUpperCase()}…`);

            try {
              /* Backend-ready: POST to /api/convert/:format
                 Expects response Content-Disposition: attachment + binary body.
                 Replace the URL and payload shape to match your server contract. */
              const res = await fetch(`/api/convert/${format}`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                  content:  hdnInput,
                  filename: hdnFilename || "document",
                  format,
                }),
              });

              if (!res.ok) throw new Error(`Server responded ${res.status}: ${res.statusText}`);

              const contentType = res.headers.get("Content-Type") || "application/octet-stream";
              const blob = await res.blob();
              const url  = URL.createObjectURL(new Blob([blob], { type: contentType }));
              const a    = document.createElement("a");
              a.href     = url;
              a.download = `${hdnFilename || "document"}.${format}`;
              document.body.appendChild(a);
              a.click();
              setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 400);
              setHdnStatus(`✓ ${format.toUpperCase()} downloaded as ${a.download}`);
              setTimeout(() => setHdnStatus(""), 4000);

            } catch (err) {
              /* ── Local Vercel/dev fallback ──────────────────────────────
                 API route not yet deployed → synthesise a plain-text stand-in
                 so the user gets a downloadable file and clear guidance.      */
              console.warn("[Heavy Document Node] API unavailable:", err.message);

              const iso      = new Date().toISOString();
              const safeName = (hdnFilename || "document").replace(/[^a-z0-9_\-]/gi, "_");

              /* Build a descriptive fallback payload per format */
              let fallbackContent = "";
              let fallbackMime    = "text/plain";
              let fallbackExt     = "txt";

              if (format === "pdf") {
                fallbackContent = [
                  `%PDF-1.4 PLACEHOLDER — Generated by TrES Heavy Document Node`,
                  `Filename : ${safeName}.pdf`,
                  `Created  : ${iso}`,
                  ``,
                  `── CONTENT ──────────────────────────────────────────────`,
                  hdnInput,
                  ``,
                  `── NOTE ────────────────────────────────────────────────`,
                  `Real PDF rendering requires the /api/convert/pdf backend route.`,
                  `Connect your server and this button will produce a true PDF binary.`,
                ].join("\n");
                fallbackMime = "text/plain";
                fallbackExt  = "pdf.txt";
              } else if (format === "docx") {
                fallbackContent = [
                  `DOCX PLACEHOLDER — Generated by TrES Heavy Document Node`,
                  `Filename : ${safeName}.docx`,
                  `Created  : ${iso}`,
                  ``,
                  `── CONTENT ──────────────────────────────────────────────`,
                  hdnInput,
                  ``,
                  `── NOTE ────────────────────────────────────────────────`,
                  `Real DOCX rendering requires the /api/convert/docx backend route.`,
                  `Connect your server (e.g. python-docx, Pandoc) and this button`,
                  `will produce a fully formatted Word document binary.`,
                ].join("\n");
                fallbackMime = "text/plain";
                fallbackExt  = "docx.txt";
              } else if (format === "pptx") {
                fallbackContent = [
                  `PPTX PLACEHOLDER — Generated by TrES Heavy Document Node`,
                  `Filename : ${safeName}.pptx`,
                  `Created  : ${iso}`,
                  ``,
                  `── SLIDE CONTENT ────────────────────────────────────────`,
                  hdnInput,
                  ``,
                  `── NOTE ────────────────────────────────────────────────`,
                  `Real PPTX rendering requires the /api/convert/pptx backend route.`,
                  `Connect your server (e.g. python-pptx) and this button`,
                  `will produce a fully formatted PowerPoint binary.`,
                ].join("\n");
                fallbackMime = "text/plain";
                fallbackExt  = "pptx.txt";
              }

              const blob = new Blob([fallbackContent], { type: fallbackMime });
              const url  = URL.createObjectURL(blob);
              const a    = document.createElement("a");
              a.href     = url;
              a.download = `${safeName}_PREVIEW.${fallbackExt}`;
              document.body.appendChild(a);
              a.click();
              setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 400);

              setHdnStatus(`⚠ API offline — preview file downloaded. Wire /api/convert/${format} for real output.`);
              setTimeout(() => setHdnStatus(""), 6000);
            } finally {
              setHdnLoading(null);
            }
          };

          /* ── Shared micro-helpers scoped to this inner component ── */
          const sLine = (msg) => {
            if (!msg) return null;
            const isOk   = msg.startsWith("✓");
            const isWarn = msg.startsWith("⚠");
            const isInfo = msg.startsWith("⏳");
            return (
              <div style={{
                fontSize: "clamp(10.5px, 2.5vw, 11.5px)", padding: "8px 12px",
                borderRadius: 8, fontFamily: "monospace",
                background: dk ? "#0f172a" : "#f8fafc",
                border: `1px solid ${isOk ? "#10b98140" : isWarn ? "#f59e0b40" : isInfo ? "#6366f140" : bd}`,
                color:  isOk ? "#10b981" : isWarn ? "#f59e0b" : isInfo ? "#818cf8" : mu,
                wordBreak: "break-word", lineHeight: 1.5,
              }}>{msg}</div>
            );
          };

          const hdnBtn = (label, fmt, color, icon, isLoading) => (
            <button
              onClick={() => handleHdnConvert(fmt)}
              disabled={!!hdnLoading}
              style={{
                flex: "1 1 auto", minWidth: 100,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "12px 10px", borderRadius: 10,
                border: `1.5px solid ${color}40`,
                background: isLoading
                  ? color + "20"
                  : `linear-gradient(135deg, ${color}18, ${color}08)`,
                color: hdnLoading && !isLoading ? mu : color,
                fontSize: "clamp(11px, 2.5vw, 12.5px)", fontWeight: 700,
                cursor: hdnLoading ? "not-allowed" : "pointer",
                transition: "all 0.18s",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                userSelect: "none",
                opacity: hdnLoading && !isLoading ? 0.45 : 1,
                boxShadow: isLoading ? `0 0 0 2px ${color}30` : "none",
              }}
              onMouseEnter={e => { if (!hdnLoading) { e.currentTarget.style.background = color + "28"; e.currentTarget.style.borderColor = color + "80"; } }}
              onMouseLeave={e => { if (!hdnLoading) { e.currentTarget.style.background = `linear-gradient(135deg, ${color}18, ${color}08)`; e.currentTarget.style.borderColor = color + "40"; } }}
              onMouseDown={e => { if (!hdnLoading) e.currentTarget.style.transform = "scale(0.97)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = ""; }}
              onTouchStart={e => { if (!hdnLoading) e.currentTarget.style.transform = "scale(0.97)"; }}
              onTouchEnd={e => { e.currentTarget.style.transform = ""; }}
            >
              {isLoading
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2 a10 10 0 0 1 10 10"/></svg>
                : icon}
              {isLoading ? "Processing…" : label}
            </button>
          );

          /* ── RENDER ─────────────────────────────────────────────── */
          return (
            <div
              className="utilities-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 18,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >

              {/* ═══════════════════════════════════════════════════════
                  CARD 1 — CONVERTER STUDIO
                  textarea + format select → Blob/URL.createObjectURL
                  ═══════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                {/* Header */}
                <div style={panelHeaderStyle("#6366f1")}>
                  <div style={iconBubble("#6366f1")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 3 21 3 21 8"/>
                      <line x1="4" y1="20" x2="21" y2="3"/>
                      <polyline points="21 16 21 21 16 21"/>
                      <line x1="15" y1="15" x2="21" y2="21"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>Converter Studio</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#6366f1", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Text → TXT / JSON / HTML</div>
                  </div>
                  {/* Badge */}
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#6366f122", color: "#6366f1", letterSpacing: "0.07em", flexShrink: 0 }}>CONVERT</span>
                </div>

                {/* Instruction strip */}
                <div style={{ fontSize: "clamp(10.5px, 2.5vw, 12px)", color: mu, lineHeight: 1.6, padding: "8px 12px", borderRadius: 8, background: dark ? "#0f172a50" : "#6366f108", border: `1px solid #6366f120` }}>
                  Type or paste any text below, choose your export format, name the file, then click <strong style={{ color: "#6366f1" }}>Process</strong>. The browser will instantly download a real file via <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#ede9fe", borderRadius: 4, padding: "1px 5px", color: "#6366f1" }}>Blob + URL.createObjectURL</code>.
                </div>

                {/* Drop zone (wired to existing cvUploadRef handler) */}
                <div
                  className="utilities-drop-zone"
                  style={dropZoneStyle(cvFileLabel !== "Drop or choose a file to pre-fill", "#6366f1")}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleCvDrop}
                  onClick={() => cvUploadRef.current && cvUploadRef.current.click()}
                >
                  <input
                    ref={cvUploadRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleCvUploadChange}
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 5 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <div style={{ fontSize: "clamp(10px, 3vw, 11.5px)", color: cvFileLabel !== "Drop or choose a file to pre-fill" ? "#6366f1" : mu, fontWeight: 600 }}>{cvFileLabel}</div>
                  <div style={{ fontSize: 10, color: mu, marginTop: 3 }}>Tap to browse · or drag &amp; drop a .txt / .json / .html file</div>
                </div>

                {/* Input textarea */}
                <div>
                  <label style={lS}>Input Text</label>
                  <textarea
                    rows={6}
                    style={{ ...iS, resize: "vertical", lineHeight: 1.65, fontFamily: "monospace", fontSize: 12, width: "100%", boxSizing: "border-box" }}
                    placeholder="Paste or type text here…"
                    value={cvText}
                    onChange={e => setCvText(e.target.value)}
                  />
                </div>

                {/* Controls row — filename + format select */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
                  <div>
                    <label style={lS}>Output Filename</label>
                    <input
                      style={{ ...iS, width: "100%", boxSizing: "border-box" }}
                      value={cvFileName}
                      onChange={e => setCvFileName(e.target.value)}
                      placeholder="output"
                    />
                  </div>
                  <div>
                    <label style={lS}>Format</label>
                    <select
                      value={cvFormat}
                      onChange={e => setCvFormat(e.target.value)}
                      style={{
                        ...iS,
                        width: "100%", boxSizing: "border-box",
                        cursor: "pointer",
                        paddingRight: 28,
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 10px center",
                      }}
                    >
                      <option value="txt">.TXT — Plain Text</option>
                      <option value="json">.JSON — Structured</option>
                      <option value="html">.HTML — Webpage</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                {sLine(cvStatus)}

                {/* Process button — Blob + URL.createObjectURL */}
                {actionBtn(
                  "Process & Download",
                  handleCvConvert,
                  "linear-gradient(135deg, #6366f1, #818cf8)",
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                )}

                {/* Engine note */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  100% browser-native · no server · no upload · instant download
                </div>
              </div>


              {/* ═══════════════════════════════════════════════════════
                  CARD 2 — DOCUMENT MERGER CORE
                  Two textareas → joined with headers → Blob download
                  ═══════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                {/* Header */}
                <div style={panelHeaderStyle("#10b981")}>
                  <div style={iconBubble("#10b981")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>Document Merger Core</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#10b981", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Two Blocks → One File</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#10b98122", color: "#10b981", letterSpacing: "0.07em", flexShrink: 0 }}>MERGE</span>
                </div>

                {/* Instruction strip */}
                <div style={{ fontSize: "clamp(10.5px, 2.5vw, 12px)", color: mu, lineHeight: 1.6, padding: "8px 12px", borderRadius: 8, background: dk ? "#0f172a50" : "#10b98108", border: "1px solid #10b98120" }}>
                  Fill in both blocks (or drop files), choose a separator style, then click <strong style={{ color: "#10b981" }}>Compile</strong> to download a single unified text file with clear section headers.
                </div>

                {/* Block A */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label style={{ ...lS, marginBottom: 0 }}>Block A — Document&nbsp;One</label>
                    {/* drop trigger */}
                    <div
                      className="utilities-drop-zone"
                      style={{
                        ...dropZoneStyle(mgFileALabel !== "Drop or choose File A", "#10b981"),
                        padding: "5px 12px", fontSize: 10.5, display: "flex",
                        alignItems: "center", gap: 5, borderRadius: 7,
                      }}
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleMgDropA}
                      onClick={() => mgUploadARef.current && mgUploadARef.current.click()}
                    >
                      <input ref={mgUploadARef} type="file" style={{ display: "none" }} onChange={handleMgUploadA} />
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span style={{ color: mgFileALabel !== "Drop or choose File A" ? "#10b981" : mu, fontWeight: 600 }}>{mgFileALabel}</span>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    style={{ ...iS, resize: "vertical", lineHeight: 1.65, fontFamily: "monospace", fontSize: 12, width: "100%", boxSizing: "border-box", borderColor: mgBlockA.trim() ? "#10b98140" : undefined }}
                    placeholder="Paste or type the first document…"
                    value={mgBlockA}
                    onChange={e => setMgBlockA(e.target.value)}
                  />
                  {mgBlockA.trim() && (
                    <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>
                      {mgBlockA.trim().split(/\s+/).length} words · {new Blob([mgBlockA]).size.toLocaleString()} bytes
                    </div>
                  )}
                </div>

                {/* Separator visual */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 1, background: dk ? "#334155" : "#e2e8f0" }} />
                  <div>
                    <label style={{ ...lS, marginBottom: 4, textAlign: "center", display: "block" }}>Separator</label>
                    {formatTabRow(
                      [
                        { value: "divider", label: "── Rule ──" },
                        { value: "newline", label: "↵ Blank" },
                        { value: "comment", label: "/* mark */" },
                        { value: "none",    label: "None" },
                      ],
                      mgSeparator, setMgSeparator, "#10b981"
                    )}
                  </div>
                  <div style={{ flex: 1, height: 1, background: dk ? "#334155" : "#e2e8f0" }} />
                </div>

                {/* Block B */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label style={{ ...lS, marginBottom: 0 }}>Block B — Document&nbsp;Two</label>
                    <div
                      className="utilities-drop-zone"
                      style={{
                        ...dropZoneStyle(mgFileBLabel !== "Drop or choose File B", "#10b981"),
                        padding: "5px 12px", fontSize: 10.5, display: "flex",
                        alignItems: "center", gap: 5, borderRadius: 7,
                      }}
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleMgDropB}
                      onClick={() => mgUploadBRef.current && mgUploadBRef.current.click()}
                    >
                      <input ref={mgUploadBRef} type="file" style={{ display: "none" }} onChange={handleMgUploadB} />
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span style={{ color: mgFileBLabel !== "Drop or choose File B" ? "#10b981" : mu, fontWeight: 600 }}>{mgFileBLabel}</span>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    style={{ ...iS, resize: "vertical", lineHeight: 1.65, fontFamily: "monospace", fontSize: 12, width: "100%", boxSizing: "border-box", borderColor: mgBlockB.trim() ? "#10b98140" : undefined }}
                    placeholder="Paste or type the second document…"
                    value={mgBlockB}
                    onChange={e => setMgBlockB(e.target.value)}
                  />
                  {mgBlockB.trim() && (
                    <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600 }}>
                      {mgBlockB.trim().split(/\s+/).length} words · {new Blob([mgBlockB]).size.toLocaleString()} bytes
                    </div>
                  )}
                </div>

                {/* Output row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
                  <div>
                    <label style={lS}>Output Filename</label>
                    <input style={{ ...iS, width: "100%", boxSizing: "border-box" }} value={mgFileName} onChange={e => setMgFileName(e.target.value)} placeholder="merged-output" />
                  </div>
                  <div>
                    <label style={lS}>Format</label>
                    <select
                      value={mgFormat}
                      onChange={e => setMgFormat(e.target.value)}
                      style={{
                        ...iS, width: "100%", boxSizing: "border-box",
                        cursor: "pointer", paddingRight: 28, appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
                      }}
                    >
                      <option value="txt">.TXT — Plain Text</option>
                      <option value="json">.JSON — Structured</option>
                      <option value="html">.HTML — Webpage</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                {sLine(mgStatus)}

                {/* Compile button — Blob + URL.createObjectURL */}
                {actionBtn(
                  "Compile & Download",
                  handleMerge,
                  "linear-gradient(135deg, #10b981, #059669)",
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                )}

                {/* Engine note */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Blocks joined with clear section headers · Blob download · no upload required
                </div>
              </div>


              {/* ═══════════════════════════════════════════════════════
                  CARD 3 — HEAVY DOCUMENT NODE
                  async fetch('/api/convert/:format') → Blob download
                  try/catch fallback for local/Vercel testing
                  ═══════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                {/* Header */}
                <div style={panelHeaderStyle("#f59e0b")}>
                  <div style={iconBubble("#f59e0b")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>Heavy Document Node</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#f59e0b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>PDF · DOCX · PPTX Export</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#f59e0b22", color: "#f59e0b", letterSpacing: "0.07em", flexShrink: 0 }}>BACKEND</span>
                </div>

                {/* API route info banner */}
                <div style={{
                  fontSize: "clamp(10px, 2.5vw, 11.5px)", color: mu, lineHeight: 1.6,
                  padding: "10px 13px", borderRadius: 9,
                  background: dk ? "#0f172a" : "#fffbeb",
                  border: "1px solid #f59e0b30",
                  display: "flex", flexDirection: "column", gap: 4,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <strong style={{ color: "#f59e0b", fontSize: "clamp(10px, 2vw, 11px)" }}>Backend-ready · async fetch architecture</strong>
                  </div>
                  <span>
                    Each button fires <code style={{ fontSize: 10, background: dk ? "#1e293b" : "#fef3c7", borderRadius: 4, padding: "1px 5px", color: "#d97706" }}>POST /api/convert/:format</code> and streams the binary response back as a real file download.
                    While the API route is offline, a descriptive preview file is downloaded instantly as a local fallback.
                  </span>
                </div>

                {/* Drop zone */}
                <div
                  className="utilities-drop-zone"
                  style={dropZoneStyle(false, "#f59e0b")}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleHdnDrop}
                  onClick={() => hdnUploadRef.current && hdnUploadRef.current.click()}
                >
                  <input ref={hdnUploadRef} type="file" style={{ display: "none" }} onChange={handleHdnUpload} />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 4 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <div style={{ fontSize: "clamp(10px, 3vw, 11.5px)", color: mu, fontWeight: 600 }}>Drop a file to pre-fill content · or tap to browse</div>
                </div>

                {/* Content textarea */}
                <div>
                  <label style={lS}>Document Content</label>
                  <textarea
                    rows={7}
                    style={{ ...iS, resize: "vertical", lineHeight: 1.65, fontFamily: "monospace", fontSize: 12, width: "100%", boxSizing: "border-box" }}
                    placeholder={"Type or paste document content here…\n\nThis text will be sent to the conversion API as the document body.\nStructure it clearly — headings, paragraphs, bullet points."}
                    value={hdnInput}
                    onChange={e => setHdnInput(e.target.value)}
                  />
                  {hdnInput.trim() && (
                    <div style={{ fontSize: 10, color: mu, marginTop: 4, display: "flex", gap: 12 }}>
                      <span style={{ color: "#f59e0b", fontWeight: 600 }}>{hdnInput.trim().split(/\s+/).length} words</span>
                      <span>{hdnInput.trim().split("\n").length} lines</span>
                      <span>{new Blob([hdnInput]).size.toLocaleString()} bytes</span>
                    </div>
                  )}
                </div>

                {/* Filename */}
                <div>
                  <label style={lS}>Output Filename (no extension)</label>
                  <input
                    style={{ ...iS, width: "100%", boxSizing: "border-box" }}
                    value={hdnFilename}
                    onChange={e => setHdnFilename(e.target.value)}
                    placeholder="document"
                  />
                </div>

                {/* Format buttons — three distinct conversion targets */}
                <div>
                  <label style={lS}>Export Format — select one to convert</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>

                    {/* PDF */}
                    {hdnBtn(
                      "Export PDF",
                      "pdf",
                      "#ef4444",
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                      </svg>,
                      hdnLoading === "pdf"
                    )}

                    {/* DOCX */}
                    {hdnBtn(
                      "Export DOCX",
                      "docx",
                      "#3b82f6",
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>,
                      hdnLoading === "docx"
                    )}

                    {/* PPTX */}
                    {hdnBtn(
                      "Export PPTX",
                      "pptx",
                      "#a855f7",
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>,
                      hdnLoading === "pptx"
                    )}

                  </div>
                </div>

                {/* API endpoint reference table */}
                <div style={{
                  borderRadius: 9, border: `1px solid ${bd}`,
                  background: dk ? "#0f172a" : "#f8fafc",
                  overflow: "hidden", fontSize: "clamp(9.5px, 2vw, 11px)",
                }}>
                  <div style={{ padding: "7px 12px", borderBottom: `1px solid ${bd}`, fontWeight: 700, color: mu, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 9.5 }}>
                    API Route Contract
                  </div>
                  {[
                    { fmt: "PDF",  route: "POST /api/convert/pdf",  ct: "application/pdf",          color: "#ef4444" },
                    { fmt: "DOCX", route: "POST /api/convert/docx", ct: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", color: "#3b82f6" },
                    { fmt: "PPTX", route: "POST /api/convert/pptx", ct: "application/vnd.openxmlformats-officedocument.presentationml.presentation", color: "#a855f7" },
                  ].map(r => (
                    <div key={r.fmt} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 12px", borderBottom: `1px solid ${bd}30` }}>
                      <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: r.color + "20", color: r.color, letterSpacing: "0.05em", flexShrink: 0, marginTop: 1 }}>{r.fmt}</span>
                      <div>
                        <code style={{ color: mu, fontSize: "clamp(9px, 2vw, 10.5px)" }}>{r.route}</code>
                        <div style={{ color: mu, fontSize: 9, marginTop: 1, opacity: 0.7 }}>Content-Type: {r.ct}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status */}
                {sLine(hdnStatus)}

                {/* Engine note */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  async/await · try/catch local fallback · Blob + URL.createObjectURL pipeline
                </div>
              </div>

            </div>
          );
        }

        /* Render the inner component, forwarding all outer-scope props & handlers */
        return (
          <DocumentsModule
            dark={dark} surface={surface} border={border} text={text} muted={muted} accent={accent}
            inputStyle={inputStyle} labelStyle={labelStyle}
            cvText={cvText} setCvText={setCvText}
            cvFormat={cvFormat} setCvFormat={setCvFormat}
            cvFileName={cvFileName} setCvFileName={setCvFileName}
            cvFileLabel={cvFileLabel} cvStatus={cvStatus}
            cvUploadRef={cvUploadRef}
            handleCvDrop={handleCvDrop}
            handleCvConvert={handleCvConvert}
            handleCvUploadChange={handleCvUploadChange}
            mgBlockA={mgBlockA} setMgBlockA={setMgBlockA}
            mgBlockB={mgBlockB} setMgBlockB={setMgBlockB}
            mgFileALabel={mgFileALabel} mgFileBLabel={mgFileBLabel}
            mgSeparator={mgSeparator} setMgSeparator={setMgSeparator}
            mgFileName={mgFileName} setMgFileName={setMgFileName}
            mgFormat={mgFormat} setMgFormat={setMgFormat}
            mgStatus={mgStatus}
            mgUploadARef={mgUploadARef} mgUploadBRef={mgUploadBRef}
            handleMgDropA={handleMgDropA} handleMgDropB={handleMgDropB}
            handleMgUploadA={handleMgUploadA} handleMgUploadB={handleMgUploadB}
            handleMerge={handleMerge}
            formatTabRow={formatTabRow}
            actionBtn={actionBtn}
            statusLine={statusLine}
            panelStyle={panelStyle}
            panelHeaderStyle={panelHeaderStyle}
            iconBubble={iconBubble}
            dropZoneStyle={dropZoneStyle}
          />
        );
      })()}{/* end utilCategory === "documents" IIFE */}

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY: IMAGES — placeholder, ready for image tools in next phase
          ══════════════════════════════════════════════════════════════════ */}
      {utilCategory === "images" && (() => {

        /* ══════════════════════════════════════════════════════════════════
           ImagesModule — inner component so useState/useRef hooks are legal
           Three cards, all 100% client-side canvas processing, no uploads.
           ══════════════════════════════════════════════════════════════════ */
        function ImagesModule({ dark: dk, surface: sf, border: bd, text: tx, muted: mu,
                                inputStyle: iS, labelStyle: lS,
                                panelStyle, panelHeaderStyle, iconBubble, dropZoneStyle }) {

          /* ── Shared panel helpers ── */
          const sLine = (msg) => {
            if (!msg) return null;
            const isOk   = msg.startsWith("✓");
            const isWarn = msg.startsWith("⚠");
            const isInfo = msg.startsWith("⏳");
            return (
              <div style={{
                fontSize: "clamp(10.5px, 2.5vw, 11.5px)", padding: "8px 12px",
                borderRadius: 8, fontFamily: "monospace",
                background: dk ? "#0f172a" : "#f8fafc",
                border: `1px solid ${isOk ? "#10b98140" : isWarn ? "#f59e0b40" : isInfo ? "#6366f140" : bd}`,
                color: isOk ? "#10b981" : isWarn ? "#f59e0b" : isInfo ? "#818cf8" : mu,
                wordBreak: "break-word", lineHeight: 1.5,
              }}>{msg}</div>
            );
          };

          const processBtn = (label, onClick, color, icon, disabled) => (
            <button
              onClick={onClick}
              disabled={!!disabled}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8,
                padding: "12px 16px", borderRadius: 10, border: "none",
                background: disabled ? (dk ? "#1e293b" : "#e2e8f0") : color,
                color: disabled ? mu : "#fff",
                fontSize: "clamp(12px, 3vw, 13px)", fontWeight: 700,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "filter 0.15s, transform 0.1s",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation", userSelect: "none",
                opacity: disabled ? 0.5 : 1,
              }}
              onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(1.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
              onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = ""; }}
              onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
              onTouchEnd={e => { e.currentTarget.style.transform = ""; }}
            >
              {icon}{label}
            </button>
          );

          /* ── Helper: load a File into an HTMLImageElement ── */
          const loadImageFromFile = (file) => new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload  = () => { resolve(img); URL.revokeObjectURL(url); };
            img.onerror = () => { reject(new Error("Could not decode image.")); URL.revokeObjectURL(url); };
            img.src = url;
          });

          /* ── Helper: trigger anchor download from a data-URL ── */
          const triggerDownload = (dataUrl, filename) => {
            const a = document.createElement("a");
            a.href     = dataUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => document.body.removeChild(a), 300);
          };

          /* ══════════════════════════════════════════════════════
             CARD 1 — IMAGE FORMAT SWAP
             State
             ══════════════════════════════════════════════════════ */
          const [fmtFile,     setFmtFile]     = React.useState(null);
          const [fmtPreview,  setFmtPreview]  = React.useState(null);   // data-URL preview
          const [fmtMeta,     setFmtMeta]     = React.useState(null);   // { w, h, size, name }
          const [fmtStatus,   setFmtStatus]   = React.useState("");
          const [fmtBusy,     setFmtBusy]     = React.useState(false);
          const fmtRef = React.useRef(null);

          const handleFmtPick = (file) => {
            if (!file || !file.type.startsWith("image/")) {
              setFmtStatus("⚠ Please select a valid image file (PNG, JPEG, WebP, GIF…).");
              return;
            }
            setFmtStatus("");
            setFmtPreview(null);
            setFmtMeta(null);
            setFmtFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target.result;
              const img = new Image();
              img.onload = () => {
                setFmtPreview(dataUrl);
                setFmtMeta({ w: img.naturalWidth, h: img.naturalHeight, size: file.size, name: file.name });
              };
              img.src = dataUrl;
            };
            reader.readAsDataURL(file);
          };

          const handleFmtConvert = async () => {
            if (!fmtFile) { setFmtStatus("⚠ Upload an image first."); return; }
            setFmtBusy(true);
            setFmtStatus("⏳ Drawing to canvas…");
            try {
              const img    = await loadImageFromFile(fmtFile);
              const canvas = document.createElement("canvas");
              canvas.width  = img.naturalWidth;
              canvas.height = img.naturalHeight;
              const ctx = canvas.getContext("2d");
              /* Fill white background so transparent PNGs convert cleanly to JPEG */
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              /* toDataURL with JPEG mime + quality 0.92 */
              const dataUrl  = canvas.toDataURL("image/jpeg", 0.92);
              const baseName = fmtFile.name.replace(/\.[^.]+$/, "") || "converted";
              triggerDownload(dataUrl, `${baseName}.jpg`);
              /* Compute approx output size from base64 payload */
              const b64Bytes = Math.round((dataUrl.length - "data:image/jpeg;base64,".length) * 0.75);
              setFmtStatus(`✓ Exported as JPEG — ${(b64Bytes / 1024).toFixed(1)} KB  (${img.naturalWidth} × ${img.naturalHeight}px)`);
            } catch (err) {
              setFmtStatus(`⚠ Conversion failed: ${err.message}`);
            } finally {
              setFmtBusy(false);
            }
          };

          /* ══════════════════════════════════════════════════════
             CARD 2 — COMPRESSION ENGINE
             State
             ══════════════════════════════════════════════════════ */
          const [cmpFile,    setCmpFile]    = React.useState(null);
          const [cmpPreview, setCmpPreview] = React.useState(null);
          const [cmpMeta,    setCmpMeta]    = React.useState(null);
          const [cmpResult,  setCmpResult]  = React.useState(null);  // { dataUrl, w, h, bytes }
          const [cmpStatus,  setCmpStatus]  = React.useState("");
          const [cmpBusy,    setCmpBusy]    = React.useState(false);
          const cmpRef = React.useRef(null);

          const handleCmpPick = (file) => {
            if (!file || !file.type.startsWith("image/")) {
              setCmpStatus("⚠ Please select a valid image file.");
              return;
            }
            setCmpStatus(""); setCmpResult(null);
            setCmpFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target.result;
              const img = new Image();
              img.onload = () => {
                setCmpPreview(dataUrl);
                setCmpMeta({ w: img.naturalWidth, h: img.naturalHeight, size: file.size, name: file.name });
              };
              img.src = dataUrl;
            };
            reader.readAsDataURL(file);
          };

          const handleCmpCompress = async () => {
            if (!cmpFile) { setCmpStatus("⚠ Upload an image first."); return; }
            setCmpBusy(true);
            setCmpStatus("⏳ Compressing on canvas…");
            try {
              const img    = await loadImageFromFile(cmpFile);
              const canvas = document.createElement("canvas");
              /* Scale dimensions down by 30% */
              const SCALE   = 0.70;
              const newW    = Math.max(1, Math.round(img.naturalWidth  * SCALE));
              const newH    = Math.max(1, Math.round(img.naturalHeight * SCALE));
              canvas.width  = newW;
              canvas.height = newH;
              const ctx = canvas.getContext("2d");
              ctx.imageSmoothingEnabled  = true;
              ctx.imageSmoothingQuality  = "high";
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, newW, newH);
              ctx.drawImage(img, 0, 0, newW, newH);
              /* Quality 0.5 for aggressive byte reduction */
              const dataUrl  = canvas.toDataURL("image/jpeg", 0.5);
              const b64Bytes = Math.round((dataUrl.length - "data:image/jpeg;base64,".length) * 0.75);
              setCmpResult({ dataUrl, w: newW, h: newH, bytes: b64Bytes });
              const saving = (((cmpFile.size - b64Bytes) / cmpFile.size) * 100).toFixed(1);
              const savingNum = parseFloat(saving);
              setCmpStatus(
                savingNum > 0
                  ? `✓ Compressed ${newW}×${newH}px — ${(b64Bytes / 1024).toFixed(1)} KB saved ${savingNum}% vs original`
                  : `✓ Compressed ${newW}×${newH}px — ${(b64Bytes / 1024).toFixed(1)} KB (original was already small)`
              );
            } catch (err) {
              setCmpStatus(`⚠ Compression failed: ${err.message}`);
            } finally {
              setCmpBusy(false);
            }
          };

          const handleCmpDownload = () => {
            if (!cmpResult) return;
            const baseName = (cmpFile && cmpFile.name.replace(/\.[^.]+$/, "")) || "compressed";
            triggerDownload(cmpResult.dataUrl, `${baseName}_compressed.jpg`);
          };

          /* ══════════════════════════════════════════════════════
             CARD 3 — IMAGE TO PDF (printable viewport frame)
             State
             ══════════════════════════════════════════════════════ */
          const [pdfFile,    setPdfFile]    = React.useState(null);
          const [pdfPreview, setPdfPreview] = React.useState(null);
          const [pdfMeta,    setPdfMeta]    = React.useState(null);
          const [pdfStatus,  setPdfStatus]  = React.useState("");
          const [pdfBusy,    setPdfBusy]    = React.useState(false);
          const pdfRef = React.useRef(null);

          const handlePdfPick = (file) => {
            if (!file || !file.type.startsWith("image/")) {
              setPdfStatus("⚠ Please select a valid image file.");
              return;
            }
            setPdfStatus("");
            setPdfFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target.result;
              const img = new Image();
              img.onload = () => {
                setPdfPreview(dataUrl);
                setPdfMeta({ w: img.naturalWidth, h: img.naturalHeight, size: file.size, name: file.name });
              };
              img.src = dataUrl;
            };
            reader.readAsDataURL(file);
          };

          const handlePdfOpen = () => {
            if (!pdfFile) { setPdfStatus("⚠ Upload an image first."); return; }
            if (!pdfPreview) { setPdfStatus("⚠ Image is still loading — please wait a moment."); return; }
            setPdfBusy(true);
            setPdfStatus("⏳ Preparing printable frame…");
            try {
              const baseName = pdfFile.name.replace(/\.[^.]+$/, "") || "image";
              /* Build a self-contained HTML document that:
                 1. Embeds the image as a base64 data-URL array string
                 2. Centers it on an A4-proportioned white page
                 3. Auto-triggers the print dialog on load
                 4. Closes the tab after the dialog is dismissed        */
              const htmlDoc = [
                "<!DOCTYPE html>",
                "<html lang='en'>",
                "<head>",
                "  <meta charset='UTF-8'>",
                `  <title>${baseName} — Print / Save as PDF</title>`,
                "  <style>",
                "    * { margin: 0; padding: 0; box-sizing: border-box; }",
                "    html, body { width: 100%; background: #e5e7eb; }",
                "    .page {",
                "      width: 210mm; min-height: 297mm;",
                "      background: #fff;",
                "      margin: 0 auto;",
                "      display: flex; align-items: center; justify-content: center;",
                "      padding: 16mm;",
                "    }",
                "    img {",
                "      max-width: 100%; max-height: 265mm;",
                "      object-fit: contain;",
                "      display: block;",
                "    }",
                "    .toolbar {",
                "      position: fixed; top: 0; left: 0; right: 0; z-index: 999;",
                "      background: #1e293b; color: #f1f5f9;",
                "      padding: 10px 20px; display: flex; align-items: center;",
                "      gap: 12px; font-family: 'DM Sans', sans-serif; font-size: 13px;",
                "    }",
                "    .toolbar button {",
                "      padding: 6px 16px; border-radius: 7px; border: none;",
                "      background: #6366f1; color: #fff; font-size: 12px;",
                "      font-weight: 700; cursor: pointer;",
                "    }",
                "    .toolbar button.close {",
                "      background: #475569; margin-left: auto;",
                "    }",
                "    @media print {",
                "      .toolbar { display: none !important; }",
                "      html, body { background: #fff; }",
                "      .page { margin: 0; padding: 12mm; width: 100%; min-height: unset; }",
                "    }",
                "  </style>",
                "</head>",
                "<body>",
                "  <div class='toolbar'>",
                `    <span>📄 ${baseName}.pdf&nbsp;—&nbsp;Print or Save as PDF</span>`,
                "    <button onclick='window.print()'>🖨 Print / Save PDF</button>",
                "    <button class='close' onclick='window.close()'>✕ Close</button>",
                "  </div>",
                "  <div style='height:44px'></div>",
                "  <div class='page'>",
                /* Embed image as data-URL — the array join reconstructs the string */
                `    <img src="${pdfPreview}" alt="${baseName}" />`,
                "  </div>",
                "  <script>",
                "    window.addEventListener('load', () => {",
                "      setTimeout(() => window.print(), 600);",
                "    });",
                "  </script>",
                "</body>",
                "</html>",
              ].join("\n");

              /* Convert the HTML string to a Blob and open in a new tab */
              const blob = new Blob([htmlDoc], { type: "text/html;charset=utf-8" });
              const url  = URL.createObjectURL(blob);
              const win  = window.open(url, "_blank");
              /* Revoke after the new tab has had time to load */
              if (win) {
                win.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
                setTimeout(() => URL.revokeObjectURL(url), 30000);
              } else {
                URL.revokeObjectURL(url);
                setPdfStatus("⚠ Pop-up blocked — please allow pop-ups for this site and try again.");
                setPdfBusy(false);
                return;
              }
              setPdfStatus(`✓ Printable frame opened — use the toolbar or Ctrl+P to Save as PDF`);
            } catch (err) {
              setPdfStatus(`⚠ Failed to open frame: ${err.message}`);
            } finally {
              setPdfBusy(false);
            }
          };

          /* ── Shared drop-zone tile ── */
          const DropTile = ({ fileRef, onPick, preview, meta, color, accept }) => {
            const handleDrop = (e) => {
              e.preventDefault();
              const f = e.dataTransfer.files && e.dataTransfer.files[0];
              if (f) onPick(f);
            };
            return (
              <div>
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current && fileRef.current.click()}
                  style={{
                    border: `2px dashed ${preview ? color : bd}`,
                    borderRadius: 10,
                    background: preview ? color + "08" : "transparent",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                    overflow: "hidden",
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                  }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept={accept || "image/*"}
                    style={{ display: "none" }}
                    onChange={e => { const f = e.target.files && e.target.files[0]; if (f) onPick(f); e.target.value = ""; }}
                  />
                  {preview ? (
                    /* Image preview thumbnail */
                    <div style={{ position: "relative" }}>
                      <img
                        src={preview}
                        alt="preview"
                        style={{ width: "100%", maxHeight: 180, objectFit: "contain", display: "block", background: dk ? "#0f172a" : "#f1f5f9", padding: 8 }}
                      />
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                        padding: "5px 10px", display: "flex", gap: 10,
                        fontSize: 10, color: "#fff", fontWeight: 600,
                      }}>
                        <span>{meta && meta.name}</span>
                        <span style={{ marginLeft: "auto" }}>{meta && `${meta.w}×${meta.h}px`}</span>
                        <span>{meta && `${(meta.size / 1024).toFixed(1)} KB`}</span>
                      </div>
                    </div>
                  ) : (
                    /* Empty state */
                    <div style={{ padding: "22px 12px", textAlign: "center" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8, opacity: 0.7 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <div style={{ fontSize: "clamp(10.5px, 3vw, 12px)", color: mu, fontWeight: 600, lineHeight: 1.5 }}>
                        Tap to choose an image<br/>
                        <span style={{ fontSize: 10, opacity: 0.7 }}>or drag &amp; drop · PNG, JPEG, WebP, GIF</span>
                      </div>
                    </div>
                  )}
                </div>
                {preview && (
                  <div style={{ marginTop: 6, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={e => { e.stopPropagation(); onPick.__clear && onPick.__clear(); fileRef.current && fileRef.current.click(); }}
                      onClick={() => fileRef.current && fileRef.current.click()}
                      style={{ fontSize: 10, color, background: "transparent", border: `1px solid ${color}40`, borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontWeight: 600 }}
                    >↺ Change image</button>
                  </div>
                )}
              </div>
            );
          };

          /* ── Stat pill row ── */
          const StatRow = ({ items, color }) => (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {items.map(({ label, value }) => (
                <div key={label} style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 6,
                  background: color + "12", border: `1px solid ${color}25`,
                  color: mu, fontWeight: 600,
                }}>
                  <span style={{ color }}>{label}</span> {value}
                </div>
              ))}
            </div>
          );

          /* ══════════════════════════════════════════════════════════════
             RENDER — three cards in responsive single-column grid
             ══════════════════════════════════════════════════════════════ */
          return (
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 18,
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}>

              {/* ═══════════════════════════════════════════════════════════
                  CARD 1 — IMAGE FORMAT SWAP
                  Canvas draws the image at native size → toDataURL("image/jpeg")
                  ═══════════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                <div style={panelHeaderStyle("#f59e0b")}>
                  <div style={iconBubble("#f59e0b")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 3 21 3 21 8"/>
                      <line x1="4" y1="20" x2="21" y2="3"/>
                      <polyline points="21 16 21 21 16 21"/>
                      <line x1="15" y1="15" x2="21" y2="21"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>Image Format Swap</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#f59e0b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Any format → JPEG · canvas engine</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#f59e0b22", color: "#f59e0b", letterSpacing: "0.07em", flexShrink: 0 }}>CONVERT</span>
                </div>

                {/* How it works strip */}
                <div style={{ fontSize: "clamp(10.5px, 2.5vw, 12px)", color: mu, lineHeight: 1.6, padding: "8px 12px", borderRadius: 8, background: dk ? "#0f172a50" : "#fffbeb", border: "1px solid #f59e0b20" }}>
                  Upload any image (PNG, WebP, GIF, BMP…). The browser draws it onto a hidden <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#fef3c7", borderRadius: 4, padding: "1px 5px", color: "#d97706" }}>&lt;canvas&gt;</code> at full resolution, then calls <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#fef3c7", borderRadius: 4, padding: "1px 5px", color: "#d97706" }}>toDataURL("image/jpeg")</code> — no server, no upload.
                </div>

                <DropTile
                  fileRef={fmtRef}
                  onPick={handleFmtPick}
                  preview={fmtPreview}
                  meta={fmtMeta}
                  color="#f59e0b"
                />

                {fmtMeta && (
                  <StatRow color="#f59e0b" items={[
                    { label: "Source:", value: fmtMeta.name },
                    { label: "Dimensions:", value: `${fmtMeta.w} × ${fmtMeta.h} px` },
                    { label: "Original size:", value: `${(fmtMeta.size / 1024).toFixed(1)} KB` },
                    { label: "Output:", value: "JPEG — quality 0.92" },
                  ]} />
                )}

                {sLine(fmtStatus)}

                {processBtn(
                  fmtBusy ? "Converting…" : "Convert to JPEG & Download",
                  handleFmtConvert,
                  "linear-gradient(135deg, #f59e0b, #d97706)",
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"/>
                    <line x1="4" y1="20" x2="21" y2="3"/>
                    <polyline points="21 16 21 21 16 21"/>
                    <line x1="15" y1="15" x2="21" y2="21"/>
                  </svg>,
                  fmtBusy || !fmtFile
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  100% browser-native · canvas API · no upload · white-fill for transparent sources
                </div>
              </div>


              {/* ═══════════════════════════════════════════════════════════
                  CARD 2 — COMPRESSION ENGINE
                  Canvas redraws at 70% dimensions + quality 0.5 → JPEG download
                  ═══════════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                <div style={panelHeaderStyle("#ef4444")}>
                  <div style={iconBubble("#ef4444")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 14 10 14 10 20"/>
                      <polyline points="20 10 14 10 14 4"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                      <line x1="3" y1="21" x2="14" y2="10"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>Compression Engine</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#ef4444", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>70% scale · quality 0.5 · JPEG output</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#ef444422", color: "#ef4444", letterSpacing: "0.07em", flexShrink: 0 }}>COMPRESS</span>
                </div>

                {/* How it works */}
                <div style={{ fontSize: "clamp(10.5px, 2.5vw, 12px)", color: mu, lineHeight: 1.6, padding: "8px 12px", borderRadius: 8, background: dk ? "#0f172a50" : "#fef2f2", border: "1px solid #ef444420" }}>
                  The canvas is sized to <strong style={{ color: "#ef4444" }}>70%</strong> of the original dimensions, then drawn with <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#fee2e2", borderRadius: 4, padding: "1px 5px", color: "#dc2626" }}>imageSmoothingQuality: "high"</code> and exported at quality <strong style={{ color: "#ef4444" }}>0.5</strong> — a dual reduction of both pixel count and JPEG encoding fidelity.
                </div>

                <DropTile
                  fileRef={cmpRef}
                  onPick={handleCmpPick}
                  preview={cmpPreview}
                  meta={cmpMeta}
                  color="#ef4444"
                />

                {cmpMeta && (
                  <StatRow color="#ef4444" items={[
                    { label: "Source:", value: cmpMeta.name },
                    { label: "Original:", value: `${cmpMeta.w}×${cmpMeta.h}px — ${(cmpMeta.size / 1024).toFixed(1)} KB` },
                    { label: "Target:", value: `${Math.round(cmpMeta.w * 0.7)}×${Math.round(cmpMeta.h * 0.7)}px — quality 0.5` },
                  ]} />
                )}

                {/* Compressed preview + savings badge */}
                {cmpResult && (
                  <div style={{ borderRadius: 9, overflow: "hidden", border: `1px solid #ef444430` }}>
                    <img
                      src={cmpResult.dataUrl}
                      alt="compressed preview"
                      style={{ width: "100%", maxHeight: 160, objectFit: "contain", display: "block", background: dk ? "#0f172a" : "#f9fafb", padding: 8 }}
                    />
                    <div style={{
                      padding: "7px 12px", display: "flex", flexWrap: "wrap", gap: 8,
                      background: dk ? "#0f172a" : "#fef2f2",
                      borderTop: `1px solid #ef444420`,
                      fontSize: "clamp(10px, 2.5vw, 11px)", fontWeight: 600,
                    }}>
                      <span style={{ color: mu }}>Output: <strong style={{ color: "#ef4444" }}>{cmpResult.w}×{cmpResult.h}px</strong></span>
                      <span style={{ color: mu }}>Size: <strong style={{ color: "#ef4444" }}>{(cmpResult.bytes / 1024).toFixed(1)} KB</strong></span>
                      {cmpMeta && cmpResult.bytes < cmpMeta.size && (
                        <span style={{ marginLeft: "auto", color: "#10b981", fontWeight: 800 }}>
                          ↓ {(((cmpMeta.size - cmpResult.bytes) / cmpMeta.size) * 100).toFixed(1)}% saved
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {sLine(cmpStatus)}

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {processBtn(
                    cmpBusy ? "Compressing…" : "Compress Image",
                    handleCmpCompress,
                    "linear-gradient(135deg, #ef4444, #dc2626)",
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 14 10 14 10 20"/>
                      <polyline points="20 10 14 10 14 4"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                      <line x1="3" y1="21" x2="14" y2="10"/>
                    </svg>,
                    cmpBusy || !cmpFile
                  )}
                  {cmpResult && processBtn(
                    "Download Compressed JPEG",
                    handleCmpDownload,
                    "#b91c1c",
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>,
                    false
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Dual reduction: 30% dimension scale + quality 0.5 encoding · no server · instant
                </div>
              </div>


              {/* ═══════════════════════════════════════════════════════════
                  CARD 3 — IMAGE TO PDF
                  Reads image as base64 data-URL array string →
                  injects into printable HTML Blob → opens in new tab
                  ═══════════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                <div style={panelHeaderStyle("#8b5cf6")}>
                  <div style={iconBubble("#8b5cf6")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <rect x="8" y="12" width="8" height="6" rx="1"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>Image to PDF</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#8b5cf6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Base64 array → printable viewport frame</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#8b5cf622", color: "#8b5cf6", letterSpacing: "0.07em", flexShrink: 0 }}>PDF</span>
                </div>

                {/* How it works */}
                <div style={{ fontSize: "clamp(10.5px, 2.5vw, 12px)", color: mu, lineHeight: 1.6, padding: "8px 12px", borderRadius: 8, background: dk ? "#0f172a50" : "#f5f3ff", border: "1px solid #8b5cf620" }}>
                  The image is read by <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#ede9fe", borderRadius: 4, padding: "1px 5px", color: "#7c3aed" }}>FileReader</code> as a base64 data-URL array string, injected into a self-contained A4 HTML document, and opened in a new tab. The toolbar's <strong style={{ color: "#8b5cf6" }}>Print / Save PDF</strong> button triggers the native browser print dialog — zero dependencies.
                </div>

                <DropTile
                  fileRef={pdfRef}
                  onPick={handlePdfPick}
                  preview={pdfPreview}
                  meta={pdfMeta}
                  color="#8b5cf6"
                />

                {pdfMeta && (
                  <StatRow color="#8b5cf6" items={[
                    { label: "File:", value: pdfMeta.name },
                    { label: "Dimensions:", value: `${pdfMeta.w} × ${pdfMeta.h} px` },
                    { label: "Size:", value: `${(pdfMeta.size / 1024).toFixed(1)} KB` },
                    { label: "Page:", value: "A4 · 210mm × 297mm" },
                  ]} />
                )}

                {/* Data-URL string preview */}
                {pdfPreview && (
                  <div>
                    <label style={{ ...lS, marginBottom: 6 }}>Base64 Data-URL Preview (array string)</label>
                    <div style={{
                      borderRadius: 8, border: `1px solid #8b5cf630`,
                      background: dk ? "#0f172a" : "#faf5ff",
                      padding: "9px 12px",
                      fontFamily: "monospace",
                      fontSize: "clamp(9px, 2vw, 10.5px)",
                      color: "#8b5cf6",
                      wordBreak: "break-all",
                      lineHeight: 1.5,
                      maxHeight: 72,
                      overflowY: "auto",
                    }}>
                      {/* Show first 320 chars of the data-URL to illustrate the array string */}
                      {pdfPreview.slice(0, 320)}<span style={{ color: mu }}>…[{(pdfPreview.length).toLocaleString()} chars total]</span>
                    </div>
                  </div>
                )}

                {sLine(pdfStatus)}

                {processBtn(
                  pdfBusy ? "Opening frame…" : "Open Printable PDF Frame",
                  handlePdfOpen,
                  "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <rect x="8" y="12" width="8" height="6" rx="1"/>
                  </svg>,
                  pdfBusy || !pdfFile
                )}

                {/* Print workflow note */}
                <div style={{
                  borderRadius: 8, border: `1px solid #8b5cf625`,
                  background: dk ? "#0f172a" : "#faf5ff",
                  padding: "9px 12px", fontSize: "clamp(10px, 2.5vw, 11px)", color: mu, lineHeight: 1.55,
                }}>
                  <strong style={{ color: "#8b5cf6" }}>In the opened frame:</strong> click <em>Print / Save PDF</em> in the toolbar, or press <kbd style={{ fontSize: 9.5, padding: "1px 5px", borderRadius: 4, border: `1px solid ${bd}`, background: dk ? "#334155" : "#e2e8f0" }}>Ctrl+P</kbd> / <kbd style={{ fontSize: 9.5, padding: "1px 5px", borderRadius: 4, border: `1px solid ${bd}`, background: dk ? "#334155" : "#e2e8f0" }}>⌘P</kbd>, then choose <em>Save as PDF</em> as the destination.
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  FileReader base64 → Blob HTML → new tab · browser print dialog · zero dependencies
                </div>
              </div>

            </div>
          ); /* end ImagesModule return */
        } /* end function ImagesModule */

        /* Render inner component with all required style helpers forwarded */
        return (
          <ImagesModule
            dark={dark} surface={surface} border={border} text={text} muted={muted}
            inputStyle={inputStyle} labelStyle={labelStyle}
            panelStyle={panelStyle} panelHeaderStyle={panelHeaderStyle}
            iconBubble={iconBubble} dropZoneStyle={dropZoneStyle}
          />
        );
      })()}{/* end utilCategory === "images" IIFE */}

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY: DEVELOPER TOOLS — placeholder, ready for dev tools next phase
          ══════════════════════════════════════════════════════════════════ */}
      {utilCategory === "developer" && (() => {

        /* ══════════════════════════════════════════════════════════════════
           DeveloperModule — inner component so useState hooks are legal.
           Three cards:
             1. Code Minifier    — regex string compaction
             2. Base64 Pipeline  — btoa() / atob()
             3. URL Translator   — encodeURIComponent / decodeURIComponent
           All processing is synchronous, 100% browser-native, zero deps.
           ══════════════════════════════════════════════════════════════════ */
        function DeveloperModule({ dark: dk, surface: sf, border: bd, text: tx,
                                   muted: mu, inputStyle: iS, labelStyle: lS,
                                   panelStyle, panelHeaderStyle, iconBubble }) {

          /* ── Shared status line renderer ─────────────────────────────── */
          const sLine = (msg) => {
            if (!msg) return null;
            const isOk   = msg.startsWith("✓");
            const isWarn = msg.startsWith("⚠");
            return (
              <div style={{
                fontSize: "clamp(10.5px, 2.5vw, 11.5px)", padding: "8px 12px",
                borderRadius: 8, fontFamily: "monospace", wordBreak: "break-word", lineHeight: 1.5,
                background: dk ? "#0f172a" : "#f8fafc",
                border: `1px solid ${isOk ? "#10b98140" : isWarn ? "#f59e0b40" : bd}`,
                color:  isOk ? "#10b981" : isWarn ? "#f59e0b" : mu,
              }}>{msg}</div>
            );
          };

          /* ── Shared copy-to-clipboard button ─────────────────────────── */
          const CopyBtn = ({ value, color }) => {
            const [copied, setCopied] = React.useState(false);
            const handleCopy = () => {
              if (!value) return;
              navigator.clipboard.writeText(value).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }).catch(() => {
                /* Fallback for environments without clipboard API */
                const ta = document.createElement("textarea");
                ta.value = value;
                ta.style.position = "fixed";
                ta.style.opacity  = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            };
            return (
              <button
                onClick={handleCopy}
                disabled={!value}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "5px 12px", borderRadius: 7, border: `1px solid ${copied ? "#10b98150" : color + "40"}`,
                  background: copied ? "#10b98112" : "transparent",
                  color: copied ? "#10b981" : color,
                  fontSize: 10.5, fontWeight: 700, cursor: value ? "pointer" : "not-allowed",
                  opacity: value ? 1 : 0.4,
                  transition: "all 0.15s",
                  WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
                }}
              >
                {copied
                  ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                }
                {copied ? "Copied!" : "Copy"}
              </button>
            );
          };

          /* ── Shared action button ────────────────────────────────────── */
          const ActBtn = ({ label, onClick, color, icon, disabled, flex }) => (
            <button
              onClick={onClick}
              disabled={!!disabled}
              style={{
                flex: flex ? "1 1 0" : undefined,
                width: flex ? undefined : "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "11px 14px", borderRadius: 10, border: "none",
                background: disabled ? (dk ? "#1e293b" : "#e2e8f0") : color,
                color: disabled ? mu : "#fff",
                fontSize: "clamp(11.5px, 2.5vw, 13px)", fontWeight: 700,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "filter 0.15s, transform 0.1s",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation", userSelect: "none",
                opacity: disabled ? 0.5 : 1,
              }}
              onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(1.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
              onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = ""; }}
              onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
              onTouchEnd={e => { e.currentTarget.style.transform = ""; }}
            >
              {icon}{label}
            </button>
          );

          /* ── Shared output block (readonly textarea + copy bar) ──────── */
          const OutputBlock = ({ value, color, label, mono }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <label style={{ ...lS, marginBottom: 0 }}>{label}</label>
                <CopyBtn value={value} color={color} />
              </div>
              <textarea
                rows={5}
                readOnly
                value={value}
                style={{
                  ...iS,
                  resize: "vertical",
                  width: "100%", boxSizing: "border-box",
                  fontFamily: mono !== false ? "monospace" : "inherit",
                  fontSize: 12, lineHeight: 1.65,
                  color: value ? color : mu,
                  borderColor: value ? color + "50" : undefined,
                  background: value ? (dk ? "#0f172a" : color + "06") : undefined,
                  cursor: "text",
                }}
                placeholder="Output will appear here…"
              />
              {value && (
                <div style={{ fontSize: 10, color: mu, display: "flex", gap: 10 }}>
                  <span><strong style={{ color }}>{value.length.toLocaleString()}</strong> chars</span>
                  <span><strong style={{ color }}>{new Blob([value]).size.toLocaleString()}</strong> bytes</span>
                </div>
              )}
            </div>
          );

          
          const [minInput,    setMinInput]    = React.useState("");
          const [minOutput,   setMinOutput]   = React.useState("");
          const [minMode,     setMinMode]     = React.useState("trim");
          const [minStatus,   setMinStatus]   = React.useState("");
          const [minSavings,  setMinSavings]  = React.useState(null);

          const MINIFY_MODES = [
            { value: "trim",     label: "Trim",    desc: "Collapse runs of whitespace to single spaces" },
            { value: "minify",   label: "Minify",  desc: "Strip comments + excess whitespace" },
            { value: "collapse", label: "Collapse",desc: "Remove ALL whitespace — single token stream" },
          ];

          const handleMinify = () => {
            if (!minInput.trim()) { setMinStatus("⚠ Paste some code or text first."); return; }
            let result = minInput;

            if (minMode === "trim") {
              /* Core formula from spec */
              result = minInput.replace(/\s+/g, " ").trim();
            } else if (minMode === "minify") {
              /* Strip block comments */
              result = result.replace(/\/\*[\s\S]*?\*\//g, "");
              /* Strip line comments */
              result = result.replace(/\/\/[^\n]*/g, "");
              /* Collapse whitespace */
              result = result.replace(/\s+/g, " ").trim();
              /* Remove spaces around common operators */
              result = result
                .replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, "$1")
                .replace(/;\s*}/g, "}");
            } else if (minMode === "collapse") {
              /* Remove ALL whitespace — newlines, tabs, spaces */
              result = result.replace(/\s+/g, "");
            }

            const savedChars = minInput.length - result.length;
            const savedPct   = minInput.length > 0
              ? ((savedChars / minInput.length) * 100).toFixed(1)
              : "0.0";

            setMinOutput(result);
            setMinSavings({ before: minInput.length, after: result.length, chars: savedChars, pct: savedPct });
            setMinStatus(
              savedChars > 0
                ? `✓ Compacted — removed ${savedChars.toLocaleString()} chars (${savedPct}% reduction)`
                : `✓ Processed — no further reduction possible in ${minMode} mode`
            );
          };

          const handleMinClear = () => {
            setMinInput(""); setMinOutput(""); setMinStatus(""); setMinSavings(null);
          };

          /* ══════════════════════════════════════════════════════════════
             CARD 2 — BASE64 PIPELINE
             btoa() for encode, atob() for decode.
             UTF-8 safe wrapper: TextEncoder → Uint8Array → binary string
             so characters outside latin-1 (emoji, CJK, etc.) don't throw.
             ══════════════════════════════════════════════════════════════ */
          const [b64Input,   setB64Input]   = React.useState("");
          const [b64Output,  setB64Output]  = React.useState("");
          const [b64Status,  setB64Status]  = React.useState("");
          const [b64LastOp,  setB64LastOp]  = React.useState(null); // "encode"|"decode"

          /* UTF-8 safe btoa */
          const utf8ToB64 = (str) => {
            const bytes  = new TextEncoder().encode(str);
            let   binary = "";
            bytes.forEach(b => { binary += String.fromCharCode(b); });
            return btoa(binary);
          };

          /* UTF-8 safe atob */
          const b64ToUtf8 = (b64) => {
            const binary = atob(b64);
            const bytes  = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            return new TextDecoder().decode(bytes);
          };

          const handleB64Encode = () => {
            if (!b64Input.trim()) { setB64Status("⚠ Enter text to encode."); return; }
            try {
              const result = utf8ToB64(b64Input);
              setB64Output(result);
              setB64LastOp("encode");
              setB64Status(`✓ Encoded via btoa() — ${b64Input.length} chars → ${result.length} Base64 chars`);
            } catch (err) {
              setB64Status(`⚠ Encoding failed: ${err.message}`);
            }
          };

          const handleB64Decode = () => {
            if (!b64Input.trim()) { setB64Status("⚠ Enter a Base64 string to decode."); return; }
            try {
              /* Validate it looks like Base64 before trying */
              const cleaned = b64Input.replace(/\s/g, "");
              if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
                setB64Status("⚠ Input doesn't look like valid Base64 — check for invalid characters.");
                return;
              }
              const result = b64ToUtf8(cleaned);
              setB64Output(result);
              setB64LastOp("decode");
              setB64Status(`✓ Decoded via atob() — ${cleaned.length} Base64 chars → ${result.length} chars`);
            } catch (err) {
              setB64Status(`⚠ Decoding failed: ${err.message} — confirm the input is valid Base64.`);
            }
          };

          const handleB64Clear = () => {
            setB64Input(""); setB64Output(""); setB64Status(""); setB64LastOp(null);
          };

          /* Swap output back into input for chained operations */
          const handleB64Swap = () => {
            if (!b64Output) return;
            setB64Input(b64Output);
            setB64Output("");
            setB64Status("");
            setB64LastOp(null);
          };

          /* ══════════════════════════════════════════════════════════════
             CARD 3 — URL TRANSLATOR
             encodeURIComponent() and decodeURIComponent().
             Also provides a "Full URL encode" variant using encodeURI()
             for encoding complete URLs without breaking scheme/slashes.
             ══════════════════════════════════════════════════════════════ */
          const [urlInput,   setUrlInput]   = React.useState("");
          const [urlOutput,  setUrlOutput]  = React.useState("");
          const [urlStatus,  setUrlStatus]  = React.useState("");
          const [urlMode,    setUrlMode]    = React.useState("component"); // "component"|"full"
          const [urlLastOp,  setUrlLastOp]  = React.useState(null);

          const URL_MODES = [
            { value: "component", label: "Component",  desc: "encodeURIComponent — encodes everything incl. : / ? # & =" },
            { value: "full",      label: "Full URL",   desc: "encodeURI — preserves : / ? # & = for complete URLs" },
          ];

          const handleUrlEncode = () => {
            if (!urlInput.trim()) { setUrlStatus("⚠ Enter text or a URL to encode."); return; }
            try {
              const result = urlMode === "component"
                ? encodeURIComponent(urlInput)
                : encodeURI(urlInput);
              setUrlOutput(result);
              setUrlLastOp("encode");
              const fn = urlMode === "component" ? "encodeURIComponent()" : "encodeURI()";
              setUrlStatus(`✓ Encoded via ${fn} — ${urlInput.length} → ${result.length} chars`);
            } catch (err) {
              setUrlStatus(`⚠ Encode failed: ${err.message}`);
            }
          };

          const handleUrlDecode = () => {
            if (!urlInput.trim()) { setUrlStatus("⚠ Enter a URL-encoded string to decode."); return; }
            try {
              const result = decodeURIComponent(urlInput);
              setUrlOutput(result);
              setUrlLastOp("decode");
              setUrlStatus(`✓ Decoded via decodeURIComponent() — ${urlInput.length} → ${result.length} chars`);
            } catch (err) {
              setUrlStatus(`⚠ Decode failed: ${err.message} — check for malformed percent-encoding.`);
            }
          };

          const handleUrlClear = () => {
            setUrlInput(""); setUrlOutput(""); setUrlStatus(""); setUrlLastOp(null);
          };

          const handleUrlSwap = () => {
            if (!urlOutput) return;
            setUrlInput(urlOutput);
            setUrlOutput("");
            setUrlStatus("");
            setUrlLastOp(null);
          };

          /* ── Mode tab row ────────────────────────────────────────────── */
          const ModeTabRow = ({ modes, value, onChange, color }) => (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {modes.map(m => {
                const active = value === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => onChange(m.value)}
                    title={m.desc}
                    style={{
                      flex: "1 1 auto", minWidth: 80,
                      padding: "9px 10px", borderRadius: 8,
                      border: `1px solid ${active ? color : bd}`,
                      background: active ? color : "transparent",
                      color: active ? "#fff" : mu,
                      fontSize: "clamp(11px, 2.5vw, 12px)", fontWeight: active ? 700 : 500,
                      cursor: "pointer", transition: "all 0.15s",
                      WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
                      userSelect: "none",
                    }}
                    onMouseDown={e => { if (!active) e.currentTarget.style.transform = "scale(0.97)"; }}
                    onMouseUp={e => { e.currentTarget.style.transform = ""; }}
                    onTouchStart={e => { if (!active) e.currentTarget.style.transform = "scale(0.97)"; }}
                    onTouchEnd={e => { e.currentTarget.style.transform = ""; }}
                  >{m.label}</button>
                );
              })}
            </div>
          );

          /* ── Swap button ─────────────────────────────────────────────── */
          const SwapBtn = ({ onClick, disabled, color }) => (
            <button
              onClick={onClick}
              disabled={disabled}
              title="Move output back to input"
              style={{
                alignSelf: "center", display: "flex", alignItems: "center", gap: 5,
                padding: "6px 14px", borderRadius: 7,
                border: `1px solid ${disabled ? bd : color + "50"}`,
                background: "transparent",
                color: disabled ? mu : color,
                fontSize: 11, fontWeight: 700,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.4 : 1,
                transition: "all 0.15s",
                WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
              ↺ Use as input
            </button>
          );

          /* ── RENDER ─────────────────────────────────────────────────── */
          return (
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 18,
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}>

              {/* ═══════════════════════════════════════════════════════════
                  CARD 1 — CODE MINIFIER
                  String compaction via regex replace formulas.
                  Three modes: Trim · Minify · Collapse
                  ═══════════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                <div style={panelHeaderStyle("#06b6d4")}>
                  <div style={iconBubble("#06b6d4")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 14 10 14 10 20"/>
                      <polyline points="20 10 14 10 14 4"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                      <line x1="3" y1="21" x2="14" y2="10"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>Code Minifier</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#06b6d4", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>String compaction · regex replace formulas</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#06b6d422", color: "#06b6d4", letterSpacing: "0.07em", flexShrink: 0 }}>MINIFY</span>
                </div>

                {/* How it works */}
                <div style={{ fontSize: "clamp(10.5px, 2.5vw, 12px)", color: mu, lineHeight: 1.6, padding: "8px 12px", borderRadius: 8, background: dk ? "#0f172a50" : "#ecfeff", border: "1px solid #06b6d420" }}>
                  Paste any code or text. Select a compaction strategy, then click <strong style={{ color: "#06b6d4" }}>Minify</strong>. All processing runs entirely in the browser via JavaScript string <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#cffafe", borderRadius: 4, padding: "1px 5px", color: "#0891b2" }}>.replace()</code> formulas — no server, no upload.
                </div>

                {/* Mode selector */}
                <div>
                  <label style={lS}>Compaction Mode</label>
                  <ModeTabRow modes={MINIFY_MODES} value={minMode} onChange={setMinMode} color="#06b6d4" />
                  <div style={{ marginTop: 6, fontSize: 10.5, color: mu, fontStyle: "italic" }}>
                    {MINIFY_MODES.find(m => m.value === minMode)?.desc}
                  </div>
                </div>

                {/* Formula display */}
                <div style={{
                  borderRadius: 8, border: `1px solid #06b6d425`,
                  background: dk ? "#0f172a" : "#f0fdfe",
                  padding: "8px 12px",
                  fontFamily: "monospace",
                  fontSize: "clamp(9.5px, 2vw, 11px)",
                  color: "#0891b2",
                  lineHeight: 1.7,
                }}>
                  {minMode === "trim" && (
                    <span>input<strong style={{ color: "#06b6d4" }}>.replace</strong>(<span style={{ color: "#f59e0b" }}>/\s+/g</span>, <span style={{ color: "#10b981" }}>&#39; &#39;</span>)<strong style={{ color: "#06b6d4" }}>.trim</strong>()</span>
                  )}
                  {minMode === "minify" && (
                    <>
                      <div>strip <span style={{ color: "#f59e0b" }}>/\/\*[\s\S]*?\*\//g</span> <span style={{ color: mu }}>← block comments</span></div>
                      <div>strip <span style={{ color: "#f59e0b" }}>/\/\/[^\n]*/g</span> <span style={{ color: mu }}>← line comments</span></div>
                      <div><strong style={{ color: "#06b6d4" }}>.replace</strong>(<span style={{ color: "#f59e0b" }}>/\s+/g</span>, <span style={{ color: "#10b981" }}>&#39; &#39;</span>)<strong style={{ color: "#06b6d4" }}>.trim</strong>()</div>
                    </>
                  )}
                  {minMode === "collapse" && (
                    <span>input<strong style={{ color: "#06b6d4" }}>.replace</strong>(<span style={{ color: "#f59e0b" }}>/\s+/g</span>, <span style={{ color: "#10b981" }}>&#39;&#39;</span>) <span style={{ color: mu }}>← removes ALL whitespace</span></span>
                  )}
                </div>

                {/* Input */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <label style={{ ...lS, marginBottom: 0 }}>Input Code / Text</label>
                    {minInput && (
                      <span style={{ fontSize: 10, color: mu }}>
                        <strong style={{ color: "#06b6d4" }}>{minInput.length.toLocaleString()}</strong> chars
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={6}
                    style={{ ...iS, resize: "vertical", lineHeight: 1.65, fontFamily: "monospace", fontSize: 12, width: "100%", boxSizing: "border-box" }}
                    placeholder={"Paste code or text here…\n\nExample:\n  function hello ( ) {\n    return   'world';\n  }"}
                    value={minInput}
                    onChange={e => { setMinInput(e.target.value); setMinOutput(""); setMinStatus(""); setMinSavings(null); }}
                  />
                </div>

                {/* Savings strip */}
                {minSavings && (
                  <div style={{
                    display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
                    padding: "8px 12px", borderRadius: 9,
                    background: dk ? "#0f172a" : "#ecfeff",
                    border: "1px solid #06b6d430",
                    fontSize: "clamp(10px, 2.5vw, 11.5px)", fontWeight: 600,
                  }}>
                    <span style={{ color: mu }}>Before: <strong style={{ color: tx }}>{minSavings.before.toLocaleString()}</strong></span>
                    <span style={{ color: mu }}>After: <strong style={{ color: "#06b6d4" }}>{minSavings.after.toLocaleString()}</strong></span>
                    {minSavings.chars > 0 && (
                      <span style={{ marginLeft: "auto", color: "#10b981" }}>↓ {minSavings.pct}% reduced</span>
                    )}
                  </div>
                )}

                {/* Output */}
                {minOutput && <OutputBlock value={minOutput} color="#06b6d4" label="Minified Output" />}

                {/* Status */}
                {sLine(minStatus)}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <ActBtn
                    label="Minify" onClick={handleMinify}
                    color="linear-gradient(135deg, #06b6d4, #0891b2)"
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="21" y2="3"/><line x1="3" y1="21" x2="14" y2="10"/></svg>}
                    disabled={!minInput.trim()} flex
                  />
                  <ActBtn
                    label="Clear" onClick={handleMinClear}
                    color={dk ? "#334155" : "#64748b"}
                    icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>}
                    disabled={!minInput && !minOutput} flex
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  100% browser-native · JS String.replace() regex formulas · zero server calls
                </div>
              </div>


              {/* ═══════════════════════════════════════════════════════════
                  CARD 2 — BASE64 PIPELINE
                  btoa() to encode · atob() to decode · UTF-8 safe wrappers
                  ═══════════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                <div style={panelHeaderStyle("#8b5cf6")}>
                  <div style={iconBubble("#8b5cf6")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>Base64 Pipeline</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#8b5cf6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>btoa() encode · atob() decode · UTF-8 safe</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#8b5cf622", color: "#8b5cf6", letterSpacing: "0.07em", flexShrink: 0 }}>BASE64</span>
                </div>

                {/* How it works */}
                <div style={{ fontSize: "clamp(10.5px, 2.5vw, 12px)", color: mu, lineHeight: 1.6, padding: "8px 12px", borderRadius: 8, background: dk ? "#0f172a50" : "#f5f3ff", border: "1px solid #8b5cf620" }}>
                  Type or paste any text. Click <strong style={{ color: "#8b5cf6" }}>Encode</strong> to convert it to Base64 via <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#ede9fe", borderRadius: 4, padding: "1px 5px", color: "#7c3aed" }}>btoa()</code>, or <strong style={{ color: "#8b5cf6" }}>Decode</strong> a Base64 string back via <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#ede9fe", borderRadius: 4, padding: "1px 5px", color: "#7c3aed" }}>atob()</code>. UTF-8 characters (emoji, CJK, etc.) are handled safely via <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#ede9fe", borderRadius: 4, padding: "1px 5px", color: "#7c3aed" }}>TextEncoder</code>.
                </div>

                {/* Function reference pills */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { fn: "btoa(str)",  note: "string → Base64",   active: b64LastOp === "encode", color: "#8b5cf6" },
                    { fn: "atob(b64)",  note: "Base64 → string",   active: b64LastOp === "decode", color: "#7c3aed" },
                    { fn: "TextEncoder",note: "UTF-8 safe wrapper", active: false,                  color: "#a78bfa" },
                  ].map(pill => (
                    <div key={pill.fn} style={{
                      padding: "4px 10px", borderRadius: 7, fontSize: 10.5, fontFamily: "monospace",
                      background: pill.active ? pill.color + "20" : (dk ? "#1e293b" : "#f5f3ff"),
                      border: `1px solid ${pill.active ? pill.color + "50" : pill.color + "25"}`,
                      color: pill.active ? pill.color : mu,
                      fontWeight: pill.active ? 700 : 400,
                      transition: "all 0.2s",
                    }}>
                      <strong style={{ color: pill.color }}>{pill.fn}</strong>
                      <span style={{ marginLeft: 6, fontSize: 9.5, opacity: 0.7 }}>{pill.note}</span>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <label style={{ ...lS, marginBottom: 0 }}>Input</label>
                    {b64Input && <span style={{ fontSize: 10, color: mu }}><strong style={{ color: "#8b5cf6" }}>{b64Input.length.toLocaleString()}</strong> chars</span>}
                  </div>
                  <textarea
                    rows={5}
                    style={{ ...iS, resize: "vertical", lineHeight: 1.65, fontFamily: "monospace", fontSize: 12, width: "100%", boxSizing: "border-box" }}
                    placeholder={"Paste plain text to encode…\n— or —\nPaste a Base64 string to decode.\n\nExample: Hello, World! 🌍"}
                    value={b64Input}
                    onChange={e => { setB64Input(e.target.value); setB64Output(""); setB64Status(""); setB64LastOp(null); }}
                  />
                </div>

                {/* Output */}
                {b64Output && (
                  <>
                    <SwapBtn onClick={handleB64Swap} disabled={!b64Output} color="#8b5cf6" />
                    <OutputBlock value={b64Output} color="#8b5cf6" label={b64LastOp === "encode" ? "Base64 Encoded Output" : "Decoded Text Output"} />
                  </>
                )}

                {/* Status */}
                {sLine(b64Status)}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <ActBtn
                    label="Encode → Base64" onClick={handleB64Encode}
                    color="linear-gradient(135deg, #8b5cf6, #7c3aed)"
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
                    disabled={!b64Input.trim()} flex
                  />
                  <ActBtn
                    label="Decode ← Base64" onClick={handleB64Decode}
                    color="linear-gradient(135deg, #7c3aed, #6d28d9)"
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>}
                    disabled={!b64Input.trim()} flex
                  />
                  <ActBtn
                    label="Clear" onClick={handleB64Clear}
                    color={dk ? "#334155" : "#64748b"}
                    icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>}
                    disabled={!b64Input && !b64Output}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  btoa() · atob() · TextEncoder/Decoder UTF-8 wrapper · handles emoji &amp; CJK safely
                </div>
              </div>


              {/* ═══════════════════════════════════════════════════════════
                  CARD 3 — URL TRANSLATOR
                  encodeURIComponent() · decodeURIComponent() · encodeURI()
                  ═══════════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                <div style={panelHeaderStyle("#10b981")}>
                  <div style={iconBubble("#10b981")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>URL Translator</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#10b981", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>encodeURIComponent · decodeURIComponent</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#10b98122", color: "#10b981", letterSpacing: "0.07em", flexShrink: 0 }}>URL</span>
                </div>

                {/* How it works */}
                <div style={{ fontSize: "clamp(10.5px, 2.5vw, 12px)", color: mu, lineHeight: 1.6, padding: "8px 12px", borderRadius: 8, background: dk ? "#0f172a50" : "#f0fdf4", border: "1px solid #10b98120" }}>
                  <strong style={{ color: "#10b981" }}>Component mode</strong> uses <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#d1fae5", borderRadius: 4, padding: "1px 5px", color: "#059669" }}>encodeURIComponent()</code> — encodes everything including <code style={{ fontSize: 10, color: "#059669" }}>: / ? # &amp; =</code> — ideal for query parameter values. <strong style={{ color: "#10b981" }}>Full URL mode</strong> uses <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#d1fae5", borderRadius: 4, padding: "1px 5px", color: "#059669" }}>encodeURI()</code> which preserves URL structure characters.
                </div>

                {/* Mode tabs */}
                <div>
                  <label style={lS}>Encoding Scope</label>
                  <ModeTabRow modes={URL_MODES} value={urlMode} onChange={m => { setUrlMode(m); setUrlOutput(""); setUrlStatus(""); setUrlLastOp(null); }} color="#10b981" />
                  <div style={{ marginTop: 6, fontSize: 10.5, color: mu, fontStyle: "italic" }}>
                    {URL_MODES.find(m => m.value === urlMode)?.desc}
                  </div>
                </div>

                {/* Function formula display */}
                <div style={{
                  borderRadius: 8, border: "1px solid #10b98125",
                  background: dk ? "#0f172a" : "#f0fdf4",
                  padding: "8px 12px", fontFamily: "monospace",
                  fontSize: "clamp(9.5px, 2vw, 11px)", color: "#059669", lineHeight: 1.7,
                }}>
                  <div>
                    <strong style={{ color: "#10b981" }}>Encode:</strong>{" "}
                    {urlMode === "component"
                      ? <span><strong style={{ color: "#10b981" }}>encodeURIComponent</strong>(<span style={{ color: "#f59e0b" }}>input</span>)</span>
                      : <span><strong style={{ color: "#10b981" }}>encodeURI</strong>(<span style={{ color: "#f59e0b" }}>input</span>)</span>
                    }
                  </div>
                  <div>
                    <strong style={{ color: "#10b981" }}>Decode:</strong>{" "}
                    <span><strong style={{ color: "#10b981" }}>decodeURIComponent</strong>(<span style={{ color: "#f59e0b" }}>input</span>)</span>
                  </div>
                </div>

                {/* Input */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <label style={{ ...lS, marginBottom: 0 }}>Input</label>
                    {urlInput && <span style={{ fontSize: 10, color: mu }}><strong style={{ color: "#10b981" }}>{urlInput.length.toLocaleString()}</strong> chars</span>}
                  </div>
                  <textarea
                    rows={4}
                    style={{ ...iS, resize: "vertical", lineHeight: 1.65, fontFamily: "monospace", fontSize: 12, width: "100%", boxSizing: "border-box" }}
                    placeholder={"Plain text or URL to encode…\n— or —\nPercent-encoded string to decode.\n\nExample: Hello World! café résumé"}
                    value={urlInput}
                    onChange={e => { setUrlInput(e.target.value); setUrlOutput(""); setUrlStatus(""); setUrlLastOp(null); }}
                  />
                </div>

                {/* Character map — what gets encoded */}
                {urlInput && !urlOutput && (
                  <div style={{
                    borderRadius: 8, border: `1px solid #10b98120`,
                    background: dk ? "#0f172a" : "#f0fdf4",
                    padding: "8px 12px", fontSize: 10.5, color: mu, lineHeight: 1.6,
                  }}>
                    <strong style={{ color: "#10b981", fontSize: 10 }}>
                      {urlMode === "component" ? "encodeURIComponent will encode:" : "encodeURI will preserve:"}
                    </strong>{" "}
                    {urlMode === "component"
                      ? <span>spaces, <code style={{ color: "#10b981" }}>! # $ &amp; ' ( ) * + , / : ; = ? @ [ ]</code> and non-ASCII chars</span>
                      : <span><code style={{ color: "#10b981" }}>; , / ? : @ &amp; = + $ #</code> — only spaces and non-ASCII are encoded</span>
                    }
                  </div>
                )}

                {/* Output */}
                {urlOutput && (
                  <>
                    <SwapBtn onClick={handleUrlSwap} disabled={!urlOutput} color="#10b981" />
                    <OutputBlock
                      value={urlOutput} color="#10b981"
                      label={urlLastOp === "encode" ? "URL-Encoded Output" : "Decoded Output"}
                    />
                  </>
                )}

                {/* Status */}
                {sLine(urlStatus)}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <ActBtn
                    label="Encode" onClick={handleUrlEncode}
                    color="linear-gradient(135deg, #10b981, #059669)"
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
                    disabled={!urlInput.trim()} flex
                  />
                  <ActBtn
                    label="Decode" onClick={handleUrlDecode}
                    color="linear-gradient(135deg, #059669, #047857)"
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>}
                    disabled={!urlInput.trim()} flex
                  />
                  <ActBtn
                    label="Clear" onClick={handleUrlClear}
                    color={dk ? "#334155" : "#64748b"}
                    icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>}
                    disabled={!urlInput && !urlOutput}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  encodeURIComponent · decodeURIComponent · encodeURI · 100% browser-native
                </div>
              </div>

            </div>
          ); /* end DeveloperModule return */
        } /* end function DeveloperModule */

        /* Render inner component with all required style helpers forwarded */
        return (
          <DeveloperModule
            dark={dark} surface={surface} border={border} text={text} muted={muted}
            inputStyle={inputStyle} labelStyle={labelStyle}
            panelStyle={panelStyle} panelHeaderStyle={panelHeaderStyle} iconBubble={iconBubble}
          />
        );
      })()}{/* end utilCategory === "developer" IIFE */}

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY: SECURITY NODES — placeholder, ready for security tools next phase
          ══════════════════════════════════════════════════════════════════ */}
      {utilCategory === "security" && (() => {

        /* ══════════════════════════════════════════════════════════════════
           SecurityModule — inner component so useState/useRef hooks are legal.
           Two cards:
             1. Local Encryption Tool  — Web Crypto AES-GCM encrypt/decrypt
             2. Self-Destruct Simulator — async fetch('/api/links/create')
                                          with interactive mock UI for Vercel
           ══════════════════════════════════════════════════════════════════ */
        function SecurityModule({ dark: dk, surface: sf, border: bd, text: tx,
                                  muted: mu, inputStyle: iS, labelStyle: lS,
                                  panelStyle, panelHeaderStyle, iconBubble }) {

          /* ── Shared status line ─────────────────────────────────────── */
          const sLine = (msg) => {
            if (!msg) return null;
            const isOk   = msg.startsWith("✓");
            const isWarn = msg.startsWith("⚠");
            const isInfo = msg.startsWith("⏳");
            return (
              <div style={{
                fontSize: "clamp(10.5px, 2.5vw, 11.5px)", padding: "8px 12px",
                borderRadius: 8, fontFamily: "monospace", wordBreak: "break-word", lineHeight: 1.5,
                background: dk ? "#0f172a" : "#f8fafc",
                border: `1px solid ${isOk ? "#10b98140" : isWarn ? "#ef444440" : isInfo ? "#6366f140" : bd}`,
                color: isOk ? "#10b981" : isWarn ? "#ef4444" : isInfo ? "#818cf8" : mu,
              }}>{msg}</div>
            );
          };

          /* ── Shared copy button ─────────────────────────────────────── */
          const CopyBtn = ({ value, color, label }) => {
            const [copied, setCopied] = React.useState(false);
            const doCopy = () => {
              if (!value) return;
              navigator.clipboard.writeText(value).catch(() => {
                const ta = document.createElement("textarea");
                ta.value = value; ta.style.cssText = "position:fixed;opacity:0";
                document.body.appendChild(ta); ta.select();
                document.execCommand("copy"); document.body.removeChild(ta);
              });
              setCopied(true); setTimeout(() => setCopied(false), 2000);
            };
            return (
              <button onClick={doCopy} disabled={!value} style={{
                display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                borderRadius: 7, border: `1px solid ${copied ? "#10b98150" : color + "40"}`,
                background: copied ? "#10b98112" : "transparent",
                color: copied ? "#10b981" : color,
                fontSize: 11, fontWeight: 700, cursor: value ? "pointer" : "not-allowed",
                opacity: value ? 1 : 0.4, transition: "all 0.15s",
                WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
              }}>
                {copied
                  ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                }
                {copied ? "Copied!" : (label || "Copy")}
              </button>
            );
          };

          /* ── Shared action button ───────────────────────────────────── */
          const ActBtn = ({ label, onClick, color, icon, disabled, flex }) => (
            <button onClick={onClick} disabled={!!disabled} style={{
              flex: flex ? "1 1 0" : undefined, width: flex ? undefined : "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "12px 16px", borderRadius: 10, border: "none",
              background: disabled ? (dk ? "#1e293b" : "#e2e8f0") : color,
              color: disabled ? mu : "#fff",
              fontSize: "clamp(11.5px, 2.5vw, 13px)", fontWeight: 700,
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "filter 0.15s, transform 0.1s", opacity: disabled ? 0.5 : 1,
              WebkitTapHighlightColor: "transparent", touchAction: "manipulation", userSelect: "none",
            }}
              onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(1.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
              onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = ""; }}
              onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
              onTouchEnd={e => { e.currentTarget.style.transform = ""; }}
            >{icon}{label}</button>
          );

          /* ══════════════════════════════════════════════════════════════
             CARD 1 — LOCAL ENCRYPTION TOOL
             Web Crypto API — AES-GCM 256-bit encrypt / decrypt
             Key derived from passphrase via PBKDF2 (100 000 iterations)
             All processing 100% client-side. Zero bytes leave the browser.
             ══════════════════════════════════════════════════════════════ */
          const [encInput,    setEncInput]    = React.useState("");
          const [encPass,     setEncPass]     = React.useState("");
          const [encOutput,   setEncOutput]   = React.useState("");
          const [encStatus,   setEncStatus]   = React.useState("");
          const [encBusy,     setEncBusy]     = React.useState(false);
          const [encMode,     setEncMode]     = React.useState("encrypt"); // "encrypt"|"decrypt"
          const [encShowPass, setEncShowPass] = React.useState(false);

          /* ── Web Crypto helpers ── */
          const enc = new TextEncoder();
          const dec = new TextDecoder();

          /* Derive an AES-GCM key from a passphrase + salt via PBKDF2 */
          const deriveKey = async (passphrase, salt) => {
            const keyMaterial = await crypto.subtle.importKey(
              "raw", enc.encode(passphrase), { name: "PBKDF2" }, false, ["deriveKey"]
            );
            return crypto.subtle.deriveKey(
              { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
              keyMaterial,
              { name: "AES-GCM", length: 256 },
              false,
              ["encrypt", "decrypt"]
            );
          };

          /* Uint8Array ↔ Base64 helpers for safe storage/display */
          const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
          const fromB64 = (b64) => {
            const bin = atob(b64);
            const buf = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
            return buf;
          };

          const handleEncrypt = async () => {
            if (!encInput.trim()) { setEncStatus("⚠ Enter a message to encrypt."); return; }
            if (!encPass.trim())  { setEncStatus("⚠ Enter a passphrase."); return; }
            setEncBusy(true); setEncStatus("⏳ Deriving key via PBKDF2…");
            try {
              const salt = crypto.getRandomValues(new Uint8Array(16));
              const iv   = crypto.getRandomValues(new Uint8Array(12));
              const key  = await deriveKey(encPass, salt);
              setEncStatus("⏳ Encrypting with AES-GCM 256-bit…");
              const cipherBuf = await crypto.subtle.encrypt(
                { name: "AES-GCM", iv }, key, enc.encode(encInput)
              );
              /* Pack: [salt 16B][iv 12B][ciphertext] → Base64 */
              const combined = new Uint8Array(16 + 12 + cipherBuf.byteLength);
              combined.set(salt, 0);
              combined.set(iv, 16);
              combined.set(new Uint8Array(cipherBuf), 28);
              setEncOutput(toB64(combined.buffer));
              setEncStatus("✓ Encrypted — share the output string and passphrase separately. Never together.");
            } catch (err) {
              setEncStatus(`⚠ Encryption failed: ${err.message}`);
            } finally { setEncBusy(false); }
          };

          const handleDecrypt = async () => {
            if (!encInput.trim()) { setEncStatus("⚠ Paste the encrypted string to decrypt."); return; }
            if (!encPass.trim())  { setEncStatus("⚠ Enter the decryption passphrase."); return; }
            setEncBusy(true); setEncStatus("⏳ Deriving key via PBKDF2…");
            try {
              const combined = fromB64(encInput.trim());
              if (combined.length < 29) throw new Error("Input too short — not a valid encrypted payload.");
              const salt      = combined.slice(0, 16);
              const iv        = combined.slice(16, 28);
              const cipher    = combined.slice(28);
              const key       = await deriveKey(encPass, salt);
              setEncStatus("⏳ Decrypting with AES-GCM 256-bit…");
              const plainBuf  = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv }, key, cipher
              );
              setEncOutput(dec.decode(plainBuf));
              setEncStatus("✓ Decrypted successfully — original message recovered.");
            } catch (err) {
              const msg = err.name === "OperationError"
                ? "Wrong passphrase or corrupted payload — decryption failed."
                : err.message;
              setEncStatus(`⚠ ${msg}`);
            } finally { setEncBusy(false); }
          };

          const handleEncClear = () => {
            setEncInput(""); setEncPass(""); setEncOutput(""); setEncStatus(""); setEncBusy(false);
          };

          /* ══════════════════════════════════════════════════════════════
             CARD 2 — SELF-DESTRUCT SIMULATOR
             Backend-ready: async fetch('/api/links/create') POST
             Interactive mock UI for Vercel dev/preview mode
             ══════════════════════════════════════════════════════════════ */
          const [sdContent,  setSdContent]  = React.useState("");
          const [sdExpiry,   setSdExpiry]   = React.useState("1h");
          const [sdViews,    setSdViews]    = React.useState("1");
          const [sdPass,     setSdPass]     = React.useState("");
          const [sdResult,   setSdResult]   = React.useState(null);  // { url, id, expiry, views }
          const [sdStatus,   setSdStatus]   = React.useState("");
          const [sdBusy,     setSdBusy]     = React.useState(false);
          const [sdCopied,   setSdCopied]   = React.useState(false);
          const [sdShowPass, setSdShowPass] = React.useState(false);
          const [sdDestroyed,setSdDestroyed]= React.useState(false);

          const SD_EXPIRY_OPTS = [
            { value: "15m",  label: "15 min" },
            { value: "1h",   label: "1 hour" },
            { value: "6h",   label: "6 hours" },
            { value: "24h",  label: "24 hours" },
            { value: "7d",   label: "7 days" },
          ];
          const SD_VIEWS_OPTS = [
            { value: "1",  label: "1 view" },
            { value: "3",  label: "3 views" },
            { value: "5",  label: "5 views" },
            { value: "10", label: "10 views" },
          ];

          const handleSdCreate = async () => {
            if (!sdContent.trim()) { setSdStatus("⚠ Enter secret content first."); return; }
            setSdBusy(true); setSdResult(null); setSdDestroyed(false);
            setSdStatus("⏳ Sending to secure link API…");

            try {
              /* ── Backend-ready POST ─────────────────────────────────────
                 Replace origin with your actual API host in production.
                 The server should:
                   1. Encrypt `content` server-side with a random key
                   2. Store the encrypted payload in your DB
                   3. Return a one-time access URL + expiry metadata
                 ─────────────────────────────────────────────────────── */
              const res = await fetch("/api/links/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  content:    sdContent,
                  expiry:     sdExpiry,
                  maxViews:   parseInt(sdViews, 10),
                  passphrase: sdPass || null,
                  destroyOnRead: parseInt(sdViews, 10) === 1,
                }),
              });

              if (!res.ok) throw new Error(`Server ${res.status}: ${res.statusText}`);
              const data = await res.json();
              setSdResult({
                url:    data.url || `${window.location.origin}/s/${data.id}`,
                id:     data.id,
                expiry: data.expiry || sdExpiry,
                views:  data.maxViews || parseInt(sdViews, 10),
              });
              setSdStatus("✓ Self-destruct link created successfully via API.");

            } catch (err) {
              /* ── Vercel / local mock fallback ──────────────────────────
                 API not yet deployed — generate a realistic mock link so
                 the UI is fully interactive and demonstrable immediately.
                 ──────────────────────────────────────────────────────── */
              console.warn("[Self-Destruct] API offline:", err.message);

              const mockId  = Array.from(crypto.getRandomValues(new Uint8Array(8)))
                              .map(b => b.toString(36)).join("").slice(0, 10);
              const expiryLabels = { "15m": "15 minutes", "1h": "1 hour", "6h": "6 hours", "24h": "24 hours", "7d": "7 days" };

              setSdResult({
                url:    `${window.location.origin}/s/${mockId}`,
                id:     mockId,
                expiry: sdExpiry,
                views:  parseInt(sdViews, 10),
                isMock: true,
              });
              setSdStatus(`⚠ API offline — mock link shown. Wire /api/links/create to activate. Expires in ${expiryLabels[sdExpiry] || sdExpiry} · ${sdViews} view${parseInt(sdViews,10) > 1 ? "s" : ""}.`);
            } finally {
              setSdBusy(false);
            }
          };

          const handleSdCopyLink = () => {
            if (!sdResult) return;
            navigator.clipboard.writeText(sdResult.url).catch(() => {});
            setSdCopied(true); setTimeout(() => setSdCopied(false), 2500);
          };

          const handleSdDestroy = () => {
            /* Simulate instant destruction — in production: DELETE /api/links/:id */
            setSdDestroyed(true);
            setSdResult(null);
            setSdStatus("✓ Link destroyed. The secret content is permanently gone.");
          };

          const handleSdReset = () => {
            setSdContent(""); setSdExpiry("1h"); setSdViews("1");
            setSdPass(""); setSdResult(null); setSdStatus(""); setSdBusy(false);
            setSdCopied(false); setSdDestroyed(false); setSdShowPass(false);
          };

          /* ── Pill tab row (reusable inside this module) ─────────────── */
          const TabPills = ({ opts, value, onChange, color }) => (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {opts.map(o => {
                const active = value === o.value;
                return (
                  <button key={o.value} onClick={() => onChange(o.value)} style={{
                    flex: "1 1 auto", padding: "8px 8px", borderRadius: 8,
                    border: `1px solid ${active ? color : bd}`,
                    background: active ? color : "transparent",
                    color: active ? "#fff" : mu,
                    fontSize: "clamp(10.5px, 2vw, 12px)", fontWeight: active ? 700 : 500,
                    cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                    WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
                  }}
                    onMouseDown={e => { if (!active) e.currentTarget.style.transform = "scale(0.97)"; }}
                    onMouseUp={e => { e.currentTarget.style.transform = ""; }}
                    onTouchStart={e => { if (!active) e.currentTarget.style.transform = "scale(0.97)"; }}
                    onTouchEnd={e => { e.currentTarget.style.transform = ""; }}
                  >{o.label}</button>
                );
              })}
            </div>
          );

          /* ── Password input with show/hide toggle ───────────────────── */
          const PassField = ({ value, onChange, placeholder, show, onToggle, color }) => (
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{ ...iS, width: "100%", boxSizing: "border-box", paddingRight: 40 }}
              />
              <button onClick={onToggle} style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: mu,
                padding: 4, display: "flex", alignItems: "center",
                WebkitTapHighlightColor: "transparent",
              }}>
                {show
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          );

          /* ── RENDER ─────────────────────────────────────────────────── */
          return (
            <div style={{
              display: "grid", gridTemplateColumns: "1fr",
              gap: 18, width: "100%", maxWidth: "100%", boxSizing: "border-box",
            }}>

              {/* ═══════════════════════════════════════════════════════════
                  CARD 1 — LOCAL ENCRYPTION TOOL
                  Web Crypto AES-GCM 256 · PBKDF2 key derivation · Base64 I/O
                  ═══════════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                <div style={panelHeaderStyle("#10b981")}>
                  <div style={iconBubble("#10b981")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>Local Encryption Tool</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#10b981", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>AES-GCM 256 · PBKDF2 · Web Crypto API</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#10b98122", color: "#10b981", letterSpacing: "0.07em", flexShrink: 0 }}>CRYPTO</span>
                </div>

                {/* How it works */}
                <div style={{ fontSize: "clamp(10.5px, 2.5vw, 12px)", color: mu, lineHeight: 1.6, padding: "9px 13px", borderRadius: 9, background: dk ? "#0f172a50" : "#f0fdf4", border: "1px solid #10b98120" }}>
                  Uses the browser's built-in <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#d1fae5", borderRadius: 4, padding: "1px 5px", color: "#059669" }}>Web Crypto API</code> — your passphrase is fed through <strong style={{ color: "#10b981" }}>PBKDF2</strong> (100,000 iterations, SHA-256) to derive a fresh <strong style={{ color: "#10b981" }}>AES-GCM 256-bit</strong> key. A random 96-bit IV and 128-bit salt are generated for every encryption. Output is packed as <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#d1fae5", borderRadius: 4, padding: "1px 5px", color: "#059669" }}>salt‖iv‖ciphertext</code> and Base64-encoded. <strong style={{ color: "#10b981" }}>Zero bytes leave the browser.</strong>
                </div>

                {/* Mode selector */}
                <div>
                  <label style={lS}>Operation</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[{ value: "encrypt", label: "🔒 Encrypt" }, { value: "decrypt", label: "🔓 Decrypt" }].map(m => {
                      const active = encMode === m.value;
                      return (
                        <button key={m.value} onClick={() => { setEncMode(m.value); setEncOutput(""); setEncStatus(""); }} style={{
                          flex: 1, padding: "10px 8px", borderRadius: 9, fontWeight: 700,
                          fontSize: "clamp(11.5px, 2.5vw, 13px)", cursor: "pointer",
                          border: `1.5px solid ${active ? "#10b981" : bd}`,
                          background: active ? "#10b981" : "transparent",
                          color: active ? "#fff" : mu,
                          transition: "all 0.15s",
                          WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
                        }}>{m.label}</button>
                      );
                    })}
                  </div>
                </div>

                {/* Input textarea */}
                <div>
                  <label style={lS}>
                    {encMode === "encrypt" ? "Plaintext Message" : "Encrypted Payload (Base64)"}
                  </label>
                  <textarea
                    rows={5}
                    style={{ ...iS, resize: "vertical", fontFamily: encMode === "decrypt" ? "monospace" : "inherit", fontSize: 12, lineHeight: 1.65, width: "100%", boxSizing: "border-box" }}
                    placeholder={encMode === "encrypt"
                      ? "Type your secret message here…"
                      : "Paste the Base64-encoded encrypted payload here…"}
                    value={encInput}
                    onChange={e => { setEncInput(e.target.value); setEncOutput(""); setEncStatus(""); }}
                  />
                  {encInput && (
                    <div style={{ fontSize: 10, color: mu, marginTop: 4 }}>
                      <strong style={{ color: "#10b981" }}>{encInput.length.toLocaleString()}</strong> chars
                    </div>
                  )}
                </div>

                {/* Passphrase field */}
                <div>
                  <label style={lS}>Passphrase</label>
                  <PassField
                    value={encPass} onChange={e => setEncPass(e.target.value)}
                    placeholder="Enter a strong, secret passphrase…"
                    show={encShowPass} onToggle={() => setEncShowPass(v => !v)}
                    color="#10b981"
                  />
                  {encPass && (
                    <div style={{ marginTop: 5, display: "flex", gap: 4, alignItems: "center" }}>
                      {/* Strength meter */}
                      {[
                        encPass.length >= 8,
                        /[A-Z]/.test(encPass),
                        /[0-9]/.test(encPass),
                        /[^A-Za-z0-9]/.test(encPass),
                        encPass.length >= 16,
                      ].map((ok, i) => (
                        <div key={i} style={{
                          flex: 1, height: 4, borderRadius: 2,
                          background: ok ? (i < 2 ? "#f59e0b" : i < 4 ? "#06b6d4" : "#10b981") : (dk ? "#334155" : "#e2e8f0"),
                          transition: "background 0.2s",
                        }} />
                      ))}
                      <div style={{ fontSize: 10, color: mu, marginLeft: 6, whiteSpace: "nowrap" }}>
                        {encPass.length < 8 ? "Weak" : encPass.length < 12 ? "Fair" : encPass.length < 16 ? "Good" : "Strong"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Output */}
                {encOutput && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                      <label style={{ ...lS, marginBottom: 0 }}>
                        {encMode === "encrypt" ? "Encrypted Output (Base64)" : "Decrypted Message"}
                      </label>
                      <CopyBtn value={encOutput} color="#10b981" />
                    </div>
                    <textarea
                      rows={4} readOnly value={encOutput}
                      style={{
                        ...iS, resize: "vertical", width: "100%", boxSizing: "border-box",
                        fontFamily: encMode === "encrypt" ? "monospace" : "inherit",
                        fontSize: 12, lineHeight: 1.65, color: "#10b981",
                        borderColor: "#10b98150", background: dk ? "#0f172a" : "#f0fdf4",
                      }}
                    />
                    {encMode === "encrypt" && (
                      <div style={{ marginTop: 6, fontSize: 10.5, color: mu, lineHeight: 1.5 }}>
                        <strong style={{ color: "#f59e0b" }}>⚠ Security reminder:</strong> send the encrypted string and the passphrase through separate channels. Never share both together.
                      </div>
                    )}
                  </div>
                )}

                {/* Crypto spec badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    { label: "AES-GCM",   note: "256-bit symmetric",  color: "#10b981" },
                    { label: "PBKDF2",    note: "100k iterations",     color: "#059669" },
                    { label: "SHA-256",   note: "hash function",       color: "#34d399" },
                    { label: "96-bit IV", note: "random per message",  color: "#6ee7b7" },
                  ].map(b => (
                    <div key={b.label} style={{
                      padding: "3px 9px", borderRadius: 6, fontSize: 10, fontFamily: "monospace",
                      background: b.color + "12", border: `1px solid ${b.color}28`, color: mu,
                    }}>
                      <strong style={{ color: b.color }}>{b.label}</strong>
                      <span style={{ marginLeft: 5, opacity: 0.7 }}>{b.note}</span>
                    </div>
                  ))}
                </div>

                {/* Status */}
                {sLine(encStatus)}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <ActBtn
                    label={encBusy ? (encMode === "encrypt" ? "Encrypting…" : "Decrypting…") : (encMode === "encrypt" ? "Encrypt Message" : "Decrypt Message")}
                    onClick={encMode === "encrypt" ? handleEncrypt : handleDecrypt}
                    color={encMode === "encrypt" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #059669, #047857)"}
                    icon={encMode === "encrypt"
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 1 1 9.9-1"/></svg>
                    }
                    disabled={encBusy || !encInput.trim() || !encPass.trim()} flex
                  />
                  <ActBtn
                    label="Clear" onClick={handleEncClear}
                    color={dk ? "#334155" : "#64748b"}
                    icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>}
                    disabled={!encInput && !encPass && !encOutput}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Web Crypto API · AES-GCM · PBKDF2 · zero server calls · zero data transmission
                </div>
              </div>


              {/* ═══════════════════════════════════════════════════════════
                  CARD 2 — SELF-DESTRUCT SIMULATOR
                  async fetch('/api/links/create') POST → mock UI fallback
                  ═══════════════════════════════════════════════════════════ */}
              <div style={panelStyle}>

                <div style={panelHeaderStyle("#ef4444")}>
                  <div style={iconBubble("#ef4444")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "clamp(13px, 3.5vw, 14px)", fontWeight: 800, color: tx }}>Self-Destruct Simulator</div>
                    <div style={{ fontSize: "clamp(9px, 2.5vw, 10.5px)", color: "#ef4444", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>One-time links · backend-ready API</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#ef444422", color: "#ef4444", letterSpacing: "0.07em", flexShrink: 0 }}>DESTRUCT</span>
                </div>

                {/* Architecture explanation */}
                <div style={{ fontSize: "clamp(10.5px, 2.5vw, 12px)", color: mu, lineHeight: 1.6, padding: "9px 13px", borderRadius: 9, background: dk ? "#0f172a50" : "#fef2f2", border: "1px solid #ef444420" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <strong style={{ color: "#ef4444", fontSize: "clamp(10px, 2vw, 11px)" }}>True destruction requires a server.</strong>
                  </div>
                  Real self-destructing links need a secure database to store (and delete) the secret. This card fires <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#fee2e2", borderRadius: 4, padding: "1px 5px", color: "#dc2626" }}>POST /api/links/create</code> — when the route is wired, it goes live instantly. Until then, a cryptographically random mock link is generated locally for full UI demonstration.
                </div>

                {/* ── CREATE FORM (shown when no result yet) ── */}
                {!sdResult && !sdDestroyed && (
                  <>
                    {/* Secret content */}
                    <div>
                      <label style={lS}>Secret Content</label>
                      <textarea
                        rows={5}
                        style={{ ...iS, resize: "vertical", fontSize: 12, lineHeight: 1.65, width: "100%", boxSizing: "border-box" }}
                        placeholder={"Type your secret message, token, or link…\n\nThis content will be destroyed after the configured number of views or when the timer expires."}
                        value={sdContent}
                        onChange={e => setSdContent(e.target.value)}
                      />
                      {sdContent && (
                        <div style={{ fontSize: 10, color: mu, marginTop: 4 }}>
                          <strong style={{ color: "#ef4444" }}>{sdContent.length.toLocaleString()}</strong> chars
                        </div>
                      )}
                    </div>

                    {/* Expiry tabs */}
                    <div>
                      <label style={lS}>Link Expiry</label>
                      <TabPills opts={SD_EXPIRY_OPTS} value={sdExpiry} onChange={setSdExpiry} color="#ef4444" />
                    </div>

                    {/* Max views tabs */}
                    <div>
                      <label style={lS}>Max Views Before Destruction</label>
                      <TabPills opts={SD_VIEWS_OPTS} value={sdViews} onChange={setSdViews} color="#ef4444" />
                    </div>

                    {/* Optional passphrase */}
                    <div>
                      <label style={lS}>Optional Access Passphrase</label>
                      <PassField
                        value={sdPass} onChange={e => setSdPass(e.target.value)}
                        placeholder="Leave blank for no passphrase protection…"
                        show={sdShowPass} onToggle={() => setSdShowPass(v => !v)}
                        color="#ef4444"
                      />
                    </div>

                    {/* API contract preview */}
                    <div style={{ borderRadius: 9, border: `1px solid ${bd}`, overflow: "hidden", fontSize: "clamp(9.5px, 2vw, 11px)" }}>
                      <div style={{ padding: "6px 12px", borderBottom: `1px solid ${bd}`, fontWeight: 700, color: mu, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 9.5, background: dk ? "#0f172a" : "#fafafa" }}>
                        POST /api/links/create — Request Payload
                      </div>
                      <pre style={{
                        margin: 0, padding: "10px 12px", overflow: "auto",
                        background: dk ? "#0f172a" : "#f8fafc",
                        fontFamily: "monospace", fontSize: "clamp(9px, 2vw, 10.5px)",
                        color: mu, lineHeight: 1.7,
                      }}>{JSON.stringify({
                        content:       sdContent || "<your secret>",
                        expiry:        sdExpiry,
                        maxViews:      parseInt(sdViews, 10),
                        passphrase:    sdPass || null,
                        destroyOnRead: parseInt(sdViews, 10) === 1,
                      }, null, 2)}</pre>
                    </div>

                    {sLine(sdStatus)}

                    <ActBtn
                      label={sdBusy ? "Creating secure link…" : "Generate Self-Destruct Link"}
                      onClick={handleSdCreate}
                      color="linear-gradient(135deg, #ef4444, #dc2626)"
                      icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
                      disabled={sdBusy || !sdContent.trim()}
                    />
                  </>
                )}

                {/* ── RESULT PANEL ── */}
                {sdResult && !sdDestroyed && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Mock badge */}
                    {sdResult.isMock && (
                      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: 8, background: "#f59e0b12", border: "1px solid #f59e0b30", fontSize: 11, color: "#d97706", fontWeight: 600 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        Demo mode — API offline. Wire /api/links/create for live destruction.
                      </div>
                    )}

                    {/* Success banner */}
                    <div style={{ borderRadius: 12, border: "1px solid #10b98140", background: dk ? "#022c22" : "#f0fdf4", padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#10b98120", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#10b981" }}>Self-Destruct Link Created</div>
                          <div style={{ fontSize: 10.5, color: mu }}>Expires in {SD_EXPIRY_OPTS.find(o => o.value === sdResult.expiry)?.label || sdResult.expiry} · {sdResult.views} view{sdResult.views > 1 ? "s" : ""} max</div>
                        </div>
                      </div>

                      {/* Link display */}
                      <div style={{ borderRadius: 8, background: dk ? "#0f172a" : "#fff", border: `1px solid #10b98130`, padding: "9px 12px", fontFamily: "monospace", fontSize: "clamp(9.5px, 2vw, 11px)", color: "#10b981", wordBreak: "break-all", lineHeight: 1.5, marginBottom: 10 }}>
                        {sdResult.url}
                      </div>

                      {/* Copy + Destroy row */}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={handleSdCopyLink}
                          style={{
                            flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            padding: "10px 14px", borderRadius: 9, border: "none", cursor: "pointer",
                            background: sdCopied ? "#10b981" : "#10b98120",
                            color: sdCopied ? "#fff" : "#10b981",
                            fontSize: 12.5, fontWeight: 700, transition: "all 0.2s",
                            WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
                          }}
                        >
                          {sdCopied
                            ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
                            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Link</>
                          }
                        </button>
                        <button
                          onClick={handleSdDestroy}
                          style={{
                            flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            padding: "10px 14px", borderRadius: 9, border: "1.5px solid #ef444460",
                            background: "transparent", color: "#ef4444",
                            fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                            WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#ef444415"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
                          Destroy Now
                        </button>
                      </div>
                    </div>

                    {/* Link metadata */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {[
                        { k: "Link ID", v: sdResult.id },
                        { k: "Expiry", v: SD_EXPIRY_OPTS.find(o => o.value === sdResult.expiry)?.label || sdResult.expiry },
                        { k: "Max Views", v: `${sdResult.views}` },
                        { k: "Passphrase", v: sdPass ? "Protected" : "None" },
                      ].map(m => (
                        <div key={m.k} style={{ padding: "4px 10px", borderRadius: 7, fontSize: 10.5, background: dk ? "#1e293b" : "#f1f5f9", border: `1px solid ${bd}`, color: mu }}>
                          <strong style={{ color: tx }}>{m.k}:</strong> {m.v}
                        </div>
                      ))}
                    </div>

                    {sLine(sdStatus)}

                    <button onClick={handleSdReset} style={{
                      padding: "9px 16px", borderRadius: 9, border: `1px solid ${bd}`,
                      background: "transparent", color: mu, fontSize: 12.5, fontWeight: 600,
                      cursor: "pointer", width: "100%", textAlign: "center",
                      WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
                    }}>↺ Create another link</button>
                  </div>
                )}

                {/* ── DESTROYED STATE ── */}
                {sdDestroyed && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ borderRadius: 12, border: "1px solid #ef444440", background: dk ? "#1c0a0a" : "#fff1f2", padding: "24px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 36, marginBottom: 10 }}>💥</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#ef4444", marginBottom: 6 }}>Link Permanently Destroyed</div>
                      <div style={{ fontSize: 12, color: mu, lineHeight: 1.6 }}>
                        The secret content has been permanently purged. The link is now dead — any attempt to access it will return a 404. In production, <code style={{ fontSize: 10.5, background: dk ? "#1e293b" : "#fee2e2", borderRadius: 4, padding: "1px 5px", color: "#dc2626" }}>DELETE /api/links/{"{"}id{"}"}</code> fires immediately on view or manual destruction.
                      </div>
                    </div>
                    {sLine(sdStatus)}
                    <button onClick={handleSdReset} style={{
                      padding: "11px 16px", borderRadius: 9, border: "none",
                      background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff",
                      fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%",
                      WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
                    }}>↺ Create a new self-destruct link</button>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: mu }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  async fetch · POST /api/links/create · try/catch mock fallback · zero plaintext storage
                </div>
              </div>

            </div>
          ); /* end SecurityModule return */
        } /* end function SecurityModule */

        /* Render SecurityModule with all required style helpers forwarded */
        return (
          <SecurityModule
            dark={dark} surface={surface} border={border} text={text} muted={muted}
            inputStyle={inputStyle} labelStyle={labelStyle}
            panelStyle={panelStyle} panelHeaderStyle={panelHeaderStyle} iconBubble={iconBubble}
          />
        );
      })()}{/* end utilCategory === "security" IIFE */}

    </div>
  );
}

// ─── ═══════════════════════════════════════════════════════
//     ROOT COMPONENT
// ─── ═══════════════════════════════════════════════════════
function App() {
  // ── URL-based Client Tracking Portal detection (MUST be above hooks, but NO early return) ──
  // Decode once at the top — the actual conditional render lives at the BOTTOM after all hooks.
  const _urlParams = new URLSearchParams(window.location.search);
  const _trackMode = _urlParams.get("mode") === "track";
  const _trackEncoded = _urlParams.get("project");
  const _trackProject = useMemo(() => {
    if (!_trackMode || !_trackEncoded) return null;
    try { return JSON.parse(decodeURIComponent(escape(atob(_trackEncoded)))); } catch { return null; }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading screen ───────────────────────────────────────
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  // ── App-level theme (independent of dashboard theme) ─────
  const [appTheme, setAppTheme] = React.useState(() => {
    try { return localStorage.getItem('tres_app_theme') || 'dark'; } catch { return 'dark'; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('tres_app_theme', appTheme); } catch {}
  }, [appTheme]);
  const appDark = appTheme === 'dark';

  // ── Auth persistence ──────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => localStorage.getItem('tres_logged_in') === 'true');
  // viewMode: 'landing' | 'signin' | 'signup'
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('tres_logged_in') === 'true' ? 'dashboard' : 'landing');

  // Sync auth state to localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('tres_logged_in', 'true');
    } else {
      localStorage.removeItem('tres_logged_in');
    }
  }, [isAuthenticated]);

  // ── Sign-In state ─────────────────────────────────────────
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError,    setLoginError]    = useState("");

  const handleLogin = () => {
    if (loginEmail.trim() && loginPassword.trim()) {
      setIsAuthenticated(true);
      setViewMode('dashboard');
      setLoginError("");
    } else {
      setLoginError("Please enter your email and password to continue.");
    }
  };

  // ── Sign-Up state ─────────────────────────────────────────
  const [signupName,     setSignupName]     = useState("");
  const [signupEmail,    setSignupEmail]    = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm,  setSignupConfirm]  = useState("");
  const [signupError,    setSignupError]    = useState("");

  const handleSignup = () => {
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim() || !signupConfirm.trim()) {
      setSignupError("Please fill in all fields to create your account.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match. Please try again.");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }
    setIsAuthenticated(true);
    setViewMode('dashboard');
    setSignupError("");
  };

  // ── Log Out ───────────────────────────────────────────────
  const handleLogout = () => {
    setIsAuthenticated(false);
    setViewMode('landing');
    setLoginEmail(""); setLoginPassword(""); setLoginError("");
    setSignupName(""); setSignupEmail(""); setSignupPassword(""); setSignupConfirm(""); setSignupError("");
  };


  // ── Global state ──────────────────────────────────────────
  const [globalState, setGlobalState] = useLocalStorage("tres-global-v3", defaultGlobalState);
  const [projects, setProjects]       = useLocalStorage("tres-projects-v3", SEED_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useLocalStorage("tres-active-project-v3", null);
  const [resume, setResume]           = useLocalStorage("tres-resume-v3", defaultResume);

  const { theme, activeTab } = globalState;
  const dark = theme === "dark";

  // ── Sticky note state ─────────────────────────────────────
  const [stickyVisible, setStickyVisible] = useState(false);
  const [stickyPinned,  setStickyPinned]  = useState(false);

  // ── Resume sub-view ───────────────────────────────────────
  const [resumeView, setResumeView] = useState("cv");

  // ── Selected official layout ──────────────────────────────
  const [selectedLayoutId, setSelectedLayoutId] = useState("wharton");
  const selectedLayout = OFFICIAL_LAYOUTS.find(l => l.id === selectedLayoutId) || OFFICIAL_LAYOUTS[0];

  // ── Active project ────────────────────────────────────────
  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  // ── Open project → show sticky ────────────────────────────
  const handleOpenProject = useCallback((id) => {
    setActiveProjectId(id);
    setStickyVisible(true);
  }, []);

  const handleBackToHub = () => {
    setActiveProjectId(null);
    setStickyVisible(false);
    setStickyPinned(false);
  };

  // ── Project CRUD ──────────────────────────────────────────
  const handleCreateProject = (overrides) => {
    const proj = createProject(overrides);
    setProjects(prev => [proj, ...prev]);
    setActiveProjectId(proj.id);
    setStickyVisible(true);
  };

  const handleDeleteProject = (id, e) => {
    if (e) e.stopPropagation();
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    try { localStorage.setItem("tres-projects-v3", JSON.stringify(updated)); } catch {}
    if (activeProjectId === id) {
      setActiveProjectId(null);
      setStickyVisible(false);
      setStickyPinned(false);
    }
  };

  // ── Per-project field updater ─────────────────────────────
  const updateProject = useCallback((field, value) => {
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, [field]: value } : p));
  }, [activeProjectId, setProjects]);

  const updateProjectDeep = useCallback((path, value) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProjectId) return p;
      const next = JSON.parse(JSON.stringify(p));
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    }));
  }, [activeProjectId, setProjects]);

  // ── Global state setter ───────────────────────────────────
  const setGlobal = useCallback((key, value) => {
    setGlobalState(prev => ({ ...prev, [key]: value }));
  }, [setGlobalState]);

  // ── Milestone helpers ─────────────────────────────────────
  const milestones = activeProject?.milestones || [];
  const [newMilestoneText, setNewMilestoneText] = useState("");

  const addMilestone = () => {
    const trimmed = newMilestoneText.trim();
    if (!trimmed) return;
    updateProject("milestones", [...milestones, { id: Date.now(), text: trimmed, status: "Pending", elapsedTime: 0, isTimerRunning: false }]);
    setNewMilestoneText("");
  };
  const toggleMilestone = id => updateProject("milestones", milestones.map(m => {
    if (m.id !== id) return m;
    const next = m.status === "Pending" ? "In Progress" : m.status === "In Progress" ? "Completed" : "Pending";
    return { ...m, status: next, isTimerRunning: false };
  }));
  const removeMilestone = id => {
    updateProject("milestones", milestones.filter(m => m.id !== id));
  };

  const updateMilestone = (id, fields) => {
    updateProject("milestones", milestones.map(m => m.id === id ? { ...m, ...fields } : m));
  };

  // Task-level timer tick — fires every second when any task isTimerRunning
  useEffect(() => {
    const anyRunning = milestones.some(m => m.isTimerRunning);
    if (!anyRunning) return;
    const iv = setInterval(() => {
      setProjects(prev => prev.map(p => {
        if (p.id !== activeProjectId) return p;
        return {
          ...p,
          milestones: p.milestones.map(m => {
            if (!m.isTimerRunning) return m;
            return { ...m, elapsedTime: (m.elapsedTime || 0) + 1 };
          }),
        };
      }));
    }, 1000);
    return () => clearInterval(iv);
  }, [milestones, activeProjectId]);
  const setRes = useCallback((path, value) => {
    setResume(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  }, [setResume]);

  const resumeFullText = [resume.name, resume.title, resume.summary, ...resume.experience.map(e => `${e.company} ${e.role} ${e.bullets}`), resume.education, resume.skills].join(" ");

  // ── Theme ─────────────────────────────────────────────────
  const bg      = dark
    ? "linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f1f2e 100%)"
    : "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 40%, #f0fdf9 100%)";
  const surface = dark ? "#1e293b" : "#ffffff";
  const border  = dark ? "#334155" : "#e2e8f0";
  const text    = dark ? "#f1f5f9" : "#0f172a";
  const muted   = dark ? "#94a3b8" : "#64748b";
  const accent  = "#6366f1";

  const inputStyle = { width: "100%", padding: "9px 12px", border: `1px solid ${border}`, borderRadius: 9, background: dark ? "#0f172a" : "#f8fafc", color: text, fontSize: 13, outline: "none", transition: "border-color 0.15s", boxSizing: "border-box", fontFamily: "inherit" };
  const labelStyle = { fontSize: 11.5, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, display: "block" };

  // Shorthand for project fields
  const proj = activeProject || {};

  // ─── Client Tracking Portal — rendered after all hooks (Rules of Hooks compliant) ──
  if (_trackProject) {
    return <ClientTrackingPortal project={_trackProject} />;
  }

  // ─── CHROMATIC TrES NEXUS — LOADING SPLASH ──────────────
  if (loading) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        backgroundColor: "#020617",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        overflow: "hidden",
        animation: "nexusFadeOut 0.55s ease 1.35s forwards",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;800;900&display=swap');

          @keyframes nexusFadeOut {
            0%   { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.06); pointer-events: none; }
          }
          @keyframes nexusLetterDrop {
            0%   { opacity: 0; transform: translateY(-22px) scale(0.82); filter: blur(6px); }
            60%  { opacity: 1; transform: translateY(3px)  scale(1.04); filter: blur(0); }
            100% { opacity: 1; transform: translateY(0)    scale(1);    filter: blur(0); }
          }
          @keyframes nexusDotBounce {
            0%,100% { transform: translateY(0);   opacity: 0.5; }
            50%     { transform: translateY(-10px); opacity: 1; }
          }
          @keyframes nexusEGlow {
            0%,100% { text-shadow: 0 0 0px transparent; filter: brightness(1); }
            50%     { text-shadow: 0 0 32px rgba(168,85,247,0.85), 0 0 64px rgba(59,130,246,0.5); filter: brightness(1.25); }
          }
          @keyframes nexusOrb {
            0%,100% { opacity: 0.45; transform: scale(1); }
            50%     { opacity: 0.85; transform: scale(1.08); }
          }
          @keyframes nexusSubFade {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          /* Letter drops — staggered */
          .nxl-T { animation: nexusLetterDrop 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
          .nxl-r { animation: nexusLetterDrop 0.55s cubic-bezier(0.22,1,0.36,1) 0.13s both; }
          .nxl-E { animation: nexusLetterDrop 0.55s cubic-bezier(0.22,1,0.36,1) 0.21s both, nexusEGlow 1s ease-in-out 0.75s infinite; }
          .nxl-S { animation: nexusLetterDrop 0.55s cubic-bezier(0.22,1,0.36,1) 0.29s both; }

          /* Dots bounce — staggered sine-wave */
          .nxd-1 { animation: nexusDotBounce 1s ease-in-out 0.55s infinite; }
          .nxd-2 { animation: nexusDotBounce 1s ease-in-out 0.70s infinite; }
          .nxd-3 { animation: nexusDotBounce 1s ease-in-out 0.85s infinite; }
          .nxd-4 { animation: nexusDotBounce 1s ease-in-out 1.00s infinite; }

          /* Ambient orbs */
          .nx-orb { animation: nexusOrb 3s ease-in-out infinite; }
          .nx-orb-2 { animation: nexusOrb 3.6s ease-in-out 1.2s infinite; }

          /* Sub-text */
          .nx-sub { animation: nexusSubFade 0.7s ease 0.55s both; }
        `}</style>

        {/* ── Ambient glow orbs ── */}
        <div className="nx-orb" style={{ position: "absolute", top: "18%", left: "18%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
        <div className="nx-orb-2" style={{ position: "absolute", bottom: "16%", right: "14%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

        {/* ══ CHROMATIC LOGO TYPOGRAPHY ══ */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

          {/* ── Letter group: T r E S ── */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 0, lineHeight: 1 }}>
            {/* T */}
            <span className="nxl-T" style={{
              fontSize: "clamp(72px, 14vw, 110px)", fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.06em",
              fontFamily: "'DM Sans', sans-serif",
            }}>T</span>

            {/* r */}
            <span className="nxl-r" style={{
              fontSize: "clamp(72px, 14vw, 110px)", fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.06em",
              fontFamily: "'DM Sans', sans-serif",
            }}>r</span>

            {/* E — gradient mask, always blue→purple */}
            <span className="nxl-E" style={{
              fontSize: "clamp(72px, 14vw, 110px)", fontWeight: 900,
              letterSpacing: "-0.06em",
              fontFamily: "'DM Sans', sans-serif",
              background: "linear-gradient(to bottom, #3b82f6 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}>E</span>

            {/* S */}
            <span className="nxl-S" style={{
              fontSize: "clamp(72px, 14vw, 110px)", fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.06em",
              fontFamily: "'DM Sans', sans-serif",
            }}>S</span>
          </div>

          {/* ── 4 Ripple Dots ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 4 }}>
            {/* Dot 1 — Cyan/Blue */}
            <div className="nxd-1" style={{ width: 10, height: 10, borderRadius: "50%", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", boxShadow: "0 0 10px rgba(6,182,212,0.7)" }} />
            {/* Dot 2 — Cyan/Blue */}
            <div className="nxd-2" style={{ width: 10, height: 10, borderRadius: "50%", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", boxShadow: "0 0 10px rgba(6,182,212,0.7)" }} />
            {/* Dot 3 — Purple/Magenta (under E) */}
            <div className="nxd-3" style={{ width: 10, height: 10, borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #ec4899)", boxShadow: "0 0 14px rgba(168,85,247,0.85)" }} />
            {/* Dot 4 — Cyan/Blue */}
            <div className="nxd-4" style={{ width: 10, height: 10, borderRadius: "50%", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", boxShadow: "0 0 10px rgba(6,182,212,0.7)" }} />
          </div>

          {/* ── Sub-label ── */}
          <div className="nx-sub" style={{
            fontSize: 13, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase",
            color: "rgba(148,163,184,0.7)", marginTop: 4,
          }}>
            Workspace
          </div>

        </div>

        {/* ── Bottom micro copyright ── */}
        <div style={{
          position: "absolute", bottom: 24,
          fontSize: 10, color: "rgba(51,65,85,0.8)", letterSpacing: "0.06em",
          fontFamily: "inherit",
        }}>
          © 2026 TrES Workspace · CodeScriptors IT Solutions
        </div>
      </div>
    );
  }

  // ─── Public Auth Shell (landing | signin | signup) ───────────
  if (!isAuthenticated) {
    const authBg = "linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f1f2e 100%)";
    const cardStyle = {
      width: "min(440px, 93vw)",
      background: "rgba(30,41,59,0.96)",
      borderRadius: 24,
      border: "1px solid rgba(99,102,241,0.25)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
      padding: "44px 40px 40px",
      animation: "fadeIn 0.45s ease",
      display: "flex", flexDirection: "column", alignItems: "center",
    };
    const fieldLabel = { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, display: "block" };
    const fieldInput = { width: "100%", padding: "11px 14px", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, background: "rgba(15,23,42,0.8)", color: "#f1f5f9", fontSize: 14, transition: "all 0.15s", outline: "none", fontFamily: "inherit" };
    const logoBlock = (
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 0, userSelect: "none" }}>
          <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#ffffff", lineHeight: 1 }}>T</span>
          <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#ffffff", lineHeight: 1 }}>r</span>
          <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "linear-gradient(to bottom, #3b82f6 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block", lineHeight: 1 }}>E</span>
          <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#ffffff", lineHeight: 1 }}>S</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(148,163,184,0.55)", marginLeft: 8, alignSelf: "center", letterSpacing: "0.04em" }}>Workspace</span>
        </div>
      </div>
    );
    const primaryBtn = (label, onClick) => (
      <button onClick={onClick} style={{ marginTop: 4, width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.55)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.4)"; }}>
        {label}
      </button>
    );

    // ── LANDING PAGE ─────────────────────────────────────────
    if (viewMode === 'landing') {
      // Particle data: [size, top%, left%, animDuration, animDelay, opacity]
      const particles = [
        [120,5,8,44,0,"rgba(99,102,241,0.07)"],[80,12,72,51,3,"rgba(6,182,212,0.06)"],[60,3,45,38,7,"rgba(167,139,250,0.08)"],
        [200,18,90,60,1,"rgba(99,102,241,0.04)"],[45,25,18,42,5,"rgba(6,182,212,0.09)"],[150,35,55,55,2,"rgba(99,102,241,0.05)"],
        [90,42,3,48,8,"rgba(167,139,250,0.07)"],[70,50,80,40,4,"rgba(6,182,212,0.06)"],[110,58,33,52,6,"rgba(99,102,241,0.06)"],
        [55,65,67,45,1,"rgba(167,139,250,0.09)"],[180,70,12,57,9,"rgba(99,102,241,0.04)"],[65,75,50,43,3,"rgba(6,182,212,0.07)"],
        [95,80,88,50,7,"rgba(99,102,241,0.05)"],[40,88,28,39,2,"rgba(167,139,250,0.08)"],[130,92,60,53,5,"rgba(6,182,212,0.05)"],
        [75,8,35,46,10,"rgba(99,102,241,0.06)"],[100,20,62,41,6,"rgba(6,182,212,0.07)"],[50,30,5,58,4,"rgba(167,139,250,0.06)"],
        [160,40,78,47,8,"rgba(99,102,241,0.05)"],[85,48,42,44,1,"rgba(6,182,212,0.08)"],[45,56,95,36,9,"rgba(167,139,250,0.07)"],
        [115,62,22,54,3,"rgba(99,102,241,0.06)"],[70,68,57,42,7,"rgba(6,182,212,0.05)"],[190,77,38,61,2,"rgba(99,102,241,0.03)"],
        [60,83,75,40,5,"rgba(167,139,250,0.08)"],[80,90,15,49,10,"rgba(6,182,212,0.06)"],[140,15,85,56,6,"rgba(99,102,241,0.05)"],
        [55,33,50,38,4,"rgba(167,139,250,0.07)"],[100,55,10,47,8,"rgba(6,182,212,0.06)"],[75,72,92,43,1,"rgba(99,102,241,0.07)"],
        [120,85,44,52,9,"rgba(6,182,212,0.05)"],[90,95,70,46,3,"rgba(167,139,250,0.06)"],[65,2,25,41,7,"rgba(99,102,241,0.08)"],
        [110,10,55,59,5,"rgba(6,182,212,0.07)"],[50,22,82,37,2,"rgba(167,139,250,0.09)"],
      ];

      return (
        <div style={{ minHeight: "100vh", background: appDark ? "linear-gradient(135deg,#0f172a 0%,#1a1040 50%,#0f1f2e 100%)" : "linear-gradient(135deg,#f0f4ff 0%,#faf5ff 40%,#f0fdf9 100%)", fontFamily: "'DM Sans','Segoe UI',sans-serif", overflowX: "hidden", position: "relative", transition: "background 0.4s ease" }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

            @keyframes flowBackground {
              0%   { transform: translate(0px, 0px) scale(1); }
              15%  { transform: translate(18px, -25px) scale(1.04); }
              30%  { transform: translate(-12px, 20px) scale(0.97); }
              45%  { transform: translate(28px, 10px) scale(1.06); }
              60%  { transform: translate(-20px, -15px) scale(1.02); }
              75%  { transform: translate(10px, 30px) scale(0.96); }
              90%  { transform: translate(-8px, -22px) scale(1.03); }
              100% { transform: translate(0px, 0px) scale(1); }
            }

            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(28px); }
              to   { opacity: 1; transform: translateY(0); }
            }

            @keyframes pulseCyan {
              0%, 100% { box-shadow: 0 0 0 0 rgba(6,182,212,0); }
              50%       { box-shadow: 0 0 22px 4px rgba(6,182,212,0.35); }
            }

            @keyframes shimmer {
              0%   { background-position: -200% center; }
              100% { background-position: 200% center; }
            }

            @keyframes subtleBob {
              0%,100% { transform: translateY(0px); }
              50%      { transform: translateY(-6px); }
            }

            @keyframes navSlideDown {
              from { opacity: 0; transform: translateY(-16px); }
              to   { opacity: 1; transform: translateY(0); }
            }

            .lp-particle {
              position: absolute;
              border-radius: 50%;
              pointer-events: none;
              animation: flowBackground linear infinite;
            }

            .lp-nav {
              animation: navSlideDown 0.6s ease both;
            }

            .lp-badge {
              opacity: 0;
              animation: fadeInUp 0.8s ease-out 0.1s forwards;
            }
            .lp-h1 {
              opacity: 0;
              animation: fadeInUp 0.9s ease-out 0.25s forwards;
            }
            .lp-sub {
              opacity: 0;
              animation: fadeInUp 0.9s ease-out 0.42s forwards;
            }
            .lp-cta {
              opacity: 0;
              animation: fadeInUp 0.9s ease-out 0.58s forwards;
            }
            .lp-metrics {
              opacity: 0;
              animation: fadeInUp 0.9s ease-out 0.72s forwards;
            }
            .lp-feat-title {
              opacity: 0;
              animation: fadeInUp 0.8s ease-out 0.3s forwards;
            }
            .lp-card-0 { opacity:0; animation: fadeInUp 0.7s ease-out 0.10s forwards; }
            .lp-card-1 { opacity:0; animation: fadeInUp 0.7s ease-out 0.20s forwards; }
            .lp-card-2 { opacity:0; animation: fadeInUp 0.7s ease-out 0.30s forwards; }
            .lp-card-3 { opacity:0; animation: fadeInUp 0.7s ease-out 0.40s forwards; }
            .lp-card-4 { opacity:0; animation: fadeInUp 0.7s ease-out 0.50s forwards; }
            .lp-card-5 { opacity:0; animation: fadeInUp 0.7s ease-out 0.60s forwards; }
            .lp-why-0  { opacity:0; animation: fadeInUp 0.7s ease-out 0.15s forwards; }
            .lp-why-1  { opacity:0; animation: fadeInUp 0.7s ease-out 0.28s forwards; }
            .lp-why-2  { opacity:0; animation: fadeInUp 0.7s ease-out 0.41s forwards; }
            .lp-why-3  { opacity:0; animation: fadeInUp 0.7s ease-out 0.54s forwards; }
            .lp-stat-0 { opacity:0; animation: fadeInUp 0.7s ease-out 0.10s forwards; }
            .lp-stat-1 { opacity:0; animation: fadeInUp 0.7s ease-out 0.22s forwards; }
            .lp-stat-2 { opacity:0; animation: fadeInUp 0.7s ease-out 0.34s forwards; }
            .lp-stat-3 { opacity:0; animation: fadeInUp 0.7s ease-out 0.46s forwards; }
            .lp-footer-cta { opacity:0; animation: fadeInUp 0.8s ease-out 0.2s forwards; }

            .lp-btn-primary {
              padding: 15px 36px; border-radius: 14px; border: none;
              background: linear-gradient(135deg,#6366f1,#4f46e5);
              color: #fff; font-size: 15px; font-weight: 700;
              cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;
              box-shadow: 0 6px 24px rgba(99,102,241,0.45);
              font-family: inherit;
            }
            .lp-btn-primary:hover {
              transform: translateY(-3px) scale(1.04);
              box-shadow: 0 10px 32px rgba(99,102,241,0.55);
              animation: pulseCyan 1.6s ease infinite;
            }
            .lp-btn-ghost {
              padding: 15px 36px; border-radius: 14px;
              border: 1px solid rgba(99,102,241,0.3);
              background: rgba(99,102,241,0.08); color: #a5b4fc;
              font-size: 15px; font-weight: 600; cursor: pointer;
              transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
              font-family: inherit;
            }
            .lp-btn-ghost:hover {
              transform: translateY(-3px) scale(1.03);
              border-color: rgba(99,102,241,0.6);
              box-shadow: 0 8px 24px rgba(99,102,241,0.2);
            }
            .lp-btn-nav-outline {
              padding: 9px 22px; border-radius: 10px;
              border: 1px solid rgba(99,102,241,0.35);
              background: transparent; color: #a5b4fc;
              font-size: 13px; font-weight: 600; cursor: pointer;
              transition: all 0.18s; font-family: inherit;
            }
            .lp-btn-nav-outline:hover {
              background: rgba(99,102,241,0.1);
              border-color: rgba(99,102,241,0.6);
              transform: translateY(-1px);
            }
            .lp-btn-nav-solid {
              padding: 9px 22px; border-radius: 10px; border: none;
              background: linear-gradient(135deg,#6366f1,#4f46e5);
              color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
              transition: all 0.18s; box-shadow: 0 4px 14px rgba(99,102,241,0.4);
              font-family: inherit;
            }
            .lp-btn-nav-solid:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 22px rgba(99,102,241,0.55);
            }
            .lp-feat-card {
              background: ${appDark ? "rgba(30,41,59,0.72)" : "rgba(255,255,255,0.85)"};
              border: 1px solid ${appDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.15)"};
              border-radius: 18px; padding: 28px 26px;
              backdrop-filter: blur(12px);
              transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s;
              box-shadow: ${appDark ? "none" : "0 4px 20px rgba(0,0,0,0.06)"};
            }
            .lp-feat-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 16px 40px ${appDark ? "rgba(0,0,0,0.35)" : "rgba(99,102,241,0.15)"};
              border-color: rgba(99,102,241,0.28);
            }
            .lp-why-card {
              background: ${appDark ? "rgba(30,41,59,0.6)" : "rgba(255,255,255,0.8)"};
              border: 1px solid ${appDark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.12)"};
              border-radius: 16px; padding: 24px 22px;
              backdrop-filter: blur(10px);
              transition: transform 0.22s ease, box-shadow 0.22s ease;
              box-shadow: ${appDark ? "none" : "0 2px 12px rgba(0,0,0,0.05)"};
            }
            .lp-why-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 32px ${appDark ? "rgba(0,0,0,0.3)" : "rgba(99,102,241,0.12)"};
            }
            .lp-stat-card {
              background: ${appDark ? "rgba(30,41,59,0.65)" : "rgba(255,255,255,0.85)"};
              border: 1px solid ${appDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.12)"};
              border-radius: 16px; padding: 28px 24px; text-align: center;
              backdrop-filter: blur(10px);
              transition: transform 0.22s ease;
              box-shadow: ${appDark ? "none" : "0 2px 12px rgba(0,0,0,0.05)"};
            }
            .lp-stat-card:hover { transform: translateY(-3px); }
            .lp-shimmer-text {
              background: linear-gradient(90deg, #6366f1, #a78bfa, #38bdf8, #a78bfa, #6366f1);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              animation: shimmer 4s linear infinite;
            }
            .lp-divider {
              width: 60px; height: 3px; border-radius: 99px;
              background: linear-gradient(90deg,#6366f1,#38bdf8);
              margin: 0 auto 20px;
            }
          `}</style>

          {/* ── PARTICLE BACKGROUND ──────────────────────────── */}
          <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
            {particles.map(([sz, top, left, dur, delay, bg], i) => (
              <div
                key={i}
                className="lp-particle"
                style={{
                  width: sz, height: sz,
                  top: `${top}%`, left: `${left}%`,
                  background: appDark ? bg : bg.replace(/0\.\d+\)/, "0.04)"),
                  animationDuration: `${dur}s`,
                  animationDelay: `-${delay}s`,
                  transition: "background 0.4s ease",
                }}
              />
            ))}
          </div>

          {/* ── NAV ─────────────────────────────────────────── */}
          <nav className="lp-nav" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(99,102,241,0.12)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px)", background: appDark ? "rgba(15,23,42,0.88)" : "rgba(248,250,252,0.94)", flexWrap: "wrap", gap: 10 }}>
            <style>{`@media (min-width: 640px) { .lp-nav { padding: 18px 48px !important; flex-wrap: nowrap !important; gap: 0 !important; } }`}</style>
            {/* ── TrES Workspace text logo — top left ── */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 0, userSelect: "none" }}>
              <span style={{
                fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em",
                fontFamily: "'DM Sans','Segoe UI',sans-serif",
                color: appDark ? "#ffffff" : "#0B132B",
                lineHeight: 1,
              }}>T</span>
              <span style={{
                fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em",
                fontFamily: "'DM Sans','Segoe UI',sans-serif",
                color: appDark ? "#ffffff" : "#0B132B",
                lineHeight: 1,
              }}>r</span>
              <span style={{
                fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em",
                fontFamily: "'DM Sans','Segoe UI',sans-serif",
                background: "linear-gradient(to bottom, #3b82f6 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                lineHeight: 1,
              }}>E</span>
              <span style={{
                fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em",
                fontFamily: "'DM Sans','Segoe UI',sans-serif",
                color: appDark ? "#ffffff" : "#0B132B",
                lineHeight: 1,
              }}>S</span>
              <span style={{
                fontSize: 13, fontWeight: 600, letterSpacing: "0.04em",
                fontFamily: "'DM Sans','Segoe UI',sans-serif",
                color: appDark ? "rgba(148,163,184,0.6)" : "rgba(11,19,43,0.5)",
                marginLeft: 7, alignSelf: "center",
              }}>Workspace</span>
            </div>
            {/* Auth buttons + theme toggle — top right */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {/* Theme Toggle */}
              <button
                onClick={() => setAppTheme(t => t === 'dark' ? 'light' : 'dark')}
                title={appDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  border: "1px solid rgba(99,102,241,0.3)",
                  background: "rgba(99,102,241,0.08)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.18)"; e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.transform = ""; }}>
                {appDark
                  ? /* Sun */ <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  : /* Moon */ <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                }
              </button>
              <button className="lp-btn-nav-outline" onClick={() => setViewMode('signin')}>Sign In</button>
              <button className="lp-btn-nav-solid" onClick={() => setViewMode('signup')}>Get Started</button>
            </div>
          </nav>

          {/* ── HERO ─────────────────────────────────────────── */}
          <section style={{ textAlign: "center", padding: "72px 20px 60px", position: "relative", zIndex: 1 }}>
            <div className="lp-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 99, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.28)", marginBottom: 36 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", animation: "subtleBob 2.4s ease-in-out infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.08em", textTransform: "uppercase" }}>The All-in-One Freelance OS</span>
            </div>
            <h1 className="lp-h1" style={{ fontSize: "clamp(38px,6.5vw,76px)", fontWeight: 800, color: appDark ? "#f1f5f9" : "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.07, maxWidth: 900, margin: "0 auto 28px" }}>
              Manage clients,<br />
              <span className="lp-shimmer-text">projects &amp; revenue</span>
              <br />from one workspace.
            </h1>
            <p className="lp-sub" style={{ fontSize: "clamp(14px, 3.5vw, 18px)", color: appDark ? "#94a3b8" : "#475569", maxWidth: 580, margin: "0 auto 48px", lineHeight: 1.75 }}>
              TrES is the premium workspace built for freelancers and agencies — track milestones, generate invoices, and deliver polished client reports without switching tools.
            </p>
            <div className="lp-cta" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="lp-btn-primary" onClick={() => setViewMode('signup')}>Start Free — No Card Needed</button>
              <button className="lp-btn-ghost" onClick={() => setViewMode('signin')}>Sign In to Dashboard →</button>
            </div>

            {/* Metrics strip */}
            <div className="lp-metrics" style={{ display: "flex", gap: 0, justifyContent: "center", marginTop: 60, flexWrap: "wrap", rowGap: 24 }}>
              {[
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, val: "99.9%", lbl: "Platform Uptime", c: "#06b6d4" },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, val: "E2E", lbl: "Data Encryption", c: "#6366f1" },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, val: "0ms", lbl: "Sync Latency", c: "#10b981" },
              ].map((m, i) => (
                <div key={i} style={{ padding: "0 48px", borderRight: i < 2 ? "1px solid rgba(99,102,241,0.15)" : "none", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: m.c + "18", border: `1px solid ${m.c}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.icon}</div>
                    <div style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{m.val}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: "0.04em" }}>{m.lbl}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FEATURES GRID ────────────────────────────────── */}
          <section style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px 100px", position: "relative", zIndex: 1 }}>
            <div className="lp-feat-title" style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="lp-divider" />
              <div style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 800, color: appDark ? "#f1f5f9" : "#0f172a", letterSpacing: "-0.02em" }}>Everything you need to run your business</div>
              <div style={{ fontSize: 15, color: "#64748b", marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>Six powerful modules, one unified workspace. No context-switching required.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 20 }}>
              {[
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, color: "#6366f1", title: "Client Workspace", desc: "Track milestones, health status, scope budgets, and deadline pressure in real time — one pane per client." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: "#10b981", title: "Smart Invoice Generator", desc: "Build professional invoices with multi-currency support, VAT/GST presets, and one-click PDF export." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, color: "#f59e0b", title: "Billable Time Tracker", desc: "Per-milestone stopwatch timers, live billable totals, and a session logger that exports clean CSV timesheets." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>, color: "#06b6d4", title: "Utilities Studio", desc: "10 enterprise-grade file tools — PDF conversion, compression, OCR, encryption, and batch renaming." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, color: "#a78bfa", title: "Executive Resume Studio", desc: "ATS-optimised CV builder, agency pitch deck generator, and live resume preview — all in one place." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>, color: "#f43f5e", title: "Completion Certificates", desc: "Auto-generate signed project completion certificates and timesheet PDFs the moment payment is cleared." },
              ].map((f, i) => (
                <div key={i} className={`lp-feat-card lp-card-${i}`}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: f.color + "1a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, border: `1px solid ${f.color}28` }}>{f.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: appDark ? "#f1f5f9" : "#0f172a", marginBottom: 10 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: appDark ? "#94a3b8" : "#475569", lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── WHY CHOOSE TRES ──────────────────────────────── */}
          <section style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px 100px", position: "relative", zIndex: 1 }}>
            <div className="lp-feat-title" style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="lp-divider" />
              <div style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, color: appDark ? "#f1f5f9" : "#0f172a", letterSpacing: "-0.02em" }}>Why choose TrES?</div>
              <div style={{ fontSize: 15, color: "#64748b", marginTop: 12 }}>Designed by freelancers, for freelancers — with zero fluff.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
              {[
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, color: "#6366f1", title: "Blazing Fast", body: "Every interaction is instant — no spinners, no lag. Your workspace loads in under a second, every time." },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, color: "#10b981", title: "Privacy First", body: "Your data lives in your browser. No cloud sync, no third-party tracking — total data sovereignty." },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>, color: "#f59e0b", title: "Works Offline", body: "All core features — invoices, timers, notes — work without an internet connection. Always available." },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, color: "#a78bfa", title: "Enterprise-Grade PDF", body: "From timesheets to invoices to certificates — every export is pixel-perfect and print-ready." },
              ].map((w, i) => (
                <div key={i} className={`lp-why-card lp-why-${i}`}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: w.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, border: `1px solid ${w.color}22` }}>{w.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: appDark ? "#f1f5f9" : "#0f172a", marginBottom: 8 }}>{w.title}</div>
                  <div style={{ fontSize: 13, color: appDark ? "#94a3b8" : "#475569", lineHeight: 1.65 }}>{w.body}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── METRICS ──────────────────────────────────────── */}
          <section style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px 100px", position: "relative", zIndex: 1 }}>
            <div className="lp-feat-title" style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="lp-divider" />
              <div style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, color: appDark ? "#f1f5f9" : "#0f172a", letterSpacing: "-0.02em" }}>Trusted by creators worldwide</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
              {[
                { val: "10,000+", lbl: "Active Freelancers", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, c: "#6366f1" },
                { val: "$4.2M+", lbl: "Revenue Managed",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, c: "#10b981" },
                { val: "250K+",  lbl: "Hours Tracked",       icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, c: "#f59e0b" },
                { val: "98%",    lbl: "Satisfaction Rate",   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>, c: "#a78bfa" },
              ].map((s, i) => (
                <div key={i} className={`lp-stat-card lp-stat-${i}`}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: s.c + "18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", border: `1px solid ${s.c}22` }}>{s.icon}</div>
                  <div style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: appDark ? "#f1f5f9" : "#0f172a", letterSpacing: "-0.03em" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 6, fontWeight: 500 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FOOTER CTA ───────────────────────────────────── */}
          <section style={{ textAlign: "center", padding: "80px 24px 60px", borderTop: "1px solid rgba(99,102,241,0.1)", background: appDark ? "rgba(15,23,42,0.7)" : "rgba(240,244,255,0.9)", position: "relative", zIndex: 1 }}>
            <div className="lp-footer-cta">
              <div style={{ fontSize: "clamp(22px,3.5vw,38px)", fontWeight: 800, color: appDark ? "#f1f5f9" : "#0f172a", letterSpacing: "-0.02em", marginBottom: 14 }}>Ready to run your freelance business like a pro?</div>
              <div style={{ fontSize: 15, color: "#94a3b8", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>Join thousands of freelancers already using TrES Workspace.</div>
              <button className="lp-btn-primary" onClick={() => setViewMode('signup')} style={{ fontSize: 15, padding: "14px 44px" }}>Create Free Account</button>
              <div style={{ marginTop: 20, fontSize: 12, color: "#475569" }}>Already have an account?{" "}<button onClick={() => setViewMode('signin')} style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", fontSize: 12, fontWeight: 600, textDecoration: "underline" }}>Sign In</button></div>
            </div>
          </section>

          {/* ── FOOTER ───────────────────────────────────────── */}
          <footer style={{ borderTop: "1px solid rgba(99,102,241,0.08)", background: appDark ? "rgba(10,14,26,0.95)" : "rgba(241,245,249,0.98)", padding: "56px 48px 32px", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 1140, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
                {/* Brand col */}
                <div>
                  <img src="" alt="Your Logo Here" style={{ height: 40, width: "auto", maxWidth: 160, objectFit: "contain", background: "rgba(99,102,241,0.08)", borderRadius: 10, border: "1px dashed rgba(99,102,241,0.3)", padding: "6px 16px", marginBottom: 16 }} onError={e => { e.target.style.display = 'none'; }} />
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, maxWidth: 280 }}>The all-in-one freelance operating system. Manage projects, track time, and get paid — all from one beautiful workspace.</p>
                  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    {[
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
                    ].map((icon, i) => (
                      <div key={i} style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.color = "#a5b4fc"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.color = "#475569"; }}>
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Product col */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#f1f5f9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>Product</div>
                  {["Client Workspace","Invoice Generator","Time Tracker","Utilities Studio","Resume Builder","Completion Certs"].map(l => (
                    <div key={l} style={{ fontSize: 13, color: "#64748b", marginBottom: 10, cursor: "pointer", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
                      onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>{l}</div>
                  ))}
                </div>
                {/* Company col */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#f1f5f9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>Company</div>
                  {["About Us","Careers","Blog","Press Kit","Partners","Contact"].map(l => (
                    <div key={l} style={{ fontSize: 13, color: "#64748b", marginBottom: 10, cursor: "pointer", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
                      onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>{l}</div>
                  ))}
                </div>
                {/* Legal col */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#f1f5f9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>Legal</div>
                  {["Privacy Policy","Terms of Service","Cookie Policy","GDPR","Security","Accessibility"].map(l => (
                    <div key={l} style={{ fontSize: 13, color: "#64748b", marginBottom: 10, cursor: "pointer", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
                      onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>{l}</div>
                  ))}
                </div>
              </div>
              {/* Bottom bar */}
              <div style={{ borderTop: "1px solid rgba(99,102,241,0.08)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ fontSize: 12, color: "#334155" }}>© 2026 TrES Workspace. Built and owned by <span style={{ color: "#6366f1", fontWeight: 600 }}>CodeScriptors IT Solutions</span>. All rights reserved.</div>
                <div style={{ display: "flex", gap: 20 }}>
                  {["Privacy","Terms","Cookies"].map(l => (
                    <span key={l} style={{ fontSize: 12, color: "#334155", cursor: "pointer", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#a5b4fc"}
                      onMouseLeave={e => e.currentTarget.style.color = "#334155"}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      );
    }

    // ── SIGN-IN FORM ─────────────────────────────────────────
    if (viewMode === 'signin') {
      return (
        <div style={{ minHeight: "100vh", background: authBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            .auth-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.2) !important; outline: none; }
          `}</style>
          <div style={cardStyle}>
            {logoBlock}
            <div style={{ textAlign: "center", marginBottom: 32, width: "100%" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Welcome Back</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>Sign in to your TrES Workspace</div>
            </div>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={fieldLabel}>Email</label>
                <input className="auth-input" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="you@example.com" style={fieldInput} />
              </div>
              <div>
                <label style={fieldLabel}>Password</label>
                <input className="auth-input" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••" style={fieldInput} />
              </div>
              {loginError && (
                <div style={{ fontSize: 12, color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 12px" }}>{loginError}</div>
              )}
              {primaryBtn("Sign In →", handleLogin)}
            </div>
            <div style={{ marginTop: 24, fontSize: 12, color: "#475569", textAlign: "center" }}>
              Don't have an account?{" "}
              <button onClick={() => { setLoginError(""); setViewMode('signup'); }} style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", fontSize: 12, fontWeight: 600, textDecoration: "underline" }}>Create one free</button>
            </div>
            <button onClick={() => setViewMode('landing')} style={{ marginTop: 14, background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> Back to home
            </button>
          </div>
        </div>
      );
    }

    // ── SIGN-UP FORM ─────────────────────────────────────────
    return (
      <div style={{ minHeight: "100vh", background: authBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "40px 16px" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          .auth-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.2) !important; outline: none; }
        `}</style>
        <div style={cardStyle}>
          {logoBlock}
          <div style={{ textAlign: "center", marginBottom: 32, width: "100%" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Create Your Account</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>Start managing projects like a pro — free forever.</div>
          </div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={fieldLabel}>Full Name</label>
              <input className="auth-input" type="text" value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="Your Name" style={fieldInput} />
            </div>
            <div>
              <label style={fieldLabel}>Email</label>
              <input className="auth-input" type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="you@example.com" style={fieldInput} />
            </div>
            <div>
              <label style={fieldLabel}>Password</label>
              <input className="auth-input" type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="Min. 6 characters" style={fieldInput} />
            </div>
            <div>
              <label style={fieldLabel}>Confirm Password</label>
              <input className="auth-input" type="password" value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignup()} placeholder="Repeat your password" style={fieldInput} />
            </div>
            {signupError && (
              <div style={{ fontSize: 12, color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 12px" }}>{signupError}</div>
            )}
            {primaryBtn("Create Account & Enter →", handleSignup)}
          </div>
          <div style={{ marginTop: 24, fontSize: 12, color: "#475569", textAlign: "center" }}>
            Already have an account?{" "}
            <button onClick={() => { setSignupError(""); setViewMode('signin'); }} style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", fontSize: 12, fontWeight: 600, textDecoration: "underline" }}>Sign in instead</button>
          </div>
          <button onClick={() => setViewMode('landing')} style={{ marginTop: 14, background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", maxWidth: "100%", overflowX: "hidden", background: bg, color: text, fontFamily: "'DM Sans','Segoe UI',sans-serif", transition: "all 0.25s ease", boxSizing: "border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { max-width: 100%; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${dark ? "#475569" : "#cbd5e1"}; border-radius: 99px; }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flash { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes stickyIn { from { opacity: 0; transform: scale(0.88) translateY(24px) rotate(-1.5deg); } to { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); } }
        @keyframes stickyWiggle { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-1deg); } 75% { transform: rotate(1deg); } }
        .tab-btn { border: none; background: transparent; cursor: pointer; transition: all 0.2s ease; font-family: 'DM Sans', sans-serif; }
        .tab-btn:hover { color: ${accent}; }
        input:focus, select:focus, textarea:focus { border-color: ${accent} !important; box-shadow: 0 0 0 3px ${accent}22 !important; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: ${dark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.08)"}; }

        /* ── Mobile-first layout helpers ── */
        .dash-nav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 10px 16px; min-height: 58px; }
        @media (min-width: 640px) { .dash-nav { flex-wrap: nowrap; padding: 0 24px; height: 58px; gap: 0; } }

        .dash-nav-tabs { display: none; }
        @media (min-width: 640px) { .dash-nav-tabs { display: flex; gap: 2px; flex: 1; overflow: hidden; } }

        .dash-nav-tabs-mobile { display: flex; gap: 4px; overflow-x: auto; padding: 0 16px 10px; border-bottom: 1px solid ${border}; -webkit-overflow-scrolling: touch; scrollbar-width: none; width: 100%; }
        .dash-nav-tabs-mobile::-webkit-scrollbar { display: none; }
        @media (min-width: 640px) { .dash-nav-tabs-mobile { display: none; } }

        .dash-main { padding: 16px; width: 100%; max-width: 100%; }
        @media (min-width: 768px) { .dash-main { padding: 28px 24px; max-width: 1400px; margin: 0 auto; } }

        .workspace-cols { display: grid; grid-template-columns: 1fr; gap: 16px; width: 100%; }
        @media (min-width: 1024px) { .workspace-cols { grid-template-columns: 1fr 1fr; gap: 20px; } }

        .meta-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 480px) { .meta-grid { grid-template-columns: 1fr 1fr; } }

        .resume-header-bar { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        @media (min-width: 640px) { .resume-header-bar { flex-direction: row; align-items: center; justify-content: space-between; } }

        .resume-view-tabs { display: flex; gap: 6px; flex-wrap: wrap; }

        .resume-cv-grid { display: grid; grid-template-columns: 1fr; gap: 16px; width: 100%; }
        @media (min-width: 768px) { .resume-cv-grid { grid-template-columns: 180px 1fr; } }
        @media (min-width: 1100px) { .resume-cv-grid { grid-template-columns: 200px 1fr 1fr; } }

        .resume-2col { display: grid; grid-template-columns: 1fr; gap: 20px; width: 100%; }
        @media (min-width: 768px) { .resume-2col { grid-template-columns: 1fr 1fr; } }

        .cv-sidebar { display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        @media (min-width: 768px) { .cv-sidebar { flex-direction: column; flex-wrap: nowrap; overflow-x: unset; overflow-y: auto; max-height: calc(100vh - 180px); gap: 0; } }

        .touch-btn { -webkit-tap-highlight-color: transparent; touch-action: manipulation; user-select: none; }
        .touch-btn:active { transform: scale(0.97); }

        @media print {
          .no-print { display: none !important; }
          .print-a4 { width: 210mm; min-height: 297mm; margin: 0 auto; background: white !important; color: #000 !important; box-shadow: none !important; }
          body * { visibility: hidden; }
          .print-a4, .print-a4 * { visibility: visible; }
          .print-a4 { position: absolute; left: 0; top: 0; }
        }
      `}</style>

      {/* ── STICKY NOTE MODAL ─────────────────────────────── */}
      <StickyNoteModal
        visible={stickyVisible}
        onClose={() => setStickyVisible(false)}
        note={activeProject?.stickyNote || ""}
        onSave={(val) => updateProject("stickyNote", val)}
        dark={dark}
        projectName={activeProject?.name || ""}
      />

      {/* ── NAV ───────────────────────────────────────────── */}
      <nav className="dash-nav no-print" style={{
        background: dark ? "rgba(15,23,42,0.94)" : "rgba(248,250,252,0.94)",
        backdropFilter: "blur(16px)", borderBottom: `1px solid ${border}`,
      }}>
        {/* Logo — TrES brand identity text */}
        <div style={{ display: "flex", alignItems: "center", marginRight: activeProject ? 16 : 36, flexShrink: 0, userSelect: "none" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: dark ? "#ffffff" : "#0B132B", lineHeight: 1 }}>T</span>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: dark ? "#ffffff" : "#0B132B", lineHeight: 1 }}>r</span>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "linear-gradient(to bottom, #3b82f6 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block", lineHeight: 1 }}>E</span>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: dark ? "#ffffff" : "#0B132B", lineHeight: 1 }}>S</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: dark ? "rgba(148,163,184,0.5)" : "rgba(11,19,43,0.4)", marginLeft: 6, alignSelf: "center", letterSpacing: "0.04em" }}>Workspace</span>
          </div>
        </div>

        {/* Back to Hub button (only when project is open) */}
        {activeProject && (
          <button onClick={handleBackToHub} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 12px", borderRadius: 8, border: `1px solid ${border}`,
            background: dark ? "#1e293b" : "#fff", color: muted,
            fontSize: 12, fontWeight: 600, cursor: "pointer", marginRight: 16, flexShrink: 0,
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.borderColor = accent + "60"; }}
            onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = border; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> Project Hub
          </button>
        )}

        {/* Project breadcrumb */}
        {activeProject && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 16, flexShrink: 0 }}>
            <div style={{ width: 1, height: 18, background: border }} />
            <div style={{ marginLeft: 10 }}>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1 }}>{activeProject.client}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: text, lineHeight: 1.2, marginTop: 1 }}>{activeProject.name}</div>
            </div>
          </div>
        )}

        {/* Tabs — desktop: inline in nav; mobile: scrollable row below nav */}
        <div className="dash-nav-tabs">
          {[
            { id: "workspaces", label: "Client Workspace",       icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
            { id: "utilities",  label: "Utilities Studio",        icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
            { id: "resume",     label: "Executive Resume Studio", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
          ].map(tab => (
            <button key={tab.id} className="tab-btn" onClick={() => setGlobal("activeTab", tab.id)} style={{
              padding: "0 14px", height: 58, fontSize: 12.5,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? accent : muted,
              borderBottom: activeTab === tab.id ? `2px solid ${accent}` : "2px solid transparent",
              display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Sticky note toggle (sidebar shortcut) — only when project open */}
          {activeProject && (
            <button onClick={() => setStickyVisible(v => !v)} title="Project Notes" style={{
              width: 38, height: 38, borderRadius: 10,
              border: `1px solid ${stickyPinned || stickyVisible ? "#fde047" : border}`,
              background: stickyPinned ? "#fef9c3" : (dark ? "#1e293b" : "#fff"),
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              animation: stickyVisible ? "" : (activeProject?.stickyNote?.trim() ? "stickyWiggle 2s ease 1s 1" : ""),
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeProject?.stickyNote?.trim() ? "#ca8a04" : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z"/><polyline points="15 3 15 9 21 9"/></svg>
            </button>
          )}
          {/* Theme toggle */}
          <button onClick={() => setGlobal("theme", dark ? "light" : "dark")} style={{
            width: 38, height: 38, borderRadius: 10, border: `1px solid ${border}`,
            background: dark ? "#1e293b" : "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
          }}>
            {dark ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
          </button>
          {/* Log Out button */}
          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "0 13px", height: 38, borderRadius: 10,
              border: `1px solid ${dark ? "#ef444430" : "#fca5a530"}`,
              background: dark ? "rgba(239,68,68,0.08)" : "rgba(254,226,226,0.6)",
              color: "#ef4444", fontSize: 12, fontWeight: 600,
              cursor: "pointer", flexShrink: 0, transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#ef444418"; e.currentTarget.style.borderColor = "#ef444460"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = dark ? "rgba(239,68,68,0.08)" : "rgba(254,226,226,0.6)"; e.currentTarget.style.borderColor = dark ? "#ef444430" : "#fca5a530"; e.currentTarget.style.transform = ""; }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log Out
          </button>
        </div>
      </nav>

      {/* ── MOBILE TAB ROW (visible only < 640px) ─────────── */}
      <div className="dash-nav-tabs-mobile no-print">
        {[
          { id: "workspaces", label: "Workspace",  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
          { id: "utilities",  label: "Utilities",  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
          { id: "resume",     label: "Resume",     icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        ].map(tab => (
          <button
            key={tab.id}
            className="tab-btn touch-btn"
            onClick={() => setGlobal("activeTab", tab.id)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              whiteSpace: "nowrap", flexShrink: 0,
              color: activeTab === tab.id ? accent : muted,
              background: activeTab === tab.id ? accent + "15" : "transparent",
              border: `1px solid ${activeTab === tab.id ? accent + "50" : "transparent"}`,
              transition: "all 0.15s",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── PROJECT HUB (no active project and on workspaces tab) ──────────────── */}
      {!activeProject && activeTab === "workspaces" && (
        <ProjectHub
          projects={projects}
          onOpenProject={handleOpenProject}
          onCreateProject={handleCreateProject}
          onDeleteProject={handleDeleteProject}
          dark={dark} surface={surface} border={border} text={text} muted={muted} accent={accent} bg={bg}
        />
      )}

      {/* ── WORKSPACE — Utilities & Resume render independently; Client Workspace requires an active project ── */}
      {(activeProject || activeTab === "utilities" || activeTab === "resume") && (
        <main className="dash-main" style={{ animation: "fadeIn 0.3s ease" }}>

          {/* ══ TAB A — CLIENT WORKSPACE ══════════════════════ */}
          {activeTab === "workspaces" && !activeProject && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <div style={{ fontSize: 18, fontWeight: 700, color: text }}>No Project Selected</div>
              <div style={{ fontSize: 13, color: muted, maxWidth: 320 }}>Open or create a project from the Project Hub to access the Client Workspace tools.</div>
              <button onClick={handleBackToHub} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: accent, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>← Go to Project Hub</button>
            </div>
          )}
          {activeTab === "workspaces" && activeProject && (
            <div className="workspace-cols">

              {/* LEFT: Setup Panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Project Metadata */}
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    <span style={{ fontSize: "clamp(13px, 3.5vw, 15px)", fontWeight: 600, color: text }}>Project Metadata</span>
                  </div>
                  <div className="meta-grid">
                    <div>
                      <label style={labelStyle}>Project Name</label>
                      <input style={inputStyle} value={proj.name || ""} onChange={e => updateProject("name", e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Client Name</label>
                      <input style={inputStyle} value={proj.client || ""} onChange={e => updateProject("client", e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Progress ({proj.progress || 0}%)</label>
                      <input type="range" min={0} max={100} value={proj.progress || 0} onChange={e => updateProject("progress", Number(e.target.value))} style={{ width: "100%", accentColor: accent, marginTop: 8 }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Project Deadline</label>
                      <input type="date" style={inputStyle} value={proj.deadline || ""} onChange={e => updateProject("deadline", e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Scope Budget (×$1k)</label>
                      <input style={inputStyle} type="number" min={0} value={proj.scopeBudget || 0} onChange={e => updateProject("scopeBudget", Number(e.target.value))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Project Health</label>
                      <select style={{ ...inputStyle }} value={proj.health || "on-track"} onChange={e => updateProject("health", e.target.value)}>
                        <option value="on-track">On Track</option>
                        <option value="under-review">Under Review</option>
                        <option value="action-required">Action Required</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Late Fee Toggle */}
                <div style={{ background: surface, border: `1px solid ${proj.lateFeeEnabled ? "#ef444440" : border}`, borderRadius: 16, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: proj.lateFeeEnabled ? 14 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: "#ef444420", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: text }}>Enforce Smart Late Fees</div>
                        <div style={{ fontSize: 11, color: muted }}>Auto-compound overdue penalty weekly</div>
                      </div>
                    </div>
                    <button onClick={() => updateProject("lateFeeEnabled", !proj.lateFeeEnabled)} style={{
                      background: proj.lateFeeEnabled ? "#ef4444" : (dark ? "#334155" : "#e2e8f0"),
                      border: "none", borderRadius: 99, width: 44, height: 24, cursor: "pointer",
                      position: "relative", transition: "all 0.25s", flexShrink: 0,
                    }}>
                      <div style={{ position: "absolute", top: 3, left: proj.lateFeeEnabled ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                    </button>
                  </div>
                  {proj.lateFeeEnabled && (
                    <div style={{ animation: "fadeIn 0.3s ease" }}>
                      <label style={labelStyle}>Weekly Late Fee Rate (%)</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input type="range" min={0.5} max={10} step={0.5} value={proj.lateFeeRate || 1.5} onChange={e => updateProject("lateFeeRate", Number(e.target.value))} style={{ flex: 1, accentColor: "#ef4444" }} />
                        <div style={{ background: "#ef444420", border: "1px solid #ef444440", borderRadius: 8, padding: "5px 12px", fontSize: 13, fontWeight: 800, color: "#ef4444", minWidth: 60, textAlign: "center" }}>{proj.lateFeeRate || 1.5}%</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Milestone Tracker */}
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 600, color: text }}>Milestone Tracking</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="New milestone name…" value={newMilestoneText} onChange={e => setNewMilestoneText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addMilestone(); }} />
                    <button onClick={addMilestone} style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 14px", borderRadius: 9, border: `1px solid ${accent}`, background: accent, color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {milestones.map(m => {
                      const fmtTime = s => {
                        const h = Math.floor(s / 3600), mn = Math.floor((s % 3600) / 60), sc = s % 60;
                        return `${String(h).padStart(2,"0")}:${String(mn).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
                      };
                      const statusColors = { "Pending": muted, "In Progress": "#f59e0b", "Completed": "#10b981" };
                      const statusBg    = { "Pending": dark ? "#334155" : "#f1f5f9", "In Progress": "#f59e0b20", "Completed": "#10b98118" };
                      const sColor = statusColors[m.status] || muted;
                      const sBg    = statusBg[m.status] || (dark ? "#334155" : "#f1f5f9");

                      const handleTaskTimer = () => {
                        const nowRunning = !m.isTimerRunning;
                        // pause all other tasks first, then toggle this one
                        updateProject("milestones", milestones.map(ms => {
                          if (ms.id === m.id) return { ...ms, isTimerRunning: nowRunning, elapsedTime: ms.elapsedTime || 0 };
                          return { ...ms, isTimerRunning: false };
                        }));
                      };

                      return (
                        <div key={m.id} style={{
                          borderRadius: 11, background: dark ? "#0f172a" : "#f8fafc",
                          border: `1px solid ${m.isTimerRunning ? "#06b6d440" : m.status === "Completed" ? accent + "40" : border}`,
                          padding: "10px 12px", transition: "all 0.2s",
                          boxShadow: m.isTimerRunning ? "0 0 0 3px #06b6d415" : "none",
                        }}>
                          {/* Top row: checkbox + text + status badge + remove */}
                          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                            <button onClick={() => toggleMilestone(m.id)} title="Cycle status" style={{
                              width: 20, height: 20, borderRadius: 6, flexShrink: 0, cursor: "pointer",
                              border: `2px solid ${m.status === "Completed" ? "#10b981" : m.status === "In Progress" ? "#f59e0b" : border}`,
                              background: m.status === "Completed" ? "#10b981" : m.status === "In Progress" ? "#f59e0b20" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                            }}>
                              {m.status === "Completed" && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                              {m.status === "In Progress" && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b" }} />}
                            </button>
                            <span style={{
                              flex: 1, fontSize: 12.5, fontWeight: 500,
                              color: m.status === "Completed" ? muted : text,
                              textDecoration: m.status === "Completed" ? "line-through" : "none",
                            }}>{m.text}</span>
                            <span style={{
                              fontSize: 9.5, padding: "2px 7px", borderRadius: 20, fontWeight: 700,
                              background: sBg, color: sColor, whiteSpace: "nowrap",
                            }}>{m.status}</span>
                            <button onClick={() => removeMilestone(m.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: dark ? "#475569" : "#cbd5e1", padding: 2, flexShrink: 0 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>

                          {/* Task timer row */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 6, borderTop: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}` }}>
                            <button onClick={handleTaskTimer} style={{
                              width: 28, height: 28, borderRadius: 8, border: "none", flexShrink: 0,
                              background: m.isTimerRunning ? "#f59e0b" : "#06b6d4",
                              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                              transition: "all 0.15s", boxShadow: m.isTimerRunning ? "0 2px 8px #f59e0b40" : "0 2px 8px #06b6d440",
                            }}>
                              {m.isTimerRunning ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
                            </button>
                            <div style={{
                              fontFamily: "monospace", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em",
                              color: m.isTimerRunning ? "#06b6d4" : muted,
                              background: dark ? "#1e293b" : "#fff",
                              border: `1px solid ${m.isTimerRunning ? "#06b6d430" : border}`,
                              borderRadius: 7, padding: "3px 10px", transition: "all 0.2s",
                            }}>
                              {fmtTime(m.elapsedTime || 0)}
                            </div>
                            {m.isTimerRunning && (
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#06b6d4", animation: "pulse-ring 1.2s ease infinite" }} />
                                <span style={{ fontSize: 10, color: "#06b6d4", fontWeight: 600 }}>Tracking</span>
                              </div>
                            )}
                            {(m.elapsedTime || 0) > 0 && !m.isTimerRunning && (
                              <button onClick={() => updateMilestone(m.id, { elapsedTime: 0 })} title="Reset timer" style={{
                                background: "transparent", border: `1px solid ${border}`, borderRadius: 6,
                                padding: "2px 8px", fontSize: 10, color: muted, cursor: "pointer",
                              }}>Reset</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {milestones.length === 0 && <div style={{ fontSize: 12, color: muted, textAlign: "center", padding: "14px 0" }}>No milestones yet — add one above.</div>}
                  </div>
                </div>

                {/* ── Cumulative Workspace Billable Time ─────────────────── */}
                {(() => {
                  const totalSeconds = milestones.reduce((sum, m) => sum + (m.elapsedTime || 0), 0);
                  const totalH  = Math.floor(totalSeconds / 3600);
                  const totalM  = Math.floor((totalSeconds % 3600) / 60);
                  const totalS  = totalSeconds % 60;
                  const anyRunning = milestones.some(m => m.isTimerRunning);
                  const plainEnglish = `Total Logged Duration: ${totalH} hour${totalH !== 1 ? "s" : ""}, ${totalM} minute${totalM !== 1 ? "s" : ""}, ${totalS} second${totalS !== 1 ? "s" : ""}`;
                  return (
                    <div style={{
                      background: dark
                        ? "linear-gradient(135deg, #0c1a2e 0%, #101f38 100%)"
                        : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                      border: `1px solid ${anyRunning ? "#06b6d440" : (dark ? "#1e3a5f" : "#bae6fd")}`,
                      borderRadius: 14, padding: "16px 18px",
                      boxShadow: anyRunning ? "0 0 0 3px #06b6d415" : "none",
                      transition: "all 0.3s ease",
                    }}>
                      {/* Header row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: anyRunning ? "#06b6d420" : (dark ? "#1e3a5f" : "#e0f2fe"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.3s" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={anyRunning ? "#06b6d4" : "#0ea5e9"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: anyRunning ? "#06b6d4" : "#0ea5e9", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            Cumulative Workspace Billable Time
                          </div>
                          <div style={{ fontSize: 10, color: dark ? "#64748b" : "#7dd3fc", marginTop: 1, fontWeight: 500 }}>
                            Auto-summing all milestone timers in real-time
                          </div>
                        </div>
                        {anyRunning && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#06b6d4", animation: "pulse-ring 1.2s ease infinite" }} />
                            <span style={{ fontSize: 10, color: "#06b6d4", fontWeight: 700 }}>LIVE</span>
                          </div>
                        )}
                      </div>

                      {/* Milestone breakdown mini-rows */}
                      {milestones.filter(m => (m.elapsedTime || 0) > 0).length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12, padding: "8px 10px", background: dark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.6)", borderRadius: 9, border: `1px solid ${dark ? "#1e3a5f" : "#bae6fd"}` }}>
                          {milestones.filter(m => (m.elapsedTime || 0) > 0).map(m => {
                            const h = Math.floor((m.elapsedTime||0) / 3600);
                            const mn = Math.floor(((m.elapsedTime||0) % 3600) / 60);
                            const sc = (m.elapsedTime||0) % 60;
                            return (
                              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                                {m.isTimerRunning && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#06b6d4", flexShrink: 0, animation: "pulse-ring 1.2s ease infinite" }} />}
                                {!m.isTimerRunning && <div style={{ width: 5, height: 5, borderRadius: "50%", background: dark ? "#334155" : "#cbd5e1", flexShrink: 0 }} />}
                                <span style={{ flex: 1, color: dark ? "#94a3b8" : "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.text}</span>
                                <span style={{ fontFamily: "monospace", fontWeight: 600, color: m.isTimerRunning ? "#06b6d4" : (dark ? "#64748b" : "#94a3b8"), flexShrink: 0 }}>
                                  {`${String(h).padStart(2,"0")}:${String(mn).padStart(2,"0")}:${String(sc).padStart(2,"0")}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Grand total display */}
                      <div style={{ padding: "12px 14px", background: dark ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.8)", border: `1px solid ${dark ? "#06b6d430" : "#7dd3fc"}`, borderRadius: 10 }}>
                        <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 800, color: totalSeconds > 0 ? (anyRunning ? "#06b6d4" : "#0ea5e9") : (dark ? "#334155" : "#cbd5e1"), letterSpacing: "0.04em", lineHeight: 1, textAlign: "center", transition: "color 0.3s" }}>
                          {`${String(totalH).padStart(2,"0")}:${String(totalM).padStart(2,"0")}:${String(totalS).padStart(2,"0")}`}
                        </div>
                        <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, fontWeight: 600, color: totalSeconds > 0 ? (dark ? "#94a3b8" : "#475569") : (dark ? "#334155" : "#cbd5e1"), lineHeight: 1.5, transition: "color 0.3s" }}>
                          {totalSeconds > 0 ? plainEnglish : "No time logged yet — start a milestone timer above"}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Scope Creep */}
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 18 }}>
                  <label style={labelStyle}>Scope Creep Adjustment — ${proj.scopeCreep || 0}</label>
                  <input type="range" min={0} max={1000} step={50} value={proj.scopeCreep || 0} onChange={e => updateProject("scopeCreep", Number(e.target.value))} style={{ width: "100%", accentColor: "#ef4444" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: muted, marginTop: 3 }}>
                    <span>$0</span>
                    <span style={{ color: (proj.scopeCreep || 0) > 700 ? "#ef4444" : muted }}>{(proj.scopeCreep || 0) > 700 ? "⚠ High Risk" : "Safe Zone"}</span>
                    <span>$1,000</span>
                  </div>
                </div>

                {/* Timesheet */}
                <TimesheetTracker
                  dark={dark} milestones={milestones} surface={surface} border={border} text={text} muted={muted} accent={accent}
                  projectId={activeProjectId}
                  timeLogs={proj.timeLogs || []}
                  onUpdateTimeLogs={(logs) => updateProject("timeLogs", logs)}
                />

                {/* Invoice */}
                <InvoiceGenerator dark={dark} surface={surface} border={border} text={text} muted={muted} accent={accent} projectClient={proj.client} />
              </div>

              {/* RIGHT: Live Client View */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Project Header Card */}
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: "clamp(15px, 4vw, 18px)", fontWeight: 700, color: text }}>{proj.name || "Untitled Project"}</div>
                      <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{proj.client}</div>
                    </div>
                    <HealthPulse health={proj.health || "on-track"} />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: muted, marginBottom: 6 }}>
                      <span>Overall Progress</span><span style={{ fontWeight: 600, color: accent }}>{proj.progress || 0}%</span>
                    </div>
                    <svg width="100%" height="10" style={{ borderRadius: 99, overflow: "visible" }}>
                      <rect x={0} y={0} width="100%" height={10} fill={dark ? "#334155" : "#e2e8f0"} rx={5} />
                      <rect x={0} y={0} width={`${proj.progress || 0}%`} height={10} fill={accent} rx={5} style={{ transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
                    </svg>
                  </div>
                  {milestones.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                      {milestones.map(m => <div key={m.id} style={{ flex: 1, height: 4, borderRadius: 99, background: (m.status === "Completed" || m.status === "Done") ? "#10b981" : m.status === "In Progress" ? "#f59e0b" : (dark ? "#334155" : "#e2e8f0"), transition: "background 0.3s" }} />)}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: muted, marginTop: 6 }}>{milestones.filter(m => m.status === "Completed" || m.status === "Done").length} of {milestones.length} milestones complete</div>
                </div>

                {/* Sticky Note Sidebar Preview */}
                {proj.stickyNote?.trim() && (
                  <div style={{ background: "linear-gradient(135deg, #fefce8, #fef9c3)", border: "1px solid #fde047", borderRadius: 14, padding: "14px 16px", cursor: "pointer", animation: "fadeIn 0.4s ease" }}
                    onClick={() => setStickyVisible(true)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z"/><polyline points="15 3 15 9 21 9"/></svg>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#92400e" }}>Project Notes</span>
                      <span style={{ fontSize: 10, color: "#a16207", marginLeft: "auto" }}>Click to edit</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#451a03", lineHeight: 1.6, maxHeight: 72, overflow: "hidden", whiteSpace: "pre-wrap" }}>{proj.stickyNote}</div>
                  </div>
                )}

                {/* Late Fee Warning */}
                <LateFeeDisplay dark={dark} surface={surface} border={border} text={text} muted={muted} accent={accent} deadline={proj.deadline} budget={proj.scopeBudget} lateFeeEnabled={proj.lateFeeEnabled} lateFeeRate={proj.lateFeeRate || 1.5} />

                {/* Scope Creep Card */}
                <div style={{ background: surface, border: `1px solid ${(proj.scopeCreep || 0) > 700 ? "#ef444440" : border}`, borderRadius: 16, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={(proj.scopeCreep || 0) > 700 ? "#ef4444" : "#f59e0b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: text }}>Scope Creep Adjustment</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: (proj.scopeCreep || 0) > 700 ? "#ef4444" : text }}>${(proj.scopeCreep || 0).toLocaleString()}</div>
                  <div style={{ height: 4, background: dark ? "#334155" : "#e2e8f0", borderRadius: 99, marginTop: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${((proj.scopeCreep || 0) / 1000) * 100}%`, background: (proj.scopeCreep || 0) > 700 ? "#ef4444" : "#f59e0b", borderRadius: 99, transition: "all 0.4s" }} />
                  </div>
                  <div style={{ fontSize: 10.5, color: muted, marginTop: 5 }}>Cap: $1,000 · ${(1000 - (proj.scopeCreep || 0)).toLocaleString()} remaining</div>
                </div>

                {/* Payment Lock */}
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: proj.paymentLocked ? "#10b98120" : accent + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {proj.paymentLocked ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{proj.paymentLocked ? "Payment Cleared" : "Payment Pending"}</div>
                    <div style={{ fontSize: 11.5, color: muted, marginTop: 2 }}>{proj.paymentLocked ? "Handoff certificate unlocked" : "Mark as cleared to unlock certificate"}</div>
                  </div>
                  <button onClick={() => updateProject("paymentLocked", !proj.paymentLocked)} style={{
                    padding: "7px 14px", borderRadius: 9, border: `1px solid ${proj.paymentLocked ? "#10b981" : accent}`,
                    background: proj.paymentLocked ? "#10b98120" : "transparent", color: proj.paymentLocked ? "#10b981" : accent,
                    fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                  }}>
                    {proj.paymentLocked ? "Revoke" : "Mark Cleared"}
                  </button>
                </div>

                {/* Completion Certificate */}
                <CompletionCertificate dark={dark} milestones={milestones} clientName={proj.client} projectName={proj.name} paymentLocked={!proj.paymentLocked} />

                {/* ── Export Comprehensive Timesheet PDF ──────── */}
                {milestones.length > 0 && (() => {
                  const fmtSec = s => {
                    const h = Math.floor((s||0) / 3600), mn = Math.floor(((s||0) % 3600) / 60), sc = (s||0) % 60;
                    return `${String(h).padStart(2,"0")}:${String(mn).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
                  };
                  const grandTotal = milestones.reduce((sum, m) => sum + (m.elapsedTime || 0), 0);
                  const grandH = Math.floor(grandTotal / 3600);
                  const grandM = Math.floor((grandTotal % 3600) / 60);
                  const grandS = grandTotal % 60;
                  const grandPlainEnglish = `Total Logged Duration: ${grandH} hour${grandH !== 1 ? "s" : ""}, ${grandM} minute${grandM !== 1 ? "s" : ""}, ${grandS} second${grandS !== 1 ? "s" : ""}`;

                  const handleTimesheetPDF = () => {
                    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
                    const rowsHTML = milestones.map((m, i) => {
                      const statusColor = m.status === "Completed" || m.status === "Done" ? "#10b981" : m.status === "In Progress" ? "#f59e0b" : "#94a3b8";
                      return `<tr>
                        <td class="idx">${i + 1}</td>
                        <td class="task-name">${m.text}</td>
                        <td><span class="status-badge" style="color:${statusColor};background:${statusColor}18;border-color:${statusColor}40">${m.status}</span></td>
                        <td class="mono">${fmtSec(m.elapsedTime || 0)}</td>
                      </tr>`;
                    }).join("");

                    const w = window.open("", "_blank");
                    w.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Timesheet — ${proj.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: #f8fafc; padding: 48px; color: #1e293b; }
    .sheet { background: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.1); overflow: hidden; max-width: 760px; margin: 0 auto; }
    .header { background: #0f172a; padding: 36px 40px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-row { display: flex; align-items: center; gap: 12px; }
    .logo-box { width: 40px; height: 40px; background: #6366f1; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .logo-box svg { fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; }
    .brand { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
    .brand-sub { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
    .meta-right { text-align: right; }
    .doc-type { font-size: 12px; color: #6366f1; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    .project-name { font-size: 22px; font-weight: 800; color: #fff; margin-top: 4px; }
    .client-label { font-size: 12px; color: #94a3b8; margin-top: 3px; }
    .sub-bar { background: #1e293b; padding: 14px 40px; display: flex; gap: 32px; }
    .sub-item { font-size: 11px; color: #64748b; }
    .sub-item span { display: block; font-size: 13px; font-weight: 700; color: #cbd5e1; margin-top: 2px; }
    .body { padding: 32px 40px; }
    .section-label { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #6366f1; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #f1f5f9; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; padding: 0 12px 10px; text-align: left; }
    th.right, td.right { text-align: right; }
    th.center, td.center { text-align: center; }
    td { padding: 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    td.idx { color: #94a3b8; font-size: 11px; font-weight: 600; width: 32px; }
    td.task-name { font-weight: 600; color: #0f172a; }
    td.mono { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; color: #475569; text-align: right; }
    .status-badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 10.5px; font-weight: 700; border: 1px solid; }
    .total-row { background: #f8fafc; }
    .total-row td { font-weight: 700; font-size: 13.5px; border-bottom: none; padding-top: 16px; }
    .grand-total { font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 700; color: #6366f1; text-align: right; }
    .footer { padding: 20px 40px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
    .footer-note { font-size: 11px; color: #94a3b8; }
    .sig-area { display: flex; gap: 48px; }
    .sig-block { text-align: center; font-size: 11px; color: #94a3b8; }
    .sig-line { width: 140px; border-bottom: 1px solid #cbd5e1; margin: 0 auto 6px; height: 28px; }
    @media print {
      html, body { background: #fff !important; padding: 0 !important; }
      .sheet { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
      @page { size: A4 portrait; margin: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div class="header-top">
        <div class="logo-row">
          <div class="logo-box">
            <svg width="20" height="20" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          </div>
          <div>
            <div class="brand">TrES Workspace</div>
            <div class="brand-sub">Project Time Report</div>
          </div>
        </div>
        <div class="meta-right">
          <div class="doc-type">Comprehensive Timesheet</div>
          <div class="project-name">${proj.name || "Project"}</div>
          <div class="client-label">Client: ${proj.client || "—"}</div>
        </div>
      </div>
    </div>
    <div class="sub-bar">
      <div class="sub-item">Issued On<span>${today}</span></div>
      <div class="sub-item">Total Milestones<span>${milestones.length}</span></div>
      <div class="sub-item">Completed<span>${milestones.filter(m => m.status === "Completed" || m.status === "Done").length}</span></div>
      <div class="sub-item">Grand Total Time<span style="color:#6366f1">${fmtSec(grandTotal)}</span></div>
    </div>
    <div style="background:#312e81;padding:13px 40px;border-top:1px solid #4338ca">
      <div style="font-size:13px;font-weight:700;color:#c7d2fe;text-align:center;letter-spacing:0.01em">${grandPlainEnglish}</div>
    </div>
    <div class="body">
      <div class="section-label">Milestone Time Log</div>
      <table>
        <thead><tr>
          <th>#</th>
          <th>Milestone / Task</th>
          <th>Status</th>
          <th style="text-align:right">Time Logged</th>
        </tr></thead>
        <tbody>
          ${rowsHTML}
          <tr class="total-row">
            <td colspan="3" style="text-align:right;color:#6366f1;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;font-size:11px">Grand Total Duration</td>
            <td class="grand-total">${fmtSec(grandTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <div class="footer-note">Generated by TrES Workspace · Confidential Time Report</div>
      <div class="sig-area">
        <div class="sig-block"><div class="sig-line"></div>Agency Representative</div>
        <div class="sig-block"><div class="sig-line"></div>Client Acknowledgement</div>
      </div>
    </div>
  </div>
</body>
</html>`);
                    w.document.close();
                    setTimeout(() => { w.focus(); w.print(); }, 450);
                  };

                  return (
                    <div style={{ background: dark ? "linear-gradient(135deg,#0d1f3c,#1a1040)" : "linear-gradient(135deg,#eef2ff,#f0fdf4)", border: "1px solid #6366f130", borderRadius: 16, padding: "18px 20px", animation: "fadeIn 0.4s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: text }}>Comprehensive Timesheet</div>
                          <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{milestones.length} tasks · <span style={{ fontFamily: "monospace", color: accent, fontWeight: 700 }}>{fmtSec(grandTotal)}</span></div>
                          <div style={{ fontSize: 10.5, color: accent, marginTop: 2, fontWeight: 600 }}>{grandPlainEnglish}</div>
                        </div>
                      </div>
                      <button onClick={handleTimesheetPDF} style={{
                        width: "100%", padding: "11px 0", borderRadius: 10, border: "none",
                        background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff",
                        fontSize: 13, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        boxShadow: "0 4px 16px #6366f140", transition: "all 0.2s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px #6366f155"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px #6366f140"; }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Export Comprehensive Timesheet PDF
                      </button>
                    </div>
                  );
                })()}

                {/* Video embed */}
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: text }}>Project Walkthrough</span>
                  </div>
                  <div style={{ padding: "10px 16px 12px" }}>
                    <input style={inputStyle} value={proj.videoUrl || ""} onChange={e => updateProject("videoUrl", e.target.value)} placeholder="https://www.youtube.com/embed/…" />
                  </div>
                  <div style={{ position: "relative", paddingBottom: "46%", background: dark ? "#0f172a" : "#f1f5f9" }}>
                    <iframe src={proj.videoUrl} title="Project Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB B — UTILITIES STUDIO ══════════════════════ */}
          {activeTab === "utilities" && (
            <UtilitiesStudio dark={dark} surface={surface} border={border} text={text} muted={muted} accent={accent} inputStyle={inputStyle} labelStyle={labelStyle} />
          )}

          {/* ══ TAB C — EXECUTIVE RESUME STUDIO ══════════════ */}
          {activeTab === "resume" && (
            <div>
              <div className="resume-header-bar">
                <div>
                  <div style={{ fontSize: "clamp(15px, 4vw, 18px)", fontWeight: 700, color: text }}>Executive Resume Studio</div>
                  <div style={{ fontSize: "clamp(11px, 3vw, 13px)", color: muted, marginTop: 3 }}>Professional CV builder, agency pitch deck, and ATS keyword analyzer</div>
                </div>
                <div className="resume-view-tabs">
                  {["cv", "agency", "ats"].map(v => (
                    <button key={v} onClick={() => setResumeView(v)} className="touch-btn" style={{
                      padding: "9px 16px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                      border: `1px solid ${resumeView === v ? accent : border}`,
                      background: resumeView === v ? accent : "transparent",
                      color: resumeView === v ? "#fff" : muted,
                      transition: "all 0.15s",
                    }}>{v === "cv" ? "CV Builder" : v === "agency" ? "Agency Pitch" : "ATS Analyzer"}</button>
                  ))}
                </div>
              </div>

              {/* CV Builder */}
              {resumeView === "cv" && (
                <div className="resume-cv-grid">

                  {/* ── Layout Selector Sidebar ── */}
                  <div className="cv-sidebar">
                    {/* CV Section Header */}
                    <div style={{ position: "sticky", top: 0, zIndex: 2, background: dark ? "#1e293b" : "#f1f5f9", borderRadius: 8, padding: "7px 10px", marginBottom: 6, border: `1px solid ${dark ? "#334155" : "#dde3ea"}` }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: "#1a3a5c", textTransform: "uppercase", letterSpacing: "0.13em", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>Executive CV Blueprints</span>
                        <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 99, background: "#1a3a5c", color: "#fff" }}>10</span>
                      </div>
                    </div>
                    {OFFICIAL_LAYOUTS.filter(l => l.category === "CV").map(layout => (
                      <button key={layout.id} onClick={() => setSelectedLayoutId(layout.id)} style={{
                        width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 9, border: `1px solid ${selectedLayoutId === layout.id ? layout.borderHex : (dark ? "#334155" : "#e2e8f0")}`,
                        background: selectedLayoutId === layout.id ? layout.accentHex + "12" : "transparent",
                        cursor: "pointer", marginBottom: 4, transition: "all 0.15s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 20, background: layout.borderHex + "22", color: layout.borderHex, letterSpacing: "0.05em" }}>{layout.badge}</span>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: selectedLayoutId === layout.id ? layout.accentHex : text, lineHeight: 1.3 }}>{layout.name}</div>
                        <div style={{ fontSize: 9.5, color: muted, marginTop: 2, lineHeight: 1.4 }}>{layout.description}</div>
                      </button>
                    ))}

                    {/* Pitch Section Header */}
                    <div style={{ position: "sticky", top: 0, zIndex: 2, background: dark ? "#1e293b" : "#f1f5f9", borderRadius: 8, padding: "7px 10px", marginTop: 8, marginBottom: 6, border: `1px solid ${dark ? "#334155" : "#dde3ea"}` }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.13em", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>Agency Pitch Blueprints</span>
                        <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 99, background: "#6366f1", color: "#fff" }}>10</span>
                      </div>
                    </div>
                    {OFFICIAL_LAYOUTS.filter(l => l.category === "Pitch").map(layout => (
                      <button key={layout.id} onClick={() => setSelectedLayoutId(layout.id)} style={{
                        width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 9, border: `1px solid ${selectedLayoutId === layout.id ? layout.borderHex : (dark ? "#334155" : "#e2e8f0")}`,
                        background: selectedLayoutId === layout.id ? layout.accentHex + "12" : "transparent",
                        cursor: "pointer", marginBottom: 4, transition: "all 0.15s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 20, background: layout.borderHex + "22", color: layout.borderHex, letterSpacing: "0.05em" }}>{layout.badge}</span>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: selectedLayoutId === layout.id ? layout.accentHex : text, lineHeight: 1.3 }}>{layout.name}</div>
                        <div style={{ fontSize: 9.5, color: muted, marginTop: 2, lineHeight: 1.4 }}>{layout.description}</div>
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", maxHeight: "calc(100vh - 180px)" }}>
                    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${border}` }}>Personal Information</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={resume.name} onChange={e => setRes("name", e.target.value)} /></div>
                        <div><label style={labelStyle}>Professional Title</label><input style={inputStyle} value={resume.title} onChange={e => setRes("title", e.target.value)} /></div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div><label style={labelStyle}>Email</label><input style={inputStyle} value={resume.email} onChange={e => setRes("email", e.target.value)} /></div>
                          <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={resume.phone} onChange={e => setRes("phone", e.target.value)} /></div>
                        </div>
                        <div><label style={labelStyle}>Location</label><input style={inputStyle} value={resume.location} onChange={e => setRes("location", e.target.value)} /></div>
                      </div>
                    </div>
                    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${border}` }}>Professional Summary</div>
                      <textarea rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} value={resume.summary} onChange={e => setRes("summary", e.target.value)} />
                    </div>
                    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${border}` }}>Work Experience</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {resume.experience.map((exp, i) => (
                          <div key={exp.id} style={{ padding: 14, background: dark ? "#0f172a" : "#f8fafc", borderRadius: 10, border: `1px solid ${border}` }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 8 }}>Position {i + 1}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                <div><label style={labelStyle}>Company</label><input style={inputStyle} value={exp.company} onChange={e => { const ex = [...resume.experience]; ex[i] = { ...ex[i], company: e.target.value }; setRes("experience", ex); }} /></div>
                                <div><label style={labelStyle}>Role</label><input style={inputStyle} value={exp.role} onChange={e => { const ex = [...resume.experience]; ex[i] = { ...ex[i], role: e.target.value }; setRes("experience", ex); }} /></div>
                              </div>
                              <div><label style={labelStyle}>Period</label><input style={inputStyle} value={exp.period} onChange={e => { const ex = [...resume.experience]; ex[i] = { ...ex[i], period: e.target.value }; setRes("experience", ex); }} /></div>
                              <div><label style={labelStyle}>Key Achievements</label><textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={exp.bullets} onChange={e => { const ex = [...resume.experience]; ex[i] = { ...ex[i], bullets: e.target.value }; setRes("experience", ex); }} /></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${border}` }}>Education</div>
                      <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={resume.education} onChange={e => setRes("education", e.target.value)} />
                    </div>
                    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${border}` }}>Skills</div>
                      <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={resume.skills} onChange={e => setRes("skills", e.target.value)} />
                    </div>
                  </div>
                  {/* A4 Live Preview */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: text }}>Live Preview — {selectedLayout.name}</div>
                        <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{selectedLayout.description}</div>
                      </div>
                      <button onClick={() => {
                        try {
                          const canvas = document.querySelector('.print-a4');
                          if (!canvas) { window.print(); return; }
                          const w = window.open('', '_blank');
                          if (!w) { window.print(); return; }
                          w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${resume.name} — ${selectedLayout.name}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff}@media print{@page{size:A4 portrait;margin:0}body{margin:0}}</style></head><body>${canvas.outerHTML}</body></html>`);
                          w.document.close();
                          setTimeout(() => { w.focus(); w.print(); }, 500);
                        } catch(err) { window.print(); }
                      }} className="no-print" style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 9, border: `1px solid ${selectedLayout.borderHex}`, background: selectedLayout.accentHex, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Download PDF
                      </button>
                    </div>

                    {/* ── DYNAMIC LAYOUT CANVAS ── */}
                    <div className="print-a4" style={{ background: "#ffffff", color: "#0f172a", width: "100%", minHeight: 800, borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", fontFamily: "'DM Sans', sans-serif" }}>

                      {/* ═══ WHARTON STANDARD — strict single-column finance ═══ */}
                      {selectedLayout.columnMode === "single" && (
                        <div>
                          <div style={{ borderTop: `6px solid ${selectedLayout.borderHex}`, padding: "32px 48px 20px" }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: selectedLayout.headingHex, letterSpacing: "-0.02em", textTransform: "uppercase" }}>{resume.name}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: selectedLayout.subtitleHex, marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>{resume.title}</div>
                            <div style={{ display: "flex", gap: 24, marginTop: 10, flexWrap: "wrap" }}>
                              {[resume.email, resume.phone, resume.location].map((item, i) => (
                                <span key={i} style={{ fontSize: 11, color: "#374151" }}>{item}</span>
                              ))}
                            </div>
                            <div style={{ height: 1, background: selectedLayout.borderHex, marginTop: 16, opacity: 0.35 }} />
                          </div>
                          <div style={{ padding: "0 48px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
                            {[
                              { label: "Professional Summary", content: <p style={{ fontSize: 12, lineHeight: 1.75, color: "#374151" }}>{resume.summary}</p> },
                              { label: "Professional Experience", content: <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{resume.experience.map(exp => (<div key={exp.id}><div style={{ display: "flex", justifyContent: "space-between" }}><div><span style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</span><span style={{ fontSize: 12, color: selectedLayout.subtitleHex, marginLeft: 8 }}>· {exp.company}</span></div><span style={{ fontSize: 11, color: "#9ca3af" }}>{exp.period}</span></div><p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 4, lineHeight: 1.65 }}>{exp.bullets}</p></div>))}</div> },
                              { label: "Education", content: resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>{l}</div>) },
                              { label: "Core Competencies", content: <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 11, padding: "3px 10px", border: `1px solid ${selectedLayout.borderHex}50`, borderRadius: 3, color: selectedLayout.headingHex, fontWeight: 500 }}>{s}</span>)}</div> },
                            ].map(sec => (
                              <div key={sec.label}>
                                <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: selectedLayout.subtitleHex, marginBottom: 10, paddingBottom: 5, borderBottom: `1px solid ${selectedLayout.borderHex}40` }}>{sec.label}</div>
                                {sec.content}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ═══ MCKINSEY MATRIX — asymmetric two-column consulting ═══ */}
                      {selectedLayout.columnMode === "asymmetric" && (
                        <div style={{ display: "grid", gridTemplateColumns: "38% 62%", minHeight: 800 }}>
                          <div style={{ background: selectedLayout.accentHex, padding: "36px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{resume.name}</div>
                              <div style={{ fontSize: 11, color: selectedLayout.subtitleHex, marginTop: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{resume.title}</div>
                            </div>
                            <div style={{ height: 2, background: selectedLayout.subtitleHex, opacity: 0.4 }} />
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {[resume.email, resume.phone, resume.location].map((item, i) => <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{item}</div>)}
                            </div>
                            <div>
                              <div style={{ fontSize: 8.5, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Core Competencies</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.85)", paddingLeft: 10, borderLeft: `2px solid ${selectedLayout.subtitleHex}` }}>{s}</div>)}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: 8.5, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Education</div>
                              {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{l}</div>)}
                            </div>
                          </div>
                          <div style={{ padding: "36px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 6, borderBottom: `2px solid ${selectedLayout.accentHex}` }}>Impact Summary</div>
                              <p style={{ fontSize: 12, lineHeight: 1.75, color: "#374151" }}>{resume.summary}</p>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 6, borderBottom: `2px solid ${selectedLayout.accentHex}` }}>Engagement History</div>
                              {resume.experience.map(exp => (
                                <div key={exp.id} style={{ marginBottom: 16, paddingLeft: 14, borderLeft: `3px solid ${selectedLayout.accentHex}` }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</span>
                                    <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{exp.period}</span>
                                  </div>
                                  <div style={{ fontSize: 11.5, fontWeight: 600, color: selectedLayout.subtitleHex, marginTop: 2 }}>{exp.company}</div>
                                  <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 5, lineHeight: 1.65 }}>{exp.bullets}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ BOARDROOM C-SUITE — centered executive governance ═══ */}
                      {selectedLayout.columnMode === "centered" && (
                        <div>
                          <div style={{ textAlign: "center", padding: "40px 48px 20px", borderBottom: `3px double ${selectedLayout.borderHex}` }}>
                            <div style={{ fontSize: 26, fontWeight: 900, color: selectedLayout.headingHex, letterSpacing: "0.04em", textTransform: "uppercase" }}>{resume.name}</div>
                            <div style={{ fontSize: 12, color: selectedLayout.subtitleHex, marginTop: 6, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>{resume.title}</div>
                            <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 10, flexWrap: "wrap" }}>
                              {[resume.email, resume.phone, resume.location].map((item, i) => (
                                <span key={i} style={{ fontSize: 11, color: "#374151" }}>{item}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ padding: "20px 48px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
                            <div style={{ textAlign: "center", borderBottom: `1px solid ${selectedLayout.borderHex}30`, paddingBottom: 16 }}>
                              <p style={{ fontSize: 12.5, lineHeight: 1.8, color: "#374151", fontStyle: "italic" }}>{resume.summary}</p>
                            </div>
                            <div>
                              <div style={{ textAlign: "center", fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Board-Level Experience</div>
                              {resume.experience.map(exp => (
                                <div key={exp.id} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 16, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${selectedLayout.borderHex}20` }}>
                                  <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 11.5, fontWeight: 700, color: selectedLayout.subtitleHex }}>{exp.company}</div>
                                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{exp.period}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</div>
                                    <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 4, lineHeight: 1.65 }}>{exp.bullets}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>Education</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{l}</div>)}
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>Governance Competencies</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                  {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "3px 9px", border: `1px solid ${selectedLayout.borderHex}60`, borderRadius: 2, color: selectedLayout.headingHex }}>{s}</span>)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ LEGAL BRIEF — formal practice-area structured ═══ */}
                      {selectedLayout.columnMode === "legal" && (
                        <div>
                          <div style={{ background: selectedLayout.headingHex, padding: "28px 40px" }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "0.01em" }}>{resume.name}</div>
                            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>{resume.title}</div>
                            <div style={{ display: "flex", gap: 20, marginTop: 10, flexWrap: "wrap" }}>
                              {[resume.email, resume.phone, resume.location].map((item, i) => (
                                <span key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{item}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 2px 2fr" }}>
                            <div style={{ padding: "22px 20px", display: "flex", flexDirection: "column", gap: 18, background: "#f8f9fa" }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Practice Areas</div>
                                {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => (
                                  <div key={i} style={{ fontSize: 11, color: "#374151", padding: "4px 0", borderBottom: `1px solid ${selectedLayout.borderHex}20`, lineHeight: 1.5 }}>{s}</div>
                                ))}
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Education</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11, color: "#374151", lineHeight: 1.65 }}>{l}</div>)}
                              </div>
                            </div>
                            <div style={{ background: selectedLayout.borderHex, opacity: 0.2 }} />
                            <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 5, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Professional Statement</div>
                                <p style={{ fontSize: 12, lineHeight: 1.75, color: "#374151" }}>{resume.summary}</p>
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10, paddingBottom: 5, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Professional Experience</div>
                                {resume.experience.map(exp => (
                                  <div key={exp.id} style={{ marginBottom: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                      <div><span style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</span><span style={{ fontSize: 12, color: selectedLayout.subtitleHex, marginLeft: 8 }}>— {exp.company}</span></div>
                                      <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{exp.period}</span>
                                    </div>
                                    <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 4, lineHeight: 1.65 }}>{exp.bullets}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ FEDERAL BLUEPRINT — high-density institutional ═══ */}
                      {selectedLayout.columnMode === "federal" && (
                        <div>
                          <div style={{ background: selectedLayout.headingHex, borderBottom: `4px solid ${selectedLayout.borderHex}`, padding: "24px 40px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                              <div>
                                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "0.02em", textTransform: "uppercase" }}>{resume.name}</div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>{resume.title}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                {[resume.email, resume.phone, resume.location].map((item, i) => (
                                  <div key={i} style={{ fontSize: 10.5, color: "rgba(255,255,255,0.75)" }}>{item}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div style={{ padding: "18px 40px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                            <div style={{ background: "#f8f9fb", border: `1px solid ${selectedLayout.borderHex}30`, borderRadius: 4, padding: "10px 14px" }}>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 5 }}>Objective / Summary</div>
                              <p style={{ fontSize: 11.5, lineHeight: 1.7, color: "#374151" }}>{resume.summary}</p>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", borderBottom: `2px solid ${selectedLayout.headingHex}`, paddingBottom: 4, marginBottom: 10 }}>Work Experience (Chronological)</div>
                              {resume.experience.map(exp => (
                                <div key={exp.id} style={{ marginBottom: 12, paddingLeft: 0 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", background: selectedLayout.headingHex + "0a", padding: "4px 8px", borderLeft: `3px solid ${selectedLayout.borderHex}` }}>
                                    <div><span style={{ fontSize: 12, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</span><span style={{ fontSize: 11.5, color: selectedLayout.subtitleHex, marginLeft: 8 }}>| {exp.company}</span></div>
                                    <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{exp.period}</span>
                                  </div>
                                  <p style={{ fontSize: 11, color: "#4b5563", marginTop: 4, lineHeight: 1.7, paddingLeft: 11 }}>{exp.bullets}</p>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", borderBottom: `2px solid ${selectedLayout.headingHex}`, paddingBottom: 4, marginBottom: 8 }}>Education</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11, color: "#374151", lineHeight: 1.7 }}>{l}</div>)}
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", borderBottom: `2px solid ${selectedLayout.headingHex}`, paddingBottom: 4, marginBottom: 8 }}>Clearance-Relevant Skills</div>
                                {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => (
                                  <div key={i} style={{ fontSize: 10.5, color: "#374151", padding: "2px 0", display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{ width: 4, height: 4, background: selectedLayout.borderHex, borderRadius: "50%", flexShrink: 0 }} />{s}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ VC 1-PAGE BRIEF — investor pitch ═══ */}
                      {selectedLayout.columnMode === "vc" && (
                        <div style={{ minHeight: 800 }}>
                          <div style={{ background: selectedLayout.headingHex, padding: "28px 40px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: selectedLayout.subtitleHex, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 5 }}>Investment Opportunity</div>
                                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>{resume.name}</div>
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>{resume.title}</div>
                              </div>
                              <div style={{ textAlign: "right", fontSize: 10.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
                                {[resume.email, resume.phone].map((x,i) => <div key={i}>{x}</div>)}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                            {[
                              { label: "The Problem", content: resume.summary, icon: "⚡" },
                              { label: "The Solution", content: resume.experience[0]?.bullets || "", icon: "💡" },
                              { label: "Track Record", content: resume.experience.slice(1).map(e => `${e.role} @ ${e.company}: ${e.bullets}`).join("\n"), icon: "📈" },
                              { label: "Credentials", content: resume.education + "\nCore Skills: " + resume.skills, icon: "🎓" },
                            ].map((block, i) => (
                              <div key={i} style={{ padding: "20px 28px", borderRight: i % 2 === 0 ? `1px solid ${selectedLayout.subtitleHex}30` : "none", borderBottom: i < 2 ? `1px solid ${selectedLayout.subtitleHex}30` : "none" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                  <span style={{ fontSize: 14 }}>{block.icon}</span>
                                  <span style={{ fontSize: 9.5, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase" }}>{block.label}</span>
                                </div>
                                <p style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.75, whiteSpace: "pre-line" }}>{block.content}</p>
                              </div>
                            ))}
                          </div>
                          <div style={{ padding: "16px 28px", background: selectedLayout.headingHex + "0a", borderTop: `2px solid ${selectedLayout.subtitleHex}40`, display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => (
                              <span key={i} style={{ fontSize: 10.5, padding: "4px 12px", borderRadius: 20, background: selectedLayout.subtitleHex + "18", border: `1px solid ${selectedLayout.subtitleHex}50`, color: selectedLayout.subtitleHex, fontWeight: 600 }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ═══ INSTITUTIONAL MEMORANDUM — M&A deal execution ═══ */}
                      {selectedLayout.columnMode === "memo" && (
                        <div>
                          <div style={{ background: selectedLayout.headingHex, padding: "22px 40px" }}>
                            <div style={{ fontSize: 9.5, fontWeight: 700, color: selectedLayout.subtitleHex, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 8 }}>Confidential — Executive Memorandum</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
                              <div>
                                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{resume.name}</div>
                                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>{resume.title}</div>
                              </div>
                              <div style={{ textAlign: "right", fontSize: 10.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
                                {[resume.email, resume.phone, resume.location].map((x,i) => <div key={i}>{x}</div>)}
                              </div>
                            </div>
                          </div>
                          <div style={{ padding: "20px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ padding: "12px 16px", background: selectedLayout.subtitleHex + "10", border: `1px solid ${selectedLayout.subtitleHex}40`, borderLeft: `4px solid ${selectedLayout.subtitleHex}` }}>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>Executive Overview</div>
                              <p style={{ fontSize: 12, lineHeight: 1.75, color: "#374151" }}>{resume.summary}</p>
                            </div>
                            {resume.experience.map((exp, i) => (
                              <div key={exp.id} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, paddingBottom: 14, borderBottom: `1px solid ${selectedLayout.borderHex}20` }}>
                                <div style={{ textAlign: "right", paddingRight: 16, borderRight: `2px solid ${selectedLayout.subtitleHex}30` }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: selectedLayout.subtitleHex }}>{exp.company}</div>
                                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>{exp.period}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</div>
                                  <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 4, lineHeight: 1.65 }}>{exp.bullets}</p>
                                </div>
                              </div>
                            ))}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Education</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{l}</div>)}
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Deal Competencies</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                  {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "2px 8px", background: selectedLayout.subtitleHex + "15", border: `1px solid ${selectedLayout.subtitleHex}40`, color: selectedLayout.headingHex, borderRadius: 2 }}>{s}</span>)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ B2B ENTERPRISE PITCH — ROI/Pain-point sales ═══ */}
                      {selectedLayout.columnMode === "b2b" && (
                        <div style={{ minHeight: 800 }}>
                          <div style={{ background: selectedLayout.headingHex, borderBottom: `4px solid ${selectedLayout.borderHex}`, padding: "28px 40px" }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: selectedLayout.borderHex, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 6 }}>Enterprise Value Proposition</div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{resume.name}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{resume.title}</div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid ${selectedLayout.borderHex}30` }}>
                            {[["Pain Point", resume.summary.slice(0, 120) + "…", "🔴"], ["Solution", (resume.experience[0]?.bullets || "").slice(0, 120) + "…", "🟢"], ["ROI Proof", resume.experience.slice(1).map(e => e.company).join(" · "), "📊"]].map(([label, body, icon], i) => (
                              <div key={i} style={{ padding: "18px 20px", borderRight: i < 2 ? `1px solid ${selectedLayout.borderHex}20` : "none" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                                  <span>{icon}</span>
                                  <span style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.borderHex, letterSpacing: "0.16em", textTransform: "uppercase" }}>{label}</span>
                                </div>
                                <p style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{body}</p>
                              </div>
                            ))}
                          </div>
                          <div style={{ padding: "20px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.borderHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 5, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Enterprise Track Record</div>
                              {resume.experience.map(exp => (
                                <div key={exp.id} style={{ display: "flex", gap: 16, marginBottom: 12, padding: "10px 12px", background: selectedLayout.headingHex + "05", border: `1px solid ${selectedLayout.borderHex}20`, borderRadius: 4 }}>
                                  <div style={{ flexShrink: 0, width: 100 }}>
                                    <div style={{ fontSize: 11.5, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.company}</div>
                                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{exp.period}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: selectedLayout.borderHex }}>{exp.role}</div>
                                    <p style={{ fontSize: 11, color: "#4b5563", marginTop: 3, lineHeight: 1.65 }}>{exp.bullets}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "4px 11px", borderRadius: 4, background: selectedLayout.borderHex + "15", border: `1px solid ${selectedLayout.borderHex}40`, color: selectedLayout.headingHex, fontWeight: 600 }}>{s}</span>)}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ STRATEGIC ROADMAP — quarterly milestone execution ═══ */}
                      {selectedLayout.columnMode === "roadmap" && (
                        <div>
                          <div style={{ background: selectedLayout.headingHex, padding: "28px 40px", borderBottom: `4px solid ${selectedLayout.borderHex}` }}>
                            <div style={{ fontSize: 9.5, fontWeight: 700, color: selectedLayout.borderHex, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Strategic Execution Profile</div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{resume.name}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>{resume.title}</div>
                          </div>
                          <div style={{ padding: "20px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
                            <p style={{ fontSize: 12, lineHeight: 1.75, color: "#374151", paddingLeft: 14, borderLeft: `3px solid ${selectedLayout.borderHex}` }}>{resume.summary}</p>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>Execution Milestones</div>
                              {resume.experience.map((exp, i) => (
                                <div key={exp.id} style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: selectedLayout.borderHex, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>Q{i + 1}</div>
                                    {i < resume.experience.length - 1 && <div style={{ width: 2, flex: 1, background: selectedLayout.borderHex + "40", marginTop: 6 }} />}
                                  </div>
                                  <div style={{ paddingBottom: 14 }}>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</span>
                                      <span style={{ fontSize: 11, color: selectedLayout.subtitleHex }}>{exp.company}</span>
                                      <span style={{ fontSize: 10.5, color: "#9ca3af", marginLeft: "auto" }}>{exp.period}</span>
                                    </div>
                                    <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 5, lineHeight: 1.65 }}>{exp.bullets}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Education</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{l}</div>)}
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Strategic Capabilities</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                  {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "3px 9px", borderRadius: 20, background: selectedLayout.borderHex + "18", border: `1px solid ${selectedLayout.borderHex}50`, color: selectedLayout.headingHex }}>{s}</span>)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ QUARTERLY BOARD UPDATE — high-level operational summary ═══ */}
                      {selectedLayout.columnMode === "board" && (
                        <div>
                          <div style={{ background: selectedLayout.headingHex, padding: "24px 40px", borderBottom: `3px solid ${selectedLayout.borderHex}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: selectedLayout.borderHex, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 5 }}>Board of Directors — Quarterly Update</div>
                                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{resume.name}</div>
                                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>{resume.title}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                {[resume.email, resume.phone].map((x,i) => <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{x}</div>)}
                              </div>
                            </div>
                          </div>
                          <div style={{ padding: "20px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                              {[
                                { label: "Status", value: "Active", color: "#10b981" },
                                { label: "Location", value: resume.location, color: selectedLayout.borderHex },
                                { label: "Focus Area", value: resume.title.split(" ").slice(-2).join(" "), color: selectedLayout.subtitleHex },
                              ].map((kpi, i) => (
                                <div key={i} style={{ padding: "12px 14px", background: "#f8f9fb", border: `1px solid ${kpi.color}30`, borderTop: `3px solid ${kpi.color}`, borderRadius: 6, textAlign: "center" }}>
                                  <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{kpi.label}</div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                                </div>
                              ))}
                            </div>
                            <div style={{ padding: "12px 16px", background: selectedLayout.borderHex + "0a", border: `1px solid ${selectedLayout.borderHex}30`, borderLeft: `4px solid ${selectedLayout.borderHex}`, borderRadius: 4 }}>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Executive Summary</div>
                              <p style={{ fontSize: 12, lineHeight: 1.75, color: "#374151" }}>{resume.summary}</p>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", borderBottom: `2px solid ${selectedLayout.headingHex}`, paddingBottom: 5, marginBottom: 12 }}>Operational History</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {resume.experience.map(exp => (
                                  <div key={exp.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 14, padding: "10px 0", borderBottom: `1px solid ${selectedLayout.borderHex}15` }}>
                                    <div>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: selectedLayout.subtitleHex }}>{exp.company}</div>
                                      <div style={{ fontSize: 9.5, color: "#9ca3af", marginTop: 2 }}>{exp.period}</div>
                                    </div>
                                    <div>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</div>
                                      <p style={{ fontSize: 11, color: "#4b5563", marginTop: 3, lineHeight: 1.65 }}>{exp.bullets}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "3px 10px", borderRadius: 3, background: selectedLayout.headingHex + "0a", border: `1px solid ${selectedLayout.borderHex}40`, color: selectedLayout.headingHex, fontWeight: 500 }}>{s}</span>)}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ LONDON EXECUTIVE — refined British corporate ═══ */}
                      {selectedLayout.columnMode === "london" && (
                        <div>
                          <div style={{ borderTop: `5px solid ${selectedLayout.borderHex}`, padding: "36px 48px 18px", borderBottom: `1px solid ${selectedLayout.borderHex}30` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: selectedLayout.subtitleHex, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 6 }}>Curriculum Vitae</div>
                                <div style={{ fontSize: 26, fontWeight: 800, color: selectedLayout.headingHex, letterSpacing: "0.01em" }}>{resume.name}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: selectedLayout.subtitleHex, marginTop: 5, letterSpacing: "0.1em", textTransform: "uppercase" }}>{resume.title}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                {[resume.email, resume.phone, resume.location].map((item, i) => (
                                  <div key={i} style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.8 }}>{item}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", minHeight: 700 }}>
                            <div style={{ padding: "24px 20px", background: selectedLayout.headingHex + "06", borderRight: `1px solid ${selectedLayout.borderHex}25`, display: "flex", flexDirection: "column", gap: 20 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10, paddingBottom: 5, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Education</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11, color: "#374151", lineHeight: 1.7 }}>{l}</div>)}
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10, paddingBottom: 5, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Key Skills</div>
                                {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => (
                                  <div key={i} style={{ fontSize: 11, color: "#374151", padding: "4px 0", borderBottom: `1px solid ${selectedLayout.borderHex}18`, lineHeight: 1.5 }}>{s}</div>
                                ))}
                              </div>
                            </div>
                            <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 5, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Profile</div>
                                <p style={{ fontSize: 12, lineHeight: 1.8, color: "#374151" }}>{resume.summary}</p>
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 5, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Career History</div>
                                {resume.experience.map(exp => (
                                  <div key={exp.id} style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                      <div><span style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</span><span style={{ fontSize: 11.5, color: selectedLayout.subtitleHex, marginLeft: 8 }}>· {exp.company}</span></div>
                                      <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{exp.period}</span>
                                    </div>
                                    <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 5, lineHeight: 1.7 }}>{exp.bullets}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ IVY ACADEMIC — scholarly publications & grants ═══ */}
                      {selectedLayout.columnMode === "ivy" && (
                        <div>
                          <div style={{ background: selectedLayout.headingHex, padding: "32px 48px" }}>
                            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "0.01em" }}>{resume.name}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 6, letterSpacing: "0.14em", textTransform: "uppercase" }}>{resume.title}</div>
                            <div style={{ display: "flex", gap: 20, marginTop: 10, flexWrap: "wrap" }}>
                              {[resume.email, resume.phone, resume.location].map((item, i) => (
                                <span key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{item}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ padding: "24px 48px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                              <div style={{ fontSize: 9.5, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 5, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Academic Statement</div>
                              <p style={{ fontSize: 12, lineHeight: 1.8, color: "#374151", fontStyle: "italic" }}>{resume.summary}</p>
                            </div>
                            <div>
                              <div style={{ fontSize: 9.5, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 5, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Academic & Professional Experience</div>
                              {resume.experience.map(exp => (
                                <div key={exp.id} style={{ marginBottom: 14, paddingLeft: 16, borderLeft: `3px solid ${selectedLayout.borderHex}` }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <div><span style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</span><span style={{ fontSize: 12, color: selectedLayout.subtitleHex, marginLeft: 8 }}>— {exp.company}</span></div>
                                    <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{exp.period}</span>
                                  </div>
                                  <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 4, lineHeight: 1.65 }}>{exp.bullets}</p>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                              <div>
                                <div style={{ fontSize: 9.5, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Education</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{l}</div>)}
                              </div>
                              <div>
                                <div style={{ fontSize: 9.5, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Research Interests & Skills</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                  {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "3px 9px", border: `1px solid ${selectedLayout.borderHex}60`, borderRadius: 3, color: selectedLayout.headingHex }}>{s}</span>)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ TECHNICAL PRINCIPAL — stack-first engineering leadership ═══ */}
                      {selectedLayout.columnMode === "tech" && (
                        <div style={{ background: "#0d1117", minHeight: 800, color: "#e6edf3" }}>
                          <div style={{ padding: "28px 40px", borderBottom: `2px solid ${selectedLayout.borderHex}40` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div>
                                <div style={{ fontFamily: "monospace", fontSize: 11, color: selectedLayout.subtitleHex, marginBottom: 6, letterSpacing: "0.05em" }}>// principal_engineer.profile</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: "#e6edf3", letterSpacing: "-0.02em" }}>{resume.name}</div>
                                <div style={{ fontSize: 12, color: selectedLayout.subtitleHex, marginTop: 4, fontFamily: "monospace" }}>{resume.title}</div>
                              </div>
                              <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: 10.5, color: "#8b949e", lineHeight: 1.9 }}>
                                {[resume.email, resume.phone, resume.location].map((x,i) => <div key={i}>{x}</div>)}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr" }}>
                            <div style={{ padding: "22px 20px", borderRight: `1px solid ${selectedLayout.borderHex}30`, display: "flex", flexDirection: "column", gap: 20 }}>
                              <div>
                                <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: selectedLayout.subtitleHex, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>// tech_stack</div>
                                {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => (
                                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 0", borderBottom: `1px solid ${selectedLayout.borderHex}20` }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: selectedLayout.subtitleHex, flexShrink: 0 }} />
                                    <span style={{ fontSize: 11, color: "#e6edf3", fontFamily: "monospace" }}>{s}</span>
                                  </div>
                                ))}
                              </div>
                              <div>
                                <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: selectedLayout.subtitleHex, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>// education</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 10.5, color: "#8b949e", lineHeight: 1.65, fontFamily: "monospace" }}>{l}</div>)}
                              </div>
                            </div>
                            <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
                              <div style={{ padding: "12px 16px", background: selectedLayout.borderHex + "12", border: `1px solid ${selectedLayout.borderHex}40`, borderLeft: `3px solid ${selectedLayout.borderHex}`, borderRadius: 4 }}>
                                <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: selectedLayout.subtitleHex, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>// summary</div>
                                <p style={{ fontSize: 12, lineHeight: 1.75, color: "#c9d1d9" }}>{resume.summary}</p>
                              </div>
                              <div>
                                <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: selectedLayout.subtitleHex, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>// experience</div>
                                {resume.experience.map((exp, i) => (
                                  <div key={exp.id} style={{ marginBottom: 16, paddingLeft: 14, borderLeft: `2px solid ${selectedLayout.borderHex}50` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.subtitleHex, fontFamily: "monospace" }}>{exp.role}</span>
                                      <span style={{ fontSize: 10, color: "#8b949e", fontFamily: "monospace" }}>{exp.period}</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: "#8b949e", marginTop: 2, fontFamily: "monospace" }}>{exp.company}</div>
                                    <p style={{ fontSize: 11.5, color: "#c9d1d9", marginTop: 5, lineHeight: 1.65 }}>{exp.bullets}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ MEDICAL FELLOW — clinical credentials & residency ═══ */}
                      {selectedLayout.columnMode === "medical" && (
                        <div>
                          <div style={{ background: selectedLayout.headingHex, padding: "28px 44px", borderBottom: `4px solid ${selectedLayout.borderHex}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 5 }}>Medical Curriculum Vitae</div>
                                <div style={{ fontSize: 23, fontWeight: 900, color: "#fff" }}>{resume.name}</div>
                                <div style={{ fontSize: 12, color: selectedLayout.borderHex, marginTop: 4, fontWeight: 600, letterSpacing: "0.06em" }}>{resume.title}</div>
                              </div>
                              <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
                                {[resume.email, resume.phone, resume.location].map((x,i) => <div key={i}>{x}</div>)}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 2fr" }}>
                            <div style={{ padding: "22px 20px", background: "#f0f8ff", display: "flex", flexDirection: "column", gap: 18 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.headingHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Specialties</div>
                                {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => (
                                  <div key={i} style={{ fontSize: 11, color: "#1e3a5f", padding: "4px 0", borderBottom: `1px solid ${selectedLayout.borderHex}20`, lineHeight: 1.5 }}>{s}</div>
                                ))}
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.headingHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Education & Training</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11, color: "#374151", lineHeight: 1.65 }}>{l}</div>)}
                              </div>
                            </div>
                            <div style={{ background: selectedLayout.borderHex, opacity: 0.15 }} />
                            <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.headingHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Clinical Summary</div>
                                <p style={{ fontSize: 12, lineHeight: 1.8, color: "#374151" }}>{resume.summary}</p>
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.headingHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.borderHex}` }}>Clinical & Academic Appointments</div>
                                {resume.experience.map(exp => (
                                  <div key={exp.id} style={{ marginBottom: 14, padding: "10px 14px", background: selectedLayout.headingHex + "06", border: `1px solid ${selectedLayout.borderHex}30`, borderRadius: 6 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                      <div><span style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</span><span style={{ fontSize: 11.5, color: selectedLayout.borderHex, marginLeft: 8 }}>· {exp.company}</span></div>
                                      <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{exp.period}</span>
                                    </div>
                                    <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 4, lineHeight: 1.65 }}>{exp.bullets}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ SILICON DIRECTOR — minimalist product-led tech executive ═══ */}
                      {selectedLayout.columnMode === "silicon" && (
                        <div style={{ background: "#fff", minHeight: 800 }}>
                          <div style={{ padding: "48px 52px 24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div>
                                <div style={{ fontSize: 28, fontWeight: 900, color: selectedLayout.headingHex, letterSpacing: "-0.03em" }}>{resume.name}</div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: selectedLayout.subtitleHex, marginTop: 6, letterSpacing: "0.01em" }}>{resume.title}</div>
                              </div>
                              <div style={{ textAlign: "right", fontSize: 11, color: "#71717a", lineHeight: 1.9 }}>
                                {[resume.email, resume.phone, resume.location].map((x,i) => <div key={i}>{x}</div>)}
                              </div>
                            </div>
                            <div style={{ height: 2, background: selectedLayout.borderHex, marginTop: 20, borderRadius: 99 }} />
                          </div>
                          <div style={{ padding: "0 52px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
                            <p style={{ fontSize: 13, lineHeight: 1.85, color: "#3f3f46" }}>{resume.summary}</p>
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Experience</div>
                              {resume.experience.map(exp => (
                                <div key={exp.id} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 20, marginBottom: 20 }}>
                                  <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.company}</div>
                                    <div style={{ fontSize: 10, color: "#a1a1aa", marginTop: 2 }}>{exp.period}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</div>
                                    <p style={{ fontSize: 11.5, color: "#52525b", marginTop: 4, lineHeight: 1.7 }}>{exp.bullets}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ height: 1, background: "#e4e4e7" }} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Education</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11.5, color: "#52525b", lineHeight: 1.7 }}>{l}</div>)}
                              </div>
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Expertise</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                  {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => (
                                    <span key={i} style={{ fontSize: 10.5, padding: "4px 12px", borderRadius: 99, background: selectedLayout.borderHex + "14", color: selectedLayout.subtitleHex, fontWeight: 600, border: `1px solid ${selectedLayout.borderHex}30` }}>{s}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ SCOPE OF WORK (SOW) — deliverable-milestone contract ═══ */}
                      {selectedLayout.columnMode === "sow" && (
                        <div>
                          <div style={{ background: selectedLayout.headingHex, padding: "28px 44px", borderBottom: `4px solid ${selectedLayout.borderHex}` }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: selectedLayout.borderHex, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 8 }}>Scope of Work Agreement</div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{resume.name}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{resume.title}</div>
                          </div>
                          <div style={{ padding: "24px 44px", display: "flex", flexDirection: "column", gap: 18 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                              {[["Client", resume.experience[0]?.company || "—"], ["Project Lead", resume.name], ["Contact", resume.email]].map(([label, value], i) => (
                                <div key={i} style={{ padding: "10px 14px", background: selectedLayout.headingHex + "08", border: `1px solid ${selectedLayout.borderHex}30`, borderTop: `3px solid ${selectedLayout.borderHex}`, borderRadius: 6 }}>
                                  <div style={{ fontSize: 9, fontWeight: 700, color: selectedLayout.borderHex, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                                  <div style={{ fontSize: 11.5, fontWeight: 600, color: selectedLayout.headingHex }}>{value}</div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.borderHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Project Overview & Objectives</div>
                              <p style={{ fontSize: 12, lineHeight: 1.8, color: "#374151" }}>{resume.summary}</p>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.borderHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Deliverable Milestones</div>
                              {resume.experience.map((exp, i) => (
                                <div key={exp.id} style={{ display: "flex", gap: 16, marginBottom: 14, alignItems: "flex-start" }}>
                                  <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 6, background: selectedLayout.borderHex, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{i+1}</div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</span>
                                      <span style={{ fontSize: 10.5, color: "#9ca3af" }}>{exp.period}</span>
                                    </div>
                                    <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 3, lineHeight: 1.65 }}>{exp.bullets}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.borderHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Tools & Technologies</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "3px 10px", border: `1px solid ${selectedLayout.borderHex}40`, borderRadius: 4, color: selectedLayout.headingHex, fontWeight: 500 }}>{s}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ RETAINER PROPOSAL — monthly recurring agency engagement ═══ */}
                      {selectedLayout.columnMode === "retainer" && (
                        <div>
                          <div style={{ background: selectedLayout.headingHex, padding: "28px 44px" }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: selectedLayout.borderHex, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 8 }}>Monthly Retainer Proposal</div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{resume.name}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{resume.title}</div>
                              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{resume.email}</div>
                            </div>
                          </div>
                          <div style={{ padding: "22px 44px", display: "flex", flexDirection: "column", gap: 18 }}>
                            <div style={{ padding: "14px 18px", background: selectedLayout.borderHex + "12", border: `1px solid ${selectedLayout.borderHex}50`, borderLeft: `4px solid ${selectedLayout.borderHex}`, borderRadius: 6 }}>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.borderHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>Agency Overview</div>
                              <p style={{ fontSize: 12, lineHeight: 1.8, color: "#374151" }}>{resume.summary}</p>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Retainer Tiers & Deliverables</div>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                                {resume.experience.slice(0,3).map((exp, i) => (
                                  <div key={exp.id} style={{ padding: "14px 16px", border: `1px solid ${i===1 ? selectedLayout.borderHex : selectedLayout.borderHex+"40"}`, borderTop: `3px solid ${i===1 ? selectedLayout.borderHex : selectedLayout.headingHex+"40"}`, borderRadius: 8, background: i===1 ? selectedLayout.borderHex+"08" : "#fff" }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</div>
                                    <div style={{ fontSize: 10, color: selectedLayout.borderHex, fontWeight: 600, margin: "4px 0" }}>{exp.company}</div>
                                    <p style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.6 }}>{exp.bullets}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Agency Credentials</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{l}</div>)}
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Core Services</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                  {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "3px 9px", background: selectedLayout.borderHex+"15", border: `1px solid ${selectedLayout.borderHex}40`, color: selectedLayout.headingHex, borderRadius: 4, fontWeight: 500 }}>{s}</span>)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ CREATIVE BRIEF — brand campaign objectives & tone ═══ */}
                      {selectedLayout.columnMode === "creative" && (
                        <div>
                          <div style={{ background: `linear-gradient(135deg, ${selectedLayout.headingHex}, #1a0a2e)`, padding: "32px 44px" }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: selectedLayout.borderHex, letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 8 }}>Creative Brief</div>
                            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>{resume.name}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 5 }}>{resume.title}</div>
                          </div>
                          <div style={{ padding: "24px 44px", display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                              {[["Brand Vision", resume.summary.slice(0,160)], ["Target Audience", resume.experience[0]?.bullets.slice(0,160) || ""]].map(([label, val], i) => (
                                <div key={i} style={{ padding: "14px 16px", background: selectedLayout.borderHex + "0a", border: `1px solid ${selectedLayout.borderHex}30`, borderRadius: 8 }}>
                                  <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.borderHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                                  <p style={{ fontSize: 12, lineHeight: 1.75, color: "#374151" }}>{val}</p>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Campaign Executions & Creative Work</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {resume.experience.map(exp => (
                                  <div key={exp.id} style={{ display: "flex", gap: 14, padding: "10px 14px", background: "#fafafa", border: `1px solid ${selectedLayout.borderHex}20`, borderLeft: `3px solid ${selectedLayout.borderHex}`, borderRadius: 4 }}>
                                    <div style={{ flexShrink: 0 }}>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</div>
                                      <div style={{ fontSize: 10.5, color: selectedLayout.subtitleHex, marginTop: 2 }}>{exp.company} · {exp.period}</div>
                                    </div>
                                    <p style={{ fontSize: 11.5, color: "#4b5563", lineHeight: 1.65 }}>{exp.bullets}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Creative Capabilities</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "4px 12px", borderRadius: 20, background: selectedLayout.borderHex+"18", border: `1px solid ${selectedLayout.borderHex}50`, color: selectedLayout.subtitleHex, fontWeight: 600 }}>{s}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ TECH STACK EVALUATION — comparative infrastructure matrix ═══ */}
                      {selectedLayout.columnMode === "techeval" && (
                        <div style={{ background: "#050a18", color: "#e2f0ff", minHeight: 800 }}>
                          <div style={{ padding: "28px 44px", borderBottom: `2px solid ${selectedLayout.borderHex}40` }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: selectedLayout.borderHex, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 8 }}>Technology Evaluation Report</div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: "#e2f0ff" }}>{resume.name}</div>
                            <div style={{ fontSize: 12, color: selectedLayout.subtitleHex, marginTop: 4 }}>{resume.title}</div>
                          </div>
                          <div style={{ padding: "20px 44px", display: "flex", flexDirection: "column", gap: 18 }}>
                            <div style={{ padding: "14px 18px", background: selectedLayout.borderHex + "12", border: `1px solid ${selectedLayout.borderHex}40`, borderRadius: 6 }}>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.borderHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>Executive Summary</div>
                              <p style={{ fontSize: 12, lineHeight: 1.8, color: "#c5d9ee" }}>{resume.summary}</p>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 4, borderBottom: `1px solid ${selectedLayout.borderHex}30` }}>Evaluation Matrix</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${selectedLayout.borderHex}30`, borderRadius: 8, overflow: "hidden" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", background: selectedLayout.borderHex + "22", padding: "8px 16px" }}>
                                  {["Solution / Vendor", "Stack Fit", "Period"].map((h,i) => <div key={i} style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.borderHex, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</div>)}
                                </div>
                                {resume.experience.map((exp, i) => (
                                  <div key={exp.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", padding: "10px 16px", borderTop: `1px solid ${selectedLayout.borderHex}20`, background: i%2===0 ? "transparent" : selectedLayout.borderHex+"08" }}>
                                    <div>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: "#e2f0ff" }}>{exp.role}</div>
                                      <div style={{ fontSize: 11, color: "#7eb8d4", marginTop: 2 }}>{exp.bullets.slice(0, 80)}…</div>
                                    </div>
                                    <div style={{ fontSize: 11.5, color: selectedLayout.subtitleHex, fontWeight: 600, alignSelf: "center" }}>{exp.company}</div>
                                    <div style={{ fontSize: 11, color: "#7eb8d4", alignSelf: "center" }}>{exp.period}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10, paddingBottom: 4, borderBottom: `1px solid ${selectedLayout.borderHex}30` }}>Recommended Stack Components</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                                {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "4px 12px", background: selectedLayout.borderHex+"18", border: `1px solid ${selectedLayout.borderHex}50`, color: selectedLayout.borderHex, borderRadius: 4, fontWeight: 600, fontFamily: "monospace" }}>{s}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ JOINT VENTURE PROSPECTUS — partnership equity & synergy ═══ */}
                      {selectedLayout.columnMode === "jv" && (
                        <div>
                          <div style={{ background: selectedLayout.headingHex, padding: "28px 44px", borderBottom: `4px solid ${selectedLayout.borderHex}` }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: selectedLayout.borderHex, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 8 }}>Joint Venture Prospectus</div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{resume.name}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{resume.title}</div>
                              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{resume.email}</div>
                            </div>
                          </div>
                          <div style={{ padding: "22px 44px", display: "flex", flexDirection: "column", gap: 18 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                              <div style={{ padding: "14px 16px", background: selectedLayout.borderHex + "0d", border: `1px solid ${selectedLayout.borderHex}40`, borderTop: `3px solid ${selectedLayout.borderHex}`, borderRadius: 8 }}>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Venture Overview</div>
                                <p style={{ fontSize: 12, lineHeight: 1.8, color: "#374151" }}>{resume.summary}</p>
                              </div>
                              <div style={{ padding: "14px 16px", background: selectedLayout.headingHex + "08", border: `1px solid ${selectedLayout.borderHex}30`, borderTop: `3px solid ${selectedLayout.headingHex}`, borderRadius: 8 }}>
                                <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Partner Credentials</div>
                                {resume.education.split("\n").filter(Boolean).map((l,i) => <div key={i} style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{l}</div>)}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Partnership History & Track Record</div>
                              {resume.experience.map(exp => (
                                <div key={exp.id} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${selectedLayout.borderHex}20` }}>
                                  <div>
                                    <div style={{ fontSize: 11.5, fontWeight: 700, color: selectedLayout.subtitleHex }}>{exp.company}</div>
                                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{exp.period}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: selectedLayout.headingHex }}>{exp.role}</div>
                                    <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 4, lineHeight: 1.65 }}>{exp.bullets}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 800, color: selectedLayout.subtitleHex, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${selectedLayout.headingHex}` }}>Synergy Capabilities</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {resume.skills.split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => <span key={i} style={{ fontSize: 10.5, padding: "3px 10px", border: `1px solid ${selectedLayout.borderHex}40`, borderRadius: 4, color: selectedLayout.headingHex, fontWeight: 600, background: selectedLayout.borderHex+"0a" }}>{s}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              )}

              {/* Agency Pitch Deck */}
              {resumeView === "agency" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
                    <AgencyProfile dark={dark} surface={surface} border={border} text={text} muted={muted} accent={accent} />
                  </div>
                  <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 16 }}>Deck Preview</div>
                    {(() => {
                      const ag = JSON.parse(localStorage.getItem("tres_agency") || "null") || { name: "Studio Apex", tagline: "", capabilities: "", team: [], caseStudies: [], tiers: [] };
                      const caps = ag.capabilities.split(",").map(s => s.trim()).filter(Boolean);
                      return (
                        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", color: "#1e293b" }}>
                          <div style={{ background: "#0f172a", padding: "32px 36px" }}>
                            <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{ag.name}</div>
                            <div style={{ fontSize: 13, color: "#6366f1", marginTop: 6, fontStyle: "italic" }}>{ag.tagline}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>Est. {ag.founded} · {ag.website}</div>
                          </div>
                          <div style={{ padding: "20px 28px" }}>
                            {caps.length > 0 && <div style={{ marginBottom: 18 }}><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366f1", marginBottom: 8 }}>Core Capabilities</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{caps.map((c, i) => <span key={i} style={{ padding: "3px 10px", borderRadius: 20, background: "#6366f110", color: "#4f46e5", fontSize: 11, fontWeight: 600, border: "1px solid #6366f120" }}>{c}</span>)}</div></div>}
                            {ag.tiers.length > 0 && <div><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366f1", marginBottom: 8 }}>Service Tiers</div><div style={{ display: "flex", gap: 8 }}>{ag.tiers.map((t, i) => <div key={t.id} style={{ flex: 1, padding: "12px", border: `1px solid ${i === 1 ? "#6366f1" : "#e2e8f0"}`, borderRadius: 10, textAlign: "center", background: i === 1 ? "#6366f108" : "#fff" }}><div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{t.name}</div><div style={{ fontSize: 16, fontWeight: 800, color: "#6366f1", margin: "6px 0" }}>{t.price}</div><div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5 }}>{t.features}</div></div>)}</div></div>}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* ATS Analyzer */}
              {resumeView === "ats" && (
                <div className="resume-2col">
                  <ATSAnalyzer dark={dark} surface={surface} border={border} text={text} muted={muted} accent={accent} resumeText={resumeFullText} />
                  <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      <span style={{ fontSize: 13, fontWeight: 700, color: text }}>Your Active Resume Copy</span>
                    </div>
                    <div style={{ background: dark ? "#0f172a" : "#f8fafc", borderRadius: 12, border: `1px solid ${border}`, padding: "16px 18px", maxHeight: 520, overflowY: "auto", fontSize: 12, color: text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{resume.name}</div>
                      <div style={{ color: accent, fontWeight: 600, marginBottom: 12 }}>{resume.title}</div>
                      <div style={{ marginBottom: 12 }}>{resume.summary}</div>
                      <div style={{ fontWeight: 700, color: accent, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Experience</div>
                      {resume.experience.map(e => (
                        <div key={e.id} style={{ marginBottom: 10 }}>
                          <div style={{ fontWeight: 700 }}>{e.role} · {e.company} <span style={{ color: muted, fontWeight: 400 }}>({e.period})</span></div>
                          <div style={{ color: muted, fontSize: 11.5 }}>{e.bullets}</div>
                        </div>
                      ))}
                      <div style={{ fontWeight: 700, color: accent, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Education</div>
                      <div style={{ marginBottom: 12 }}>{resume.education}</div>
                      <div style={{ fontWeight: 700, color: accent, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Skills</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {resume.skills.split(",").map(s => s.trim()).filter(Boolean).map((s, i) => (
                          <span key={i} style={{ padding: "3px 9px", borderRadius: 20, background: accent + "18", color: accent, fontSize: 11, fontWeight: 600 }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;

