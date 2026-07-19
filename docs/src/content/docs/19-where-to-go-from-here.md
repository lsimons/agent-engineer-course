---
title: 'Lesson 19: where to go from here'
sidebar:
  order: 19
---

## Introduction

You made it. Nineteen lessons covering everything from "what is an agent?" to building multi-agent systems with protocols and production infrastructure. That is a solid foundation.

But foundations are meant to be built on. This final lesson is your launching pad - a curated map of where to go next depending on your goals, the best resources to bookmark, and the emerging areas that will shape the future of agent development.

______________________________________________________________________

## What you have learned

Let us do a quick flyover of the entire course. Use this as a refresher and a way to spot any areas you want to revisit.

### Part 1: fundamentals

| Lesson | Title                         | Core Idea                                                                                                                                                                    |
| ------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01     | What Are AI Agents?           | Agents combine a reasoning model, tools, and an orchestration loop to pursue goals autonomously. They exist on a spectrum from simple tool-callers to self-evolving systems. |
| 02     | How Agents Think              | LLMs are the reasoning engine. Understanding tokenization, context windows, and sampling helps you predict and control agent behavior.                                       |
| 03     | Tools - Giving Agents Hands   | Tools let agents interact with the world. Good tool design - clear names, typed parameters, helpful descriptions - directly impacts agent reliability.                       |
| 04     | Agentic Design Patterns       | Patterns like ReAct, reflection, planning, and tool-use give structure to how agents solve problems. Pick the simplest pattern that works.                                   |
| 05     | Memory and Context            | Agents need memory at multiple levels - short-term (context window), session-level (conversation state), and long-term (persistent storage) - to handle complex tasks.       |
| 06     | Planning and Reasoning        | Agents break complex goals into steps through planning strategies. Chain-of-thought, tree-of-thought, and dynamic replanning each have their place.                          |
| 07     | Multi-Agent Systems           | When one agent cannot handle everything, multiple specialized agents can collaborate through orchestration patterns like hierarchical, peer-to-peer, and blackboard systems. |
| 08     | Agentic RAG                   | Going beyond basic retrieval by letting agents decide what to search, evaluate results, and iteratively refine their knowledge before answering.                             |
| 09     | Evaluating and Testing Agents | Measuring agent quality requires task-specific metrics, trajectory analysis, and systematic test cases. Evaluation is not optional - it is how you know your agent works.    |
| 10     | Guardrails and Safety         | Agents need boundaries - input validation, output filtering, scope limits, and human-in-the-loop controls - to stay safe and trustworthy.                                    |

### Part 2: building and shipping

| Lesson | Title                                                  | Core Idea                                                                                                                                                                                   |
| ------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 11     | From Prototype to Production                           | The gap between a working demo and a production agent is bridged by CI/CD, monitoring, graceful degradation, and operational practices.                                                     |
| 12     | Getting Started with Claude Code and the LiteLLM Proxy | Claude Code is your daily-driver agent, the Anthropic API (via your company's LiteLLM proxy) gives programmatic access, and the Claude Agent SDK packages the same agent loop as a library. |
| 13     | Building Your First Agent                              | Agents need a model, tools, and an instruction loop. Start by building the raw tool-use loop from scratch, then rebuild it with the Claude Agent SDK.                                       |
| 14     | Agent Protocols - MCP and A2A                          | MCP standardizes agent-to-tool communication. A2A standardizes agent-to-agent collaboration. Together they solve the integration problem.                                                   |

That is a lot of ground. If any of these summaries feel unfamiliar, go back and re-read that lesson before moving forward.

______________________________________________________________________

## ELI5: where do you go after learning to drive?

Think about learning to drive a car. You took the classes (fundamentals), passed the written test (understanding the theory), and did your driving test (building your first agent). You can now drive.

But "being able to drive" opens up a world of choices. Some people want to drive to work every day (build practical agents). Some want to become a mechanic and understand the engine deeply (study the theory). Some want to drive cross-country (deploy at scale). And some want to race competitively (push the boundaries of what agents can do).

This lesson is your road atlas. It does not tell you where to go - it shows you all the roads and helps you pick the one that matches your destination.

______________________________________________________________________

## Recommended learning paths

Not everyone has the same next step. Here are four paths based on common goals.

### Path 1: "i want to build my first agent"

You have read the theory and you want to get your hands dirty.

**Start here:**

1. Work through [Lesson 12](/12-getting-started-with-claude-code/) end to end - get Claude Code running through your company's LiteLLM proxy, then make your first Anthropic API call.
2. Build the tool-use loop from scratch, then rebuild the same agent with the [Claude Agent SDK](https://platform.claude.com/docs/en/api/agent-sdk/overview). Change the instructions. Add a custom tool. Break it, fix it, and learn how the pieces fit.
3. Browse the [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook) for runnable, production-flavored examples you can adapt.
4. Pick a small, real problem and build an agent to solve it. Keep it scoped - one agent, two to three tools, a clear success metric.

**Revisit:** Lessons 3 (Tools), 13 (Building Your First Agent)

### Path 2: "i want to improve an existing agent"

You have an agent but it is not performing well enough.

**Start here:**

1. Go back to Lesson 9 and build an evaluation suite for your agent. You cannot improve what you cannot measure.
2. Read ["Building Effective Agents"](https://www.anthropic.com/engineering) on the Anthropic engineering blog for systematic approaches to improving agent reliability and accuracy.
3. Audit your system instructions using the guidelines from Lesson 13. Vague instructions are the most common source of poor behavior.
4. Check your tool design. Are tool names clear? Are descriptions accurate? Are error cases handled?
5. Add guardrails (Lesson 10) if you have not already. Reliability and safety go hand in hand.

**Revisit:** Lessons 9 (Evaluation), 10 (Guardrails), 4 (Design Patterns)

### Path 3: "i want to deploy agents at scale"

You have a working agent and you need to run it in production.

**Start here:**

1. Re-read Lesson 11 (From Prototype to Production) with a focus on the operational concerns: monitoring, logging, error handling, and rollback.
2. Check with your platform team and internal developer portal for how services that call through your company's LiteLLM proxy handle scaling, session management, and infrastructure in your environment.
3. Browse the [Anthropic engineering blog](https://www.anthropic.com/engineering) for practical patterns that carry over from prototype to production.
4. Set up CI/CD for your agent. Treat prompt changes with the same rigor as code changes - version them, review them, test them.
5. Implement comprehensive observability. You need to see what your agent is doing in production, not just whether it returned a response.

**Revisit:** Lessons 11 (Production), 12 (Claude Code and the LiteLLM Proxy)

### Path 4: "i want to understand the theory deeper"

You want the research-level understanding.

**Start here:**

1. Read the [Anthropic engineering blog](https://www.anthropic.com/engineering). Posts like "Building Effective Agents" provide in-depth technical treatment of many topics in this course.
2. Follow the research papers on planning, reasoning, and multi-agent coordination referenced in those posts.
3. Experiment with advanced patterns - multi-agent systems (Lesson 7), agentic RAG (Lesson 8), and loop-based refinement agents.
4. Study the MCP and A2A protocol specifications directly for a deep understanding of how agent communication works at the wire level.

**Revisit:** Lessons 2 (How Agents Think), 6 (Planning), 7 (Multi-Agent Systems)

<div class="not-content" id="learning-path" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 2rem auto; background: #f8f9fa; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 24px; box-sizing: border-box;">
  <h3 style="margin: 0 0 4px 0; font-size: 1.2rem; color: #1a1a2e;">Learning Path Recommender</h3>
  <p style="margin: 0 0 16px 0; font-size: 0.85rem; color: #666;">Answer two questions or pick a path directly to get a personalized roadmap.</p>

<!-- Quick Pick Paths -->

<div class="not-content" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
    <button class="lp-quick" data-path="builder" style="padding: 8px 16px; border: 2px solid #4285f4; border-radius: 8px; background: white; cursor: pointer; font-size: 0.82rem; font-weight: 600; color: #4285f4; transition: all 0.2s;">&#128736; Builder</button>
    <button class="lp-quick" data-path="improver" style="padding: 8px 16px; border: 2px solid #34a853; border-radius: 8px; background: white; cursor: pointer; font-size: 0.82rem; font-weight: 600; color: #34a853; transition: all 0.2s;">&#128295; Improver</button>
    <button class="lp-quick" data-path="deployer" style="padding: 8px 16px; border: 2px solid #fbbc04; border-radius: 8px; background: white; cursor: pointer; font-size: 0.82rem; font-weight: 600; color: #9a7400; transition: all 0.2s;">&#128640; Deployer</button>
    <button class="lp-quick" data-path="theorist" style="padding: 8px 16px; border: 2px solid #9333ea; border-radius: 8px; background: white; cursor: pointer; font-size: 0.82rem; font-weight: 600; color: #9333ea; transition: all 0.2s;">&#128218; Theorist</button>
  </div>

<!-- Quiz Area -->

<div class="not-content" id="lp-quiz" style="background: white; border-radius: 12px; border: 1px solid #e0e0e0; padding: 20px; margin-bottom: 16px;">
    <!-- Step 1 -->
    <div id="lp-step1">
      <div style="font-weight: 700; font-size: 0.95rem; color: #1a1a2e; margin-bottom: 4px;">Step 1 of 2</div>
      <div style="font-size: 0.88rem; color: #555; margin-bottom: 14px;">What is your primary goal?</div>
      <div id="lp-q1-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;"></div>
    </div>
    <!-- Step 2 -->
    <div id="lp-step2" style="display: none;">
      <div style="font-weight: 700; font-size: 0.95rem; color: #1a1a2e; margin-bottom: 4px;">Step 2 of 2</div>
      <div style="font-size: 0.88rem; color: #555; margin-bottom: 14px;">What is your experience level?</div>
      <div id="lp-q2-options" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;"></div>
    </div>
  </div>

<!-- Roadmap -->

<div class="not-content" id="lp-roadmap" style="display: none;"></div>

<!-- Reset -->

<div class="not-content" style="text-align: center; margin-top: 12px;">
    <button id="lp-reset" style="padding: 6px 16px; background: #e8eaed; color: #555; border: none; border-radius: 6px; cursor: pointer; font-size: 0.82rem; display: none;">Start Over</button>
  </div>
</div>

<script>
(function() {
  const goals = [
    { id: 'build', label: 'Build agents from scratch', icon: '&#128736;' },
    { id: 'improve', label: 'Improve existing agents', icon: '&#128295;' },
    { id: 'deploy', label: 'Deploy agents to production', icon: '&#128640;' },
    { id: 'theory', label: 'Understand agent theory', icon: '&#128218;' }
  ];
  const levels = [
    { id: 'new', label: 'New to AI/ML' },
    { id: 'some', label: 'Some ML experience' },
    { id: 'experienced', label: 'Experienced ML engineer' }
  ];

  const pathData = {
    builder: {
      name: 'The Builder Path', color: '#4285f4',
      stages: [
        { type: 'learn', title: 'Foundations', items: ['Lesson 1: What Are AI Agents?', 'Lesson 2: How Agents Think', 'Lesson 3: Tools - Giving Agents Hands'] },
        { type: 'learn', title: 'Patterns & Memory', items: ['Lesson 4: Agentic Design Patterns', 'Lesson 5: Memory and Context'] },
        { type: 'build', title: 'Build Your First Agent', items: ['Lesson 12: Claude Code and the LiteLLM proxy', 'Lesson 13: Building Your First Agent', 'Rebuild the sample agent with the Claude Agent SDK'] },
        { type: 'build', title: 'Add Capabilities', items: ['Add MCP integration (Lesson 14)', 'Implement agent skills (Lesson 17)', 'Build a multi-tool agent'] },
        { type: 'deploy', title: 'Ship It', items: ['Package the agent with the Claude Agent SDK', "Deploy through your company's existing infrastructure", 'Set up basic monitoring'] }
      ],
      project: 'Build an internal knowledge agent that answers questions about your team docs using RAG + 2-3 tools.',
      resources: ['Claude Code docs', 'Claude Agent SDK docs', 'Anthropic Cookbook']
    },
    improver: {
      name: 'The Improver Path', color: '#34a853',
      stages: [
        { type: 'learn', title: 'Evaluation Fundamentals', items: ['Lesson 9: Evaluating and Testing Agents', 'Build 10+ eval test cases for your agent'] },
        { type: 'learn', title: 'Quality Frameworks', items: ['Anthropic engineering blog: "Building Effective Agents"', 'Lesson 4: Design Patterns (review)'] },
        { type: 'build', title: 'Audit & Fix', items: ['Audit system instructions (Lesson 13)', 'Review tool designs for clarity', 'Add missing error handling'] },
        { type: 'build', title: 'Add Guardrails', items: ['Lesson 10: Guardrails and Safety', 'Implement input validation', 'Add output filtering and scope limits'] },
        { type: 'deploy', title: 'Measure & Iterate', items: ['Set up A/B evaluation pipeline', 'Track success rate metrics', 'Iterate based on production data'] }
      ],
      project: 'Take your worst-performing agent and improve its eval pass rate from current to 90%+ through systematic instruction and tool refinement.',
      resources: ['Anthropic engineering blog', 'Lesson 9 evaluation techniques', 'Claude Agent SDK docs']
    },
    deployer: {
      name: 'The Deployer Path', color: '#d89700',
      stages: [
        { type: 'learn', title: 'Production Concepts', items: ['Lesson 11: From Prototype to Production', 'Anthropic engineering blog: "Building Effective Agents"'] },
        { type: 'learn', title: 'Infrastructure', items: ['Lesson 12: Claude Code and the LiteLLM proxy', 'Your internal developer portal docs', 'Understand session management'] },
        { type: 'build', title: 'CI/CD & Monitoring', items: ['Set up CI/CD for agent changes', 'Version control prompts like code', 'Configure logging and tracing'] },
        { type: 'build', title: 'Reliability', items: ['Implement graceful degradation', 'Add circuit breakers', 'Set up human escalation paths'] },
        { type: 'deploy', title: 'Scale & Observe', items: ["Deploy through your company's platform", 'Set up observability dashboards', 'Run load testing, tune scaling'] }
      ],
      project: 'Take an existing agent and deploy it with full CI/CD, monitoring, rollback, and alerting.',
      resources: ['Your internal developer portal', 'Anthropic Cookbook', "Your company's observability stack"]
    },
    theorist: {
      name: 'The Theorist Path', color: '#9333ea',
      stages: [
        { type: 'learn', title: 'Core Theory', items: ['Lesson 2: How Agents Think (deep dive)', 'Lesson 6: Planning and Reasoning', 'Read ReAct, CoT, and ToT papers'] },
        { type: 'learn', title: 'Advanced Patterns', items: ['Lesson 7: Multi-Agent Systems', 'Lesson 8: Agentic RAG', 'Lesson 18: Orchestration patterns'] },
        { type: 'learn', title: 'Protocols & Standards', items: ['Lesson 14: MCP and A2A specs', 'Read protocol specifications directly', 'Lesson 17: Agent Skills specification'] },
        { type: 'build', title: 'Experiment', items: ['Build a multi-agent orchestration', 'Implement loop-based refinement', 'Compare model performance with evals'] },
        { type: 'deploy', title: 'Contribute', items: ['Write up findings', 'Contribute to open-source agent frameworks', 'Share learnings with community'] }
      ],
      project: 'Implement and compare 3 different orchestration patterns (sequential, parallel, hierarchical) on the same task, measuring quality, cost, and latency.',
      resources: ['Anthropic engineering blog', 'MCP specification at modelcontextprotocol.io', 'A2A spec at a2a-protocol.org/latest/']
    }
  };

  // Goal -> path mapping
  const goalToPath = { build: 'builder', improve: 'improver', deploy: 'deployer', theory: 'theorist' };
  let selectedGoal = null;

  // Render Q1 options
  const q1 = document.getElementById('lp-q1-options');
  goals.forEach(g => {
    const btn = document.createElement('button');
    btn.innerHTML = `${g.icon} ${g.label}`;
    btn.style.cssText = 'padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; font-size: 0.85rem; color: #333; text-align: left; transition: all 0.2s;';
    btn.addEventListener('mouseenter', () => btn.style.borderColor = '#4285f4');
    btn.addEventListener('mouseleave', () => { if (selectedGoal !== g.id) btn.style.borderColor = '#e0e0e0'; });
    btn.addEventListener('click', () => {
      selectedGoal = g.id;
      document.getElementById('lp-step1').style.display = 'none';
      document.getElementById('lp-step2').style.display = 'block';
    });
    q1.appendChild(btn);
  });

  // Render Q2 options
  const q2 = document.getElementById('lp-q2-options');
  levels.forEach(l => {
    const btn = document.createElement('button');
    btn.textContent = l.label;
    btn.style.cssText = 'padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; font-size: 0.85rem; color: #333; transition: all 0.2s;';
    btn.addEventListener('mouseenter', () => btn.style.borderColor = '#4285f4');
    btn.addEventListener('mouseleave', () => btn.style.borderColor = '#e0e0e0');
    btn.addEventListener('click', () => {
      showPath(goalToPath[selectedGoal], l.id);
    });
    q2.appendChild(btn);
  });

  // Quick picks
  document.querySelectorAll('.lp-quick').forEach(btn => {
    btn.addEventListener('click', () => showPath(btn.dataset.path, 'some'));
    btn.addEventListener('mouseenter', () => { btn.style.background = btn.style.borderColor + '15'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'white'; });
  });

  function showPath(pathId, level) {
    const path = pathData[pathId];
    const roadmap = document.getElementById('lp-roadmap');
    document.getElementById('lp-quiz').style.display = 'none';
    document.getElementById('lp-reset').style.display = 'inline-block';
    roadmap.style.display = 'block';

    const typeColors = { learn: '#4285f4', build: '#34a853', deploy: '#d89700' };
    const typeLabels = { learn: 'LEARN', build: 'BUILD', deploy: 'DEPLOY' };

    let levelNote = '';
    if (level === 'new') levelNote = '<div style="background:#fff3cd;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:0.8rem;color:#856404;">Tip: As someone new to AI/ML, spend extra time on the Learn stages. Consider taking an intro to ML course alongside this path.</div>';
    if (level === 'experienced') levelNote = '<div style="background:#d4edda;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:0.8rem;color:#155724;">With your ML experience, you can move quickly through foundations. Focus on the Build and Deploy stages.</div>';

    let html = `<div style="background:white;border-radius:12px;border:1px solid #e0e0e0;padding:20px;">`;
    html += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;"><div style="width:10px;height:10px;border-radius:50%;background:${path.color};"></div><span style="font-weight:700;font-size:1.1rem;color:#1a1a2e;">${path.name}</span></div>`;
    html += `<p style="font-size:0.8rem;color:#666;margin:0 0 14px 0;">Your personalized roadmap based on your goals and experience level.</p>`;
    html += levelNote;

    // Roadmap nodes
    html += `<div style="position:relative;padding-left:28px;">`;
    // Vertical line
    html += `<div style="position:absolute;left:12px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,${typeColors.learn},${typeColors.build},${typeColors.deploy});border-radius:1px;"></div>`;

    path.stages.forEach((stage, i) => {
      const tc = typeColors[stage.type];
      html += `<div style="position:relative;margin-bottom:${i < path.stages.length - 1 ? '20px' : '0'};">`;
      // Dot
      html += `<div style="position:absolute;left:-22px;top:4px;width:12px;height:12px;border-radius:50%;background:${tc};border:2px solid white;box-shadow:0 0 0 2px ${tc};"></div>`;
      // Content
      html += `<div style="background:${tc}08;border-radius:8px;padding:12px 14px;border-left:3px solid ${tc};">`;
      html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;"><span style="font-size:0.65rem;font-weight:700;color:white;background:${tc};padding:1px 8px;border-radius:10px;">${typeLabels[stage.type]}</span><span style="font-weight:600;font-size:0.9rem;color:#1a1a2e;">${stage.title}</span></div>`;
      html += `<ul style="margin:0;padding-left:18px;">`;
      stage.items.forEach(item => {
        html += `<li style="font-size:0.8rem;color:#444;margin-bottom:3px;line-height:1.4;">${item}</li>`;
      });
      html += `</ul></div></div>`;
    });
    html += `</div>`;

    // Project suggestion
    html += `<div style="margin-top:20px;background:#f0f7ff;border-radius:8px;padding:14px;border:1px solid #d0e3ff;">`;
    html += `<div style="font-weight:700;font-size:0.85rem;color:#1a1a2e;margin-bottom:4px;">&#127919; Suggested First Project</div>`;
    html += `<p style="font-size:0.82rem;color:#444;margin:0;line-height:1.5;">${path.project}</p>`;
    html += `</div>`;

    // Resources
    html += `<div style="margin-top:14px;background:#f8f9fa;border-radius:8px;padding:14px;border:1px solid #e0e0e0;">`;
    html += `<div style="font-weight:700;font-size:0.85rem;color:#1a1a2e;margin-bottom:6px;">&#128218; Key Resources</div>`;
    html += `<ul style="margin:0;padding-left:18px;">`;
    path.resources.forEach(r => {
      html += `<li style="font-size:0.8rem;color:#444;margin-bottom:3px;">${r}</li>`;
    });
    html += `</ul></div>`;

    html += `</div>`;
    roadmap.innerHTML = html;
  }

  document.getElementById('lp-reset').addEventListener('click', () => {
    selectedGoal = null;
    document.getElementById('lp-quiz').style.display = 'block';
    document.getElementById('lp-step1').style.display = 'block';
    document.getElementById('lp-step2').style.display = 'none';
    document.getElementById('lp-roadmap').style.display = 'none';
    document.getElementById('lp-reset').style.display = 'none';
  });
})();
</script>

______________________________________________________________________

## Claude and Anthropic resources

### Documentation

Your primary reference when building:

| Resource                  | What It Covers                                                                | Link                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Claude Developer Platform | The Anthropic API - messages, tool use, streaming, and the full API reference | [platform.claude.com/docs](https://platform.claude.com/docs)                                                     |
| Claude Code Docs          | Installing, configuring, and extending Claude Code                            | [code.claude.com/docs](https://code.claude.com/docs)                                                             |
| Claude Agent SDK Docs     | Building agents with the same loop that powers Claude Code                    | [platform.claude.com/docs/en/api/agent-sdk/overview](https://platform.claude.com/docs/en/api/agent-sdk/overview) |
| MCP Specification         | The Model Context Protocol - standardizing agent-to-tool communication        | [modelcontextprotocol.io](https://modelcontextprotocol.io)                                                       |

### Templates and starter projects

Do not start from scratch when you do not have to:

- **Anthropic Cookbook:** [https://github.com/anthropics/anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) - Runnable examples covering tool use, agent loops, retrieval, evaluation, and more. This is the fastest way to see production-flavored patterns end to end.

### Community

Connect with other agent builders:

- **Stack Overflow** - Tag questions with `anthropic` or `claude`
- **GitHub Issues** - Report bugs and request features on the Anthropic Cookbook repository
- **Your internal engineering channels** - Whoever runs your company's LiteLLM proxy and internal developer portal is usually plugged into a wider internal community of people building agents

Building agents can feel isolating when you are the only one on your team doing it. The community is where you find people who have hit the same problems you are facing. Do not hesitate to ask questions - the ecosystem is young enough that everyone is still learning.

### Tutorials and samples

Beyond the official docs, look for:

- **Sample agents in the Anthropic Cookbook** - The Cookbook repo includes example agents that demonstrate common patterns like multi-tool agents, sequential workflows, and agent teams
- **Anthropic engineering blog posts** - Regularly publishes walkthroughs of agent architectures and deployment patterns
- **Conference talks** - Recorded talks on agents and Claude from Anthropic and the wider community are often published after the fact

______________________________________________________________________

## Anthropic engineering resources

Instead of a whitepaper series, Anthropic publishes practical, in-depth posts on the [Anthropic engineering blog](https://www.anthropic.com/engineering). "Building Effective Agents" is the standout starting point - it covers agent architectures, when (and when not) to add complexity, and patterns for tool use, evaluation, and reliability that apply throughout this course.

These posts are valuable whether you are calling Claude directly, through your company's LiteLLM proxy, or through another integration. The concepts and patterns they describe are broadly applicable.

______________________________________________________________________

## Open source projects to explore

### Anthropic projects

| Project                | What It Is                                                                     | Link                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Claude Agent SDK**   | Anthropic's toolkit for building agents that use the same loop as Claude Code  | [Claude Agent SDK docs](https://platform.claude.com/docs/en/api/agent-sdk/overview)          |
| **Anthropic Cookbook** | Runnable, open-source examples for tool use, agents, retrieval, and evaluation | [github.com/anthropics/anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) |

### Community frameworks

The agent ecosystem is broader than any single vendor. These community frameworks offer different approaches and are worth understanding:

| Framework     | Approach                                                                | Best For                                          |
| ------------- | ----------------------------------------------------------------------- | ------------------------------------------------- |
| **LangChain** | Modular components for building LLM applications with chains and agents | Rapid prototyping, wide ecosystem of integrations |
| **LangGraph** | Graph-based agent orchestration built on LangChain                      | Complex multi-step workflows, stateful agents     |
| **CrewAI**    | Role-based multi-agent collaboration framework                          | Teams of specialized agents working together      |

Each framework makes different trade-offs. The Claude Agent SDK emphasizes tight integration with Claude Code's tools, permissions, subagents, and MCP support. LangChain emphasizes breadth of integrations. CrewAI emphasizes the multi-agent team metaphor. There is no single "best" framework - the right choice depends on your requirements, existing infrastructure, and team preferences.

**A note on framework choice:** Do not spend weeks evaluating frameworks. Pick one that fits your ecosystem, build something with it, and switch later if you need to. The concepts transfer across frameworks. What you learn about tool design with the Claude Agent SDK applies in LangChain. What you learn about evaluation in one framework applies in all of them. Frameworks are vehicles, not destinations.

### Protocol implementations

- **MCP Specification:** [modelcontextprotocol.io](https://modelcontextprotocol.io) - The protocol spec and reference implementations
- **A2A Protocol:** [a2a-protocol.org/latest/](https://a2a-protocol.org/latest/) - Specification and documentation

______________________________________________________________________

## Emerging areas to watch

The agent field is moving rapidly. Here are areas that will likely have a significant impact in the near future.

### Computer use agents

Agents that can see and interact with graphical user interfaces - clicking buttons, filling forms, navigating websites - just like a human user. This opens up automation for applications that have no API, only a visual interface.

**Why it matters:** Most enterprise software was designed for human interaction through GUIs. Computer use agents can automate workflows that were previously impossible to automate without building custom integrations.

**What to watch for:** Improvements in vision-language models, standardized frameworks for GUI interaction, and security models for agents that control desktop and browser environments.

### Self-Evolving Agents

Agents that learn from their own past performance - analyzing what worked, what failed, and why. They update their strategies, refine their prompts, and improve their tool usage over time without human intervention.

**Why it matters:** Today, improving an agent requires a human to review logs, identify issues, and make changes. Self-evolving agents could dramatically reduce this maintenance burden.

**What to watch for:** Better approaches to agent self-reflection, automated prompt optimization, and safe exploration strategies that let agents try new approaches without breaking things.

### Agentic commerce

Agents that can discover products and services, negotiate terms, make purchases, and manage transactions on behalf of users. Think of a travel agent that does not just plan your trip but actually books it - comparing prices, applying discounts, and handling payment.

**Why it matters:** This shifts agents from "information helpers" to "action takers" in economic activity. The trust and safety implications are significant.

**What to watch for:** Standards for agent-to-merchant communication, payment authorization frameworks, and consumer protection models for AI-mediated transactions.

### Continuous learning in production

Agents that update their knowledge and capabilities based on production interactions without requiring redeployment. This includes learning new facts, adapting to changing user needs, and incorporating feedback loops.

**Why it matters:** Today, updating an agent's knowledge requires redeploying with new instructions or updating a knowledge base. Continuous learning could make agents that stay current automatically.

**What to watch for:** Safe online learning techniques, quality controls for learned information, and architectures that separate stable capabilities from evolving knowledge.

### Multi-Modal Agents

Agents that work with images, audio, video, and documents alongside text. A multi-modal agent might analyze a screenshot of an error, listen to a customer support call, or process a PDF invoice - all as part of a single workflow.

**Why it matters:** The real world is not text-only. Many business processes involve documents, images, and recordings. Multi-modal agents can handle these workflows without requiring a human to manually transcribe or describe non-text content.

**What to watch for:** Improvements in vision-language models, standardized ways to pass multi-modal content through agent protocols, and frameworks that handle multi-modal tool inputs and outputs natively.

### Agent observability and debugging

As agents become more complex, understanding what they are doing and why becomes harder. New tools and practices are emerging for tracing agent decision-making, visualizing multi-step execution, and diagnosing failures in production.

**Why it matters:** You cannot fix what you cannot see. Today, debugging an agent often means reading logs line by line. Better observability tools will make agent development feel more like modern software development with proper debuggers and profilers.

**What to watch for:** Dedicated agent tracing platforms, standardized telemetry formats for agent execution, and visualization tools for multi-agent interactions.

______________________________________________________________________

## Common patterns for your first real project

Once you move beyond tutorials, here are practical project patterns that work well as a first real build:

### The internal knowledge agent

**What it does:** Answers questions about your team's documentation, runbooks, or codebase.

**Why it is a good first project:** The scope is clear, the data is accessible, and you can measure success easily (does it answer correctly?). It combines RAG with tool use and gives your team immediate value.

**Tools needed:** A document retrieval tool (vector search or API to your docs), optionally a web search tool for fallback.

### The triage agent

**What it does:** Reads incoming items (bug reports, support tickets, pull requests) and categorizes, prioritizes, or routes them.

**Why it is a good first project:** Classification tasks play to LLM strengths. The output is structured and easy to evaluate. And the volume of items in most organizations makes this genuinely useful.

**Tools needed:** An API tool to read items from your issue tracker or ticketing system, and a tool to update labels or assignees.

### The daily digest agent

**What it does:** Gathers information from multiple sources (email, Slack, calendar, project management tool) and produces a summary.

**Why it is a good first project:** It exercises multiple tools and basic synthesis without requiring complex multi-step reasoning. The output is easy for a human to review.

**Tools needed:** MCP servers or custom tools for each data source, a formatting tool for the output.

### The code review helper

**What it does:** Reviews pull requests for common issues - missing tests, style violations, potential bugs, unclear naming.

**Why it is a good first project:** Developers can immediately validate the output against their own judgment. It is low-risk (suggestions, not automated changes) and high-value.

**Tools needed:** A tool to read PR diffs from your source control system, optionally a tool to post review comments.

______________________________________________________________________

## A checklist for your next agent project

Use this as a planning tool when you start your next build:

### Before you start

- [ ] Define the goal clearly - what should the agent accomplish?
- [ ] Verify an agent is the right approach (Lesson 1 decision flowchart)
- [ ] Identify the tools and data sources the agent needs
- [ ] Choose a model appropriate for the task complexity
- [ ] Set up your development environment (Claude Code, API access via your company's LiteLLM proxy, credentials)

### During development

- [ ] Write detailed system instructions (role, scope, boundaries, examples)
- [ ] Build and test tools individually before connecting them to the agent
- [ ] Create evaluation cases early - at least 5-10 to start
- [ ] Test locally with Claude Code or the Claude Agent SDK before deploying anywhere
- [ ] Add guardrails for safety and reliability

### Before deployment

- [ ] Run a thorough evaluation suite and address failures
- [ ] Set up monitoring and logging
- [ ] Define rollback procedures
- [ ] Plan for error handling and graceful degradation
- [ ] Review security - authentication, authorization, data handling

### After deployment

- [ ] Monitor agent performance metrics (latency, success rate, cost)
- [ ] Review logs regularly for unexpected behaviors
- [ ] Collect user feedback and incorporate it into eval cases
- [ ] Iterate on instructions and tools based on production data
- [ ] Keep dependencies (models, tools, MCP servers) up to date

______________________________________________________________________

## A bookmarkable resource list

Keep these links handy. They are the primary references you will come back to:

**Learning and Building:**

- Claude Developer Platform docs: [https://platform.claude.com/docs](https://platform.claude.com/docs)
- Claude Code docs: [https://code.claude.com/docs](https://code.claude.com/docs)
- Claude Agent SDK docs: [https://platform.claude.com/docs/en/api/agent-sdk/overview](https://platform.claude.com/docs/en/api/agent-sdk/overview)
- Anthropic Cookbook: [https://github.com/anthropics/anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook)

**Anthropic engineering:**

- Anthropic engineering blog: [https://www.anthropic.com/engineering](https://www.anthropic.com/engineering)
- Claude Enterprise: [https://www.anthropic.com/enterprise](https://www.anthropic.com/enterprise)

**Protocols:**

- MCP Specification: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- A2A Protocol: [https://a2a-protocol.org/latest/](https://a2a-protocol.org/latest/)

______________________________________________________________________

## Staying current

The agent ecosystem moves fast. Here is a practical strategy for keeping up without drowning in information.

### What to follow

- **Claude Code and Claude Agent SDK release notes:** Check the [Claude Code docs](https://code.claude.com/docs) and [Claude Agent SDK docs](https://platform.claude.com/docs/en/api/agent-sdk/overview) for new releases. Major versions often introduce new agent types, tool integrations, or deployment options.
- **Your internal developer portal:** Your company's LiteLLM proxy and developer portal are updated on their own schedule - watch their internal changelog for new model aliases and capabilities.
- **Model releases:** New Claude model versions (and other models exposed through your company's proxy) can unlock capabilities that were not possible before - better reasoning, longer context windows, improved tool use. Test new models with your existing eval suite to see if they improve performance.
- **Protocol updates:** Both MCP and A2A are actively evolving. Watch for new primitives, security improvements, and ecosystem growth.

### What to ignore (for now)

Not every new development requires your attention. Skip things that:

- Solve a problem you do not have yet
- Require rearchitecting a system that is working fine
- Are announcements without available implementations
- Are benchmark results without practical applications

Focus on what helps you build better agents today. File the rest away for later.

______________________________________________________________________

## A final note

The best way to learn agent development is to build agents. Start small. Pick a problem you actually have - maybe it is summarizing your morning emails, or looking up information across multiple internal tools, or triaging bug reports. Build a simple agent to solve it. One model, one or two tools, clear instructions.

Once that works, iterate. Add another tool. Improve the instructions. Write eval cases. Connect to an MCP server. Try a multi-agent pattern. Each iteration teaches you something the docs cannot.

The field is moving fast. New models with better reasoning ship regularly. New tools and protocols emerge. Best practices evolve as more teams put agents into production. The fundamentals you learned in this course - the agent loop, tool design, memory management, evaluation, safety - will stay relevant even as the specifics change. But the specific APIs, model versions, and framework features will evolve.

Bookmark the resource list above and check back often. Follow the Claude Code and Claude Agent SDK release notes. Read the Anthropic engineering blog when new posts come out. Join the community forums and see what other people are building.

And most importantly: ship something. The gap between "I understand agents" and "I have built and deployed an agent" is where the real learning happens.

Good luck building.

______________________________________________________________________

## Course complete

Congratulations on finishing AI Agents 101. You have gone from understanding what agents are to knowing how to build, test, deploy, and connect them using industry-standard tools and protocols.

[Back to Course Overview](/)
