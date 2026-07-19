// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Agent Engineer',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/lsimons/agent-engineer-course' }],
			sidebar: [
				{
					label: 'Part 1: Fundamentals',
					items: [
						{ slug: '01-what-are-ai-agents' },
						{ slug: '02-how-agents-think' },
						{ slug: '03-tools-giving-agents-hands' },
						{ slug: '04-agentic-design-patterns' },
						{ slug: '05-memory-and-context' },
						{ slug: '06-planning-and-reasoning' },
						{ slug: '07-multi-agent-systems' },
						{ slug: '08-agentic-rag' },
						{ slug: '09-evaluating-and-testing-agents' },
						{ slug: '10-guardrails-and-safety' },
					],
				},
				{
					label: 'Part 2: Building and Shipping',
					items: [
						{ slug: '11-from-prototype-to-production' },
						{ slug: '12-getting-started-with-vertex-and-adk' },
						{ slug: '13-building-your-first-agent' },
						{ slug: '14-agent-protocols-mcp-and-a2a' },
					],
				},
				{
					label: 'Part 3: Deep Dives',
					items: [
						{ slug: '15-agents-md' },
						{ slug: '16-mcp-deep-dive' },
						{ slug: '17-agent-skills' },
						{ slug: '18-orchestrators' },
						{ slug: '19-where-to-go-from-here' },
					],
				},
			],
		}),
	],
});
