import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaExclamationCircle, FaProjectDiagram, FaMoneyBillWave, FaUsers,
  FaArrowRight, FaBars, FaTimes,
  FaLock, FaEnvelope, FaGithub, FaLinkedin,
  FaChevronRight
} from 'react-icons/fa';
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiJsonwebtokens, SiRedis } from 'react-icons/si';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

/* ─── design tokens ─────────────────────────────────────────────────── */
const C = {
  navy:     '#0f172a',
  navyMid:  '#1e3a8a',
  blue:     '#2563eb',
  blueMid:  '#1d4ed8',
  emerald:  '#10b981',
  emeraldD: '#059669',
  slate:    '#94a3b8',
  slateD:   '#64748b',
  white:    '#ffffff',
  offWhite: '#f8fafc',
  border:   'rgba(255,255,255,0.1)',
  glass:    'rgba(255,255,255,0.06)',
};

/* ─── hooks ─────────────────────────────────────────────────────────── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const useCounter = (target, duration = 1800, active = false) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
};

/* ─── chart data ────────────────────────────────────────────────────── */
const chartData = [
  { name: 'Water',       count: 34, fill: '#3b82f6' },
  { name: 'Roads',       count: 28, fill: '#8b5cf6' },
  { name: 'Electricity', count: 19, fill: '#f59e0b' },
  { name: 'Sanitation',  count: 14, fill: '#10b981' },
  { name: 'Other',       count: 9,  fill: '#f43f5e' },
];

const recentActivity = [
  { color: '#10b981', status: 'Resolved', text: 'Water supply issue — Ward 4',    time: '2m ago' },
  { color: '#f59e0b', status: 'In Progress', text: 'Road repair — Main Street',   time: '18m ago' },
  { color: '#3b82f6', status: 'Pending',  text: 'Street light outage — Block B',  time: '1h ago' },
];

/* ─── Recharts custom tooltip ───────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 14px' }}>
      <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{payload[0].value} complaints</p>
    </div>
  );
};

/* ─── StatCounter ───────────────────────────────────────────────────── */
const StatCounter = ({ value, suffix, label, active }) => {
  const count = useCounter(value, 1800, active);
  return (
    <div style={{ textAlign: 'center', color: C.white }}>
      <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px' }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 13, color: '#bfdbfe', marginTop: 6, fontWeight: 500 }}>{label}</div>
    </div>
  );
};

/* ─── FeatureCard ───────────────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, iconBg, title, desc, delay }) => {
  const [ref, inView] = useInView(0.1);
  const [hov, setHov] = useState(false);
  return (
    <article
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' : C.white,
        borderRadius: 16,
        padding: '28px 24px',
        border: `1.5px solid ${hov ? 'transparent' : '#e2e8f0'}`,
        boxShadow: hov ? '0 16px 40px rgba(37,99,235,0.18)' : '0 2px 12px rgba(0,0,0,0.05)',
        transform: inView ? (hov ? 'translateY(-5px)' : 'translateY(0)') : 'translateY(28px)',
        opacity: inView ? 1 : 0,
        transition: `all 0.45s ease ${delay}s`,
        cursor: 'default',
      }}
      aria-label={title}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 13, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: hov ? 'rgba(255,255,255,0.15)' : iconBg, marginBottom: 18,
        transition: 'background 0.3s',
      }}>
        <Icon size={22} color={hov ? C.white : C.white} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: hov ? C.white : '#111827', marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 14, color: hov ? '#bfdbfe' : '#6b7280', lineHeight: 1.7 }}>{desc}</p>
    </article>
  );
};

/* ─── StepCard ──────────────────────────────────────────────────────── */
const StepCard = ({ num, title, desc, delay }) => {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.5s ease ${delay}s`,
        position: 'relative',
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg,#2563eb,#1e40af)',
        color: C.white, fontWeight: 800, fontSize: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
      }}>{num}</div>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{desc}</p>
      </div>
    </div>
  );
};

/* ─── TechBadge ─────────────────────────────────────────────────────── */
const TechBadge = ({ icon: Icon, name, sub, delay }) => {
  const [ref, inView] = useInView(0.1);
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'linear-gradient(135deg,#1e3a8a,#2563eb)' : C.white,
        border: `1.5px solid ${hov ? 'transparent' : '#e2e8f0'}`,
        borderRadius: 12, padding: '18px 14px', textAlign: 'center',
        boxShadow: hov ? '0 8px 24px rgba(37,99,235,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: inView ? (hov ? 'translateY(-3px)' : 'translateY(0)') : 'translateY(20px)',
        opacity: inView ? 1 : 0,
        transition: `all 0.4s ease ${delay}s`,
        cursor: 'default',
      }}
    >
      <Icon size={26} color={hov ? C.white : C.blue} style={{ marginBottom: 8 }} />
      <div style={{ fontSize: 13, fontWeight: 700, color: hov ? C.white : '#111827' }}>{name}</div>
      <div style={{ fontSize: 11, color: hov ? '#bfdbfe' : C.slateD, marginTop: 2 }}>{sub}</div>
    </div>
  );
};

/* ─── Dashboard Preview ─────────────────────────────────────────────── */
const DashboardPreview = () => (
  <div
    role="img"
    aria-label="GramSathi dashboard preview showing complaint statistics and recent activity"
    style={{
      background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(18px)',
      borderRadius: 18, border: '1px solid rgba(255,255,255,0.13)',
      padding: 20, boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
      maxWidth: 520, width: '100%',
    }}
  >
    {/* Browser chrome */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      {['#ef4444','#f59e0b','#22c55e'].map((c,i) => (
        <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
      ))}
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '5px 12px', fontSize: 11, color: '#64748b', marginLeft: 8 }}>
        gramsathi.app/dashboard
      </div>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>GramSathi</div>
    </div>

    {/* Stat cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
      {[
        { label: 'Total Complaints', val: '104', trend: '+8 this week', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '📋' },
        { label: 'Projects Active',  val: '12',  trend: '3 completed',   color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '🏗️' },
        { label: 'Funds Tracked',   val: '₹18L', trend: 'Updated today', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  icon: '💰' },
      ].map((s,i) => (
        <div key={i} style={{ background: s.bg, borderRadius: 11, padding: '12px 10px', border: `1px solid ${s.color}28` }}>
          <div style={{ fontSize: 16, marginBottom: 5 }}>{s.icon}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 3, lineHeight: 1.3 }}>{s.label}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.val}</div>
          <div style={{ fontSize: 10, color: s.color, marginTop: 4, fontWeight: 600 }}>{s.trend}</div>
        </div>
      ))}
    </div>

    {/* Bar chart via Recharts */}
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 11, padding: '14px 10px', marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 10, letterSpacing: 0.4 }}>
        COMPLAINTS BY CATEGORY
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={chartData} barSize={20} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Recent activity */}
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 11, padding: 14 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 10, letterSpacing: 0.4 }}>
        RECENT ACTIVITY
      </div>
      {recentActivity.map((a,i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0',
          borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.text}</div>
            <div style={{ fontSize: 10, color: a.color, fontWeight: 600, marginTop: 1 }}>{a.status}</div>
          </div>
          <div style={{ fontSize: 10, color: '#475569', flexShrink: 0 }}>{a.time}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Navbar ─────────────────────────────────────────────────────────── */
const Navbar = ({ menuOpen, setMenuOpen }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setMenuOpen(false);
  }, [setMenuOpen]);

  const navLinks = [
    { id: 'features',     label: 'Features'     },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'tech-stack',   label: 'Tech Stack'   },
    { id: 'about',        label: 'About'        },
  ];

  return (
    <header
      role="banner"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(15,23,42,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

        {/* Logo */}
        <Link
          to="/"
          aria-label="GramSathi Home"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span style={{ fontSize: 28, lineHeight: 1 }}>🌾</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: '-0.4px', lineHeight: 1.1 }}>GramSathi</div>
            <div style={{ fontSize: 9, color: '#bfdbfe', fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', lineHeight: 1 }}>Village Governance</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" style={{ display: 'flex', gap: 2, alignItems: 'center' }} className="gs-desktop-nav">
          {navLinks.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: 'none', border: 'none', color: '#bfdbfe', cursor: 'pointer',
                padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                transition: 'all 0.2s', letterSpacing: 0.1,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = C.white; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#bfdbfe'; e.currentTarget.style.background = 'none'; }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="gs-desktop-nav">
          <Link to="/login" style={{
            padding: '9px 18px', borderRadius: 9, border: '1.5px solid rgba(255,255,255,0.3)',
            color: C.white, fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent'; }}
          >
            Sign In
          </Link>
          <Link to="/register" style={{
            padding: '9px 20px', borderRadius: 9, background: C.emerald,
            color: C.white, fontWeight: 700, fontSize: 14, textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(16,185,129,0.35)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.emeraldD; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.emerald; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="gs-mobile-btn"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{ background: 'none', border: 'none', color: C.white, fontSize: 22, cursor: 'pointer', padding: 6, display: 'none' }}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px 24px' }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {navLinks.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none',
                color: '#bfdbfe', padding: '12px 0', fontSize: 16, fontWeight: 500, cursor: 'pointer',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {l.label}
            </button>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Link to="/login" style={{ flex: 1, padding: '12px', borderRadius: 9, border: '1.5px solid rgba(255,255,255,0.3)', color: C.white, textAlign: 'center', fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>Sign In</Link>
            <Link to="/register" style={{ flex: 1, padding: '12px', borderRadius: 9, background: C.emerald, color: C.white, textAlign: 'center', fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
};

/* ─── Main Landing ──────────────────────────────────────────────────── */
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIn, setHeroIn] = useState(false);

  // Stats section
  const [statsRef, statsInView] = useInView(0.3);

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const h = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const features = [
    {
      icon: FaExclamationCircle,
      iconBg: 'linear-gradient(135deg,#3b82f6,#2563eb)',
      title: 'Smart Complaint Management',
      desc: 'Submit complaints about water supply, roads, electricity, and sanitation. Track each issue from submission through resolution with real-time status updates.',
    },
    {
      icon: FaProjectDiagram,
      iconBg: 'linear-gradient(135deg,#10b981,#059669)',
      title: 'Development Project Tracking',
      desc: 'View ongoing and completed village infrastructure projects. Follow progress updates, timelines, contractor details, and budget utilization.',
    },
    {
      icon: FaMoneyBillWave,
      iconBg: 'linear-gradient(135deg,#f59e0b,#d97706)',
      title: 'Transparent Fund Management',
      desc: 'Access government fund allocations and expenditures. Visual summaries show how resources are distributed across categories and projects.',
    },
    {
      icon: FaUsers,
      iconBg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
      title: 'Community Participation',
      desc: 'Stay informed about village events, welfare schemes, and important announcements. Participate in community decisions through a shared platform.',
    },
  ];

  const steps = [
    {
      num: '1',
      title: 'Register Securely',
      desc: 'Citizens and village officials sign up through the platform with OTP-based verification. Role-based access ensures the right people see the right information.',
    },
    {
      num: '2',
      title: 'Raise or Review Issues',
      desc: 'Citizens submit complaints with photos and location details. Admins review, assign to workers, and track resolution progress through the management dashboard.',
    },
    {
      num: '3',
      title: 'Track Progress',
      desc: 'Follow the status of your complaints, view project updates, review fund reports, and receive notifications when actions are taken on your submissions.',
    },
  ];

  const techStack = [
    { icon: SiReact,        name: 'React.js',   sub: 'Frontend',   delay: 0 },
    { icon: SiNodedotjs,    name: 'Node.js',    sub: 'Runtime',    delay: 0.05 },
    { icon: SiExpress,      name: 'Express.js', sub: 'API Server', delay: 0.1 },
    { icon: SiMongodb,      name: 'MongoDB',    sub: 'Database',   delay: 0.15 },
    { icon: SiRedis,        name: 'Redis',      sub: 'Caching',    delay: 0.2 },
    { icon: SiJsonwebtokens,name: 'JWT',        sub: 'Auth',       delay: 0.25 },
    { icon: FaLock,         name: 'Bcrypt',     sub: 'Security',   delay: 0.3 },
    { icon: FaEnvelope,     name: 'Brevo API',  sub: 'Email OTP',  delay: 0.35 },
  ];

  return (
    <>
      {/* ── Global styles ───────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .gs-landing * { box-sizing: border-box; }
        .gs-landing { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        @media (prefers-reduced-motion: reduce) {
          .gs-landing * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        @media (max-width: 768px) {
          .gs-desktop-nav { display: none !important; }
          .gs-mobile-btn { display: block !important; }
          .gs-hero-grid { grid-template-columns: 1fr !important; }
          .gs-features-grid { grid-template-columns: 1fr 1fr !important; }
          .gs-steps-grid { grid-template-columns: 1fr !important; }
          .gs-tech-grid { grid-template-columns: repeat(4,1fr) !important; }
          .gs-about-grid { grid-template-columns: 1fr !important; }
          .gs-footer-grid { grid-template-columns: 1fr 1fr !important; }
          .gs-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .gs-hero-text h1 { font-size: 36px !important; }
          .gs-hero-text p { font-size: 16px !important; }
          .gs-section-h2 { font-size: 28px !important; }
        }
        @media (max-width: 480px) {
          .gs-features-grid { grid-template-columns: 1fr !important; }
          .gs-tech-grid { grid-template-columns: repeat(3,1fr) !important; }
          .gs-hero-text h1 { font-size: 30px !important; }
          .gs-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 320px) {
          .gs-tech-grid { grid-template-columns: repeat(2,1fr) !important; }
          .gs-footer-grid { grid-template-columns: 1fr !important; }
        }
        .gs-focus:focus-visible {
          outline: 2px solid #60a5fa;
          outline-offset: 3px;
          border-radius: 6px;
        }
        /* Subtle grid pattern */
        .gs-hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        /* Ambient glow */
        .gs-hero-section::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,179,237,0.4), transparent);
        }
        /* Reduced shimmer for "Villages" gradient text */
        @keyframes gs-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes gs-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes gs-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gs-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .gs-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .gs-btn { transition: all 0.2s; }
      `}</style>

      <div className="gs-landing" style={{ overflowX: 'hidden', background: C.offWhite }}>
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* ══════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════ */}
        <section
          className="gs-hero-section"
          aria-labelledby="hero-heading"
          style={{
            minHeight: '100vh',
            background: `linear-gradient(140deg, #0f172a 0%, #1e2d5a 35%, #1e3a8a 65%, #1d4ed8 100%)`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            paddingTop: 68,
            overflow: 'hidden',
          }}
        >
          {/* Ambient blobs – subtle, no performance impact */}
          <div aria-hidden="true" style={{ position: 'absolute', top: '20%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'gs-float 8s ease-in-out infinite' }} />
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'gs-float 10s ease-in-out infinite reverse' }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 80px', width: '100%', position: 'relative', zIndex: 1 }}>
            <div
              className="gs-hero-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px 48px', alignItems: 'center' }}
            >
              {/* Left — copy */}
              <div
                className="gs-hero-text"
                style={{
                  opacity: heroIn ? 1 : 0,
                  transform: heroIn ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                }}
              >
                {/* Label */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)',
                  borderRadius: 100, padding: '5px 14px', marginBottom: 24,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.emerald, display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 600, letterSpacing: 0.4 }}>Digital India Initiative</span>
                </div>

                <h1
                  id="hero-heading"
                  style={{ fontSize: 50, fontWeight: 900, color: C.white, lineHeight: 1.08, marginBottom: 20, letterSpacing: '-1.5px' }}
                >
                  Empowering{' '}
                  <span style={{
                    backgroundImage: 'linear-gradient(90deg, #34d399 0%, #60a5fa 50%, #a78bfa 100%)',
                    backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% auto',
                    animation: 'gs-shimmer 4s linear infinite',
                  }}>
                    Villages
                  </span>
                  {' '}Through<br />Technology
                </h1>

                <p style={{ fontSize: 17, color: '#93c5fd', lineHeight: 1.72, marginBottom: 32, maxWidth: 480 }}>
                  GramSathi connects citizens and village administration through transparent governance, faster complaint resolution, development project tracking, and better community participation.
                </p>

                {/* Feature chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
                  {['✓ Real-time Tracking', '✓ 4 User Roles', '✓ OTP Verified', '✓ Analytics'].map((chip, i) => (
                    <span key={i} style={{
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 100, padding: '5px 13px', color: '#e0f2fe', fontSize: 13, fontWeight: 500,
                    }}>
                      {chip}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Link
                    to="/register"
                    className="gs-btn gs-focus"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '13px 28px', borderRadius: 10,
                      background: 'linear-gradient(135deg,#10b981,#059669)',
                      color: C.white, fontWeight: 700, fontSize: 15, textDecoration: 'none',
                      boxShadow: '0 6px 20px rgba(16,185,129,0.38)',
                    }}
                  >
                    Get Started Free <FaArrowRight size={13} />
                  </Link>
                  <Link
                    to="/login"
                    className="gs-btn gs-focus"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '13px 24px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
                      border: '1.5px solid rgba(255,255,255,0.2)',
                      color: C.white, fontWeight: 600, fontSize: 15, textDecoration: 'none',
                    }}
                  >
                    Sign In
                  </Link>
                </div>
              </div>

              {/* Right — dashboard preview */}
              <div
                style={{
                  opacity: heroIn ? 1 : 0,
                  transform: heroIn ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.7s ease 0.18s, transform 0.7s ease 0.18s',
                  display: 'flex', justifyContent: 'center',
                  animation: heroIn ? 'gs-float 6s ease-in-out 0.5s infinite' : 'none',
                }}
              >
                <DashboardPreview />
              </div>
            </div>
          </div>

          {/* Wave divider */}
          <div aria-hidden="true" style={{ position: 'absolute', bottom: -2, left: 0, right: 0, lineHeight: 0 }}>
            <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 56 }}>
              <path d="M0,28 C480,56 960,0 1440,28 L1440,56 L0,56 Z" fill="#f8fafc" />
            </svg>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            STATS STRIP
        ══════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Platform statistics"
          ref={statsRef}
          style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#1d4ed8 100%)', padding: '52px 24px' }}
        >
          <div
            className="gs-stats-grid"
            style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}
          >
            <StatCounter value={4}    suffix=" Roles"  label="User Roles Supported" active={statsInView} />
            <StatCounter value={6}    suffix=" Modules" label="Platform Modules"     active={statsInView} />
            <StatCounter value={100}  suffix="% Free"  label="Open to All Villages"  active={statsInView} />
            <StatCounter value={3}    suffix=" Levels"  label="Permission Levels"     active={statsInView} />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════════════════════ */}
        <section id="features" aria-labelledby="features-heading" style={{ padding: '96px 24px', background: C.offWhite }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ display: 'inline-block', background: '#eff6ff', color: C.blue, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, padding: '5px 16px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 14 }}>
                Platform Features
              </span>
              <h2
                id="features-heading"
                className="gs-section-h2"
                style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 14, lineHeight: 1.15 }}
              >
                Everything Your Village Needs
              </h2>
              <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
                A comprehensive platform covering all aspects of village governance and citizen services.
              </p>
            </div>

            <div
              className="gs-features-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}
            >
              {features.map((f, i) => (
                <FeatureCard key={i} {...f} delay={i * 0.07} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════════════════ */}
        <section id="how-it-works" aria-labelledby="hiw-heading" style={{ padding: '96px 24px', background: C.white }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ display: 'inline-block', background: '#f0fdf4', color: C.emeraldD, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, padding: '5px 16px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 14 }}>
                How It Works
              </span>
              <h2
                id="hiw-heading"
                className="gs-section-h2"
                style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 14, lineHeight: 1.15 }}
              >
                From Complaint to Resolution
              </h2>
              <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
                A simple, transparent workflow that keeps citizens and officials aligned.
              </p>
            </div>

            {/* Steps */}
            <div
              className="gs-steps-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40, position: 'relative' }}
            >
              {/* Connector line – desktop only */}
              <div aria-hidden="true" className="gs-desktop-nav" style={{
                position: 'absolute', top: 24, left: 'calc(16.67% + 24px)', right: 'calc(16.67% + 24px)',
                height: 2, background: 'linear-gradient(90deg,#2563eb,#10b981)', borderRadius: 1,
                zIndex: 0,
              }} />
              {steps.map((s, i) => <StepCard key={i} {...s} delay={i * 0.12} />)}
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: 52 }}>
              <Link
                to="/register"
                className="gs-btn gs-focus"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px', borderRadius: 10,
                  background: 'linear-gradient(135deg,#2563eb,#1e40af)',
                  color: C.white, fontWeight: 700, fontSize: 15, textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(37,99,235,0.28)',
                }}
              >
                Create Your Account <FaArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            TECH STACK
        ══════════════════════════════════════════════════════════════ */}
        <section id="tech-stack" aria-labelledby="tech-heading" style={{ padding: '96px 24px', background: C.offWhite }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <span style={{ display: 'inline-block', background: '#fef3c7', color: '#b45309', fontSize: 11, fontWeight: 700, letterSpacing: 1.4, padding: '5px 16px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 14 }}>
                Technology
              </span>
              <h2
                id="tech-heading"
                className="gs-section-h2"
                style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 14, lineHeight: 1.15 }}
              >
                Built with Modern Technologies
              </h2>
              <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
                A production-grade stack designed for reliability and scalability.
              </p>
            </div>

            <div
              className="gs-tech-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 14 }}
            >
              {techStack.map((t, i) => <TechBadge key={i} {...t} />)}
            </div>

            {/* Architecture strip */}
            <div style={{
              marginTop: 48, borderRadius: 16, overflow: 'hidden',
              border: '1.5px solid #e2e8f0', background: '#1e293b',
            }}>
              <div style={{ height: 4, background: 'linear-gradient(90deg,#2563eb,#10b981,#f59e0b)' }} />
              <div style={{ padding: '24px 28px' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>
                  System Architecture
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  {[
                    { label: 'React Frontend', sub: ':3000', icon: '⚛️', c: '#3b82f6' },
                    null,
                    { label: 'Express API', sub: ':5000', icon: '🚀', c: '#10b981' },
                    null,
                    { label: 'MongoDB Atlas', sub: 'Cloud', icon: '🍃', c: '#f59e0b' },
                    null,
                    { label: 'Upstash Redis', sub: 'Cache', icon: '🔴', c: '#ef4444' },
                  ].map((item, i) => item ? (
                    <div key={i} style={{
                      flex: '1 1 100px', background: `${item.c}12`, border: `1.5px solid ${item.c}30`,
                      borderRadius: 10, padding: '14px 10px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{item.sub}</div>
                    </div>
                  ) : (
                    <div key={i} style={{ color: '#374151', textAlign: 'center', flexShrink: 0 }}>
                      <FaChevronRight color="#334155" size={14} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            ABOUT / CTA
        ══════════════════════════════════════════════════════════════ */}
        <section id="about" aria-labelledby="about-heading" style={{ padding: '96px 24px', background: C.white }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div
              className="gs-about-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px 48px', alignItems: 'center' }}
            >
              {/* Left — about text */}
              <div>
                <span style={{ display: 'inline-block', background: '#fdf2f8', color: '#9d174d', fontSize: 11, fontWeight: 700, letterSpacing: 1.4, padding: '5px 16px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 20 }}>
                  About GramSathi
                </span>
                <h2
                  id="about-heading"
                  className="gs-section-h2"
                  style={{ fontSize: 34, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 18, lineHeight: 1.2 }}
                >
                  Built for Digital<br />Village Governance
                </h2>
                <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.78, marginBottom: 18 }}>
                  GramSathi is an open, digital platform that bridges the gap between village administration and citizens. It provides tools for transparent complaint management, project monitoring, fund tracking, and community engagement.
                </p>
                <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.78, marginBottom: 28 }}>
                  Developed as part of a vision aligned with India's digital governance goals, the platform supports multiple user roles — villagers, workers, admins, and super-admins — each with access to the features relevant to their responsibilities.
                </p>

                {/* Developer card */}
                <div style={{ background: '#f8fafc', borderRadius: 14, padding: '20px 22px', border: '1.5px solid #e2e8f0', marginBottom: 24 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 2 }}>Ayush Ranjan</div>
                  <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>Full-Stack Developer</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <a
                      href="mailto:Ayushranjan9531@gmail.com"
                      className="gs-focus"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: '#eff6ff', color: C.blue, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
                    >
                      <FaEnvelope size={12} /> Email
                    </a>
                    <a
                      href="https://www.linkedin.com/in/ayush-ranjan-9135d3/"
                      target="_blank"
                      rel="noreferrer"
                      className="gs-focus"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: '#eff6ff', color: C.blue, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
                    >
                      <FaLinkedin size={12} /> LinkedIn
                    </a>
                    <a
                      href="https://github.com/ayush-ranjan9135"
                      target="_blank"
                      rel="noreferrer"
                      className="gs-focus"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: '#1f2937', color: C.white, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
                    >
                      <FaGithub size={12} /> GitHub
                    </a>
                  </div>
                </div>
              </div>

              {/* Right — CTA card */}
              <div style={{
                background: 'linear-gradient(140deg,#0f172a 0%,#1e3a8a 50%,#2563eb 100%)',
                borderRadius: 22, padding: '44px 36px', color: C.white, textAlign: 'center',
                boxShadow: '0 24px 60px rgba(37,99,235,0.28)',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Decorative circles */}
                <div aria-hidden="true" style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div aria-hidden="true" style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(16,185,129,0.08)' }} />

                <div style={{ fontSize: 52, marginBottom: 18, lineHeight: 1 }}>🌾</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 14, lineHeight: 1.25 }}>
                  Ready to Get Started?
                </h3>
                <p style={{ color: '#93c5fd', fontSize: 15, lineHeight: 1.65, marginBottom: 28 }}>
                  Join your village administration on GramSathi — transparent, efficient, and built for community governance.
                </p>
                <Link
                  to="/register"
                  className="gs-btn gs-focus"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 28px', borderRadius: 10, background: C.emerald,
                    color: C.white, fontWeight: 700, fontSize: 15, textDecoration: 'none',
                    boxShadow: '0 6px 20px rgba(16,185,129,0.38)', marginBottom: 18,
                  }}
                >
                  Create Free Account <FaArrowRight size={13} />
                </Link>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, color: '#bfdbfe', fontSize: 12, flexWrap: 'wrap' }}>
                  <span>✓ No payment required</span>
                  <span>✓ OTP verified</span>
                  <span>✓ Role-based access</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════ */}
        <footer role="contentinfo" style={{ background: '#0f172a', color: '#94a3b8', padding: '56px 24px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div
              className="gs-footer-grid"
              style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px 32px', marginBottom: 44 }}
            >
              {/* Brand */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 24 }}>🌾</span>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9' }}>GramSathi</div>
                    <div style={{ fontSize: 10, color: '#475569', letterSpacing: 1.1, textTransform: 'uppercase' }}>Village Governance</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: '#64748b', maxWidth: 260 }}>
                  A digital platform connecting village administration and citizens through transparent governance and community participation.
                </p>
                <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
                  <a href="https://www.linkedin.com/in/ayush-ranjan-9135d3/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="gs-focus" style={{ width: 34, height: 34, borderRadius: 8, background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none' }}>
                    <FaLinkedin size={14} />
                  </a>
                  <a href="https://github.com/ayush-ranjan9135" target="_blank" rel="noreferrer" aria-label="GitHub" className="gs-focus" style={{ width: 34, height: 34, borderRadius: 8, background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none' }}>
                    <FaGithub size={14} />
                  </a>
                  <a href="mailto:Ayushranjan9531@gmail.com" aria-label="Email" className="gs-focus" style={{ width: 34, height: 34, borderRadius: 8, background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none' }}>
                    <FaEnvelope size={13} />
                  </a>
                </div>
              </div>

              {/* Platform links */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.9 }}>Platform</div>
                {[
                  { label: 'Dashboard',   to: '/dashboard' },
                  { label: 'Complaints',  to: '/complaints' },
                  { label: 'Projects',    to: '/projects' },
                  { label: 'Funds',       to: '/funds' },
                  { label: 'Events',      to: '/events' },
                  { label: 'Schemes',     to: '/schemes' },
                ].map(l => (
                  <div key={l.to} style={{ marginBottom: 9 }}>
                    <Link to={l.to} className="gs-focus" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#93c5fd'}
                      onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                    >{l.label}</Link>
                  </div>
                ))}
              </div>

              {/* User roles */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.9 }}>Roles</div>
                {['Villager','Worker','Admin','Super Admin'].map(r => (
                  <div key={r} style={{ marginBottom: 9 }}>
                    <Link to="/register" className="gs-focus" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#93c5fd'}
                      onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                    >{r}</Link>
                  </div>
                ))}
              </div>

              {/* Account */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.9 }}>Account</div>
                {[
                  { label: 'Sign In',          to: '/login' },
                  { label: 'Register',         to: '/register' },
                  { label: 'Forgot Password',  to: '/forgot-password' },
                  { label: 'Profile',          to: '/profile' },
                ].map(l => (
                  <div key={l.to} style={{ marginBottom: 9 }}>
                    <Link to={l.to} className="gs-focus" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#93c5fd'}
                      onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                    >{l.label}</Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <p style={{ fontSize: 12, color: '#475569' }}>© 2024 GramSathi. Built for the Digital India Initiative.</p>
              <p style={{ fontSize: 12, color: '#475569' }}>
                Developed by{' '}
                <a href="https://github.com/ayush-ranjan9135" target="_blank" rel="noreferrer" className="gs-focus" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>
                  Ayush Ranjan
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
