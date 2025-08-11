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

const apiUrl = urlParse(process.env.API_BASEURL);
export const api = {
  baseurl: apiUrl.origin,
  username: decodeURIComponent(apiUrl.username as string),
  password: decodeURIComponent(apiUrl.password as string),
};

export type ApiType = typeof api;

const opensearchUrl = urlParse(process.env.OS_BASEURL);
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

const opensearchAdUrl = urlParse(process.env.AD_BASEURL);
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

const psqlUrl = urlParse(process.env.PG_BASEURL);
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

export const isDev = process.env.NODE_ENV !== "production";
