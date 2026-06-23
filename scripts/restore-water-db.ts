import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MYSQL_BIN = "C:\\xampp\\mysql\\bin\\mysql.exe";
const SQL_FILE = path.resolve(
  __dirname,
  "..",
  "data",
  "water-management",
  "water-managment.sql",
);
const DB = "water-managment";
const USER = "root";
const HOST = "127.0.0.1";

function mysql(args, input) {
  const res = spawnSync(MYSQL_BIN, ["-h", HOST, "-u", USER, ...args], {
    input,
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (res.status !== 0) {
    console.error(
      `[restore-water-db] mysql ${args.join(" ")} failed with code ${res.status}`,
    );
    process.exit(res.status ?? 1);
  }
}

// Drop + recreate cleanly so leftover state can't leak between runs.
// Backticks are required: `-managment` looks like a CLI flag otherwise.
mysql([
  "-e",
  `DROP DATABASE IF EXISTS \`${DB}\`; CREATE DATABASE \`${DB}\` CHARACTER SET utf8mb4;`,
]);

// Pipe the dump into the fresh database.
const dump = readFileSync(SQL_FILE, "utf8");
mysql([DB], dump);

console.log(
  `[restore-water-db] OK - database '${DB}' restored from ${SQL_FILE}`,
);
