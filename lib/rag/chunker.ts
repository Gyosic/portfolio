import fs from "fs";
import path from "path";
import { extractText } from "unpdf";
import type { PersonalType } from "@/config";

export interface Chunk {
  content: string;
  source_type: string;
  source_id?: string;
  metadata?: Record<string, unknown>;
}

// --- Project ---
interface ProjectRow {
  _id: string;
  title: string;
  description?: string | null;
  skills?: string[] | null;
  role?: string | null;
  link?: string | null;
  repo?: string | null;
  start?: string | null;
  end?: string | null;
}

export function chunkProject(p: ProjectRow): Chunk {
  const parts: string[] = [`프로젝트: ${p.title}.`];
  if (p.description) parts.push(`설명: ${p.description}.`);
  if (p.role) parts.push(`역할: ${p.role}.`);
  if (p.skills?.length) parts.push(`기술스택: ${p.skills.join(", ")}.`);
  if (p.start) parts.push(`기간: ${p.start} ~ ${p.end || "진행중"}.`);
  if (p.link) parts.push(`URL: ${p.link}.`);
  if (p.repo) parts.push(`저장소: ${p.repo}.`);

  return {
    content: parts.join(" "),
    source_type: "project",
    source_id: p._id,
    metadata: { title: p.title },
  };
}

// --- History (Career) ---
interface HistoryRow {
  _id: string;
  company: string;
  role: string;
  position: string;
  department: string;
  status?: string | null;
  description?: string | null;
  start: string;
  end?: string | null;
}

export function chunkHistory(h: HistoryRow): Chunk {
  const parts: string[] = [
    `경력: ${h.company}에서 ${h.role} (${h.position}).`,
    `부서: ${h.department}.`,
  ];
  if (h.status) parts.push(`고용형태: ${h.status}.`);
  if (h.description) parts.push(`업무내용: ${h.description}.`);
  parts.push(`기간: ${h.start} ~ ${h.end || "재직중"}.`);

  return {
    content: parts.join(" "),
    source_type: "history",
    source_id: h._id,
    metadata: { company: h.company },
  };
}

// --- Education ---
interface EducationRow {
  _id: string;
  institution: string;
  degree?: string | null;
  major?: string | null;
  location?: string | null;
  status?: string | null;
  description?: string | null;
  start?: string | null;
  end?: string | null;
}

export function chunkEducation(e: EducationRow): Chunk {
  const parts: string[] = [`학력: ${e.institution}.`];
  if (e.degree) parts.push(`학위: ${e.degree}.`);
  if (e.major) parts.push(`전공: ${e.major}.`);
  if (e.status) parts.push(`상태: ${e.status}.`);
  if (e.location) parts.push(`위치: ${e.location}.`);
  if (e.description) parts.push(`설명: ${e.description}.`);
  if (e.start) parts.push(`기간: ${e.start} ~ ${e.end || "현재"}.`);

  return {
    content: parts.join(" "),
    source_type: "education",
    source_id: e._id,
    metadata: { institution: e.institution },
  };
}

// --- Achievement ---
interface AchievementRow {
  _id: string;
  title: string;
  date: string;
  type?: string | null;
  description?: string | null;
}

export function chunkAchievement(a: AchievementRow): Chunk {
  const parts: string[] = [`활동/수상: ${a.title}.`];
  if (a.type) parts.push(`유형: ${a.type}.`);
  if (a.description) parts.push(`설명: ${a.description}.`);
  parts.push(`날짜: ${a.date}.`);

  return {
    content: parts.join(" "),
    source_type: "achievement",
    source_id: a._id,
    metadata: { title: a.title },
  };
}

// --- Personal (from config) ---
export function chunkPersonal(personal: PersonalType): Chunk[] {
  const chunks: Chunk[] = [];

  // Korean profile
  const koParts: string[] = [];
  if (personal.ko.name) koParts.push(`이름: ${personal.ko.name}.`);
  if (personal.ko.title) koParts.push(`직함: ${personal.ko.title}.`);
  if (personal.ko.location) koParts.push(`위치: ${personal.ko.location}.`);
  if (personal.email) koParts.push(`이메일: ${personal.email}.`);
  if (personal.phone) koParts.push(`전화번호: ${personal.phone}.`);
  if (personal.description) koParts.push(`소개: ${personal.description}.`);
  if (personal.roles?.length) koParts.push(`역할: ${personal.roles.join(", ")}.`);

  if (koParts.length > 0) {
    chunks.push({
      content: `개인정보 (한국어). ${koParts.join(" ")}`,
      source_type: "personal",
      source_id: "ko",
      metadata: { lang: "ko" },
    });
  }

  // English profile
  const enParts: string[] = [];
  if (personal.en.name) enParts.push(`Name: ${personal.en.name}.`);
  if (personal.en.title) enParts.push(`Title: ${personal.en.title}.`);
  if (personal.en.location) enParts.push(`Location: ${personal.en.location}.`);
  if (personal.email) enParts.push(`Email: ${personal.email}.`);
  if (personal.phone) enParts.push(`Phone: ${personal.phone}.`);
  if (personal.description) enParts.push(`Description: ${personal.description}.`);
  if (personal.roles?.length) enParts.push(`Roles: ${personal.roles.join(", ")}.`);

  if (enParts.length > 0) {
    chunks.push({
      content: `Personal Info (English). ${enParts.join(" ")}`,
      source_type: "personal",
      source_id: "en",
      metadata: { lang: "en" },
    });
  }

  // About
  const aboutParts: string[] = [];
  if (personal.about.nationality) aboutParts.push(`국적: ${personal.about.nationality}.`);
  if (personal.about.gender) aboutParts.push(`성별: ${personal.about.gender}.`);
  if (personal.about.birthday) aboutParts.push(`생년월일: ${personal.about.birthday}.`);
  if (personal.about.bio) aboutParts.push(`자기소개: ${personal.about.bio}.`);
  if (personal.about.hobbies?.length) aboutParts.push(`취미: ${personal.about.hobbies.join(", ")}.`);
  if (personal.about.languages?.length)
    aboutParts.push(`언어: ${personal.about.languages.join(", ")}.`);

  if (aboutParts.length > 0) {
    chunks.push({
      content: `개인 정보 상세. ${aboutParts.join(" ")}`,
      source_type: "personal",
      source_id: "about",
      metadata: { section: "about" },
    });
  }

  // Skills
  const skillParts: string[] = [];
  if (personal.skill.bio) skillParts.push(`스킬 소개: ${personal.skill.bio}.`);
  if (personal.skill.languages?.length)
    skillParts.push(`프로그래밍 언어: ${personal.skill.languages.join(", ")}.`);
  if (personal.skill.frameworks?.length)
    skillParts.push(`프레임워크: ${personal.skill.frameworks.join(", ")}.`);
  if (personal.skill.tools?.length)
    skillParts.push(`도구: ${personal.skill.tools.join(", ")}.`);
  if (personal.skill.os?.length)
    skillParts.push(`운영체제: ${personal.skill.os.join(", ")}.`);

  if (skillParts.length > 0) {
    chunks.push({
      content: `기술 스택. ${skillParts.join(" ")}`,
      source_type: "personal",
      source_id: "skill",
      metadata: { section: "skill" },
    });
  }

  // Social
  const socialEntries = Object.entries(personal.social).filter(([, v]) => v);
  if (socialEntries.length > 0) {
    const socialParts = socialEntries.map(([k, v]) => `${k}: ${v}`);
    chunks.push({
      content: `소셜 링크. ${socialParts.join(". ")}.`,
      source_type: "personal",
      source_id: "social",
      metadata: { section: "social" },
    });
  }

  return chunks;
}

// --- PDF ---
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

function splitTextToChunks(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];

  for (let i = 0; i < cleaned.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
    chunks.push(cleaned.slice(i, i + CHUNK_SIZE));
    if (i + CHUNK_SIZE >= cleaned.length) break;
  }

  return chunks;
}

// --- Markdown ---
export function chunkMarkdown(filePath: string): Chunk[] {
  const absolutePath = path.resolve(filePath);
  const content = fs.readFileSync(absolutePath, "utf-8").replace(/\x00/g, "");
  const fileName = path.basename(filePath);

  const textChunks = splitTextToChunks(content);

  return textChunks.map((text, i) => ({
    content: text,
    source_type: "markdown",
    source_id: `${fileName}:${i}`,
    metadata: { fileName, chunk: i + 1, totalChunks: textChunks.length },
  }));
}

// --- PDF ---
export async function chunkPdf(filePath: string): Promise<Chunk[]> {
  const absolutePath = path.resolve(filePath);
  const buffer = fs.readFileSync(absolutePath);
  const { text } = await extractText(new Uint8Array(buffer));
  const rawText = Array.isArray(text) ? text.join("\n") : String(text);
  const fullText = rawText.replace(/\x00/g, "");
  const fileName = path.basename(filePath);

  const textChunks = splitTextToChunks(fullText);

  return textChunks.map((text, i) => ({
    content: text,
    source_type: "pdf",
    source_id: `${fileName}:${i}`,
    metadata: { fileName, page: i + 1, totalChunks: textChunks.length },
  }));
}
