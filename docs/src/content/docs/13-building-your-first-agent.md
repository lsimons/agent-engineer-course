---
title: 'Lesson 13: building your first agent'
sidebar:
  order: 13
---

## Introduction

You have made it through the fundamentals. You understand what agents are, how they think, how they use tools, how they remember things, and how to evaluate whether they are doing a good job. Now it is time to build one.

In this lesson you will build a working agent two ways. First, from scratch with the Anthropic Python SDK, so you can see exactly how the agent loop works - there is no magic, just a `while` loop and a handful of rules. Second, with the Claude Agent SDK, the framework that packages the same loop Claude Code uses so you do not have to write it yourself. By the end you will understand what the loop does, when to hand-roll it, and when to reach for the framework.

Everything here runs against your company's LiteLLM proxy, exactly as you set it up in [Lesson 12: Getting started with Claude Code and the LiteLLM proxy](/12-getting-started-with-claude-code/). No new accounts, no new keys.

> ⚠️ **Safety first:** An agent that calls tools can take real actions, so build it on the foundation from [Lesson 10: Guardrails and safety](/10-guardrails-and-safety/) rather than bolting safety on afterwards. Your company's own AI principles and guardrails govern what you are allowed to build and ship - they live in the internal documentation, so read them before you wire an agent up to anything that matters.

______________________________________________________________________

## What we are building

Our goal is a small but genuinely useful assistant that can:

- Look up the current weather for a location (a custom tool you define)
- Do arithmetic reliably (a second tool - language models are famously shaky at math)
- Run in a loop so it can chain several tool calls together to answer one question

Think of this as a "hello world" for agents - simple enough to understand in one sitting, but real enough to show how every piece connects. The exact tools do not matter; the loop that drives them is the thing worth learning, and it is identical whether your tools read the weather or deploy to production.

### Prerequisites

Before you start, make sure you have:

- **Python 3.9+** installed
- **The Anthropic SDK installed** (`uv add anthropic`)
- **`ANTHROPIC_BASE_URL` and `ANTHROPIC_API_KEY` set** in your environment, pointing at your company's LiteLLM proxy - see [Lesson 12](/12-getting-started-with-claude-code/) if you have not done this yet

A quick check that your environment is wired up correctly:

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

If that prints a greeting, you are ready. The SDK reads both environment variables automatically, so nothing in the code below is proxy-specific - it just works through your endpoint.

______________________________________________________________________

## ELI5: what is an agent loop?

A plain chatbot is a vending machine: you put a message in, a message comes out, done. An agent is more like an assistant with a phone on their desk. You ask a question, and instead of answering immediately they might pick up the phone, call someone, get an answer, maybe make a second call, and only then turn back to you with the final reply.

The "phone calls" are tool calls. The agent loop is the simple rule that makes this work: *keep going as long as the model wants to make another call, stop when it is ready to answer.* That is the whole idea. Everything else in this lesson is detail around that one sentence.

______________________________________________________________________

## Part 1 - build the agent loop from scratch

The best way to demystify agents is to build the loop yourself. It is less code than you might expect.

### Step 1: define a tool

A tool is a JSON description of a function the model is allowed to call. You describe *what* it does and *what inputs* it takes; the model decides *when* to call it and *with what arguments*.

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City name"},
            },
            "required": ["location"],
        },
    },
]
```

A few things to notice:

- **The `description` is the model's instruction manual.** It reads this to decide when the tool applies. Write it like you are explaining the function to a new colleague: `"Get current weather for a location"` is clear; `"weather stuff"` is not.
- **The `input_schema` is a JSON Schema.** It tells the model the shape of the arguments, which fields are required, and what each one means. The model fills this in for you.
- **You have not written any weather code yet.** The tool definition is only a description. Running the tool is your job, and it happens outside the model.

### Step 2: make the first call and watch for a tool request

Now send a question along with the tool definition and see what comes back.

```python
messages = [{"role": "user", "content": "What's the weather in Tokyo?"}]

response = client.messages.create(
    model="aws/claude-4-8-opus",
    max_tokens=4096,
    tools=tools,
    messages=messages,
)

print(response.stop_reason)  # -> "tool_use"
```

The `stop_reason` is the signal that drives everything. When the model wants to call a tool, it stops with `stop_reason == "tool_use"` instead of finishing its turn. The response's `content` now contains one or more `tool_use` blocks describing the calls it wants to make:

```python
for block in response.content:
    if block.type == "tool_use":
        print(block.name)   # -> "get_weather"
        print(block.input)  # -> {"location": "Tokyo"}
```

Note that `block.input` is **already-parsed Python data** - a dictionary, not a string of JSON you have to decode. Reach into it by key; never string-match the serialized form.

### Step 3: execute the tool and return the result

The model has asked for the weather in Tokyo. It cannot get that itself - that is what *you* are for. You run the actual function and hand the result back, and the handing-back has strict rules:

1. First append the model's turn (the whole `response.content`, tool-use blocks and all) to the conversation.
2. Then send a **user** message containing a `tool_result` block. The `tool_use_id` on that result must match the `id` of the `tool_use` block you are answering.

```python
def get_weather(location: str) -> str:
    # A real implementation would call a weather API. We mock it for now.
    return f"It's 22degC and sunny in {location}."

# Append the assistant's turn, including its tool_use block, to history
messages.append({"role": "assistant", "content": response.content})

# Answer each tool_use block with a matching tool_result
tool_results = []
for block in response.content:
    if block.type == "tool_use":
        result = get_weather(**block.input)
        tool_results.append({
            "type": "tool_result",
            "tool_use_id": block.id,
            "content": result,
        })

messages.append({"role": "user", "content": tool_results})
```

The `tool_use_id` is the thread that ties a request to its answer. Every `tool_use` block you receive **must** get exactly one matching `tool_result` in the next user message. Skip one, or mismatch an id, and the next API call errors out.

Send the updated `messages` back and the model now has the weather it asked for, so it can write a normal reply:

```python
response = client.messages.create(
    model="aws/claude-4-8-opus",
    max_tokens=4096,
    tools=tools,
    messages=messages,
)
print(response.stop_reason)  # -> "end_turn"
```

### Step 4: wrap it in a loop

Steps 2 and 3 are one round. A real question might need several - look up a value, do a calculation on it, look up another. Rather than hand-coding each round, you loop until the model stops asking for tools.

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City name"},
            },
            "required": ["location"],
        },
    },
]

def execute_tool(name, tool_input):
    if name == "get_weather":
        return f"It's 22degC and sunny in {tool_input['location']}."
    return f"Unknown tool: {name}"

messages = [{"role": "user", "content": "What's the weather in Tokyo?"}]

while True:
    response = client.messages.create(
        model="aws/claude-4-8-opus",
        max_tokens=4096,
        tools=tools,
        messages=messages,
    )

    if response.stop_reason != "tool_use":
        break  # Claude is done - no more tool calls

    # Append the assistant turn (including its tool_use blocks) to history
    messages.append({"role": "assistant", "content": response.content})

    # Execute every requested tool; ALL results go back in ONE user message
    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            result = execute_tool(block.name, block.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": result,
            })
    messages.append({"role": "user", "content": tool_results})

final_text = next(b.text for b in response.content if b.type == "text")
print(final_text)
```

That is a complete agent. Read the loop body once more and notice how little there is to it:

- **`stop_reason == "tool_use"` drives the loop.** As long as the model wants a tool, you serve it and go around again. The moment it stops asking, you break and read the final answer.
- **You append the assistant turn *before* the results.** The conversation has to read as assistant-asks, user-answers. Forget the assistant turn and the ids in your `tool_result` blocks will not line up with anything.
- **All tool results go in one user message.** Even when the model requests several tools at once, you collect every result and send them together (more on this in Step 6).

### Step 5: add a second tool

One tool is a demo; the interesting behaviour starts with two, because now the model has to *choose*. Add a calculator so the assistant can do reliable arithmetic.

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City name"},
            },
            "required": ["location"],
        },
    },
    {
        "name": "calculate",
        "description": "Evaluate a basic arithmetic expression, e.g. '3 * (4 + 5)'",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string", "description": "The expression to evaluate"},
            },
            "required": ["expression"],
        },
    },
]
```

You do not touch the loop at all - it already handles any number of tools. You only extend `execute_tool` to know how to run the new one:

```python
def execute_tool(name, tool_input):
    if name == "get_weather":
        return f"It's 22degC and sunny in {tool_input['location']}."
    if name == "calculate":
        return str(evaluate(tool_input["expression"]))  # your safe evaluator
    return f"Unknown tool: {name}"
```

Now the model picks the right tool based on the question. Ask about Tokyo and it calls `get_weather`; ask "what's 15% of 240?" and it calls `calculate`. This is the payoff of describing tools well: the model routes to the right one on its own, using your `description` text to decide.

### Step 6: handle errors and parallel calls

Two realities show up as soon as your agent leaves the demo stage: tools fail, and the model often wants several at once.

**When a tool fails, tell the model - do not crash.** Return a `tool_result` with `"is_error": True` and a message describing what went wrong. The model reads that just like any other result and can adapt: retry with different arguments, try another tool, or explain the problem to the user. Dropping the result instead (or letting the exception bubble up and kill your loop) throws away the model's chance to recover.

```python
tool_results = []
for block in response.content:
    if block.type == "tool_use":
        try:
            result = execute_tool(block.name, block.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": result,
            })
        except Exception as exc:
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": f"Error: {exc}",
                "is_error": True,
            })
```

**When the model asks for several tools at once, answer them all in one message.** Ask "what's the weather in Tokyo and in Paris?" and a single response may contain two `tool_use` blocks. The rule from Step 4 is exactly what handles this: loop over every block, collect every result, and append them together as *one* user message. Splitting the results across two messages - one per tool - breaks the request/response pairing and the API rejects it.

The loop you already wrote does this correctly because it builds the full `tool_results` list before appending. That is not an accident; it is the reason the results are gathered first and sent second.

### Structured output with Instructor

The `final_text` pattern above is fine when a plain string is the answer, but production code often needs the agent's output as validated, typed data instead - a ticket object, a structured report, a set of extracted fields. [Instructor](https://python.useinstructor.com/) patches the Anthropic client so you pass a `response_model` and get back a validated object instead of raw text; Pydantic v2 models are the company standard for this kind of validated LLM output.

```python
import anthropic
import instructor
from pydantic import BaseModel

class Ticket(BaseModel):
    title: str
    priority: int

client = instructor.from_anthropic(anthropic.Anthropic())
ticket = client.messages.create(
    model="aws/claude-5-sonnet",
    max_tokens=1024,
    messages=[{"role": "user", "content": "File a ticket: the login page is slow"}],
    response_model=Ticket,
)
```

______________________________________________________________________

## Testing and iterating on your agent

Your fastest feedback loop is a plain script you run from the terminal. Make a change, run it, read the output, repeat. A few habits pay off quickly:

- **Test each tool function on its own first.** If `get_weather("London")` throws when you call it directly, it will throw inside the agent too - and it is much harder to debug there. Confirm the plain function works before wiring it into `execute_tool`.
- **Print the trace while developing.** Log each `tool_use` (name and `block.input`) and each result as the loop runs. Seeing *which* tools the model chose and *what arguments* it passed tells you whether your descriptions are landing.
- **Write down a handful of cases.** "Weather in Tokyo" should call `get_weather`; "15% of 240" should call `calculate`; "weather in Tokyo and Paris" should produce two calls in one turn. This is the same evaluation discipline from Lesson 9, applied to your very first agent - start it now and it saves you from silent regressions later.
- **Add a guard against runaway loops** before you trust the agent unattended (see the pitfalls below).

______________________________________________________________________

## Common pitfalls

Almost every bug in a hand-rolled agent loop is one of these. Knowing the list turns a confusing error into a two-second fix.

1. **A `tool_use` with no matching `tool_result`.** Every tool the model requests needs exactly one result in the next user message, matched by `tool_use_id`. Miss one and the next API call errors. When several tools are requested, answer *all* of them.

2. **Splitting parallel results across messages.** All results from one assistant turn belong in a *single* user message. One message per tool breaks the pairing. Collect first, append once.

3. **String-matching the serialized input.** `block.input` is already a parsed dict. Read `block.input["location"]`; do not run a regex over a JSON string. Treating structured data as text is fragile and unnecessary.

4. **Forgetting to append the assistant turn.** Before you send tool results, append `response.content` as an `assistant` message. Skip it and the results reference tool-use ids the conversation never recorded.

5. **Unbounded loops.** A misbehaving tool (say, one that always reports failure) can make the model retry forever, quietly burning tokens. Always cap the number of iterations:

```python
MAX_ITERATIONS = 10

for _ in range(MAX_ITERATIONS):
    response = client.messages.create(
        model="aws/claude-4-8-opus",
        max_tokens=4096,
        tools=tools,
        messages=messages,
    )
    if response.stop_reason != "tool_use":
        break
    # ... append assistant turn, run tools, append results ...
else:
    raise RuntimeError(f"Agent did not finish within {MAX_ITERATIONS} iterations")
```

Swapping `while True` for a bounded `for` loop is a one-line change that turns a possible runaway bill into a clean, catchable error.

______________________________________________________________________

## Part 2 - the framework path with the Claude Agent SDK

Building the loop by hand is the right way to *learn*. But you saw how much is left implicit: history management, error formatting, permissioning, retries, and the fact that every non-trivial agent wants a set of standard tools (read a file, run a command, search the web) that you would otherwise re-implement every time.

The **Claude Agent SDK** packages all of that. It is the same production agent loop that Claude Code runs, exposed as a library you can call from your own code.

```bash
uv add claude-agent-sdk
```

```python
import anyio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode="acceptEdits",
    )
    async for message in query(
        prompt="Summarize the TODO comments in this repo into TODO.md",
        options=options,
    ):
        print(message)

anyio.run(main)
```

There is no tool loop in that snippet because the SDK *is* the tool loop. What you get on top of the raw version from Part 1:

- **Built-in tools.** File reading and writing, shell commands, web fetch and search, and more, ready to use - no schemas to hand-write.
- **Permissioning.** A `permission_mode` and per-tool allow-lists gate what the agent may actually do, so a file-writing agent cannot quietly run a shell command you did not sanction.
- **Subagents.** Delegate a focused piece of work to a separate agent with its own tools and context, then fold the result back in.
- **Hooks.** Run your own code at defined points in the loop - to log, to enforce a policy, to block an action - without editing the loop itself.
- **MCP.** Connect external tools and data sources through the Model Context Protocol (the subject of the next lesson) instead of wiring each integration by hand.

Crucially for us, the SDK **inherits Claude Code's configuration and authentication and honors `ANTHROPIC_BASE_URL`**. Because you already configured Claude Code against the LiteLLM proxy in Lesson 12, the Agent SDK routes through the same proxy with no extra setup.

### Raw loop or framework?

| Reach for the raw loop when...                              | Reach for the Agent SDK when...                                 |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| You want to understand exactly what happens each turn       | You want a working agent quickly                                |
| The agent has a few narrow, custom tools                    | You need built-in tools (files, shell, web) out of the box      |
| You need full control over history, retries, and formatting | You want permissioning, hooks, subagents, and MCP for free      |
| You are embedding tool-calling in a larger custom system    | You are building the kind of coding or ops agent Claude Code is |

A good rule: prototype the *idea* with the raw loop so you understand the moving parts, then move to the SDK once you want the production machinery instead of maintaining your own copy of it. For the full API, see the [Claude Agent SDK documentation](https://platform.claude.com/docs/en/api/agent-sdk/overview).

______________________________________________________________________

## You have been building a harness

Step back and look at what this lesson actually produced. The model call is one line. Everything else - the tool definitions and descriptions, the result formatting, the error handling, the iteration cap, the SDK's permissions and hooks - is scaffolding around the model. That scaffolding has a name: the **harness**. A useful equation to carry forward:

```
agent = model + harness
```

This matters because the harness, not the model, is usually what determines whether your agent works. A decent model with a great harness will beat a great model with a bad harness - benchmark teams have jumped dozens of ranks on agentic coding leaderboards by changing only the harness, with the model untouched. So when your agent misbehaves, resist the instinct to conclude "the model is not smart enough." Most agent failures are configuration failures: a vague tool description, a missing feedback signal, context stuffed with irrelevant material.

The practical habit this suggests is the **ratchet**: every time your agent fails, turn the failure into a permanent constraint in the harness so it cannot happen the same way twice. The agent used the wrong test runner? Add a line to your [AGENTS.md](/15-agents-md/). It skipped verification? Add a hook that runs the tests after every edit. It produced a bad output shape? Add the case to your evals from [Lesson 9](/09-evaluating-and-testing-agents/). Each fix ratchets the floor upward, and the harness compounds in value while prompts alone would not. Addy Osmani's [Agent Harness Engineering](https://addyosmani.com/blog/agent-harness-engineering/) is a good deep dive on this mindset.

______________________________________________________________________

## Before you ship

An agent that calls tools is software that takes actions on your behalf, so treat it like production software from the first commit:

> ⚠️ **Revisit the guardrails:** Before this agent touches anything real, revisit [Lesson 10: Guardrails and safety](/10-guardrails-and-safety/) and, earlier in the course, [Lesson 11: From prototype to production](/11-from-prototype-to-production/). Between them they cover the input validation, permissioning, monitoring, and rollout discipline a tool-using agent needs. And your company's own AI principles and guardrails still apply - check the internal documentation before you deploy.

Never hardcode API keys or credentials in your agent code - read them from the environment, exactly as the SDK reads `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL`. This is basic software hygiene, but it is easy to forget while prototyping.

If you are exposing this agent as a service other systems call into, the company's standard shape for that is a FastAPI app run under uvicorn - see [Lesson 11: From prototype to production](/11-from-prototype-to-production/) for the deployment concerns that come with it.

______________________________________________________________________

## Key takeaways

1. **The agent loop is small.** Call the model, and while `stop_reason == "tool_use"`, run the requested tools and feed the results back. When it stops asking, read the final answer. That loop is the whole idea.

2. **The tool-result contract is strict.** Every `tool_use` block needs exactly one `tool_result` matched by `tool_use_id`; append the assistant turn before the results; put all parallel results in one user message.

3. **Work with structured data, not strings.** `block.input` is already a parsed dict. Read it by key.

4. **Fail loudly to the model, not to your process.** Return `tool_result` with `is_error: True` so the model can recover, and cap iterations so a stuck agent cannot run forever.

5. **Learn with the raw loop, ship with the SDK.** Hand-roll the loop to understand it, then reach for the Claude Agent SDK when you want built-in tools, permissioning, hooks, subagents, and MCP - all of which run through your LiteLLM proxy already.

6. **The harness determines the agent.** Most agent failures are harness failures, not model failures. When something goes wrong, ratchet a fix into the harness - an instruction, a hook, an eval - so it cannot recur.

______________________________________________________________________

## What is next?

Now that you can build an agent, you need to understand how agents connect to the wider world of tools and to each other. In the next lesson we explore two important protocols - MCP and A2A - that let agents talk to tools and to other agents using open standards. MCP is exactly the mechanism the Agent SDK uses to plug in external capabilities, so you have already met the reason it matters.

[\<-- Previous: Lesson 12 - Getting started with Claude Code and the LiteLLM proxy](/12-getting-started-with-claude-code/)

[Next: Lesson 14 - Agent Protocols: MCP and A2A -->](/14-agent-protocols-mcp-and-a2a/)
