import { Ollama } from "ollama";
import { loadConfigFromFile } from "./load_config";
import config from "../../config.json";
// const config = loadConfigFromFile();

export const ollama = new Ollama({
  host: config.global.ollamaUrl || "http://localhost:11434",
  headers: {
    timeout: "300",
  },
});
