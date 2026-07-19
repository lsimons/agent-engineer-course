# Agent Engineer - a course for software engineers

Learn the fundamentals of AI agents and how to build them with Claude.

## Who is this for?

Software engineers who want to understand what AI agents are, how they work, and how to build them. No prior AI/ML experience required - just curiosity and some Python knowledge.

## Course overview

This course is split into three parts:

**Part 1: Fundamentals (101)** - Understand the core concepts behind AI agents. These lessons are platform-agnostic and focused on building your mental model.

**Part 2: Building and shipping (201)** - Put those fundamentals into practice using Claude Code, the Anthropic API through your company's LiteLLM proxy, and the Claude Agent SDK.

**Part 3: Deep dives (301)** - Go deeper on specific topics that matter for real-world agent development.

## Lessons

### Part 1: fundamentals

| #   | Lesson                                                                                       | What you will learn                                                          |
| --- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 01  | [What are AI agents?](./docs/src/content/docs/01-what-are-ai-agents.md)                      | The big picture - what agents are, why they matter, and when to use them     |
| 02  | [How agents think](./docs/src/content/docs/02-how-agents-think.md)                           | LLMs as the reasoning engine - how models plan, decide, and generate         |
| 03  | [Tools - giving agents hands](./docs/src/content/docs/03-tools-giving-agents-hands.md)       | Function calling, tool design, and connecting agents to the real world       |
| 04  | [Agentic design patterns](./docs/src/content/docs/04-agentic-design-patterns.md)             | ReAct, reflection, planning, and other core patterns                         |
| 05  | [Memory and context](./docs/src/content/docs/05-memory-and-context.md)                       | How agents remember things - sessions, context windows, and long-term memory |
| 06  | [Planning and reasoning](./docs/src/content/docs/06-planning-and-reasoning.md)               | How agents break down complex tasks and make decisions                       |
| 07  | [Multi-agent systems](./docs/src/content/docs/07-multi-agent-systems.md)                     | When one agent is not enough - coordination, delegation, and teamwork        |
| 08  | [Agentic RAG](./docs/src/content/docs/08-agentic-rag.md)                                     | Going beyond basic retrieval - agents that search, evaluate, and refine      |
| 09  | [Evaluating and testing agents](./docs/src/content/docs/09-evaluating-and-testing-agents.md) | How to know if your agent actually works - metrics, evals, and observability |
| 10  | [Guardrails and safety](./docs/src/content/docs/10-guardrails-and-safety.md)                 | Keeping agents trustworthy - security, alignment, and responsible AI         |

### Part 2: building and shipping

| #   | Lesson                                                                                                                   | What you will learn                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| 11  | [From prototype to production](./docs/src/content/docs/11-from-prototype-to-production.md)                               | The journey from demo to deployed - CI/CD, rollout, and operations                                                      |
| 12  | [Getting started with Claude Code and the LiteLLM proxy](./docs/src/content/docs/12-getting-started-with-claude-code.md) | The Claude stack for agents - Claude Code, the Anthropic API via your company's LiteLLM proxy, and the Claude Agent SDK |
| 13  | [Building your first agent](./docs/src/content/docs/13-building-your-first-agent.md)                                     | Hands-on - build a working agent loop from scratch, then with the Claude Agent SDK                                      |
| 14  | [Agent protocols - MCP and A2A](./docs/src/content/docs/14-agent-protocols-mcp-and-a2a.md)                               | How agents talk to tools and to each other using open standards                                                         |

### Part 3: deep dives

| #   | Lesson                                                                       | What you will learn                                                            |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 15  | [AGENTS.md](./docs/src/content/docs/15-agents-md.md)                         | Giving AI coding agents context about your project with a standard config file |
| 16  | [MCP deep dive](./docs/src/content/docs/16-mcp-deep-dive.md)                 | How MCP works under the hood, MCP vs. CLI tools, and security considerations   |
| 17  | [Agent skills](./docs/src/content/docs/17-agent-skills.md)                   | Packaging reusable domain expertise as portable skill modules                  |
| 18  | [Orchestrators](./docs/src/content/docs/18-orchestrators.md)                 | Managing agent control flow - patterns, frameworks, and best practices         |
| 19  | [Where to go from here](./docs/src/content/docs/19-where-to-go-from-here.md) | Resources, codelabs, community, and next steps                                 |

## How to use this course

- **Read in order** if you are new to agents. Each lesson builds on the previous one.
- **Jump around** if you already know the basics. Each lesson is self-contained enough to read on its own.
- **Follow the links** to official docs and tutorials for hands-on practice. We intentionally link out to maintained resources rather than duplicating API docs or code samples that go stale.

## Philosophy

This course follows a few principles:

- **Analogies first.** We use everyday comparisons to explain complex concepts before diving into technical details.
- **Fundamentals over frameworks.** Understand the "why" before the "how." Frameworks change, but the core ideas stick around.
- **Link, don't duplicate.** For API references, code samples, and setup instructions, we point to the official Claude Developer Platform, Claude Code, and Claude Agent SDK docs. This keeps our content focused on concepts and ensures you always see up-to-date information.
- **Honest about trade-offs.** Every architectural choice has costs. We try to show both sides.

## Prerequisites

- Basic Python knowledge (functions, classes, HTTP requests)
- Claude Code installed and working, and an API key for your company's LiteLLM proxy (from your internal developer portal)
- Familiarity with REST APIs and JSON

## Additional resources

- [Claude Developer Platform documentation](https://platform.claude.com/docs)
- [Claude Code documentation](https://code.claude.com/docs)
- [Claude Agent SDK documentation](https://platform.claude.com/docs/en/api/agent-sdk/overview)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)
- [Anthropic engineering blog](https://www.anthropic.com/engineering)

## Contributing

Found a typo? Have a suggestion? PRs and issues are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE) file for details.
