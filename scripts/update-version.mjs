// update-version.js
import fs from "node:fs";
import path from "node:path";

const __dirname = import.meta.dirname;

const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJsonData = fs.readFileSync(packageJsonPath, "utf8").toString();
const packageJson = JSON.parse(packageJsonData);

const newVersion = packageJson.version;

const envPath = path.resolve(__dirname, "../", ".env");

let envContent = "";
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8");
}

const versionKey = "VITE_APP_VERSION";
const newEntry = `${versionKey}=${newVersion}`;
const regex = new RegExp(`^${versionKey}=.*`, "m");

if (regex.test(envContent)) {
  envContent = envContent.replace(regex, newEntry);
} else {
  const prefix = envContent.length > 0 && !envContent.endsWith("\n") ? "\n" : "";
  envContent += `${prefix}${newEntry}`;
}

fs.writeFileSync(envPath, envContent);

console.log(`✅ Updated .env variable ${versionKey} to ${newVersion}`);
