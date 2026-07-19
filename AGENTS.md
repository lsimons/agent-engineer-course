# AGENTS.md

Context for AI coding agents working on this repository.

## What this is

An AI-agents course for company engineers, published at
<https://lsimons.github.io/agent-engineer-course/>. Forked from
addyosmani/agent-engineer (content) + ivarurdalen/agent-engineer-course
(Starlight setup), then rewritten from Google's AI stack to the Claude stack:
Claude Code, the Anthropic API via the company's LiteLLM proxy, and the Claude
Agent SDK, plus the company production toolbox (uv, FastAPI, Pydantic v2,
Instructor, FastMCP, LangGraph, Qdrant, Langfuse) woven into the relevant
lessons.

## Layout

- `docs/` - Astro Starlight site (bun). Lesson content:
  `docs/src/content/docs/NN-name.md` (frontmatter `title` + `sidebar.order`,
  no H1 in body). Landing page: `index.mdx`.
- `mise.toml` - pinned tools (bun, just, prek, lychee, gitleaks). Run
  `mise install` first.
- `justfile` - `just docs-install`, `docs-dev`, `docs-build`, `docs-check`.
- Dev server: `just docs-dev` → <http://localhost:4321/agent-engineer-course/>
  (note the base path). Astro 7's `astro dev` daemonizes: manage with
  `astro dev stop|status|logs`.

## Hard-won rules (violating these breaks the build or the site)

- **Public repo.** Never commit company names, internal URLs, portal or proxy
  hostnames. Generic wording only ("your internal developer portal",
  `https://<your-company-llm-proxy>`).
- **Model IDs** in examples are the proxy's spellings: `aws/claude-4-8-opus`,
  `aws/claude-5-sonnet`, `aws/claude-4-5-haiku`, `azure/gpt-5-6-{luna,sol,terra}`.
  Lesson 12 explains that spellings vary per company. Don't invent model IDs
  or quote absolute token prices.
- **Internal links** between chapters use root-relative routes
  (`[text](/NN-name/)`). A rehype plugin in `docs/astro.config.mjs` prefixes
  them with the deploy base (`/agent-engineer-course`) at render time - do not
  hardcode the base in content. Exception: Starlight hero-action links in
  `index.mdx` frontmatter are used verbatim and DO include the base.
- **Interactive widgets** (inline `<div>` + `<script>` blocks in chapters):
  - Top-level widget divs must carry `class="not-content"` or Starlight's
    content CSS distorts their layout.
  - Never put a literal `</pre>`, `</script>`, or `</style>` inside widget
    JS strings - CommonMark ends the HTML block there and the renderer AND
    mdformat mangle everything after. Escape as `<\/pre>`.
  - Avoid `('x')[0]`-shaped JS (markdownlint MD011 false positive) - use
    `.at(0)`. Avoid unescaped apostrophes in single-quoted JS strings.
- **Safety-first structure**: lesson 10 carries the company-policy note;
  lessons 12/13/14 must keep their safety callback blockquotes linking
  `/10-guardrails-and-safety/`.
- Formatting is mdformat style (`uvx --with mdformat-gfm --with mdformat-frontmatter mdformat <files>`); padded tables, `______` thematic
  breaks. The pre-commit hook enforces it.

## Tooling / process

- Git hooks via prek (`prek install -t pre-commit -t commit-msg` once per
  clone): mdformat, markdownlint, lychee (link check), gitleaks, commitlint.
- **Conventional commits are enforced** (`docs:`, `fix:`, `ci:`, `build:`,
  `feat:` ...). Also add `Assisted-by: <Agent>:<model>` trailer per user
  convention.
- prek stashes unstaged changes during commit - if a hook needs a file
  (e.g. mise.toml tool pins), it must be staged in the same commit.
- lychee resolves internal routes via `--root-dir` (see prek.toml) and
  excludes our own published URL (.lychee.toml).
- CI (`.github/workflows/ci.yml`) builds + astro-checks on push/PR.
  Deploy (`deploy.yml`) publishes `docs/dist` to GitHub Pages on push to main.
  Dependabot is active (bun + actions, weekly); typescript is held to 6.x
  (@astrojs/check needs ^5||^6) - keep the ignore rule.
- Verify changes with: `just docs-build`, then curl the dev server; a full
  internal-link audit is: crawl every page's `href="/..."` and expect 200s.
- The lsimons.github.io root site links here; keep the published URL stable.
