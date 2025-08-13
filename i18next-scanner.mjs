import { statSync, readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Parser } from "i18next-scanner";

const languages = ["en", "ko"];
const parser = new Parser({
  sort: true,
  lngs: languages,
  nsSeparator: false,
  keySeparator: false,
  resource: {
    loadPath: "lib/i18n/languages/{{lng}}/{{ns}}.json",
    savePath: "lib/i18n/languages/{{lng}}/{{ns}}.json",
  },
});
let content = "";

// Parse Translation Function
// i18next.t('key');

const __dirname = dirname(fileURLToPath(import.meta.url));

const components = join(__dirname, "components");
const apps = join(__dirname, "app");
const destination = join(__dirname, "lib/i18n/languages");
if (!existsSync(destination)) mkdirSync(destination, { recursive: true });

const entries = [components, apps];

const customHandler = (key) => parser.set(key, key);

entries.forEach((entry) => {
  readdirSync(entry, { recursive: true }).forEach((pathname) => {
    const filepath = join(entry, pathname);
    if (statSync(filepath).isDirectory()) return;

    content = readFileSync(filepath, "utf-8");
    parser
      .parseFuncFromString(content, customHandler) // pass a custom handler
      .parseFuncFromString(content, { list: ["t"] }) // override `func.list`
      .parseFuncFromString(content, { list: ["t"] }, customHandler)
      .parseFuncFromString(content); // using default options and handler
  });
});

const parsed = parser.get();
for (const lng of languages) {
  const languageDirname = join(destination, lng);
  if (!existsSync(languageDirname)) mkdirSync(languageDirname, { recursive: true });

  for (const [ns, translation] of Object.entries(parsed[lng]))
    writeFileSync(join(languageDirname, `${ns}.json`), JSON.stringify(translation, null, 2));
}
