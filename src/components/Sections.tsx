"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Data types ─────────────────────────────────────────────────── */
// description can be a single string OR an array of bullet points
type Desc = string | string[];

interface WorkItem {
  role: string;
  company: string;
  period: string;
  description: Desc;
}
interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  description: Desc;
}
interface ProjectItem {
  name: string;
  stack: string[];
  description: Desc;
}
interface CertItem {
  name: string;
  issuer: string;
  date: string;
  credential?: string;
}

/* ─── Placeholder data — replace with your real content ─────────── */
const WORK: WorkItem[] = [
  {
    role: "Software Developer Intern",
    company: "Sample Junction",
    period: "Nov 2025 — Present",
    description:[
      "- Built and shipped scalable web applications.",
      "- Led frontend architecture decisions and collaborated cross-functionally with design and backend teams",
      "- Built and maintained selenium(regression testing) and Jmeter scripts for load testing, improving test coverage by 70%",]
  },
  {
    role: "ML Research Fellow",
    company: "Hostalky (connected through Practera) ",
    period: "Jan 2026 — April 2026",
    description:[
      "- Designed and implemented a 4-stage multi-step LLM prompt pipeline (transcript structuring → clinical extraction → note generation → claim validation) to improve clinical note accuracy, achieving a 21.6% overall quality improvement over the single-step baseline",
      , 
      "- Built a 9-agent error mitigation framework targeting hallucination, negation consistency, clinical attribution, medication accuracy, and omission detection, reducing hallucination rate by 69.6%"
      ,
      "- Evaluated the pipeline across SOAP and H&P note formats, measuring citation accuracy, omission-free rate, and hallucination-free rate, with TurnID-based source linking achieving an average validity score of 0.817"
    ]
    },
  {
    role: "Ground Station Developer",
    company: "UW Orbital",
    period: "Jan 2026 — Present",
    description:[
      "- Built a RESTful API backend using Python and FastAPI, implementing endpoints for satellite command management including POST to create commands, GET to retrieve all commands, and DELETE to remove commands by ID with 404 error handling",
      "- Designed and modeled the database layer using SQLModel and SQLite, defining relational data models for satellite commands with foreign key relationships, enum-based status tracking (PENDING, SCHEDULED, ONGOING, CANCELLED, FAILED, COMPLETED), and automated database seeding with mock satellite command data on startup",
      "- Integrated CORS middleware and a custom request logger middleware into the FastAPI application",
    ]
  }
];

const EDUCATION: EducationItem[] = [
  {
    degree: "B.ASC Computer Engineering",
    institution: "University of Waterloo",
    period: "2025 — 2030",
    description: [
      "- Relevant coursework: Data Structures and Algorithms "
    ]
  },
];

const CERTIFICATIONS: CertItem[] = [
  {
    name: "Getting Started with Advanced Computing With NVIDIA C++",
    issuer: "NVIDIA",
    date: "2026",
    credential: "https://learn.nvidia.com/certificates?id=mR0qVfrxTGG2FXZPjZfDtg",
  },
  {
    name: "Deep Learning Specialization",
    issuer: "deeplearning.ai",
    date: "2026",
    credential: "https://learn.deeplearning.ai/certificates/76f4129b-552f-4ff1-acba-28da6cfba101",
  },
  {
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    date: "2026",
    credential: "https://www.credly.com/badges/e8c4098f-9f2f-46d5-b15e-c8390d98a1fa/",
  },
  {
    name: "Microsoft Certified: AI Fundamentals",
    issuer: "Microsoft",
    date: "2026",
    credential: "http://credly.com/badges/75440e3a-43f7-4323-8754-0f867b4a36fb/",
  },
];

const PROJECTS: ProjectItem[] = [
  {
    name: "MiniGPT",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    description:
      "A full-stack web platform with real-time collaboration features, built with Next.js and WebSockets.",
  },
  {
    name: "Project Beta",
    stack: ["Python", "PyTorch", "FastAPI"],
    description:
      "An image classification pipeline using a custom CNN architecture, served via a REST API.",
  },
  {
    name: "Project Gamma",
    stack: ["React", "Three.js", "Node.js"],
    description:
      "An interactive 3D data visualisation tool for exploring high-dimensional datasets in the browser.",
  },
];

/* ─── Scroll-reveal ──────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── The big dark blur panel that wraps an entire section ───────── */
function DarkPanel({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto clamp(48px, 8vh, 96px)",
        /* Dark frosted glass panel */
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        backgroundColor: "rgba(18, 18, 24, 0.62)",
        border: "0.5px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 20,
        padding: "clamp(28px, 5vw, 48px)",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#AFA9EC",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <h2
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(24px, 3.5vw, 40px)",
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      {/* Thin divider under header */}
      <div style={{ height: "0.5px", backgroundColor: "rgba(255,255,255,0.1)" }} />

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {children}
      </div>
    </motion.section>
  );
}

/* ─── Renders a string or bullet list ───────────────────────────── */
function DescBlock({ value }: { value: Desc }) {
  if (Array.isArray(value)) {
    return (
      <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
        {value.map((point, i) => (
          <li
            key={i}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
            }}
          >
            {point}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 14,
        fontWeight: 400,
        color: "rgba(255,255,255,0.6)",
        lineHeight: 1.7,
        margin: 0,
        maxWidth: 600,
      }}
    >
      {value}
    </p>
  );
}

/* ─── Row item inside a panel (work / education) ────────────────── */
function Row({
  title,
  subtitle,
  period,
  description,
  isLast,
  delay,
}: {
  title: string;
  subtitle: string;
  period: string;
  description: Desc;
  isLast: boolean;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        style={{
          padding: "20px 0",
          borderBottom: isLast ? "none" : "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(14px, 1.8vw, 16px)",
                fontWeight: 600,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              {title}
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 400,
                color: "#AFA9EC",
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            {period}
          </span>
        </div>
        <DescBlock value={description} />
      </div>
    </Reveal>
  );
}

/* ─── Project card inside the panel ─────────────────────────────── */
function ProjectRow({
  item,
  isLast,
  delay,
}: {
  item: ProjectItem;
  isLast: boolean;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        style={{
          padding: "20px 0",
          borderBottom: isLast ? "none" : "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(14px, 1.8vw, 16px)",
            fontWeight: 600,
            color: "#FFFFFF",
            margin: "0 0 8px",
          }}
        >
          {item.name}
        </p>

        {/* Stack tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {item.stack.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#AFA9EC",
                backgroundColor: "rgba(127,119,221,0.18)",
                border: "0.5px solid rgba(175,169,236,0.35)",
                borderRadius: 6,
                padding: "2px 8px",
                letterSpacing: "0.02em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <DescBlock value={item.description} />
      </div>
    </Reveal>
  );
}

/* ─── Certification row ──────────────────────────────────────────── */
function CertRow({
  item,
  isLast,
  delay,
}: {
  item: CertItem;
  isLast: boolean;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        style={{
          padding: "18px 0",
          borderBottom: isLast ? "none" : "0.5px solid rgba(255,255,255,0.07)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(14px, 1.8vw, 16px)",
              fontWeight: 600,
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            {item.name}
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: "#AFA9EC",
              margin: 0,
            }}
          >
            {item.issuer}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            {item.date}
          </span>
          {item.credential && (
            <a
              href={item.credential}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#AFA9EC",
                backgroundColor: "rgba(127,119,221,0.18)",
                border: "0.5px solid rgba(175,169,236,0.35)",
                borderRadius: 6,
                padding: "3px 10px",
                textDecoration: "none",
                letterSpacing: "0.03em",
                whiteSpace: "nowrap",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(127,119,221,0.32)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(127,119,221,0.18)")}
            >
              View ↗
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Assembled sections ─────────────────────────────────────────── */
export default function Sections() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        paddingLeft: "clamp(16px, 5vw, 48px)",
        paddingRight: "clamp(16px, 5vw, 48px)",
        paddingTop: "clamp(64px, 12vh, 128px)",
        paddingBottom: 96,
      }}
    >
      {/* Work Experience */}
      <DarkPanel id="about" label="Experience" title="Work Experience">
        {WORK.map((item, i) => (
          <Row
            key={i}
            title={item.role}
            subtitle={item.company}
            period={item.period}
            description={item.description}
            isLast={i === WORK.length - 1}
            delay={i * 0.07}
          />
        ))}
      </DarkPanel>

      {/* Education */}
      <DarkPanel id="education" label="Background" title="Education">
        {EDUCATION.map((item, i) => (
          <Row
            key={i}
            title={item.degree}
            subtitle={item.institution}
            period={item.period}
            description={item.description}
            isLast={i === EDUCATION.length - 1}
            delay={i * 0.07}
          />
        ))}
      </DarkPanel>

      {/* Certifications */}
      <DarkPanel id="certifications" label="Credentials" title="Certifications">
        {CERTIFICATIONS.map((item, i) => (
          <CertRow
            key={i}
            item={item}
            isLast={i === CERTIFICATIONS.length - 1}
            delay={i * 0.07}
          />
        ))}
      </DarkPanel>

      {/* Projects */}
      <DarkPanel id="projects" label="Work" title="Projects">
        {PROJECTS.map((item, i) => (
          <ProjectRow
            key={i}
            item={item}
            isLast={i === PROJECTS.length - 1}
            delay={i * 0.07}
          />
        ))}
      </DarkPanel>
    </div>
  );
}
