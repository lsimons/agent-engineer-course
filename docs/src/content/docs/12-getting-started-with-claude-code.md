---
title: 'Lesson 12: Getting started with Claude Code and the LiteLLM proxy'
sidebar:
  order: 12
---

## Introduction

Over the first eleven lessons, we built a strong foundation in how agents work - reasoning, tools, memory, planning, multi-agent systems, RAG, evaluation, safety, and production operations. All of those concepts are platform-agnostic; they apply whether you build on Claude, GPT, Gemini, or an open-source model.

Now we shift from theory to practice. From here on, the course is hands-on, and everything you build uses one concrete stack:

- **Claude (Claude Enterprise)** - the chat, documents, and projects surface you already use in the browser and desktop app.
- **Claude Code** - the terminal-based coding agent that is already installed and working on your machine. This is your daily driver.
- **The Anthropic API, reached through your company's LiteLLM proxy** - the programmatic entry point for everything you write in code. One endpoint, one bill, Claude and OpenAI models behind it.
- **The Claude Agent SDK** - the framework you use to build your own agents, covered in the next lesson.

This lesson maps the concepts from earlier lessons onto these tools, explains how the pieces fit together, and shows you how to make your first API call through the proxy. By the end you will know which tool to reach for, how to get and configure your API key, and how to run a Claude model from the terminal, from `curl`, and from Python.

> ⚠️ **Safety first:** Before you build anything with these tools, revisit [Lesson 10: Guardrails and safety](/10-guardrails-and-safety/). Your company defines its own AI principles and guardrails on top of the general practices in that lesson - they are documented internally and take precedence over anything written here. Review them before you write your first agent.

### ELI5: Think of the stack like a professional kitchen

Imagine you are cooking in a busy restaurant kitchen rather than at home. You need ingredients (raw food), a set of knives and pans (the tools you actually work with), a pass where orders come in and plated food goes out (a single controlled point everything flows through), and a recipe book that turns individual techniques into full dishes.

Our Claude stack works the same way:

- **Claude models** are your ingredients - the intelligence that powers everything.
- **Claude Code** is your knife roll - the tool you pick up every day to get real work done.
- **The LiteLLM proxy** is the pass - every programmatic order flows through it, so the kitchen can track what is cooked, who ordered it, and how much it costs.
- **The Claude Agent SDK** is your recipe book - it packages the techniques from Claude Code into repeatable, buildable agents.
- **Claude Enterprise chat** is the dining room - where people who are not in the kitchen still get served.

You can use these pieces independently or together. Not every task needs every tool - sometimes you just ask Claude in the browser; sometimes you write code against the API.

> **Key takeaway:** The course uses a single, coherent stack - Claude Code for interactive work, the Anthropic API through your company's LiteLLM proxy for programmatic work, and the Claude Agent SDK to build agents. Knowing which piece does what lets you pick the right tool for each job.

______________________________________________________________________

## Why a proxy in front of the models?

Before we look at the pieces, it helps to understand why your programmatic calls do not go straight to Anthropic. Instead, they pass through a **LiteLLM proxy** that your company runs.

LiteLLM is an open-source proxy that speaks the Anthropic and OpenAI API formats and forwards requests to the real providers. Putting one in front of the model providers gives a company several things that matter at scale:

- **A single endpoint and a single bill.** Every team calls one URL. Finance sees one invoice instead of a separate contract with each model provider.
- **Per-team budgets and rate limits.** The proxy issues keys scoped to a team or project, each with its own spending cap and request-rate ceiling. One runaway script cannot burn the whole company's budget.
- **Central logging and audit.** Because every request flows through one place, the platform team can log usage, trace incidents, and answer "who called which model with what" - which matters for both cost control and safety review.
- **Model allow-lists.** The proxy decides which models are exposed. That is how a company enforces "we only use approved models" without trusting every developer to remember the policy.
- **Painless A/B of providers.** Because the proxy exposes Anthropic and OpenAI models behind the same API shape, you can compare a Claude model against a GPT model by changing a single string - no rewrite, no second SDK.

The practical upshot for you: you write ordinary Anthropic SDK code, point two environment variables at the proxy, and everything else just works. We will do exactly that below. (Not every workload goes through the proxy - some reach Claude directly via AWS Bedrock instead; the proxy is the default path for course work, so follow the internal documentation to know when Bedrock applies to you.)

______________________________________________________________________

## The pieces and when to use which

Here is a map of the stack and how the parts relate:

```
+------------------------------------------------------------------+
|                     You, building things                          |
+------------------------------------------------------------------+
|                                                                    |
|  +--------------------+    +----------------------------------+   |
|  |  Claude (chat)     |    |  Claude Code                     |   |
|  |  Claude Enterprise |    |  (terminal agent)                |   |
|  |                    |    |                                  |   |
|  |  - Ask questions   |    |  - Read & change code            |   |
|  |  - Documents       |    |  - Run commands                  |   |
|  |  - Projects        |    |  - MCP, skills, subagents        |   |
|  +--------------------+    +----------------------------------+   |
|                                        |                          |
|                                        v                          |
|  +----------------------------------------------------+          |
|  |            Claude Agent SDK                         |          |
|  |  (the agent loop from Claude Code, as a library)    |          |
|  +----------------------------------------------------+          |
|                          |                                        |
|                          v                                        |
|  +----------------------------------------------------+          |
|  |         Anthropic API  (client.messages.create)     |          |
|  +----------------------------------------------------+          |
|                          |                                        |
|                          v                                        |
|  +----------------------------------------------------+          |
|  |     Your company's LiteLLM proxy (one endpoint)     |          |
|  |     budgets - rate limits - logging - allow-list    |          |
|  +----------------------------------------------------+          |
|                          |                                        |
|                          v                                        |
|  +----------------------------------------------------+          |
|  |   Claude models  (Opus 4.8 - Sonnet 5 - Haiku 4.5)  |          |
|  |   + recent OpenAI GPT-series models                 |          |
|  +----------------------------------------------------+          |
+------------------------------------------------------------------+
```

<div id="claude-stack" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 2rem auto; background: #f8f7f5; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
  <div style="background: linear-gradient(135deg, #cc785c, #a8543c); padding: 20px 24px; color: white;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <div>
        <div style="font-size: 1.25rem; font-weight: 700;">Claude Stack Explorer</div>
        <div style="font-size: 0.85rem; opacity: 0.9;">Click any piece to learn more. Try the Decision Helper.</div>
      </div>
      <button id="cstack-helper-btn" onclick="cstackToggleHelper()" style="background: white; color: #a8543c; border: none; border-radius: 8px; padding: 10px 20px; font-weight: 600; cursor: pointer; font-size: 0.85rem;">Decision Helper</button>
    </div>
  </div>
  <div id="cstack-main" style="padding: 24px;">
    <div style="margin-bottom: 8px; font-size: 0.7rem; font-weight: 600; color: #6b6b6b; text-transform: uppercase; letter-spacing: 1px;">What you use directly</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
      <div class="cstack-card" onclick="cstackShow('chat')" style="background: white; border-radius: 10px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: pointer; border: 2px solid transparent; transition: all 0.2s; text-align: center;" onmouseenter="this.style.borderColor='#cc785c';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='transparent';this.style.transform='none'">
        <div style="font-size: 1.3rem; margin-bottom: 6px;">💬</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #202124;">Claude (chat)</div>
        <div style="font-size: 0.65rem; color: #6b6b6b;">Claude Enterprise</div>
      </div>
      <div class="cstack-card" onclick="cstackShow('code')" style="background: white; border-radius: 10px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: pointer; border: 2px solid transparent; transition: all 0.2s; text-align: center;" onmouseenter="this.style.borderColor='#cc785c';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='transparent';this.style.transform='none'">
        <div style="font-size: 1.3rem; margin-bottom: 6px;">⌨️</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #202124;">Claude Code</div>
        <div style="font-size: 0.65rem; color: #6b6b6b;">Terminal agent</div>
      </div>
    </div>
    <div style="text-align: center; margin: -8px 0; color: #e0dcd6; font-size: 1.2rem;">▼ ▼</div>
    <div style="margin: 8px 0; font-size: 0.7rem; font-weight: 600; color: #6b6b6b; text-transform: uppercase; letter-spacing: 1px;">What you build with</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
      <div class="cstack-card" onclick="cstackShow('sdk')" style="background: white; border-radius: 10px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: pointer; border: 2px solid transparent; transition: all 0.2s; text-align: center;" onmouseenter="this.style.borderColor='#cc785c';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='transparent';this.style.transform='none'">
        <div style="font-size: 1.3rem; margin-bottom: 6px;">🧰</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #202124;">Claude Agent SDK</div>
        <div style="font-size: 0.65rem; color: #6b6b6b;">Build agents</div>
      </div>
      <div class="cstack-card" onclick="cstackShow('api')" style="background: white; border-radius: 10px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: pointer; border: 2px solid transparent; transition: all 0.2s; text-align: center;" onmouseenter="this.style.borderColor='#cc785c';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='transparent';this.style.transform='none'">
        <div style="font-size: 1.3rem; margin-bottom: 6px;">🔌</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #202124;">Anthropic API</div>
        <div style="font-size: 0.65rem; color: #6b6b6b;">Raw messages call</div>
      </div>
    </div>
    <div style="text-align: center; margin: -8px 0; color: #e0dcd6; font-size: 1.2rem;">▼ ▼</div>
    <div style="margin: 8px 0; font-size: 0.7rem; font-weight: 600; color: #6b6b6b; text-transform: uppercase; letter-spacing: 1px;">The gateway and the models</div>
    <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 10px;">
      <div class="cstack-card" onclick="cstackShow('proxy')" style="background: white; border-radius: 10px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: pointer; border: 2px solid transparent; transition: all 0.2s; text-align: center;" onmouseenter="this.style.borderColor='#cc785c';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='transparent';this.style.transform='none'">
        <div style="font-size: 1.3rem; margin-bottom: 6px;">🛂</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #202124;">LiteLLM proxy</div>
        <div style="font-size: 0.65rem; color: #6b6b6b;">One endpoint - budgets, limits, logging, allow-list</div>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
      <div class="cstack-card" onclick="cstackShow('opus')" style="background: white; border-radius: 10px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: pointer; border: 2px solid transparent; transition: all 0.2s; text-align: center;" onmouseenter="this.style.borderColor='#cc785c';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='transparent';this.style.transform='none'">
        <div style="font-size: 1.3rem; margin-bottom: 6px;">🧠</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #202124;">Opus 4.8</div>
        <div style="font-size: 0.65rem; color: #6b6b6b;">Most capable</div>
      </div>
      <div class="cstack-card" onclick="cstackShow('sonnet')" style="background: white; border-radius: 10px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: pointer; border: 2px solid transparent; transition: all 0.2s; text-align: center;" onmouseenter="this.style.borderColor='#cc785c';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='transparent';this.style.transform='none'">
        <div style="font-size: 1.3rem; margin-bottom: 6px;">⚡</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #202124;">Sonnet 5</div>
        <div style="font-size: 0.65rem; color: #6b6b6b;">Balanced</div>
      </div>
      <div class="cstack-card" onclick="cstackShow('haiku')" style="background: white; border-radius: 10px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: pointer; border: 2px solid transparent; transition: all 0.2s; text-align: center;" onmouseenter="this.style.borderColor='#cc785c';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='transparent';this.style.transform='none'">
        <div style="font-size: 1.3rem; margin-bottom: 6px;">💨</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #202124;">Haiku 4.5</div>
        <div style="font-size: 0.65rem; color: #6b6b6b;">Fastest, cheapest</div>
      </div>
    </div>
    <div id="cstack-info" style="margin-top: 16px; background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: none;"></div>
  </div>
  <div id="cstack-helper" style="display: none; padding: 0 24px 24px;">
    <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="font-weight: 700; margin-bottom: 12px; color: #202124;">Decision Helper</div>
      <div id="cstack-question" style="font-size: 0.9rem; color: #202124; margin-bottom: 16px;">What are you trying to do?</div>
      <div id="cstack-options" style="display: grid; gap: 8px;"></div>
      <div id="cstack-recommendation" style="display: none; margin-top: 16px; padding: 16px; background: #f6ece7; border-radius: 10px;"></div>
      <button id="cstack-reset-btn" onclick="cstackReset()" style="display: none; margin-top: 12px; padding: 8px 16px; background: #cc785c; color: white; border: none; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">Start Over</button>
    </div>
  </div>
</div>

<script>
(function() {
  var info = {
    'chat': {title:'Claude (Claude Enterprise)', color:'#cc785c', desc:'The chat, documents, and projects surface in the browser and desktop app. Backed by your enterprise deployment with its data-handling guarantees.', when:'Use for one-off questions, drafting and reviewing documents, and exploratory thinking - no code required.', connects:'Same models as everything else; no setup beyond signing in.'},
    'code': {title:'Claude Code', color:'#cc785c', desc:'The terminal-based coding agent, already installed on your machine. It reads and edits code, runs commands, and extends via MCP servers and skills.', when:'Use as your daily driver for real work in a repository: explaining code, making changes, running tests, automating chores.', connects:'Runs the agent loop against Claude models; reads project context from CLAUDE.md; honors ANTHROPIC_BASE_URL.'},
    'sdk': {title:'Claude Agent SDK', color:'#cc785c', desc:'A Python (and TypeScript) library that packages the same agent loop Claude Code uses - tools, permissions, subagents, hooks, MCP - so you can build your own agents.', when:'Use when you are building an agent as a product or automation rather than driving one interactively.', connects:'Inherits Claude Code configuration and auth; honors ANTHROPIC_BASE_URL, so it runs through the proxy. Covered in Lesson 13.'},
    'api': {title:'Anthropic API', color:'#cc785c', desc:'The raw messages endpoint - client.messages.create(...). Full control over prompts, tools, and the agent loop, with no framework in the way.', when:'Use when you want precise control, a minimal dependency footprint, or to learn how the loop works underneath the SDK.', connects:'The Anthropic SDKs read ANTHROPIC_API_KEY and ANTHROPIC_BASE_URL, so the same code works through the proxy unchanged.'},
    'proxy': {title:"Your company's LiteLLM proxy", color:'#a8543c', desc:'One endpoint that every programmatic call passes through. Enforces per-team budgets and rate limits, logs usage for audit, and exposes only approved models.', when:'Always - all API and SDK traffic in this course goes through it. Point ANTHROPIC_BASE_URL at it and you are done.', connects:'Speaks the Anthropic and OpenAI API formats; forwards to the real providers; lists available models at /v1/models.'},
    'opus': {title:'Claude Opus 4.8', color:'#cc785c', desc:'The most capable general model. Strongest reasoning, planning, and long-context work. Up to 1M-token context.', when:'Use for complex multi-step reasoning, hard planning, and quality-critical work. The default model in the code examples of this course.', connects:'model="aws/claude-4-8-opus" (subject to the alias set by the proxy).'},
    'sonnet': {title:'Claude Sonnet 5', color:'#cc785c', desc:'The balanced speed/intelligence workhorse. Strong across most agent tasks at lower latency and cost than Opus. Up to 1M-token context.', when:'Use as your default for general agent work: tool use, RAG, summarization, conversation.', connects:'model="aws/claude-5-sonnet" (subject to the alias set by the proxy).'},
    'haiku': {title:'Claude Haiku 4.5', color:'#cc785c', desc:'The fastest and cheapest model. Optimized for high-volume, simpler tasks. 200K-token context.', when:'Use for classification, routing, extraction, and other high-throughput simple steps.', connects:'model="aws/claude-4-5-haiku" (subject to the alias set by the proxy).'}
  };

  var tree = {
    q: 'What are you trying to do?',
    options: [
      {label: 'Ask a question or work on a document', result: {parts: ['chat'], text: 'Use <strong>Claude (chat)</strong> in the browser or desktop app. No setup, no code.'}},
      {label: 'Work in a code repository interactively', result: {parts: ['code'], text: 'Use <strong>Claude Code</strong> in the terminal. Add project context in CLAUDE.md; extend with MCP and skills.'}},
      {label: 'Call a model from my own program', next: {
        q: 'Do you want a framework or full manual control?',
        options: [
          {label: 'Give me a framework for agents', result: {parts: ['sdk', 'proxy'], text: 'Use the <strong>Claude Agent SDK</strong> - it packages the agent loop as a library and runs through the <strong>proxy</strong>. See Lesson 13.'}},
          {label: 'I want full manual control', result: {parts: ['api', 'proxy'], text: 'Call the <strong>Anthropic API</strong> directly with client.messages.create; it runs through the <strong>proxy</strong> via ANTHROPIC_BASE_URL.'}}
        ]
      }},
      {label: 'Pick a model for a task', next: {
        q: 'What matters most for this task?',
        options: [
          {label: 'Hardest reasoning / quality', result: {parts: ['opus'], text: 'Use <strong>Claude Opus 4.8</strong> for complex reasoning and quality-critical work.'}},
          {label: 'Good balance of speed and smarts', result: {parts: ['sonnet'], text: 'Use <strong>Claude Sonnet 5</strong> as your general-purpose default.'}},
          {label: 'Speed and cost at high volume', result: {parts: ['haiku'], text: 'Use <strong>Claude Haiku 4.5</strong> for classification, routing, and simple high-throughput steps.'}}
        ]
      }}
    ]
  };

  var current = tree;

  window.cstackShow = function(key) {
    var i = info[key];
    var el = document.getElementById('cstack-info');
    el.style.display = 'block';
    el.innerHTML = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;"><div style="width:12px;height:12px;border-radius:50%;background:' + i.color + ';"></div><span style="font-weight:700;font-size:1rem;color:#202124;">' + i.title + '</span></div>' +
      '<div style="font-size:0.85rem;color:#6b6b6b;margin-bottom:10px;">' + i.desc + '</div>' +
      '<div style="display:grid;gap:8px;">' +
      '<div style="padding:10px 12px;background:#f6ece7;border-radius:8px;font-size:0.8rem;"><strong>When to use:</strong> ' + i.when + '</div>' +
      '<div style="padding:10px 12px;background:#eef4f0;border-radius:8px;font-size:0.8rem;"><strong>Connects to:</strong> ' + i.connects + '</div></div>';
  };

  window.cstackToggleHelper = function() {
    var helper = document.getElementById('cstack-helper');
    if (helper.style.display === 'none') {
      helper.style.display = 'block';
      document.getElementById('cstack-helper-btn').textContent = 'Show Stack';
      cstackReset();
    } else {
      helper.style.display = 'none';
      document.getElementById('cstack-helper-btn').textContent = 'Decision Helper';
    }
  };

  window.cstackReset = function() {
    current = tree;
    document.getElementById('cstack-recommendation').style.display = 'none';
    document.getElementById('cstack-reset-btn').style.display = 'none';
    render(current);
  };

  function render(node) {
    document.getElementById('cstack-question').textContent = node.q;
    var optEl = document.getElementById('cstack-options');
    optEl.innerHTML = '';
    node.options.forEach(function(opt) {
      var btn = document.createElement('button');
      btn.textContent = opt.label;
      btn.style.cssText = 'padding:10px 16px;background:#f8f7f5;border:2px solid #e0dcd6;border-radius:8px;cursor:pointer;font-size:0.85rem;text-align:left;transition:all 0.2s;';
      btn.onmouseenter = function() { btn.style.borderColor = '#cc785c'; btn.style.background = '#f6ece7'; };
      btn.onmouseleave = function() { btn.style.borderColor = '#e0dcd6'; btn.style.background = '#f8f7f5'; };
      btn.onclick = function() {
        if (opt.result) { recommend(opt.result); }
        else if (opt.next) { current = opt.next; render(opt.next); }
      };
      optEl.appendChild(btn);
    });
  }

  function recommend(result) {
    document.getElementById('cstack-options').innerHTML = '';
    document.getElementById('cstack-question').textContent = 'Recommendation:';
    var rec = document.getElementById('cstack-recommendation');
    rec.style.display = 'block';
    rec.innerHTML = '<div style="font-size:0.9rem;line-height:1.6;">' + result.text + '</div>' +
      '<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">' +
      result.parts.map(function(s) {
        var i = info[s];
        return '<span style="padding:4px 10px;background:white;border-radius:6px;font-size:0.75rem;font-weight:600;color:' + i.color + ';border:1px solid ' + i.color + ';">' + i.title + '</span>';
      }).join('') + '</div>';
    document.getElementById('cstack-reset-btn').style.display = 'inline-block';
  }

  render(tree);
})();
</script>

Here is the same map as a table, with the question each piece answers:

| Piece                           | What it is                                               | Reach for it when                                                                   |
| ------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Claude (chat)**               | Claude Enterprise chat, documents, and projects          | You want to ask a question, draft or review a document, or think out loud - no code |
| **Claude Code**                 | Terminal coding agent, already installed                 | You are working in a repository: explaining, changing, running, automating          |
| **Anthropic API via the proxy** | The raw `messages` endpoint through your company gateway | You want full, framework-free control from your own program                         |
| **Claude Agent SDK**            | The Claude Code agent loop, as a library                 | You are building an agent as a product or automation                                |

The rule of thumb: **use chat to think, Claude Code to work, the API for control, and the SDK to build.** All four talk to the same models through the same proxy.

______________________________________________________________________

## Getting your API key

Claude Code and Claude chat are already set up for you. To call models from your own code, you need an API key for the proxy.

Keys come from **your internal developer portal**. The exact steps, the portal's location, and the proxy endpoint are documented internally - follow that documentation rather than anything hard-coded here (it can change, and it is not public). In general terms you will:

1. Sign in to the internal developer portal with your company identity.
2. Request or create a key for your team or project. The key is typically scoped to a budget and a rate limit, and to the set of models your team is allowed to use.
3. Copy the key once. Most portals show the secret only at creation time.

### Key hygiene

An API key is a credential that can spend real money and reach real models. Treat it like a password:

- **Never commit it.** Keep keys out of source control entirely. Add `.env` files to `.gitignore`; do not paste keys into code, notebooks, or chat messages.
- **Use environment variables**, or a secrets manager for anything shared or deployed. The Anthropic SDKs read the key from the environment automatically (below), so you never need it in a source file.
- **Scope narrowly.** Use a key tied to your team and its budget, not a broad shared one. That keeps usage attributable and blast radius small.
- **Rotate on exposure.** If a key ever lands somewhere it should not - a commit, a log, a screenshot - revoke and reissue it through the portal. Rotate periodically as a matter of routine, too.

If a key leaks, the proxy's per-key budget and logging limit the damage and make it visible - another reason the gateway exists - but rotating fast is still on you.

______________________________________________________________________

## Configuring your environment and making your first calls

The Anthropic SDKs and the `curl` examples below read two environment variables: `ANTHROPIC_BASE_URL` (where to send requests) and `ANTHROPIC_API_KEY` (your credential). Point the first at the proxy and the second at your key:

```bash
export ANTHROPIC_BASE_URL="https://<your-company-llm-proxy>"  # endpoint from the internal docs
export ANTHROPIC_API_KEY="sk-..."                             # key from the internal developer portal
```

Because the SDKs pick up `ANTHROPIC_BASE_URL` automatically, **every piece of Anthropic SDK code in this course works through the proxy with no proxy-specific changes.** You write ordinary Anthropic code; the two variables route it through your company's gateway. That is the whole trick.

### First call with `curl`

The quickest way to confirm your key and endpoint work is a raw HTTP request:

```bash
curl "$ANTHROPIC_BASE_URL/v1/messages" \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "aws/claude-4-8-opus",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Say hello!"}]
  }'
```

A JSON response with a `content` array means everything is wired up correctly. An authentication error usually means the key or the base URL is wrong; a model error usually means the alias is not one your proxy exposes (more on that below).

### First call with Python

For real work you will use the SDK. Install it and make the same call:

```bash
uv add anthropic
```

```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY and ANTHROPIC_BASE_URL from the environment

response = client.messages.create(
    model="aws/claude-4-8-opus",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Say hello!"}],
)

for block in response.content:
    if block.type == "text":
        print(block.text)
```

Note that `response.content` is a **list of blocks**, not a single string. A reply can contain text blocks, tool-use blocks, and more - iterating over them and checking `block.type` is the pattern you will use throughout the course. We build directly on this loop in the next lesson.

### A note on model names

The model aliases available through the proxy come from **the proxy's own configuration**, not from Anthropic directly. You can list what your proxy exposes:

```bash
curl "$ANTHROPIC_BASE_URL/v1/models" -H "x-api-key: $ANTHROPIC_API_KEY"
```

The names it returns are set by the platform team and differ from Anthropic's official IDs - and the exact spellings differ a bit in every company's environment. This course's examples use the identifiers as they appear on our proxy (for example `aws/claude-4-8-opus`); if a model string is rejected, check `/v1/models` for the exact string your proxy expects and use that. The code shapes in this course stay the same; only the model string changes.

______________________________________________________________________

## Models available through the proxy

Your proxy exposes three Claude models. They are the same three you will use for every code example in the course (remember: the exact identifier spellings are proxy-specific and vary per company):

| Model                | ID                     | Best for                                                      | Characteristics                                |
| -------------------- | ---------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| **Claude Opus 4.8**  | `aws/claude-4-8-opus`  | Complex reasoning, hard planning, quality-critical work       | Most capable, higher latency and relative cost |
| **Claude Sonnet 5**  | `aws/claude-5-sonnet`  | General agent work - tool use, RAG, summarization, chat       | Balanced speed and intelligence; the workhorse |
| **Claude Haiku 4.5** | `aws/claude-4-5-haiku` | Classification, routing, extraction, high-volume simple steps | Fastest and cheapest                           |

The proxy also exposes **recent OpenAI GPT-series models** behind the same gateway - currently three variants from the GPT-5.6 family:

| Model           | ID                    |
| --------------- | --------------------- |
| GPT-5.6 (Luna)  | `azure/gpt-5-6-luna`  |
| GPT-5.6 (Sol)   | `azure/gpt-5-6-sol`   |
| GPT-5.6 (Terra) | `azure/gpt-5-6-terra` |

That makes it easy to compare a Claude model against a GPT model for a given task by swapping the `model` string - useful for evaluation (Lesson 9) and for the kind of A/B testing the gateway is built to support. This course teaches on the Claude models, but the mechanism is provider-neutral.

### Context windows

Claude Opus 4.8 and Sonnet 5 support context windows up to **1M tokens**; Haiku 4.5 supports **200K tokens**. That is enough to put entire codebases, long document sets, or lengthy conversations in a single request - though larger contexts cost more and can be slower, so use only what the task needs.

### Choosing a model

Think of model selection like choosing the right vehicle for a trip:

- **Haiku 4.5** is a bicycle - fast, cheap, ideal for short trips (classification, routing, simple extraction).
- **Sonnet 5** is a car - versatile, good for most journeys (general agent tasks, tool use, RAG, conversation). Make it your default.
- **Opus 4.8** is a truck - powerful, handles heavy loads (complex multi-step reasoning, long documents, difficult planning).

Most production agents use more than one tier through **model routing** (Lesson 11): Haiku for the simple steps, Sonnet for the core logic, and Opus only when the task genuinely requires it. Because relative cost rises steeply from Haiku to Opus, routing well is one of the biggest levers you have on spend. (Absolute prices depend on your company's proxy arrangement - think in relative tiers, and check the internal docs for actuals.)

______________________________________________________________________

## Claude Code as your daily driver

Claude Code is where you will spend most of your hands-on time. It is an agent that lives in your terminal, sees your project, and can read code, make changes, and run commands on your behalf - the ReAct-style loop from Lesson 4, made concrete. Because it is already installed, you can try these right now in any repository.

A quick tour of what it is good at:

- **Explaining code.** "Walk me through how authentication works in this service." Claude Code reads the relevant files and explains them, with references you can click.
- **Making changes.** "Add input validation to the signup handler and a test for it." It edits the files, runs the test, and shows you the diff. You stay in control - it asks before doing anything irreversible, the permission model from Lesson 10 in practice.
- **Running commands.** "Why is the build failing?" It runs the build, reads the error, and proposes a fix.

Three features turn Claude Code from a helper into a tailored teammate. Each has its own lesson later in the course:

- **Project context with CLAUDE.md.** A `CLAUDE.md` file at the root of your repo gives Claude Code standing instructions - conventions, architecture notes, commands, do's and don'ts - that it reads on every session. This is the single highest-leverage way to make it fit your codebase. We cover it in [Lesson 15: AGENTS.md and project context](/15-agents-md/).
- **Extending with MCP.** The Model Context Protocol lets Claude Code connect to external tools and data sources - issue trackers, databases, internal services - through a standard interface. We introduce it in [Lesson 14: Agent protocols - MCP and A2A](/14-agent-protocols-mcp-and-a2a/) and go deep in [Lesson 16: MCP deep dive](/16-mcp-deep-dive/).
- **Packaging know-how as skills.** Skills bundle reusable instructions and resources that Claude Code loads when they are relevant - your team's playbook for a recurring task, made executable. We cover them in [Lesson 17: Agent skills](/17-agent-skills/).

For the full feature set - slash commands, subagents, hooks, IDE integrations - see the [Claude Code documentation](https://code.claude.com/docs). Everything Claude Code does programmatically flows through the same proxy your API keys point at, so it stays inside your company's budgets, limits, and audit trail.

______________________________________________________________________

## Where each lesson concept maps to the Claude stack

Here is a reference connecting the concepts from earlier lessons to the tools you will use from here on:

| Lesson               | Concept                         | Claude stack                                              |
| -------------------- | ------------------------------- | --------------------------------------------------------- |
| 2 - How agents think | LLM reasoning                   | Claude models (Opus 4.8, Sonnet 5, Haiku 4.5)             |
| 3 - Tools            | Function calling                | Anthropic API `tools`; MCP tools in Claude Code/SDK       |
| 4 - Design patterns  | Orchestration                   | The agent loop; Claude Agent SDK subagents                |
| 5 - Memory           | Session state, long-term memory | Conversation history; CLAUDE.md; SDK sessions             |
| 6 - Planning         | Multi-step reasoning            | Opus 4.8 for complex planning                             |
| 7 - Multi-agent      | Agent coordination              | Claude Agent SDK subagents; A2A (Lesson 14)               |
| 8 - RAG              | Knowledge retrieval             | MCP data sources; your own retrieval + the API            |
| 9 - Evaluation       | Testing agents                  | A/B of Claude and GPT models through the proxy            |
| 10 - Safety          | Guardrails                      | Claude Code permissions; company guardrails via the proxy |
| 11 - Production      | Deployment, CI/CD               | Claude Agent SDK; proxy budgets, limits, and logging      |

______________________________________________________________________

## The wider production toolbox

Beyond this course's core stack, these are the standard tool choices for production agent work at the company; later lessons introduce each where it becomes relevant. None of them replace what you are about to build - they sit alongside it once an agent moves from prototype to production.

| Concern                          | Tool                    | Where in this course                                                                       |
| -------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------ |
| Language & packaging             | Python 3.14 + uv        | Used throughout                                                                            |
| HTTP services                    | FastAPI + uvicorn       | [Lesson 11](/11-from-prototype-to-production/)                                             |
| Structured LLM output            | Instructor (+ Pydantic) | [Lesson 13](/13-building-your-first-agent/)                                                |
| Claude-native agents             | Claude Agent SDK        | [Lesson 13](/13-building-your-first-agent/)                                                |
| MCP servers (Python)             | FastMCP                 | [Lesson 14](/14-agent-protocols-mcp-and-a2a/) and [16](/16-mcp-deep-dive/)                 |
| Orchestration                    | LangGraph               | [Lesson 18](/18-orchestrators/)                                                            |
| Vector store / vectorized memory | Qdrant                  | [Lesson 5](/05-memory-and-context/) and [8](/08-agentic-rag/)                              |
| Tracing & evaluation             | Langfuse                | [Lesson 9](/09-evaluating-and-testing-agents/) and [11](/11-from-prototype-to-production/) |

______________________________________________________________________

## Key takeaways

1. **The course runs on one coherent stack.** Claude for chat, Claude Code for interactive work, the Anthropic API through your company's LiteLLM proxy for programmatic work, and the Claude Agent SDK to build agents. All four use the same models through the same gateway.

2. **The proxy is why things stay sane at scale.** One endpoint and one bill, per-team budgets and rate limits, central logging for audit, a model allow-list, and painless A/B of Anthropic and OpenAI models. You get all of it by setting two environment variables.

3. **Configuration is two variables.** Export `ANTHROPIC_BASE_URL` and `ANTHROPIC_API_KEY`, and every Anthropic SDK example in this course runs through the proxy unchanged.

4. **Keys are credentials.** They come from your internal developer portal. Never commit them, keep them in environment variables or a secrets manager, scope them narrowly, and rotate on exposure.

5. **Pick the right model tier.** Haiku 4.5 for simple, high-volume steps; Sonnet 5 as your default; Opus 4.8 for the hard cases. Route across tiers to control cost. Model aliases come from the proxy's `/v1/models` and may differ from Anthropic's official IDs.

6. **Claude Code is your daily driver.** Explain, change, and run code interactively, then tailor it with CLAUDE.md (Lesson 15), MCP (Lessons 14 and 16), and skills (Lesson 17).

______________________________________________________________________

## Further reading

- [Claude Code documentation](https://code.claude.com/docs) - Features, configuration, MCP, skills, and IDE integrations
- [Claude Developer Platform documentation](https://platform.claude.com/docs) - The Anthropic API reference
- [Claude Agent SDK overview](https://platform.claude.com/docs/en/api/agent-sdk/overview) - Build agents on the same loop Claude Code uses
- [Model Context Protocol](https://modelcontextprotocol.io) - The open standard for connecting agents to tools and data
- [Anthropic cookbook](https://github.com/anthropics/anthropic-cookbook) - Runnable examples for the API
- [Anthropic engineering blog](https://www.anthropic.com/engineering) - Practical guidance, including "Building effective agents"
- [Claude Enterprise](https://www.anthropic.com/enterprise) - The enterprise deployment behind your chat and Claude Code access

______________________________________________________________________

Previous lesson: [From Prototype to Production](/11-from-prototype-to-production/)

Next lesson: [Building Your First Agent](/13-building-your-first-agent/)
