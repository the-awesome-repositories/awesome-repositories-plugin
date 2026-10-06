# Awesome Repositories

Find the right open-source project without guessing. This plugin lets your
coding agent search [awesome-repositories.com](https://awesome-repositories.com),
a curated directory of open-source GitHub repositories organized by use case,
technology and ecosystem, whenever you ask for a library, a framework, a tool or
an open-source alternative to a product.

It works in Claude Code, Codex, Gemini CLI, Cursor, VS Code, GitHub Copilot CLI
and any agent that reads [Agent Skills](https://agentskills.io) and MCP.

## What you get

- **The Awesome Repositories MCP server**, a remote, read-only server at
  `https://awesome-repositories.com/api/mcp`.
- **The `awesome-repositories` skill**, which tells the agent when to use the
  server ("I need a Python library for…", "an open-source alternative to…")
  and how: find the matching tags, search several ways, check every candidate
  against its stored evidence, and ask you when the request could mean more
  than one thing.

## Install

**Claude Code**

```
/plugin marketplace add the-awesome-repositories/awesome-repositories-plugin
/plugin install awesome-repositories@awesome-repositories
```

**Codex**

```
codex plugin marketplace add the-awesome-repositories/awesome-repositories-plugin
codex plugin add awesome-repositories@awesome-repositories
codex mcp login awesome-repositories
```

**Gemini CLI**

```
gemini extensions install https://github.com/the-awesome-repositories/awesome-repositories-plugin
```

**GitHub Copilot CLI**

```
copilot plugin install the-awesome-repositories/awesome-repositories-plugin
```

**Cursor and VS Code** read this repo as an [Agent Plugin](https://agent-plugins.org):
in Cursor, use *Plugins → Import from Repo*; in VS Code, run *Chat: Install
Plugin From Source* with this repo's URL.

**Any other agent**: install the skill with the [skills CLI](https://skills.sh),
then connect the server with [add-mcp](https://github.com/neondatabase/add-mcp):

```
npx skills add the-awesome-repositories/awesome-repositories-plugin
npx add-mcp https://awesome-repositories.com/api/mcp --name awesome-repositories
```

## Try it

After installing, ask things like:

- "I need a Python library to extract tables from PDFs."
- "Recommend an open-source alternative to Notion I can self-host."
- "Is there a Rust crate for parsing TOML with comments preserved?"

The agent answers with repositories it found and checked in the directory,
each with a link to its page.

## Sign-in

The server uses OAuth 2.1. The first time the agent calls it, your client opens
a browser to sign in; there is nothing to copy or paste. To sign in again later:
`/mcp` in Claude Code, `codex mcp login awesome-repositories` in Codex,
`/mcp auth awesome-repositories` in Gemini CLI.

## What it sends and stores

- The plugin runs no local code. It only connects to
  `https://awesome-repositories.com/api/mcp`.
- It sends that server your search requests (queries, tag paths, repository
  names) and the OAuth token from your sign-in. It reads public repository
  data back; it can't change anything.
- See the [privacy policy](https://awesome-repositories.com/privacy) and
  [terms](https://awesome-repositories.com/terms).

## How this repo is built

One source, thin manifests:

| file | what it is |
|---|---|
| `skills/awesome-repositories/SKILL.md` | the skill, the only copy of its text |
| `mcp.json` | the MCP server, the only copy of its config |
| `plugin.json` | the Agent Plugins manifest (Cursor, VS Code, Copilot, Codex) |
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Claude Code (Codex reads the marketplace too); repeats the URL, because Claude's plugin directory requires `type: "http"` where `mcp.json` must say `streamable-http` |
| `gemini-extension.json` | Gemini CLI, which cannot point at `mcp.json`, so it repeats the URL |

`node scripts/check.mjs` (run by CI) fails if a manifest drifts from the others:
name, version, description, server URL or skill. The site serves the same
`SKILL.md` at
[`/.well-known/agent-skills/install-mcp/SKILL.md`](https://awesome-repositories.com/.well-known/agent-skills/install-mcp/SKILL.md),
so `npx skills add awesome-repositories.com` installs the same skill. Tool
reference: <https://awesome-repositories.com/mcp>.

## License

MIT, see [LICENSE](LICENSE).
