import Mustache from "mustache";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export async function getTemplate(template_name: string) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const templatePath = path.join(__dirname, `../templates/${template_name}`);
  return await fs.promises.readFile(templatePath, "utf8");
}

export const renderTemplate = (template: string, params: object) => {
  return Mustache.render(template, params);
};
