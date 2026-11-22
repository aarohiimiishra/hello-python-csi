import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Lock,
  LogOut,
  Search,
  Shield,
  Terminal,
  Calendar,
  MapPin,
  Clock,
  Users,
  Code2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Database,
  FileCode,
  Sparkles,
  X,
  Menu,
  Play,
  Cpu,
  Layers,
  Zap,
  Orbit
} from 'lucide-react';

/**
 * ============================================================================
 * HELLO PYTHON — EVENT CONFIGURATION & CONTENT
 * Centralized configuration so CSI organizers can update venue, speakers,
 * schedule, and Supabase credentials without touching UI components.
 * ============================================================================
 */
const EVENT_CONFIG = {
  title: 'HELLO PYTHON',
  subtitle: 'A One-Day Immersive Seminar on Modern Python Engineering',
  hostShort: 'CSI',
  hostFull: 'CSI – Computer Society of India',
  institution: 'Bennett University',
  emailDomain: '@bennett.edu.in',
  emailExample: 's25cseu0414@bennett.edu.in',
  defaultCountryCode: '+91',
  dateDisplay: '26 NOVEMBER 2026',
  dateIso: '2026-11-26',
  format: 'One-Day Seminar',
  audience: 'First-Year College Students',
  logistics: [
    { label: 'EVENT', value: 'Hello Python', confirmed: true },
    { label: 'DATE', value: '26 November 2026', confirmed: true },
    { label: 'FORMAT', value: 'One-Day Seminar', confirmed: true },
    { label: 'TARGET AUDIENCE', value: 'First-Year College Students', confirmed: true },
    { label: 'HOSTED BY', value: 'CSI – Computer Society of India', confirmed: true },
    { label: 'VENUE', value: '[VENUE — TO BE CONFIRMED]', confirmed: false },
    { label: 'TIMINGS', value: '[TIMINGS — TO BE CONFIRMED]', confirmed: false },
    { label: 'SPEAKERS & SCHEDULE', value: '[SPEAKERS & SCHEDULE — TO BE CONFIRMED]', confirmed: false },
    { label: 'ENTRY / FEE', value: '[ENTRY DETAILS — TO BE CONFIRMED]', confirmed: false },
    { label: 'CERTIFICATES', value: '[CERTIFICATE DETAILS — TO BE CONFIRMED]', confirmed: false }
  ],
  // Optional live Supabase REST configuration (populated via environment or CSI Admin Settings)
  supabaseUrl:
    (typeof window !== 'undefined' && window.__ENV__?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
    'https://uxgfboegazaryrkggpzx.supabase.co',
  supabaseAnonKey:
    (typeof window !== 'undefined' && window.__ENV__?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
    ''
};

/**
 * ============================================================================
 * SEMINAR NOTES & RESOURCES VAULT (CONFIGURABLE + ADMIN-UPLOADABLE)
 * Placeholders are clearly marked until CSI uploads the post-seminar decks.
 * ============================================================================
 */
const NOTES_STORAGE_KEY = 'csi_hello_python_notes_v1';

const DEFAULT_SEMINAR_NOTES = [
  {
    id: 'note-01',
    moduleTag: 'MODULE 01 // FOUNDATIONS',
    title: 'Python Syntax, Variables & Control Flow Deck',
    description:
      'Complete slide deck and annotated examples covering variables, types, operators, conditionals, and loops.',
    fileType: 'PDF / SLIDES',
    status: 'PLACEHOLDER',
    url: '',
    updatedAt: 'TO BE UPLOADED AFTER SEMINAR'
  },
  {
    id: 'note-02',
    moduleTag: 'MODULE 02 // PROBLEM SOLVING',
    title: 'Data Structures & Functions Cheat Sheet',
    description:
      'Quick-reference guide for lists, tuples, sets, dictionaries, string methods, and debugging tracebacks.',
    fileType: 'CHEAT SHEET',
    status: 'PLACEHOLDER',
    url: '',
    updatedAt: 'TO BE UPLOADED AFTER SEMINAR'
  },
  {
    id: 'note-03',
    moduleTag: 'MODULE 03 // REAL-WORLD PYTHON',
    title: 'OOP, File I/O & REST APIs Starter Notebook',
    description:
      'Runnable Jupyter / Python starter templates for working with JSON files, modules, and HTTP APIs.',
    fileType: 'CODE NOTEBOOK',
    status: 'PLACEHOLDER',
    url: '',
    updatedAt: 'TO BE UPLOADED AFTER SEMINAR'
  },
  {
    id: 'note-04',
    moduleTag: 'MODULE 04 // THE BIG PICTURE',
    title: 'First-Year Roadmap: AI, Data Science & Automation',
    description:
      'Curated learning tracks, open-source project ideas, and CSI mentorship resources for your next 4 years.',
    fileType: 'ROADMAP GUIDE',
    status: 'PLACEHOLDER',
    url: '',
    updatedAt: 'TO BE UPLOADED AFTER SEMINAR'
  }
];

/**
 * ============================================================================
 * CURRICULUM ROADMAP DATA (4 LEVELS)
 * Designed as an inspiring progression rather than a dry syllabus.
 * ============================================================================
 */
const LEARNING_LEVELS = [
  {
    id: '01',
    code: 'LEVEL 01',
    title: 'THE FOUNDATIONS',
    tagline: 'Zero to your first working program.',
    accent: '#00D2FF',
    gradient: 'from-[#00D2FF] via-[#635BFF] to-[#7C3AED]',
    badgeBg: 'bg-[#00D2FF]/15 text-[#00D2FF] border-[#00D2FF]/40',
    summary:
      'Build mental models for how computers execute instructions. Master clean Python syntax without boilerplate friction.',
    topics: [
      'What programming is & how Python thinks',
      'Clean Python syntax & indentation',
      'Variables and core data types',
      'Standard input and formatted output',
      'Arithmetic, comparison & logical operators',
      'Conditional statements (if / elif / else)',
      'Iteration with for & while loops'
    ],
    filename: '01_foundations.py',
    snippet: `# Level 01 — Clean, readable logic from day one
student_name = "Bennett Fresher"
languages_known = 0

if languages_known == 0:
    status = "First-year explorer ready for Python"
else:
    status = "Expanding the engineering toolkit"

for step in range(1, 4):
    print(f"[Step {step}] Welcome, {student_name} -> {status}")`,
    simulatedOutput: `[Step 1] Welcome, Bennett Fresher -> First-year explorer ready for Python
[Step 2] Welcome, Bennett Fresher -> First-year explorer ready for Python
[Step 3] Welcome, Bennett Fresher -> First-year explorer ready for Python
>>> Process finished with exit code 0 (0.012s)`
  },
  {
    id: '02',
    code: 'LEVEL 02',
    title: 'THINK LIKE A PROGRAMMER',
    tagline: 'Structure data and decompose problems.',
    accent: '#635BFF',
    gradient: 'from-[#635BFF] via-[#8B5CF6] to-[#D946EF]',
    badgeBg: 'bg-[#635BFF]/15 text-[#A5B4FC] border-[#635BFF]/40',
    summary:
      'Move past isolated lines of code. Organize information using Python’s signature data structures and write modular functions.',
    topics: [
      'Reusable functions & scope',
      'Lists, tuples, sets, and dictionaries',
      'Strings and structured problem-solving',
      'Systematic debugging & reading tracebacks',
      'Fundamental algorithmic thinking'
    ],
    filename: '02_data_structures.py',
    snippet: `# Level 02 — Structuring & querying data cleanly
attendees = [
    {"name": "Aarav", "track": "AI/ML"},
    {"name": "Diya", "track": "Web Systems"},
    {"name": "Kabir", "track": "AI/ML"},
]

def group_by_track(records: list[dict]) -> dict[str, list[str]]:
    grouped = {}
    for person in records:
        grouped.setdefault(person["track"], []).append(person["name"])
    return grouped

print(group_by_track(attendees))`,
    simulatedOutput: `{'AI/ML': ['Aarav', 'Kabir'], 'Web Systems': ['Diya']}
>>> 3 records indexed across 2 engineering tracks in 0.004s`
  },
  {
    id: '03',
    code: 'LEVEL 03',
    title: 'BEYOND THE BASICS',
    tagline: 'Connect Python to files, libraries & live APIs.',
    accent: '#D946EF',
    gradient: 'from-[#D946EF] via-[#8B5CF6] to-[#3B82F6]',
    badgeBg: 'bg-[#D946EF]/15 text-[#F0ABFC] border-[#D946EF]/40',
    summary:
      'Write maintainable software that interacts with the outside world—reading files, leveraging packages, and consuming web APIs.',
    topics: [
      'Object-oriented programming (Classes & Objects)',
      'File handling (JSON, CSV, text streams)',
      'Modules, virtual environments & libraries',
      'Working with REST APIs over HTTP',
      'Writing cleaner, reusable production code'
    ],
    filename: '03_api_client.py',
    snippet: `# Level 03 — Talking to real-world web services
import json
from dataclasses import dataclass

@dataclass
class SeminarPass:
    student_email: str
    event: str = "Hello Python // CSI"

    def to_json(self) -> str:
        return json.dumps({"email": self.student_email, "event": self.event})

ticket = SeminarPass("s25cseu0414@bennett.edu.in")
print(ticket.to_json())`,
    simulatedOutput: `{"email": "s25cseu0414@bennett.edu.in", "event": "Hello Python // CSI"}
>>> Serialized SeminarPass payload ready for REST dispatch`
  },
  {
    id: '04',
    code: 'LEVEL 04',
    title: 'THE BIG PICTURE',
    tagline: 'See where Python takes you after the seminar.',
    accent: '#38BDF8',
    gradient: 'from-[#38BDF8] via-[#635BFF] to-[#C084FC]',
    badgeBg: 'bg-[#38BDF8]/15 text-[#7DD3FC] border-[#38BDF8]/40',
    summary:
      'A high-level architectural tour of modern engineering domains powered by Python—showing you what you can build over the next four years.',
    topics: [
      'Introduction to workflow automation',
      'Data analysis & visualization pipelines',
      'AI and machine learning applications',
      'How Python powers real-world production systems',
      'Clear roadmap of projects you can build next'
    ],
    filename: '04_big_picture.py',
    snippet: `# Level 04 — From campus script to intelligent systems
ECOSYSTEM = {
    "Automation": ["Playwright", "Pathlib", "Task Schedulers"],
    "Data Science": ["NumPy", "Pandas", "Polars"],
    "AI & ML": ["PyTorch", "Scikit-Learn", "LangGraph"],
    "Backend APIs": ["FastAPI", "PostgreSQL", "Docker"],
}

for domain, stack in ECOSYSTEM.items():
    print(f"{domain:<14} => {', '.join(stack)}")`,
    simulatedOutput: `Automation     => Playwright, Pathlib, Task Schedulers
Data Science   => NumPy, Pandas, Polars
AI & ML        => PyTorch, Scikit-Learn, LangGraph
Backend APIs   => FastAPI, PostgreSQL, Docker
>>> Ecosystem roadmap initialized. Ready to build.`
  }
];

/**
 * ============================================================================
 * SQL MIGRATION, SERVERLESS API & DEPLOYMENT ARTIFACTS
 * Embedded directly in the CSI Admin "Architecture & Setup" portal so the
 * team can copy-paste into Supabase & Vercel with zero friction.
 * ============================================================================
 */
const SUPABASE_SQL_MIGRATION = `-- ============================================================================
-- HELLO PYTHON (CSI) — SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) >= 2),
  college_email text not null unique
    check (college_email ~* '^[a-z0-9._%+-]+@bennett\\.edu\\.in$'),
  phone text not null
    check (phone ~ '^(\\+91)?[6-9][0-9]{9}$'),
  created_at timestamptz not null default now()
);

create index if not exists idx_registrations_created_at
  on public.registrations (created_at desc);

alter table public.registrations enable row level security;

-- Deny all direct anonymous reads, updates, and deletes
create policy "Deny anonymous select on registrations"
  on public.registrations for select
  to anon using (false);

create policy "Deny anonymous update on registrations"
  on public.registrations for update
  to anon using (false);

create policy "Deny anonymous delete on registrations"
  on public.registrations for delete
  to anon using (false);

-- Only authenticated CSI administrators can read registrations
create policy "Allow authenticated CSI admins to read registrations"
  on public.registrations for select
  to authenticated using (true);`;

const VERCEL_API_ROUTE_CODE = `// api/register.ts — Vercel Serverless Function (Node.js / Edge compatible)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const BENNETT_EMAIL_REGEX = /^[a-z0-9._%+-]+@bennett\\.edu\\.in$/i;
const INDIAN_MOBILE_REGEX = /^[6-9]\\d{9}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, collegeEmail, phone, countryCode = '+91' } = req.body || {};
  const cleanName = String(fullName || '').trim();
  const cleanEmail = String(collegeEmail || '').trim().toLowerCase();
  const cleanDigits = String(phone || '').replace(/\\D/g, '');

  if (cleanName.length < 2) {
    return res.status(400).json({ error: 'Please enter your full name.' });
  }
  if (!BENNETT_EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({
      error: 'A valid Bennett University email (@bennett.edu.in) is required.'
    });
  }
  if (!INDIAN_MOBILE_REGEX.test(cleanDigits)) {
    return res.status(400).json({
      error: 'Please enter a valid 10-digit Indian mobile number.'
    });
  }

  const formattedPhone = \`\${countryCode}\${cleanDigits}\`;

  const { data, error } = await supabaseAdmin
    .from('registrations')
    .insert([
      {
        full_name: cleanName,
        college_email: cleanEmail,
        phone: formattedPhone
      }
    ])
    .select('id, full_name, college_email, phone, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'This Bennett University email is already registered for Hello Python.'
      });
    }
    return res.status(500).json({ error: 'Database error while saving registration.' });
  }

  return res.status(201).json({ registration: data });
}`;

const ENV_EXAMPLE_CODE = `# Frontend (Public — safe for Vite bundle)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key

# Backend Serverless API ONLY (NEVER prefix with VITE_)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key`;

/**
 * ============================================================================
 * VALIDATION & REPOSITORY LAYER
 * Enforces @bennett.edu.in domain rules, 10-digit Indian mobile validation,
 * duplicate prevention, and seamless Supabase / local fallback persistence.
 * ============================================================================
 */
const STORAGE_KEY = 'csi_hello_python_registrations_v1';
const ADMIN_SESSION_KEY = 'csi_hello_python_admin_session_v1';

const CSI_ADMIN_CREDENTIALS = {
  email: 'csi.admin@bennett.edu.in',
  password: 'CSI@HelloPython2026'
};

function validateRegistrationPayload({ fullName, collegeEmail, phone, countryCode = '+91' }) {
  const errors = {};
  const cleanName = String(fullName || '').trim();
  const cleanEmail = String(collegeEmail || '').trim().toLowerCase();
  const cleanDigits = String(phone || '').replace(/\D/g, '');

  if (!cleanName) {
    errors.fullName = 'Full name is required.';
  } else if (cleanName.length < 2) {
    errors.fullName = 'Please enter at least 2 characters.';
  }

  const bennettRegex = /^[a-z0-9._%+-]+@bennett\.edu\.in$/i;
  if (!cleanEmail) {
    errors.collegeEmail = 'Bennett University email address is required.';
  } else if (!bennettRegex.test(cleanEmail)) {
    errors.collegeEmail = `Must be a valid Bennett University email ending in ${EVENT_CONFIG.emailDomain} (e.g., ${EVENT_CONFIG.emailExample}).`;
  }

  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!cleanDigits) {
    errors.phone = '10-digit Indian mobile number is required.';
  } else if (!indianMobileRegex.test(cleanDigits)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      full_name: cleanName,
      college_email: cleanEmail,
      phone: `${countryCode}${cleanDigits}`
    }
  };
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const registrationRepository = {
  getLocalRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveLocalRecords(records) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // Ignore storage quota errors
    }
  },

  async submitRegistration(payload, customSupabaseConfig) {
    const { isValid, errors, sanitized } = validateRegistrationPayload(payload);
    if (!isValid) {
      const firstError = Object.values(errors)[0] || 'Invalid registration data.';
      throw new Error(firstError);
    }

    const sbUrl = customSupabaseConfig?.url || EVENT_CONFIG.supabaseUrl;
    const sbAnon = customSupabaseConfig?.anonKey || EVENT_CONFIG.supabaseAnonKey;

    // 1. Prefer secure Vercel Serverless API (/api/register) when deployed
    try {
      const apiResponse = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: payload.fullName,
          collegeEmail: payload.collegeEmail,
          phone: payload.phone,
          countryCode: payload.countryCode || '+91'
        })
      });

      const contentType = apiResponse.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const result = await apiResponse.json();
        if (!apiResponse.ok) {
          throw new Error(result?.error || 'Unable to save registration.');
        }
        if (result?.registration) {
          const existing = this.getLocalRecords();
          this.saveLocalRecords([
            result.registration,
            ...existing.filter((r) => r.college_email !== result.registration.college_email)
          ]);
          return result.registration;
        }
      }
    } catch (apiErr) {
      // Surface explicit validation/duplicate errors from /api/register immediately
      if (
        apiErr?.message &&
        (apiErr.message.includes('already registered') ||
          apiErr.message.includes('Bennett University') ||
          apiErr.message.includes('10-digit') ||
          apiErr.message.includes('full name'))
      ) {
        throw apiErr;
      }
      // Otherwise fall through to direct Supabase REST or local preview storage
    }

    // 2. Direct Supabase REST insert if URL + Anon Key are configured
    if (sbUrl && sbAnon) {
      const response = await fetch(`${sbUrl.replace(/\/$/, '')}/rest/v1/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: sbAnon,
          Authorization: `Bearer ${sbAnon}`,
          Prefer: 'return=representation'
        },
        body: JSON.stringify(sanitized)
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        if (response.status === 409 || errBody?.code === '23505') {
          throw new Error(
            'This @bennett.edu.in email address is already registered for Hello Python.'
          );
        }
        throw new Error(
          errBody?.message || 'Unable to save registration to Supabase. Please verify policies.'
        );
      }

      const inserted = await response.json();
      return Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // 3. Local preview fallback when running inside sandboxed preview without backend env vars
    await new Promise((resolve) => setTimeout(resolve, 450));
    const existing = this.getLocalRecords();
    const duplicate = existing.some(
      (item) => item.college_email.toLowerCase() === sanitized.college_email
    );
    if (duplicate) {
      throw new Error(
        'This @bennett.edu.in email address is already registered for Hello Python.'
      );
    }

    const newRecord = {
      id: generateUUID(),
      ...sanitized,
      created_at: new Date().toISOString()
    };

    this.saveLocalRecords([newRecord, ...existing]);
    return newRecord;
  },

  async fetchRegistrationsForAdmin(customSupabaseConfig) {
    const sbUrl = customSupabaseConfig?.url || EVENT_CONFIG.supabaseUrl;
    const sbAnon = customSupabaseConfig?.anonKey || EVENT_CONFIG.supabaseAnonKey;

    if (sbUrl && sbAnon) {
      try {
        const response = await fetch(
          `${sbUrl.replace(/\/$/, '')}/rest/v1/registrations?select=*&order=created_at.desc`,
          {
            headers: {
              apikey: sbAnon,
              Authorization: `Bearer ${sbAnon}`
            }
          }
        );
        if (response.ok) {
          return await response.json();
        }
      } catch {
        // Fallback to local records if unreachable
      }
    }

    return this.getLocalRecords();
  }
};

/**
 * Subtle tactile film-grain overlay for editorial depth without lag
 */
function FilmGrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.025] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}
    />
  );
}

function CopySnippetButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#4E4885] bg-[#241F47] px-3 py-1.5 font-mono text-xs text-[#E8E7FF] transition hover:border-[#00D2FF] hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[#00D2FF]" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? 'COPIED' : label}</span>
    </button>
  );
}

/**
 * Custom Bespoke Vector Emblem: Python × CSI Orbital Core
 * Features concentric HUD rings, dual intertwined Python node pathways in
 * electric cyan & iris-orchid, and tactile floating syntax badges.
 */
function CsiPythonOrbitalIllustration() {
  return (
    <div className="relative mx-auto flex w-full max-w-[440px] items-center justify-center py-4 select-none">
      {/* Vibrant Ambient Aura Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, #00D2FF 0%, #635BFF 48%, #D946EF 85%, transparent 100%)'
        }}
      />

      {/* Floating Tactile Syntax Pill — Top Left */}
      <div className="absolute -left-2 top-6 z-20 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/95 px-3.5 py-2 shadow-[0_12px_30px_rgba(99,91,255,0.22)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 sm:-left-6">
        <span className="h-2.5 w-2.5 rounded-full bg-[#00D2FF]" />
        <code className="font-mono text-xs font-bold text-[#14112B]">import csi</code>
      </div>

      {/* Floating Tactile Syntax Pill — Top Right */}
      <div className="absolute -right-2 top-12 z-20 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/95 px-3.5 py-2 shadow-[0_12px_30px_rgba(217,70,239,0.22)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 sm:-right-5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#D946EF]" />
        <code className="font-mono text-xs font-bold text-[#635BFF]">def future():</code>
      </div>

      {/* Floating Tactile Syntax Pill — Bottom Left */}
      <div className="absolute bottom-8 left-0 z-20 flex items-center gap-2 rounded-2xl border border-[#635BFF]/30 bg-[#14112B] px-3.5 py-2 text-white shadow-[0_14px_32px_rgba(20,17,43,0.35)] transition-transform duration-300 hover:-translate-y-1 sm:-left-4">
        <Cpu className="h-3.5 w-3.5 text-[#00D2FF]" />
        <code className="font-mono text-[11px] font-semibold text-[#E8E7FF]">
          AI • DATA • WEB
        </code>
      </div>

      {/* Floating Tactile Syntax Pill — Bottom Right */}
      <div className="absolute -bottom-1 right-2 z-20 flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#635BFF] to-[#D946EF] px-4 py-2 text-white shadow-[0_12px_28px_rgba(99,91,255,0.38)] transition-transform duration-300 hover:-translate-y-1">
        <Zap className="h-3.5 w-3.5 text-[#00D2FF]" />
        <span className="font-mono text-[11px] font-bold tracking-wider">26 NOV 2026</span>
      </div>

      {/* Central Precision SVG Orbital Emblem */}
      <svg
        viewBox="0 0 400 400"
        className="relative z-10 h-auto w-full drop-shadow-[0_24px_48px_rgba(99,91,255,0.28)]"
        role="img"
        aria-label="CSI Computer Society of India Python Orbital Emblem"
      >
        <defs>
          <linearGradient id="csiCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="50%" stopColor="#635BFF" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
          <linearGradient id="csiSerpentCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="csiSerpentOrchid" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#635BFF" />
          </linearGradient>
          <radialGradient id="innerSphere" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#2B2559" />
            <stop offset="100%" stopColor="#14112B" />
          </radialGradient>
        </defs>

        {/* Outer Dashed Telemetry Orbit */}
        <circle
          cx="200"
          cy="200"
          r="176"
          fill="none"
          stroke="url(#csiCoreGrad)"
          strokeWidth="1.75"
          strokeDasharray="8 8"
          opacity="0.75"
        />

        {/* Middle Luminous Orbit Ring */}
        <circle
          cx="200"
          cy="200"
          r="146"
          fill="none"
          stroke="#635BFF"
          strokeWidth="1.5"
          opacity="0.35"
        />

        {/* Orbital Node Satellites */}
        <circle cx="200" cy="24" r="6" fill="#00D2FF" />
        <circle cx="376" cy="200" r="6" fill="#D946EF" />
        <circle cx="200" cy="376" r="6" fill="#635BFF" />
        <circle cx="24" cy="200" r="6" fill="#38BDF8" />

        {/* Central Deep Indigo Glass Core */}
        <circle
          cx="200"
          cy="200"
          r="116"
          fill="url(#innerSphere)"
          stroke="url(#csiCoreGrad)"
          strokeWidth="3"
        />

        {/* Stylized Geometric Python Twin-Interlock Motif */}
        {/* Upper Cyan Logic Block */}
        <path
          d="M156 144 C156 126, 174 118, 200 118 C226 118, 240 128, 240 146 L240 172 L182 172 C164 172, 156 182, 156 198 L156 144 Z"
          fill="url(#csiSerpentCyan)"
          opacity="0.95"
        />
        <circle cx="178" cy="137" r="4.5" fill="#14112B" />

        {/* Lower Orchid-Periwinkle Logic Block */}
        <path
          d="M244 256 C244 274, 226 282, 200 282 C174 282, 160 272, 160 254 L160 228 L218 228 C236 228, 244 218, 244 202 L244 256 Z"
          fill="url(#csiSerpentOrchid)"
          opacity="0.95"
        />
        <circle cx="222" cy="263" r="4.5" fill="#FFFFFF" />

        {/* Center Monogram Pill: CSI */}
        <rect
          x="148"
          y="179"
          width="104"
          height="42"
          rx="21"
          fill="#14112B"
          stroke="url(#csiCoreGrad)"
          strokeWidth="2.5"
        />
        <text
          x="200"
          y="206"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="'Syne', sans-serif"
          fontWeight="800"
          fontSize="20"
          letterSpacing="4"
        >
          CSI
        </text>
      </svg>
    </div>
  );
}

/**
 * Smooth Organic Wave Divider between Dark Cosmic & Bright Studio Sections
 */
function OrganicWaveDivider({ topColor = '#14112B', bottomColor = '#F8F9FF', flip = false }) {
  return (
    <div
      aria-hidden="true"
      style={{ backgroundColor: topColor }}
      className="relative -mb-px w-full overflow-hidden leading-none"
    >
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className={`block h-12 w-full sm:h-20 ${flip ? 'scale-x-[-1]' : ''}`}
      >
        <path
          d="M0,32 C320,104 540,-16 880,48 C1140,96 1310,64 1440,28 L1440,96 L0,96 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}

/**
 * ============================================================================
 * SECTION A: SIGNATURE SVG KNOCKOUT WINDOW "CSI" ZOOM-IN HERO PORTAL
 * Matches the dramatic knockout-mask zoom transition from your reference:
 * You look straight THROUGH the giant "CSI" letterforms into the vibrant
 * "PYTHON ISN'T JUST A first LANGUAGE." canvas with ascending geometric bars,
 * then the camera zooms seamlessly through "CSI" into the main website.
 * ============================================================================
 */
function HeroZoomPortal({ onNavigateSection, reducedMotion }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(0);
      return;
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const scrollableDistance = rect.height - window.innerHeight;
          if (scrollableDistance <= 0) {
            setProgress(0);
          } else {
            const scrolled = Math.min(Math.max(-rect.top, 0), scrollableDistance);
            setProgress(scrolled / scrollableDistance);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  // Smooth cubic acceleration so the camera plunges right through the center of "CSI"
  const eased = useMemo(() => {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }, [progress]);

  // Scale ramps from 1x up to 24x so the dark mask clears off-screen completely
  const portalScale = reducedMotion ? 1 : 1 + eased * 23;
  const chromeOpacity = reducedMotion ? 1 : Math.max(0, 1 - progress * 3.2);
  const underLayerScale = reducedMotion ? 1 : 0.94 + eased * 0.06;

  return (
    <section
      ref={containerRef}
      id="top"
      aria-label="Hello Python Opening Experience"
      className={
        reducedMotion
          ? 'relative min-h-screen bg-[#14112B] text-white'
          : 'relative h-[230vh] bg-[#14112B] text-white'
      }
    >
      {/* Sticky Pinned Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#F8F9FF]">
        {/* ================================================================
            LAYER 1 (UNDERNEATH THE CUTOUT):
            Vibrant Studio Canvas visible THROUGH the giant "CSI" letters!
            Features "PYTHON ISN'T JUST A first LANGUAGE." + geometric figures
           ================================================================ */}
        <div
          style={{
            transform: `scale(${underLayerScale})`,
            willChange: 'transform'
          }}
          className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#F8F9FF] via-[#EEF0FF] to-[#E2E6FF] px-6 py-20 text-[#14112B] sm:px-14"
        >
          {/* Ambient Luminous Orbs behind the cutout */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-[#00D2FF]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-10 top-10 h-96 w-96 rounded-full bg-[#635BFF]/20 blur-3xl"
          />

          {/* Top Editorial Sub-Caption visible inside the zoomed view */}
          <div className="relative z-10 flex items-center justify-between pt-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#635BFF]">
            <span>HP / CSI — WHY PYTHON</span>
            <span className="hidden sm:inline">26 NOVEMBER 2026</span>
          </div>

          {/* Center Monumental Typography seen through the "CSI" Mask */}
          <div className="relative z-10 my-auto max-w-5xl">
            <h2
              className="font-black uppercase leading-[0.88] tracking-[-0.04em] text-[#14112B]"
              style={{
                fontFamily: "'Syne', 'Space Grotesk', sans-serif",
                fontSize: 'clamp(2.8rem, 8.2vw, 7.2rem)'
              }}
            >
              PYTHON
              <br />
              ISN&apos;T JUST
              <br />A{' '}
              <span
                className="font-serif italic font-normal lowercase tracking-normal text-[#635BFF]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                first
              </span>
              <br />
              LANGUAGE.
            </h2>
          </div>

          {/* Bottom Caption + Ascending Geometric Staircase Figures (matching reference) */}
          <div className="relative z-10 flex items-end justify-between gap-6">
            <p className="max-w-xs font-mono text-[11px] font-bold uppercase leading-relaxed tracking-wider text-[#322D5E] sm:text-xs">
              THE ONE YOU START WITH — THE ONE YOU NEVER HAVE TO OUTGROW.
            </p>

            {/* Ascending Geometric Staircase Bars & Node Figures */}
            <div
              aria-hidden="true"
              className="flex items-end gap-2.5 sm:gap-4"
            >
              <div className="h-12 w-7 rounded-t-lg bg-[#00D2FF] shadow-md sm:h-20 sm:w-12" />
              <div className="h-20 w-7 rounded-t-lg bg-[#3B82F6] shadow-md sm:h-32 sm:w-12" />
              <div className="h-28 w-7 rounded-t-lg bg-[#635BFF] shadow-md sm:h-44 sm:w-12" />
              <div className="relative h-36 w-7 rounded-t-lg bg-[#14112B] shadow-lg sm:h-56 sm:w-12">
                <span className="absolute -top-4 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#D946EF]" />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            LAYER 2 (FOREGROUND KNOCKOUT MASK):
            Deep Cosmic Indigo (#14112B) overlay with transparent SVG cutout
            for "CSI" + bold "PYTHON" lockup & geometric accent block.
           ================================================================ */}
        {!reducedMotion && (
          <div
            style={{
              transform: `scale(${portalScale})`,
              transformOrigin: '52% 49%',
              willChange: 'transform',
              pointerEvents: progress > 0.65 ? 'none' : 'auto'
            }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 1440 900"
              preserveAspectRatio="xMidYMid slice"
              className="h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <mask id="csi-portal-cutout">
                  {/* White area = visible dark cosmic foreground; Black text = transparent hole */}
                  <rect width="1440" height="900" fill="white" />
                  <text
                    x="720"
                    y="555"
                    textAnchor="middle"
                    fill="black"
                    fontFamily="'Syne', 'Arial Black', sans-serif"
                    fontWeight="900"
                    fontSize="430"
                    letterSpacing="-18"
                  >
                    CSI
                  </text>
                </mask>
              </defs>

              {/* Dark Cosmic Indigo Mask Wall */}
              <rect
                width="1440"
                height="900"
                fill="#14112B"
                mask="url(#csi-portal-cutout)"
              />

              {/* Subtle Glowing Outline around the CSI Cutout */}
              <text
                x="720"
                y="555"
                textAnchor="middle"
                fill="none"
                stroke="rgba(99, 91, 255, 0.55)"
                strokeWidth="3"
                fontFamily="'Syne', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="430"
                letterSpacing="-18"
              >
                CSI
              </text>

              {/* Geometric Accent Figures inside the Mask Lockup (matching reference) */}
              <rect x="1038" y="478" width="44" height="76" rx="6" fill="#00D2FF" />
              <circle cx="385" cy="240" r="10" fill="#D946EF" />
              <circle cx="1095" cy="220" r="16" fill="none" stroke="#00D2FF" strokeWidth="3" />

              {/* Bold "PYTHON" Overlapping Lockup below the 'I' */}
              <text
                x="965"
                y="625"
                textAnchor="middle"
                fill="#F8F9FF"
                fontFamily="'Syne', 'Arial Black', sans-serif"
                fontWeight="900"
                fontSize="74"
                letterSpacing="2"
              >
                PYTHON
              </text>
            </svg>
          </div>
        )}

        {/* ================================================================
            LAYER 3 (FOREGROUND HUD CHROME):
            Fades cleanly as the user starts scrolling into the CSI portal.
           ================================================================ */}
        <div
          style={{ opacity: chromeOpacity }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between px-5 py-6 sm:px-10 sm:py-8"
        >
          {/* Top Spacer below Fixed Header */}
          <div className="flex items-center justify-between pt-14 font-mono text-[11px] uppercase tracking-[0.22em] text-[#C7C5F4]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#1E1942]/80 px-3.5 py-1 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#00D2FF]" />
              <span>HELLO PYTHON // FIRST-YEAR SEMINAR</span>
            </span>
            <button
              type="button"
              onClick={() => onNavigateSection('register')}
              className="pointer-events-auto rounded-full bg-gradient-to-r from-[#00D2FF] via-[#635BFF] to-[#D946EF] px-4 py-1.5 font-bold text-white shadow-lg transition hover:scale-105"
            >
              REGISTER &rarr;
            </button>
          </div>

          {/* Bottom Editorial Bar matching reference layout */}
          <div className="flex items-end justify-between border-t border-white/15 pt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#C7C5F4]">
            <span className="font-bold text-white">{EVENT_CONFIG.dateDisplay}</span>
            <span className="hidden text-center text-[#E8E7FF] sm:inline">
              {EVENT_CONFIG.hostFull}
            </span>
            <button
              type="button"
              onClick={() => onNavigateSection('manifesto')}
              className="pointer-events-auto flex items-center gap-2 font-bold text-[#00D2FF] hover:text-white"
            >
              <span>SCROLL</span>
              <span className="inline-block h-5 w-[2px] bg-gradient-to-b from-[#00D2FF] to-[#D946EF]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ============================================================================
 * SECTION B: EDITORIAL EVENT INTRODUCTION ("MORE THAN SYNTAX")
 * Crisp luminous studio white (#F8F9FF) with floating elevated cards,
 * bespoke Python × CSI Orbital Illustration, and vibrant iris/cyan gradients.
 * ============================================================================
 */
function EditorialIntroduction({ onNavigateSection }) {
  const pillars = [
    {
      num: '01',
      title: 'Automation & Scripting',
      desc: 'Eliminate repetitive manual tasks and build command-line utilities that work for you.',
      accent: 'from-[#00D2FF] to-[#3B82F6]',
      badgeColor: 'bg-[#00D2FF]/15 text-[#0284C7]'
    },
    {
      num: '02',
      title: 'Data Science & Analytics',
      desc: 'Transform raw datasets into visual insight using Python’s scientific ecosystem.',
      accent: 'from-[#635BFF] to-[#8B5CF6]',
      badgeColor: 'bg-[#635BFF]/15 text-[#4F46E5]'
    },
    {
      num: '03',
      title: 'AI & Machine Learning',
      desc: 'Understand the language powering modern neural networks, computer vision, and LLMs.',
      accent: 'from-[#D946EF] to-[#9333EA]',
      badgeColor: 'bg-[#D946EF]/15 text-[#C026D3]'
    },
    {
      num: '04',
      title: 'Web & Backend Systems',
      desc: 'Architect fast APIs, microservices, and full-stack applications built for scale.',
      accent: 'from-[#38BDF8] to-[#635BFF]',
      badgeColor: 'bg-[#38BDF8]/15 text-[#0369A1]'
    }
  ];

  return (
    <section
      id="manifesto"
      className="relative overflow-hidden bg-[#F8F9FF] px-5 py-20 text-[#14112B] sm:px-10 md:py-28"
    >
      {/* Subtle Pastel Aura Blobs in Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full bg-[#635BFF]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-16 h-96 w-96 rounded-full bg-[#00D2FF]/15 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Eyebrow */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#14112B]/10 pb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#635BFF]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#635BFF]">
            [ 01 // THE MANIFESTO ]
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#4E4885]">
            DESIGNED FOR FIRST-YEAR STUDENTS
          </span>
        </div>

        {/* Asymmetric Editorial Grid + Bespoke Python × CSI Orbital Illustration */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2
              className="font-black uppercase leading-[0.94] tracking-[-0.035em] text-[#14112B]"
              style={{
                fontFamily: "'Syne', 'Space Grotesk', sans-serif",
                fontSize: 'clamp(2.4rem, 5.2vw, 4.5rem)'
              }}
            >
              PYTHON IS MORE THAN A{' '}
              <span className="bg-gradient-to-r from-[#635BFF] via-[#00A3FF] to-[#D946EF] bg-clip-text text-transparent">
                FIRST LANGUAGE.
              </span>
            </h2>

            <p className="mt-6 text-lg font-medium leading-relaxed text-[#322D5E] sm:text-xl">
              Most students meet Python as an introductory syntax exercise.{' '}
              <span className="rounded-lg bg-gradient-to-r from-[#635BFF] to-[#D946EF] px-2.5 py-0.5 font-bold text-white shadow-sm">
                Hello Python
              </span>{' '}
              reframes that very first step—showing how the exact same language scales from simple
              loops on day one to artificial intelligence, automation, data science, and production
              software engineering.
            </p>

            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-[#635BFF]/20 bg-white p-4 shadow-[0_12px_32px_rgba(99,91,255,0.08)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D2FF] to-[#635BFF] text-white">
                <Orbit className="h-5 w-5" />
              </div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2A2559]">
                NO PRIOR CODING EXPERIENCE REQUIRED. BRING CURIOSITY; LEAVE WITH DIRECTION.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <CsiPythonOrbitalIllustration />
          </div>
        </div>

        {/* 4-Column Vibrant Studio Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((item) => (
            <div
              key={item.num}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#635BFF]/15 bg-white p-7 shadow-[0_16px_40px_rgba(99,91,255,0.09)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(99,91,255,0.2)]"
            >
              {/* Top Gradient Accent Bar */}
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.accent}`} />

              <div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className={`rounded-full px-3 py-1 font-bold ${item.badgeColor}`}>
                    /{item.num}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F3FF] text-[#635BFF] transition-colors group-hover:bg-[#635BFF] group-hover:text-white">
                    <Code2 className="h-4 w-4" />
                  </div>
                </div>
                <h3
                  className="mt-6 text-xl font-extrabold uppercase tracking-tight text-[#14112B]"
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                >
                  {item.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#4A447A]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick CTA strip */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#635BFF]/15 bg-white/80 px-6 py-4 backdrop-blur-sm">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#4E4885]">
            CURATED BY CSI – COMPUTER SOCIETY OF INDIA
          </p>
          <button
            type="button"
            onClick={() => onNavigateSection('journey')}
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#635BFF] transition hover:text-[#D946EF]"
          >
            <span>INSPECT THE 4-STAGE LEARNING ROADMAP</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * ============================================================================
 * SECTION C: INTERACTIVE 4-LEVEL LEARNING JOURNEY
 * Vibrant cosmic indigo console with interactive "Run Snippet" code simulator.
 * ============================================================================
 */
function LearningJourneySection() {
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [showTerminalOutput, setShowTerminalOutput] = useState(true);
  const activeLevel = LEARNING_LEVELS[activeLevelIndex];

  const handleSelectLevel = (idx) => {
    setActiveLevelIndex(idx);
    setShowTerminalOutput(true);
  };

  const handleRunSnippet = () => {
    setIsRunningCode(true);
    setShowTerminalOutput(false);
    setTimeout(() => {
      setIsRunningCode(false);
      setShowTerminalOutput(true);
    }, 380);
  };

  return (
    <section
      id="journey"
      className="relative overflow-hidden bg-[#14112B] px-5 py-20 text-white sm:px-10 md:py-28"
    >
      {/* Ambient Radial Highlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[#635BFF]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#00D2FF]/15 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header & Honest One-Day Seminar Scope Callout */}
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00D2FF]/40 bg-[#00D2FF]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#00D2FF]">
              [ 02 // THE LEARNING JOURNEY ]
            </span>
            <h2
              className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.035em]"
              style={{
                fontFamily: "'Syne', 'Space Grotesk', sans-serif",
                fontSize: 'clamp(2.2rem, 5vw, 4.2rem)'
              }}
            >
              FOUR STAGES OF{' '}
              <span className="bg-gradient-to-r from-[#00D2FF] via-[#818CF8] to-[#D946EF] bg-clip-text text-transparent">
                EVOLUTION.
              </span>
            </h2>
          </div>

          <div className="max-w-md rounded-2xl border border-[#635BFF]/40 bg-[#1E1942]/90 p-5 shadow-[0_12px_32px_rgba(99,91,255,0.2)] backdrop-blur-md">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#00D2FF]">
              SEMINAR ROADMAP NOTE
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#E0DFFF]">
              Hello Python is a focused one-day seminar. We establish core fundamentals hands-on
              and introduce intermediate &amp; advanced horizons so you leave knowing exactly how
              to explore and build further.
            </p>
          </div>
        </div>

        {/* Interactive Level Selector Tabs */}
        <div
          role="tablist"
          aria-label="Learning Journey Levels"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {LEARNING_LEVELS.map((lvl, idx) => {
            const isSelected = idx === activeLevelIndex;
            return (
              <button
                key={lvl.id}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => handleSelectLevel(idx)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                  isSelected
                    ? `border-white/50 bg-gradient-to-br ${lvl.gradient} text-white shadow-[0_16px_40px_rgba(99,91,255,0.4)] -translate-y-1`
                    : 'border-white/15 bg-[#1E1942]/80 text-[#E8E7FF] hover:border-[#00D2FF]/60 hover:bg-[#251F52]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold tracking-widest ${
                      isSelected ? 'text-white' : 'text-[#00D2FF]'
                    }`}
                  >
                    {lvl.code}
                  </span>
                  <span
                    className="h-3 w-3 rounded-full shadow-sm"
                    style={{ backgroundColor: isSelected ? '#FFFFFF' : lvl.accent }}
                  />
                </div>
                <h3
                  className="mt-4 text-lg font-extrabold uppercase leading-tight tracking-tight"
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                >
                  {lvl.title}
                </h3>
                <p
                  className={`mt-2 font-mono text-[11px] ${
                    isSelected ? 'text-white/95' : 'text-[#B9B4E4]'
                  }`}
                >
                  {lvl.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Level Deep-Dive Console */}
        <div className="mt-7 grid grid-cols-1 overflow-hidden rounded-3xl border border-white/15 bg-[#1E1942]/90 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md lg:grid-cols-12">
          {/* Left Column: Topics & Conceptual Progression */}
          <div className="flex flex-col justify-between border-b border-white/15 p-6 sm:p-8 lg:col-span-6 lg:border-b-0 lg:border-r">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full bg-gradient-to-r ${activeLevel.gradient} px-3.5 py-1 font-mono text-xs font-bold uppercase text-white shadow-sm`}
                >
                  {activeLevel.code}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#C7C5F4]">
                  STAGE {activeLevelIndex + 1} OF 04
                </span>
              </div>

              <h3
                className="mt-5 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl"
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
              >
                {activeLevel.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#E0DFFF] sm:text-base">
                {activeLevel.summary}
              </p>

              <div className="mt-6">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#00D2FF]">
                  KEY CONCEPTS COVERED &amp; INTRODUCED:
                </p>
                <ul className="mt-4 space-y-2.5">
                  {activeLevel.topics.map((topic, tIdx) => (
                    <li key={topic} className="flex items-start gap-3 text-sm text-white">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-bold text-[#14112B]"
                        style={{ backgroundColor: activeLevel.accent }}
                      >
                        0{tIdx + 1}
                      </span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step Navigation Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-5">
              <button
                type="button"
                disabled={activeLevelIndex === 0}
                onClick={() => handleSelectLevel(Math.max(0, activeLevelIndex - 1))}
                className="font-mono text-xs font-semibold uppercase tracking-wider text-[#C7C5F4] transition hover:text-white disabled:opacity-30"
              >
                &larr; PREV LEVEL
              </button>
              <div className="flex gap-1.5">
                {LEARNING_LEVELS.map((l, idx) => (
                  <button
                    key={l.id}
                    type="button"
                    aria-label={`Jump to ${l.code}`}
                    onClick={() => handleSelectLevel(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeLevelIndex ? 'w-8 bg-[#00D2FF]' : 'w-2 bg-white/25'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={activeLevelIndex === LEARNING_LEVELS.length - 1}
                onClick={() =>
                  handleSelectLevel(Math.min(LEARNING_LEVELS.length - 1, activeLevelIndex + 1))
                }
                className="font-mono text-xs font-bold uppercase tracking-wider text-[#00D2FF] transition hover:text-white disabled:opacity-30"
              >
                NEXT LEVEL &rarr;
              </button>
            </div>
          </div>

          {/* Right Column: Live Syntax Preview & Interactive Terminal Simulator */}
          <div className="flex flex-col justify-between bg-[#0E0C21] p-6 sm:p-8 lg:col-span-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D946EF]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#635BFF]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00D2FF]" />
                  <span className="ml-1 font-mono text-xs font-semibold text-[#E8E7FF]">
                    {activeLevel.filename}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunSnippet}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#00D2FF] to-[#635BFF] px-3 py-1.5 font-mono text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>{isRunningCode ? 'RUNNING...' : 'RUN CODE'}</span>
                  </button>
                  <CopySnippetButton text={activeLevel.snippet} label="COPY" />
                </div>
              </div>

              <pre className="mt-5 overflow-x-auto font-mono text-xs leading-relaxed text-[#E8E7FF] sm:text-[13px]">
                <code>{activeLevel.snippet}</code>
              </pre>
            </div>

            {/* Simulated Interactive Output Console */}
            <div className="mt-6 rounded-2xl border border-[#00D2FF]/30 bg-[#14112B] p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 font-mono text-[10px] uppercase tracking-widest text-[#00D2FF]">
                <span>STDOUT // INTERACTIVE PREVIEW</span>
                <span>PYTHON 3.12</span>
              </div>
              {isRunningCode ? (
                <p className="mt-3 animate-pulse font-mono text-xs text-[#C7C5F4]">
                  Executing {activeLevel.filename}...
                </p>
              ) : showTerminalOutput ? (
                <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-[#7DD3FC]">
                  <code>{activeLevel.simulatedOutput}</code>
                </pre>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ============================================================================
 * SECTION D: EVENT DETAILS & CONFIGURABLE LOGISTICS SPECIFICATION TABLE
 * Clean bright studio surface (#F8F9FF) with elevated white cards.
 * ============================================================================
 */
function EventDetailsSection() {
  return (
    <section
      id="details"
      className="relative overflow-hidden bg-[#F8F9FF] px-5 py-20 text-[#14112B] sm:px-10 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#635BFF]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#635BFF]">
              [ 03 // EVENT SPECIFICATION ]
            </span>
            <h2
              className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.035em]"
              style={{
                fontFamily: "'Syne', 'Space Grotesk', sans-serif",
                fontSize: 'clamp(2.2rem, 5vw, 4.2rem)'
              }}
            >
              SEMINAR{' '}
              <span className="bg-gradient-to-r from-[#635BFF] to-[#00A3FF] bg-clip-text text-transparent">
                BRIEFING.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4 rounded-full border border-[#635BFF]/15 bg-white px-4 py-2 font-mono text-xs shadow-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#14112B]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#635BFF]" /> CONFIRMED
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#58528C]">
              <span className="h-2.5 w-2.5 rounded-full border border-dashed border-[#635BFF] bg-[#D946EF]/20" />{' '}
              TO BE ANNOUNCED
            </span>
          </div>
        </div>

        {/* Elevated Studio Specification Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {EVENT_CONFIG.logistics.map((item) => (
            <div
              key={item.label}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-all sm:flex-row sm:items-center sm:gap-6 ${
                item.confirmed
                  ? 'border-[#635BFF]/15 bg-white shadow-[0_12px_30px_rgba(99,91,255,0.07)]'
                  : 'border-dashed border-[#635BFF]/35 bg-[#F1F0FF]/80'
              }`}
            >
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#58528C]">
                {item.label}
              </span>
              <span
                className={`mt-2 font-mono text-sm font-bold sm:mt-0 sm:text-right ${
                  item.confirmed
                    ? 'text-[#14112B]'
                    : 'rounded-full bg-white px-3 py-1 text-xs text-[#635BFF] shadow-sm'
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * ============================================================================
 * SECTION D2: SEMINAR NOTES & RESOURCES VAULT
 * Dedicated repository section where CSI can upload & publish slides,
 * cheat sheets, and starter code notebooks after the seminar.
 * ============================================================================
 */
function SeminarNotesSection({ notes, onOpenAdminNotes }) {
  return (
    <section
      id="notes"
      className="relative overflow-hidden bg-[#F8F9FF] px-5 pb-20 pt-4 text-[#14112B] sm:px-10 md:pb-28"
    >
      <div className="mx-auto max-w-7xl border-t border-[#635BFF]/15 pt-16">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#D946EF]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#C026D3]">
              [ 03.5 // SEMINAR NOTES &amp; DECKS ]
            </span>
            <h2
              className="mt-4 font-black uppercase leading-[0.95] tracking-[-0.035em]"
              style={{
                fontFamily: "'Syne', 'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 4.5vw, 3.6rem)'
              }}
            >
              SESSION{' '}
              <span className="bg-gradient-to-r from-[#635BFF] via-[#00A3FF] to-[#D946EF] bg-clip-text text-transparent">
                ARCHIVE.
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="max-w-md font-mono text-xs text-[#4E4885]">
              Slides, Python cheat sheets, and starter notebooks will be published right here by the
              CSI team.
            </p>
            <button
              type="button"
              onClick={onOpenAdminNotes}
              className="inline-flex items-center gap-2 rounded-full border border-[#635BFF]/30 bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#635BFF] shadow-sm transition hover:border-[#635BFF] hover:bg-[#635BFF] hover:text-white"
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>UPLOAD NOTES (CSI)</span>
            </button>
          </div>
        </div>

        {/* 4-Card Notes Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {notes.map((note) => {
            const isAvailable = Boolean(note.url && note.url.trim());
            return (
              <div
                key={note.id}
                className={`flex flex-col justify-between rounded-3xl border p-6 transition-all ${
                  isAvailable
                    ? 'border-[#635BFF]/30 bg-white shadow-[0_16px_40px_rgba(99,91,255,0.12)] hover:-translate-y-1'
                    : 'border-dashed border-[#635BFF]/35 bg-white/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] font-bold uppercase tracking-wider">
                    <span className="rounded-full bg-[#635BFF]/10 px-2.5 py-1 text-[#635BFF]">
                      {note.fileType}
                    </span>
                    <span
                      className={
                        isAvailable
                          ? 'text-emerald-600'
                          : 'text-[#6B669E]'
                      }
                    >
                      {isAvailable ? 'READY' : 'COMING SOON'}
                    </span>
                  </div>

                  <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#00A3FF]">
                    {note.moduleTag}
                  </p>
                  <h3
                    className="mt-1.5 text-lg font-extrabold leading-snug text-[#14112B]"
                    style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                  >
                    {note.title}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#4A447A]">
                    {note.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#635BFF]/10 pt-4">
                  {isAvailable ? (
                    <a
                      href={note.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00D2FF] via-[#635BFF] to-[#D946EF] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:opacity-95"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>OPEN / DOWNLOAD</span>
                    </a>
                  ) : (
                    <div className="rounded-xl bg-[#F1F0FF] px-3 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-wider text-[#58528C]">
                      [NOTES PLACEHOLDER — TO BE UPLOADED]
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * ============================================================================
 * SECTION E: BENNETT UNIVERSITY REGISTRATION SECTION
 * Includes a real-time interactive "Live CSI Pass Preview" card that updates
 * dynamically as the student types their credentials.
 * ============================================================================
 */
function RegistrationSection({ customSupabaseConfig, onRegistrationSuccess }) {
  const [fullName, setFullName] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [countryCode, setCountryCode] = useState(EVENT_CONFIG.defaultCountryCode);
  const [phone, setPhone] = useState('');

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRecord, setConfirmedRecord] = useState(null);

  useEffect(() => {
    const { errors } = validateRegistrationPayload({
      fullName,
      collegeEmail,
      phone,
      countryCode
    });
    setFieldErrors(errors);
  }, [fullName, collegeEmail, phone, countryCode]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setTouched({ fullName: true, collegeEmail: true, phone: true });

    const validation = validateRegistrationPayload({
      fullName,
      collegeEmail,
      phone,
      countryCode
    });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await registrationRepository.submitRegistration(
        { fullName, collegeEmail, phone, countryCode },
        customSupabaseConfig
      );
      setConfirmedRecord(saved);
      if (onRegistrationSuccess) onRegistrationSuccess(saved);
    } catch (err) {
      setSubmitError(err?.message || 'Unable to complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    setConfirmedRecord(null);
    setFullName('');
    setCollegeEmail('');
    setPhone('');
    setTouched({});
    setSubmitError('');
  };

  return (
    <section
      id="register"
      className="relative overflow-hidden bg-[#14112B] px-5 py-20 text-white sm:px-10 md:py-28"
    >
      {/* Vibrant Mesh Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-12 h-96 w-96 rounded-full bg-[#D946EF]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-12 h-96 w-96 rounded-full bg-[#00D2FF]/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Pitch + Live Interactive CSI Pass Preview */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D946EF]/40 bg-[#D946EF]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F0ABFC]">
                [ 04 // STUDENT REGISTRATION ]
              </span>
              <h2
                className="mt-4 font-black uppercase leading-[0.94] tracking-[-0.035em] text-white"
                style={{
                  fontFamily: "'Syne', 'Space Grotesk', sans-serif",
                  fontSize: 'clamp(2.3rem, 4.8vw, 4.1rem)'
                }}
              >
                YOUR FIRST STEP INTO{' '}
                <span className="bg-gradient-to-r from-[#00D2FF] via-[#818CF8] to-[#D946EF] bg-clip-text text-transparent">
                  PYTHON
                </span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#E0DFFF] sm:text-lg">
                Start your journey with Python. Register for Hello Python.
              </p>

              {/* Live Dynamic CSI Student Pass Preview Card */}
              <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#00D2FF] via-[#635BFF] to-[#D946EF] p-[2px] shadow-[0_20px_50px_rgba(99,91,255,0.35)]">
                <div className="rounded-[22px] bg-[#191538]/95 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#00D2FF]">
                      LIVE ATTENDEE PASS PREVIEW
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-white">
                      26 NOV 2026
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#B9B4E4]">
                      STUDENT NAME
                    </p>
                    <p
                      className="mt-0.5 truncate text-xl font-extrabold uppercase text-white"
                      style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                    >
                      {fullName.trim() || 'YOUR NAME HERE'}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-3 font-mono text-xs">
                    <div>
                      <p className="text-[10px] uppercase text-[#B9B4E4]">BENNETT ID</p>
                      <p className="mt-0.5 truncate text-[#00D2FF]">
                        {collegeEmail.trim() || 'id@bennett.edu.in'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-[#B9B4E4]">HOST</p>
                      <p className="mt-0.5 text-white">CSI – INDIA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2.5 font-mono text-xs text-[#C7C5F4]">
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#00D2FF]">01/</span>
                <span>Open exclusively to Bennett University students (@bennett.edu.in).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[#D946EF]">02/</span>
                <span>One registration per official college email address.</span>
              </div>
            </div>
          </div>

          {/* Right Form or Confirmed Digital Seminar Pass */}
          <div className="lg:col-span-7">
            {confirmedRecord ? (
              <div
                role="status"
                aria-live="polite"
                className="overflow-hidden rounded-3xl border-2 border-[#00D2FF] bg-[#F8F9FF] p-7 text-[#14112B] shadow-[0_24px_60px_rgba(0,210,255,0.25)] sm:p-10"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#14112B]/15 pb-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#635BFF] to-[#D946EF] px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white">
                    <CheckCircle2 className="h-4 w-4" /> CONFIRMED REGISTRATION
                  </span>
                  <span className="font-mono text-xs font-bold text-[#4E4885]">
                    ID: {confirmedRecord.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <h3
                  className="mt-6 text-3xl font-black uppercase leading-tight tracking-tight text-[#14112B] sm:text-4xl"
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                >
                  You&apos;re in. See you at Hello Python.
                </h3>

                <p className="mt-3 text-sm text-[#322D5E]">
                  Your seat request has been recorded in the CSI – Computer Society of India event
                  registry. Save your pass details below.
                </p>

                {/* Digital Pass Summary */}
                <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#635BFF]/20 bg-white p-5 shadow-sm sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#58528C]">
                      ATTENDEE
                    </p>
                    <p className="mt-1 font-bold text-[#14112B]">{confirmedRecord.full_name}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#58528C]">
                      COLLEGE EMAIL
                    </p>
                    <p className="mt-1 font-mono text-xs font-bold text-[#635BFF]">
                      {confirmedRecord.college_email}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#58528C]">
                      EVENT &amp; DATE
                    </p>
                    <p className="mt-1 font-mono text-xs font-bold text-[#14112B]">
                      HELLO PYTHON // 26 NOV 2026
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#58528C]">
                      HOST
                    </p>
                    <p className="mt-1 font-mono text-xs font-bold text-[#14112B]">
                      CSI – COMPUTER SOCIETY OF INDIA
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <span className="font-mono text-xs text-[#4E4885]">
                    REGISTERED AT: {new Date(confirmedRecord.created_at).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={handleRegisterAnother}
                    className="font-mono text-xs font-bold uppercase tracking-wider text-[#635BFF] underline decoration-[#D946EF] decoration-2 underline-offset-4 hover:text-[#D946EF]"
                  >
                    REGISTER ANOTHER STUDENT
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-3xl border border-white/15 bg-[#1E1942]/90 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-10"
              >
                <div className="mb-6 flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#E0DFFF]">
                    ATTENDEE CREDENTIALS
                  </span>
                  <span className="font-mono text-xs font-bold text-[#00D2FF]">
                    * ALL FIELDS REQUIRED
                  </span>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-400/70 bg-rose-950/50 p-4 text-sm text-rose-200"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
                    <div>
                      <p className="font-mono text-xs font-bold uppercase text-rose-200">
                        REGISTRATION NOT COMPLETED
                      </p>
                      <p className="mt-1">{submitError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* 1. Full Name */}
                  <div>
                    <label
                      htmlFor="reg-full-name"
                      className="block font-mono text-xs font-bold uppercase tracking-wider text-[#E8E7FF]"
                    >
                      01. Full Name <span className="text-[#00D2FF]">*</span>
                    </label>
                    <input
                      id="reg-full-name"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      placeholder="Enter your full name"
                      aria-invalid={Boolean(touched.fullName && fieldErrors.fullName)}
                      aria-describedby={
                        touched.fullName && fieldErrors.fullName ? 'err-full-name' : undefined
                      }
                      className={`mt-2 w-full rounded-xl border bg-[#14112B] px-4 py-3.5 text-sm text-white placeholder-[#6B669E] outline-none transition ${
                        touched.fullName && fieldErrors.fullName
                          ? 'border-rose-400 focus:border-rose-300'
                          : 'border-white/20 focus:border-[#00D2FF]'
                      }`}
                    />
                    {touched.fullName && fieldErrors.fullName && (
                      <p id="err-full-name" className="mt-1.5 font-mono text-xs text-rose-300">
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* 2. Bennett University College Email */}
                  <div>
                    <label
                      htmlFor="reg-college-email"
                      className="block font-mono text-xs font-bold uppercase tracking-wider text-[#E8E7FF]"
                    >
                      02. Bennett University College Email <span className="text-[#00D2FF]">*</span>
                    </label>
                    <input
                      id="reg-college-email"
                      name="collegeEmail"
                      type="email"
                      autoComplete="email"
                      required
                      value={collegeEmail}
                      onChange={(e) => setCollegeEmail(e.target.value)}
                      onBlur={() => handleBlur('collegeEmail')}
                      placeholder={`e.g., ${EVENT_CONFIG.emailExample}`}
                      aria-invalid={Boolean(touched.collegeEmail && fieldErrors.collegeEmail)}
                      aria-describedby="hint-college-email err-college-email"
                      className={`mt-2 w-full rounded-xl border bg-[#14112B] px-4 py-3.5 font-mono text-sm text-white placeholder-[#6B669E] outline-none transition ${
                        touched.collegeEmail && fieldErrors.collegeEmail
                          ? 'border-rose-400 focus:border-rose-300'
                          : 'border-white/20 focus:border-[#00D2FF]'
                      }`}
                    />
                    <p id="hint-college-email" className="mt-1.5 font-mono text-[11px] text-[#B9B4E4]">
                      Must end with <span className="font-bold text-[#00D2FF]">@bennett.edu.in</span>
                    </p>
                    {touched.collegeEmail && fieldErrors.collegeEmail && (
                      <p id="err-college-email" className="mt-1 font-mono text-xs text-rose-300">
                        {fieldErrors.collegeEmail}
                      </p>
                    )}
                  </div>

                  {/* 3. Phone Number */}
                  <div>
                    <label
                      htmlFor="reg-phone"
                      className="block font-mono text-xs font-bold uppercase tracking-wider text-[#E8E7FF]"
                    >
                      03. Mobile Number (India) <span className="text-[#00D2FF]">*</span>
                    </label>
                    <div className="mt-2 flex">
                      <select
                        aria-label="Country code"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="rounded-l-xl border border-r-0 border-white/20 bg-[#0E0C21] px-3.5 py-3.5 font-mono text-sm text-[#E8E7FF] outline-none focus:border-[#00D2FF]"
                      >
                        <option value="+91">+91 (IN)</option>
                      </select>
                      <input
                        id="reg-phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        required
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={() => handleBlur('phone')}
                        placeholder="9876543210"
                        aria-invalid={Boolean(touched.phone && fieldErrors.phone)}
                        aria-describedby={touched.phone && fieldErrors.phone ? 'err-phone' : undefined}
                        className={`w-full rounded-r-xl border bg-[#14112B] px-4 py-3.5 font-mono text-sm text-white placeholder-[#6B669E] outline-none transition ${
                          touched.phone && fieldErrors.phone
                            ? 'border-rose-400 focus:border-rose-300'
                            : 'border-white/20 focus:border-[#00D2FF]'
                        }`}
                      />
                    </div>
                    {touched.phone && fieldErrors.phone && (
                      <p id="err-phone" className="mt-1.5 font-mono text-xs text-rose-300">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#00D2FF] via-[#635BFF] to-[#D946EF] px-6 py-4 font-mono text-sm font-bold uppercase tracking-widest text-white shadow-[0_14px_34px_rgba(99,91,255,0.45)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>SECURING YOUR SEAT...</span>
                      </>
                    ) : (
                      <>
                        <span>COMPLETE REGISTRATION</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ============================================================================
 * PROTECTED CSI ADMIN DASHBOARD
 * Styled in matching twilight indigo (#1A1730) & periwinkle (#7B75B8 / #9B95E8)
 * ============================================================================
 */
function AdminDashboardView({
  onExitAdmin,
  customSupabaseConfig,
  onUpdateSupabaseConfig,
  notes,
  onUpdateNotes,
  initialTab = 'registrations'
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState(initialTab);
  const [registrations, setRegistrations] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [sbUrlInput, setSbUrlInput] = useState(customSupabaseConfig?.url || '');
  const [sbAnonInput, setSbAnonInput] = useState(customSupabaseConfig?.anonKey || '');
  const [sbSavedBanner, setSbSavedBanner] = useState(false);

  // Notes upload / link publisher state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteModule, setNoteModule] = useState('MODULE 01 // FOUNDATIONS');
  const [noteType, setNoteType] = useState('PDF / SLIDES');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteUrl, setNoteUrl] = useState('');
  const [noteSavedMsg, setNoteSavedMsg] = useState('');

  const handlePublishNote = (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteUrl.trim()) return;
    const newEntry = {
      id: `note-${Date.now()}`,
      moduleTag: noteModule,
      title: noteTitle.trim(),
      description:
        noteDesc.trim() || 'Official seminar resource uploaded by CSI – Computer Society of India.',
      fileType: noteType,
      status: 'PUBLISHED',
      url: noteUrl.trim(),
      updatedAt: new Date().toLocaleDateString()
    };
    const filteredPlaceholders = notes.filter((n) => n.status !== 'PLACEHOLDER');
    onUpdateNotes([newEntry, ...filteredPlaceholders]);
    setNoteTitle('');
    setNoteDesc('');
    setNoteUrl('');
    setNoteSavedMsg('Note resource published to the public Session Archive!');
    setTimeout(() => setNoteSavedMsg(''), 3500);
  };

  const handleDeleteNote = (id) => {
    const remaining = notes.filter((n) => n.id !== id);
    onUpdateNotes(remaining.length > 0 ? remaining : DEFAULT_SEMINAR_NOTES);
  };

  const loadRegistrations = async () => {
    setIsLoadingData(true);
    try {
      const data = await registrationRepository.fetchRegistrationsForAdmin(customSupabaseConfig);
      setRegistrations(data);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRegistrations();
    }
  }, [isAuthenticated, customSupabaseConfig]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (
      loginEmail.trim().toLowerCase() === CSI_ADMIN_CREDENTIALS.email &&
      loginPassword === CSI_ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {
        // Ignore
      }
    } else {
      setLoginError('Invalid CSI administrator credentials. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // Ignore
    }
  };

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        reg.full_name.toLowerCase().includes(q) ||
        reg.college_email.toLowerCase().includes(q);

      const matchesDate =
        !dateFilter || new Date(reg.created_at).toISOString().slice(0, 10) === dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [registrations, searchQuery, dateFilter]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'College Email', 'Phone', 'Registered At (ISO)'];
    const rows = filteredRegistrations.map((r) => [
      r.id,
      `"${r.full_name.replace(/"/g, '""')}"`,
      r.college_email,
      `"${r.phone}"`,
      r.created_at
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `hello-python-csi-registrations-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSupabaseConfig = (e) => {
    e.preventDefault();
    onUpdateSupabaseConfig({
      url: sbUrlInput.trim(),
      anonKey: sbAnonInput.trim()
    });
    setSbSavedBanner(true);
    setTimeout(() => setSbSavedBanner(false), 3000);
  };

  // GATE 1: PROTECTED LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A1730] px-5 py-12 text-[#F4F4FC] sm:px-10">
        <div className="mx-auto max-w-md">
          <button
            type="button"
            onClick={onExitAdmin}
            className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#B9B4E4] hover:text-[#9B95E8]"
          >
            &larr; BACK TO HELLO PYTHON EVENT SITE
          </button>

          <div className="border border-[#7B75B8]/60 bg-[#231F3D] p-7 sm:p-9">
            <div className="flex items-center gap-2.5 text-[#9B95E8]">
              <Lock className="h-5 w-5" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]">
                RESTRICTED CSI PORTAL
              </span>
            </div>

            <h1
              className="mt-4 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl"
              style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            >
              CSI ADMIN ACCESS
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-[#C9C5EC]">
              Authorized CSI – Computer Society of India organizers only. Registration records are
              protected by Row Level Security.
            </p>

            <div className="mt-5 border border-dashed border-[#7B75B8] bg-[#1A1730] p-3.5 font-mono text-[11px] text-[#E6E6FA]">
              <div className="flex items-center justify-between">
                <span className="text-[#9B95E8]">PREVIEW ADMIN CREDENTIALS</span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail(CSI_ADMIN_CREDENTIALS.email);
                    setLoginPassword(CSI_ADMIN_CREDENTIALS.password);
                  }}
                  className="text-[10px] underline hover:text-white"
                >
                  AUTO-FILL
                </button>
              </div>
              <p className="mt-1">Email: {CSI_ADMIN_CREDENTIALS.email}</p>
              <p>Pass: {CSI_ADMIN_CREDENTIALS.password}</p>
            </div>

            {loginError && (
              <div
                role="alert"
                className="mt-5 border border-rose-400/60 bg-rose-950/40 p-3 font-mono text-xs text-rose-200"
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block font-mono text-xs uppercase tracking-wider text-[#E6E6FA]"
                >
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="csi.admin@bennett.edu.in"
                  className="mt-1.5 w-full border border-[#4A4578] bg-[#1A1730] px-3.5 py-3 font-mono text-sm text-white outline-none focus:border-[#9B95E8]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-pass"
                  className="block font-mono text-xs uppercase tracking-wider text-[#E6E6FA]"
                >
                  Password
                </label>
                <input
                  id="admin-pass"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-1.5 w-full border border-[#4A4578] bg-[#1A1730] px-3.5 py-3 font-mono text-sm text-white outline-none focus:border-[#9B95E8]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4F6BFF] py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#9B95E8] hover:text-[#1E1B38]"
              >
                AUTHENTICATE SESSION
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // GATE 2: AUTHENTICATED CSI ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#1A1730] text-[#F4F4FC]">
      <header className="border-b border-[#4A4578] bg-[#141126] px-5 py-4 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#7B75B8] px-2 py-0.5 font-mono text-xs font-bold text-[#F4F4FC]">
              CSI ADMIN
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#D8D6F5]">
              CSI – COMPUTER SOCIETY OF INDIA // COMMAND CENTER
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitAdmin}
              className="border border-[#4A4578] px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-[#E6E6FA] hover:border-white hover:text-white"
            >
              PUBLIC SITE
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-rose-600/90 px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-500"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-10">
        <div className="mb-8 flex flex-wrap gap-2 border-b border-[#4A4578] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('registrations')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'registrations'
                ? 'bg-[#E6E6FA] text-[#1E1B38]'
                : 'border border-[#4A4578] bg-[#231F3D] text-[#B9B4E4] hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>REGISTRATIONS ({registrations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'architecture'
                ? 'bg-[#4F6BFF] text-white'
                : 'border border-[#4A4578] bg-[#231F3D] text-[#B9B4E4] hover:text-white'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>SUPABASE SQL, VERCEL API &amp; LAUNCH CHECKLIST</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'notes'
                ? 'bg-[#D946EF] text-white'
                : 'border border-[#4A4578] bg-[#231F3D] text-[#B9B4E4] hover:text-white'
            }`}
          >
            <FileCode className="h-4 w-4" />
            <span>UPLOAD / MANAGE NOTES ({notes.length})</span>
          </button>
        </div>

        {activeTab === 'notes' ? (
          <div className="space-y-8">
            <div className="border border-[#4A4578] bg-[#231F3D] p-6">
              <h2
                className="text-xl font-black uppercase text-white"
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
              >
                PUBLISH SEMINAR NOTES, SLIDES OR GITHUB REPO LINK
              </h2>
              <p className="mt-1.5 text-xs text-[#C9C5EC]">
                Add a Google Drive PDF link, Notion doc, or GitHub repository URL. It immediately
                replaces the placeholder cards in the public Session Archive section.
              </p>

              {noteSavedMsg && (
                <div className="mt-4 border border-emerald-400/50 bg-emerald-950/40 p-3 font-mono text-xs text-emerald-200">
                  {noteSavedMsg}
                </div>
              )}

              <form onSubmit={handlePublishNote} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#B9B4E4]">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g., Hello Python Day-1 Complete Slides"
                    className="mt-1 w-full border border-[#4A4578] bg-[#1A1730] px-3.5 py-2.5 font-mono text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#B9B4E4]">
                    Resource URL (Drive / PDF / GitHub) *
                  </label>
                  <input
                    type="url"
                    required
                    value={noteUrl}
                    onChange={(e) => setNoteUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="mt-1 w-full border border-[#4A4578] bg-[#1A1730] px-3.5 py-2.5 font-mono text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#B9B4E4]">
                    Module Tag
                  </label>
                  <select
                    value={noteModule}
                    onChange={(e) => setNoteModule(e.target.value)}
                    className="mt-1 w-full border border-[#4A4578] bg-[#1A1730] px-3.5 py-2.5 font-mono text-xs text-white"
                  >
                    <option value="MODULE 01 // FOUNDATIONS">MODULE 01 // FOUNDATIONS</option>
                    <option value="MODULE 02 // PROBLEM SOLVING">MODULE 02 // PROBLEM SOLVING</option>
                    <option value="MODULE 03 // REAL-WORLD PYTHON">MODULE 03 // REAL-WORLD PYTHON</option>
                    <option value="MODULE 04 // THE BIG PICTURE">MODULE 04 // THE BIG PICTURE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#B9B4E4]">
                    Format Badge
                  </label>
                  <input
                    type="text"
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    placeholder="PDF / SLIDES"
                    className="mt-1 w-full border border-[#4A4578] bg-[#1A1730] px-3.5 py-2.5 font-mono text-xs text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-[11px] uppercase text-[#B9B4E4]">
                    Short Summary
                  </label>
                  <input
                    type="text"
                    value={noteDesc}
                    onChange={(e) => setNoteDesc(e.target.value)}
                    placeholder="Brief description of what students will find inside..."
                    className="mt-1 w-full border border-[#4A4578] bg-[#1A1730] px-3.5 py-2.5 font-mono text-xs text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-[#D946EF] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90"
                  >
                    PUBLISH TO PUBLIC NOTES ARCHIVE
                  </button>
                </div>
              </form>
            </div>

            <div className="border border-[#4A4578] bg-[#231F3D] p-6">
              <h3 className="font-mono text-sm font-bold uppercase text-[#9B95E8]">
                CURRENT ARCHIVE ITEMS
              </h3>
              <div className="mt-4 divide-y divide-[#4A4578]">
                {notes.map((n) => (
                  <div key={n.id} className="flex flex-wrap items-center justify-between gap-4 py-3.5">
                    <div>
                      <p className="font-mono text-[10px] text-[#00D2FF]">{n.moduleTag}</p>
                      <p className="font-bold text-white">{n.title}</p>
                      <p className="font-mono text-xs text-[#B9B4E4]">
                        {n.url || 'Placeholder (not yet uploaded)'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(n.id)}
                      className="border border-rose-400/50 px-3 py-1.5 font-mono text-xs text-rose-200 hover:bg-rose-950/60"
                    >
                      REMOVE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'registrations' ? (
          <div>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border border-[#4A4578] bg-[#231F3D] p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-[#B9B4E4]">
                  TOTAL REGISTERED STUDENTS
                </p>
                <p
                  className="mt-2 text-4xl font-black text-[#9B95E8]"
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                >
                  {registrations.length}
                </p>
              </div>

              <div className="border border-[#4A4578] bg-[#231F3D] p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-[#B9B4E4]">
                  FILTERED VIEW COUNT
                </p>
                <p
                  className="mt-2 text-4xl font-black text-[#F4F4FC]"
                  style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                >
                  {filteredRegistrations.length}
                </p>
              </div>

              <div className="border border-[#4A4578] bg-[#231F3D] p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-[#B9B4E4]">
                  DATABASE MODE
                </p>
                <p className="mt-3 font-mono text-xs font-bold text-[#60A5FA]">
                  {customSupabaseConfig?.url
                    ? 'CONNECTED: SUPABASE POSTGRESQL'
                    : 'LOCAL PERSISTENT STORAGE (READY FOR SUPABASE)'}
                </p>
              </div>
            </div>

            <div className="mb-6 flex flex-col justify-between gap-4 border border-[#4A4578] bg-[#231F3D] p-4 md:flex-row md:items-center">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#9B95E8]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name or @bennett.edu.in email..."
                    className="w-full border border-[#4A4578] bg-[#1A1730] py-2.5 pl-10 pr-4 font-mono text-xs text-white placeholder-[#6B669E] outline-none focus:border-[#9B95E8]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    aria-label="Filter by registration date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border border-[#4A4578] bg-[#1A1730] px-3 py-2.5 font-mono text-xs text-white outline-none focus:border-[#9B95E8]"
                  />
                  {dateFilter && (
                    <button
                      type="button"
                      onClick={() => setDateFilter('')}
                      className="border border-[#4A4578] px-2.5 py-2.5 font-mono text-xs text-[#B9B4E4] hover:text-white"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={filteredRegistrations.length === 0}
                className="inline-flex items-center justify-center gap-2 bg-[#4F6BFF] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#9B95E8] hover:text-[#1E1B38] disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                <span>EXPORT CSV ({filteredRegistrations.length})</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-[#4A4578] bg-[#231F3D]">
              {isLoadingData ? (
                <div className="p-12 text-center font-mono text-xs text-[#B9B4E4]">
                  LOADING REGISTRATIONS...
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="font-mono text-sm text-[#E6E6FA]">
                    No student registrations match your current view.
                  </p>
                  <p className="mt-2 font-mono text-xs text-[#9B95E8]">
                    Submit a registration on the public Hello Python form to see live records appear
                    here immediately.
                  </p>
                </div>
              ) : (
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#4A4578] bg-[#1A1730] font-mono text-[11px] uppercase tracking-wider text-[#B9B4E4]">
                      <th className="px-5 py-3.5">Full Name</th>
                      <th className="px-5 py-3.5">Bennett Email</th>
                      <th className="px-5 py-3.5">Phone</th>
                      <th className="px-5 py-3.5">Registered Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A4578]/70 text-sm">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-[#2B264A]">
                        <td className="px-5 py-4 font-semibold text-white">{reg.full_name}</td>
                        <td className="px-5 py-4 font-mono text-xs text-[#9B95E8]">
                          {reg.college_email}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-[#E6E6FA]">{reg.phone}</td>
                        <td className="px-5 py-4 font-mono text-xs text-[#B9B4E4]">
                          {new Date(reg.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border border-[#4A4578] bg-[#231F3D] p-6">
              <h2
                className="text-xl font-black uppercase text-white"
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
              >
                01 // CONNECT LIVE SUPABASE POSTGRESQL
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#C9C5EC]">
                Paste your Supabase Project URL and Public Anon Key below to connect this live
                frontend directly to your PostgreSQL database, or configure them via Vercel
                Environment Variables.
              </p>

              <form
                onSubmit={handleSaveSupabaseConfig}
                className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12"
              >
                <div className="md:col-span-5">
                  <label className="block font-mono text-[11px] uppercase text-[#B9B4E4]">
                    SUPABASE_URL
                  </label>
                  <input
                    type="url"
                    value={sbUrlInput}
                    onChange={(e) => setSbUrlInput(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="mt-1 w-full border border-[#4A4578] bg-[#1A1730] px-3 py-2 font-mono text-xs text-white"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block font-mono text-[11px] uppercase text-[#B9B4E4]">
                    SUPABASE_ANON_KEY
                  </label>
                  <input
                    type="text"
                    value={sbAnonInput}
                    onChange={(e) => setSbAnonInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    className="mt-1 w-full border border-[#4A4578] bg-[#1A1730] px-3 py-2 font-mono text-xs text-white"
                  />
                </div>
                <div className="flex items-end md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-[#4F6BFF] py-2.5 font-mono text-xs font-bold uppercase text-white hover:bg-[#9B95E8] hover:text-[#1E1B38]"
                  >
                    SAVE CONFIG
                  </button>
                </div>
              </form>
              {sbSavedBanner && (
                <p className="mt-3 font-mono text-xs text-[#60A5FA]">
                  Supabase connection settings updated.
                </p>
              )}
            </div>

            <div className="border border-[#4A4578] bg-[#231F3D] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2
                    className="text-xl font-black uppercase text-white"
                    style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                  >
                    02 // SUPABASE SQL MIGRATION &amp; RLS POLICIES
                  </h2>
                  <p className="mt-1 text-xs text-[#C9C5EC]">
                    Creates the <code>registrations</code> table with domain regex check, unique
                    email constraint, and strict Row Level Security.
                  </p>
                </div>
                <CopySnippetButton text={SUPABASE_SQL_MIGRATION} label="COPY SQL" />
              </div>
              <pre className="mt-4 max-h-80 overflow-auto border border-[#4A4578] bg-[#141126] p-4 font-mono text-xs text-[#E6E6FA]">
                <code>{SUPABASE_SQL_MIGRATION}</code>
              </pre>
            </div>

            <div className="border border-[#4A4578] bg-[#231F3D] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2
                    className="text-xl font-black uppercase text-white"
                    style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
                  >
                    03 // VERCEL SERVERLESS API ROUTE (api/register.ts)
                  </h2>
                  <p className="mt-1 text-xs text-[#C9C5EC]">
                    Server-side validation and insertion using{' '}
                    <code>SUPABASE_SERVICE_ROLE_KEY</code> so secrets never reach the browser.
                  </p>
                </div>
                <CopySnippetButton text={VERCEL_API_ROUTE_CODE} label="COPY API CODE" />
              </div>
              <pre className="mt-4 max-h-80 overflow-auto border border-[#4A4578] bg-[#141126] p-4 font-mono text-xs text-[#E6E6FA]">
                <code>{VERCEL_API_ROUTE_CODE}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="border border-[#4A4578] bg-[#231F3D] p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm font-bold uppercase text-[#9B95E8]">
                    04 // .ENV.EXAMPLE
                  </h3>
                  <CopySnippetButton text={ENV_EXAMPLE_CODE} label="COPY ENV" />
                </div>
                <pre className="mt-4 overflow-x-auto border border-[#4A4578] bg-[#141126] p-4 font-mono text-xs text-[#E6E6FA]">
                  <code>{ENV_EXAMPLE_CODE}</code>
                </pre>
              </div>

              <div className="border border-[#4A4578] bg-[#231F3D] p-6">
                <h3 className="font-mono text-sm font-bold uppercase text-[#9B95E8]">
                  05 // PRE-LAUNCH VERIFICATION CHECKLIST
                </h3>
                <ul className="mt-4 space-y-2.5 font-mono text-xs text-[#E6E6FA]">
                  <li>[✓] Run SQL migration in Supabase SQL Editor</li>
                  <li>[✓] Verify RLS blocks anonymous SELECT/UPDATE/DELETE</li>
                  <li>[✓] Create CSI Admin users in Supabase Auth -&gt; Users</li>
                  <li>[✓] Test valid @bennett.edu.in registration &amp; duplicate rejection</li>
                  <li>[✓] Reject non-Bennett domains (@gmail.com, etc.)</li>
                  <li>[✓] Verify CSV export &amp; date filter in CSI Admin Dashboard</li>
                  <li>[✓] Confirm venue, timings &amp; speaker placeholders before launch</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * ============================================================================
 * MAIN APPLICATION ROOT
 * ============================================================================
 */
export default function App() {
  const [viewMode, setViewMode] = useState('public'); // 'public' | 'admin'
  const [adminInitialTab, setAdminInitialTab] = useState('registrations');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [customSupabaseConfig, setCustomSupabaseConfig] = useState({
    url: EVENT_CONFIG.supabaseUrl,
    anonKey: EVENT_CONFIG.supabaseAnonKey
  });
  const [seminarNotes, setSeminarNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SEMINAR_NOTES;
    } catch {
      return DEFAULT_SEMINAR_NOTES;
    }
  });

  const handleUpdateNotes = (updated) => {
    setSeminarNotes(updated);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Load Google Fonts (Syne + JetBrains Mono) dynamically & set SEO document title
  useEffect(() => {
    document.title = 'Hello Python | CSI';

    const existingFont = document.getElementById('hello-python-fonts');
    if (!existingFont) {
      const link = document.createElement('link');
      link.id = 'hello-python-fonts';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@700;800&display=swap';
      document.head.appendChild(link);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const navigateToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  if (viewMode === 'admin') {
    return (
      <>
        <FilmGrainOverlay />
        <AdminDashboardView
          onExitAdmin={() => setViewMode('public')}
          customSupabaseConfig={customSupabaseConfig}
          onUpdateSupabaseConfig={setCustomSupabaseConfig}
          notes={seminarNotes}
          onUpdateNotes={handleUpdateNotes}
          initialTab={adminInitialTab}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#14112B] text-white selection:bg-[#635BFF] selection:text-white">
      <FilmGrainOverlay />

      {/* Minimal Floating Studio Navigation */}
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/15 bg-[#14112B]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-10">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              navigateToSection('top');
            }}
            className="flex items-center gap-2.5 font-mono text-xs font-bold tracking-[0.2em] text-white"
          >
            <span className="inline-block rounded-lg bg-gradient-to-r from-[#00D2FF] via-[#635BFF] to-[#D946EF] px-2.5 py-1 text-white shadow-sm">
              CSI
            </span>
            <span>HELLO PYTHON</span>
          </a>

          {/* Desktop Navigation Anchors */}
          <nav aria-label="Primary Navigation" className="hidden items-center gap-7 md:flex">
            {[
              { label: 'MANIFESTO', id: 'manifesto' },
              { label: 'JOURNEY', id: 'journey' },
              { label: 'DETAILS', id: 'details' },
              { label: 'NOTES', id: 'notes' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToSection(item.id)}
                className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#C7C5F4] transition hover:text-[#00D2FF]"
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => navigateToSection('register')}
              className="rounded-full bg-gradient-to-r from-[#00D2FF] via-[#635BFF] to-[#D946EF] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[0_6px_20px_rgba(99,91,255,0.45)] transition hover:scale-105"
            >
              REGISTER
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-lg border border-white/20 p-2 text-[#E8E7FF] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-white/15 bg-[#14112B] px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              {[
                { label: '01 // MANIFESTO', id: 'manifesto' },
                { label: '02 // LEARNING JOURNEY', id: 'journey' },
                { label: '03 // EVENT DETAILS', id: 'details' },
                { label: '04 // SEMINAR NOTES', id: 'notes' },
                { label: '05 // REGISTER NOW', id: 'register' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateToSection(item.id)}
                  className="text-left font-mono text-xs uppercase tracking-widest text-[#E8E7FF] hover:text-[#00D2FF]"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAdminInitialTab('registrations');
                  setViewMode('admin');
                }}
                className="mt-2 border-t border-white/15 pt-3 text-left font-mono text-xs uppercase tracking-widest text-[#00D2FF] hover:text-white"
              >
                CSI ORGANIZER PORTAL &rarr;
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Flow with Smooth Organic Wave Transitions */}
      <main>
        <HeroZoomPortal onNavigateSection={navigateToSection} reducedMotion={reducedMotion} />
        <EditorialIntroduction onNavigateSection={navigateToSection} />
        <OrganicWaveDivider topColor="#F8F9FF" bottomColor="#14112B" />
        <LearningJourneySection />
        <OrganicWaveDivider topColor="#14112B" bottomColor="#F8F9FF" flip />
        <EventDetailsSection />
        <SeminarNotesSection
          notes={seminarNotes}
          onOpenAdminNotes={() => {
            setAdminInitialTab('notes');
            setViewMode('admin');
          }}
        />
        <OrganicWaveDivider topColor="#F8F9FF" bottomColor="#14112B" />
        <RegistrationSection customSupabaseConfig={customSupabaseConfig} />
      </main>

      {/* Editorial Footer with Protected CSI Admin Portal Trigger */}
      <footer className="border-t border-white/15 bg-[#0E0C21] px-5 py-12 text-white sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-gradient-to-r from-[#00D2FF] via-[#635BFF] to-[#D946EF] px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                CSI
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C7C5F4]">
                CSI – COMPUTER SOCIETY OF INDIA
              </span>
            </div>
            <p
              className="mt-4 bg-gradient-to-r from-white via-[#E0DFFF] to-[#00D2FF] bg-clip-text text-3xl font-black uppercase tracking-tight text-transparent sm:text-5xl"
              style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            >
              HELLO PYTHON // 26.11.2026
            </p>
            <p className="mt-2 font-mono text-xs text-[#9B95E8]">
              HOSTED BY CSI – COMPUTER SOCIETY OF INDIA // ONE-DAY SEMINAR FOR FIRST-YEAR STUDENTS
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <button
              type="button"
              onClick={() => {
                setAdminInitialTab('registrations');
                setViewMode('admin');
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#1E1942] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[#E8E7FF] transition hover:border-[#00D2FF] hover:text-white"
            >
              <Shield className="h-3.5 w-3.5 text-[#00D2FF]" />
              <span>CSI ADMIN PORTAL</span>
            </button>
            <p className="font-mono text-[11px] text-[#7B75B8]">
              &copy; 2026 CSI – Computer Society of India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
