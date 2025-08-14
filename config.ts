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
  baseurl: apiUrl.origin,
  username: decodeURIComponent(apiUrl.username as string),
  password: decodeURIComponent(apiUrl.password as string),
};

export type ApiType = typeof api;

const opensearchUrl = urlParse((process.env.OS_BASEURL as string) || "https://localhost:9200");
export const opensearch = {
  index: opensearchUrl?.pathname.substring(1),
  node: opensearchUrl?.origin,
  auth: {
    username: decodeURIComponent(opensearchUrl?.username as string),
    password: decodeURIComponent(opensearchUrl?.password as string),
  },
  ssl: { rejectUnauthorized: false },
};

export type OpensearchType = typeof opensearch;

const opensearchAdUrl = urlParse((process.env.AD_BASEURL as string) || "https://localhost:9200");
export const opensearchAd = {
  index: opensearchAdUrl?.pathname.substring(1),
  node: opensearchAdUrl?.origin,
  auth: {
    username: decodeURIComponent(opensearchAdUrl?.username as string),
    password: decodeURIComponent(opensearchAdUrl?.password as string),
  },
  ssl: { rejectUnauthorized: false },
};

export type OpensearchAdType = typeof opensearchAdUrl;

const psqlUrl = urlParse(
  (process.env.PG_BASEURL as string) || "postgresql://localhost:5432/postgres",
);
export const postgresql = {
  host: psqlUrl?.hostname,
  port: Number(psqlUrl?.port),
  user: decodeURIComponent(psqlUrl?.username as string),
  password: decodeURIComponent(psqlUrl?.password as string),
  database: psqlUrl?.pathname.substring(1),
};

export type PostgresqlType = typeof postgresql;

export const mqtt = {
  baseurl: process.env.MQ_BASEURL,
};

export type MqttType = typeof mqtt;

export const personal = {
  title: process.env.PERSONAL_TITLE,
  description: process.env.PERSONAL_DESCRIPTION,
  name: process.env.PERSONAL_NAME,
  email: process.env.PERSONAL_EMAIL,
  phone: process.env.PERSONAL_PHONE,
  location: process.env.PERSONAL_LOCATION,
  about: {
    languages: process.env.PERSONAL_ABOUT_LANGUAGES,
    gender: process.env.PERSONAL_ABOUT_GENDER,
    birthday: process.env.PERSONAL_ABOUT_BIRTHDAY,
    bio: process.env.PERSONAL_ABOUT_BIO,
    hobbies: process.env.PERSONAL_ABOUT_HOBBIES,
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
  skill: {},
};

export const isDev = process.env.NODE_ENV !== "production";
