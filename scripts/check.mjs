#!/usr/bin/env node
// Checks that every agent manifest in this repo agrees with the one shared
// source: the same name, version and server URL, and one valid skill.
// Run: node scripts/check.mjs   (no dependencies; exits 1 on any mismatch)

import { readFileSync, readdirSync } from "node:fs";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const problems = [];
const expect = (ok, message) => ok || problems.push(message);

const mcp = readJson("mcp.json");
const root = readJson("plugin.json");
const claude = readJson(".claude-plugin/plugin.json");
const marketplace = readJson(".claude-plugin/marketplace.json");
const gemini = readJson("gemini-extension.json");

const [serverName, server] = Object.entries(mcp.mcpServers)[0];
const name = root.name;

for (const [file, manifest] of [
	[".claude-plugin/plugin.json", claude],
	["gemini-extension.json", gemini],
]) {
	expect(manifest.name === name, `${file}: name is "${manifest.name}", plugin.json says "${name}"`);
	expect(manifest.version === root.version, `${file}: version ${manifest.version}, plugin.json says ${root.version}`);
	expect(manifest.description === root.description, `${file}: description differs from plugin.json`);
}

// Claude's plugin directory accepts only type "http" for a remote server;
// Agent Plugins' mcp.json requires "streamable-http". Same server, two spellings.
expect(
	claude.mcpServers?.[serverName]?.type === "http" && claude.mcpServers[serverName].url === server.url,
	`.claude-plugin/plugin.json: mcpServers.${serverName} must be { "type": "http", "url": "${server.url}" }`,
);
expect(
	marketplace.plugins.some((p) => p.name === name && p.source === "./"),
	`.claude-plugin/marketplace.json: no "${name}" entry with source "./"`,
);
expect(
	gemini.mcpServers?.[serverName]?.httpUrl === server.url,
	`gemini-extension.json: mcpServers.${serverName}.httpUrl must be ${server.url}`,
);

const skills = readdirSync("skills");
expect(skills.length === 1, `skills/: expected one skill, found ${skills.join(", ")}`);
for (const dir of skills) {
	const text = readFileSync(`skills/${dir}/SKILL.md`, "utf8");
	const front = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
	const field = (key) => front.match(new RegExp(`^${key}: (.+)$`, "m"))?.[1];
	expect(field("name") === dir, `skills/${dir}/SKILL.md: name must be "${dir}"`);
	const description = field("description") ?? "";
	expect(description.length > 0, `skills/${dir}/SKILL.md: description is missing`);
	expect(description.length <= 1024, `skills/${dir}/SKILL.md: description is ${description.length} chars (max 1024)`);
	expect(text.includes(server.url), `skills/${dir}/SKILL.md: does not mention ${server.url}`);
}

if (problems.length) {
	console.error(problems.map((p) => `- ${p}`).join("\n"));
	process.exit(1);
}
console.log(`ok: ${name} ${root.version}, server ${server.url}, skill ${skills[0]}`);
