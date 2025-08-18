import { title } from "process";
import { parse as urlParse } from "@/lib/url";

export const logo = {
  light: process.env.LOGO_LIGHT,
  dark: process.env.LOGO_DARK,
};

export type LogoType = typeof logo;

export const site = {
  name: process.env.SITE_TITLE,
  description: process.env.SITE_DESCRIPTION,
  baseurl: process.env.SITE_BASEURL,
};

export type SiteType = typeof site;

const apiUrl = urlParse((process.env.API_BASEURL as string) || "http://localhost:3000");
export const api = {
  baseurl: apiUrl?.origin || "http://localhost:3000",
  username: apiUrl?.username ? decodeURIComponent(apiUrl.username) : "",
  password: apiUrl?.password ? decodeURIComponent(apiUrl.password) : "",
};

export type ApiType = typeof api;

const opensearchUrl = urlParse((process.env.OS_BASEURL as string) || "https://localhost:9200");
export const opensearch = {
  index: opensearchUrl?.pathname?.substring(1) || "",
  node: opensearchUrl?.origin || "https://localhost:9200",
  auth: {
    username: opensearchUrl?.username ? decodeURIComponent(opensearchUrl.username) : "",
    password: opensearchUrl?.password ? decodeURIComponent(opensearchUrl.password) : "",
  },
  ssl: { rejectUnauthorized: false },
};

export type OpensearchType = typeof opensearch;

const opensearchAdUrl = urlParse((process.env.AD_BASEURL as string) || "https://localhost:9200");
export const opensearchAd = {
  index: opensearchAdUrl?.pathname?.substring(1) || "",
  node: opensearchAdUrl?.origin || "https://localhost:9200",
  auth: {
    username: opensearchAdUrl?.username ? decodeURIComponent(opensearchAdUrl.username) : "",
    password: opensearchAdUrl?.password ? decodeURIComponent(opensearchAdUrl.password) : "",
  },
  ssl: { rejectUnauthorized: false },
};

export type OpensearchAdType = typeof opensearchAdUrl;

const psqlUrl = urlParse(
  (process.env.PG_BASEURL as string) || "postgresql://localhost:5432/postgres",
);
export const postgresql = {
  host: psqlUrl?.hostname || "localhost",
  port: Number(psqlUrl?.port) || 5432,
  user: psqlUrl?.username ? decodeURIComponent(psqlUrl.username) : "postgres",
  password: psqlUrl?.password ? decodeURIComponent(psqlUrl.password) : "",
  database: psqlUrl?.pathname?.substring(1) || "postgres",
};

export type PostgresqlType = typeof postgresql;

export const mqtt = {
  baseurl: process.env.MQ_BASEURL,
};

export type MqttType = typeof mqtt;

export const personal = {
  ko: {
    name: process.env.PERSONAL_NAME,
    location: process.env.PERSONAL_LOCATION,
  },
  en: {
    name: process.env.PERSONAL_EN_NAME,
    location: process.env.PERSONAL_EN_LOCATION,
  },
  title: process.env.PERSONAL_TITLE,
  description: process.env.PERSONAL_DESCRIPTION,
  email: process.env.PERSONAL_EMAIL,
  phone: process.env.PERSONAL_PHONE,
  about: {
    languages: process.env.PERSONAL_ABOUT_LANGUAGES?.split(",") ?? [],
    gender: process.env.PERSONAL_ABOUT_GENDER,
    birthday: process.env.PERSONAL_ABOUT_BIRTHDAY,
    birthtime: process.env.PERSONAL_ABOUT_BIRTHTIME,
    bio: process.env.PERSONAL_ABOUT_BIO,
    hobbies: process.env.PERSONAL_ABOUT_HOBBIES?.split(",") ?? [],
    nationality: process.env.PERSONAL_ABOUT_NATIONALITY,
  },
  social: {
    github: process.env.PERSONAL_SOCIAL_GITHUB,
    twitter: process.env.PERSONAL_SOCIAL_TWITTER,
    instagram: process.env.PERSONAL_SOCIAL_INSTAGRAM,
    youtube: process.env.PERSONAL_SOCIAL_YOUTUBE,
    facebook: process.env.PERSONAL_SOCIAL_FACEBOOK,
    tiktok: process.env.PERSONAL_SOCIAL_TIKTOK,
  },
  skill: {
    languages: process.env.PERSONAL_SKILL_LANGUAGES?.split(",") ?? [],
    frameworks: process.env.PERSONAL_SKILL_FRAMEWORKS?.split(",") ?? [],
    tools: process.env.PERSONAL_SKILL_TOOLS?.split(",") ?? [],
  },
  roles: process.env.PERSONAL_ROLES?.split(",") ?? [],
};
export type PersonalType = typeof personal;

export const isDev = process.env.NODE_ENV !== "production";
