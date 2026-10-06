# Awesome Repositories

Find the right open-source project without guessing. This plugin lets Claude
search [awesome-repositories.com](https://awesome-repositories.com), a curated
directory of open-source GitHub repositories organized by use case, technology
and ecosystem, whenever you ask for a library, a framework, a tool or an
open-source alternative to a product.

## What you get

- **The Awesome Repositories MCP server** (`awesome-repositories`), a remote,
  read-only server at `https://awesome-repositories.com/api/mcp`.
- **The `awesome-repositories` skill**, which tells Claude when to use the server
  ("I need a Python library for…", "an open-source alternative to…") and how:
  plan the request, find the matching tags, search several ways, check every
  candidate against its stored evidence, and ask you when the request could mean
  more than one thing.

## Try it

After installing, ask Claude things like:

- "I need a Python library to extract tables from PDFs."
- "Recommend an open-source alternative to Notion I can self-host."
- "Is there a Rust crate for parsing TOML with comments preserved?"

Claude answers with repositories it found and checked in the directory, each
with a link to its page.

## Sign-in

The server uses OAuth 2.1. The first time Claude calls it, Claude Code asks you
to sign in with Google in your browser; nothing to copy or paste. To sign in or
out later, run `/mcp` and pick `awesome-repositories`.

## What it sends and stores

- The plugin runs no local code. It only connects to
  `https://awesome-repositories.com/api/mcp`.
- It sends that server your search requests (queries, tag paths, repository
  names) and the OAuth token from your sign-in. It reads public repository
  data back; it can't change anything.
- See the [privacy policy](https://awesome-repositories.com/privacy) and
  [terms](https://awesome-repositories.com/terms).

## Tools

All read-only: `match_curated_searches`, `find_repository`,
`search_metadata_tags`, `explore_tag`, `search_repositories`,
`get_repository`, `list_repository_docs`, `list_curated_searches`.
Full docs: <https://awesome-repositories.com/mcp>.

## License

MIT, see [LICENSE](LICENSE).
