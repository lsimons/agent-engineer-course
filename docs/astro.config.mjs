// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = '/agent-engineer-course';

/**
 * The lesson content links between chapters with root-relative routes
 * (`/NN-chapter-name/`), which keeps the markdown portable. This rehype
 * plugin prefixes those links with the deploy base path at render time.
 */
function rehypeBaseLinks() {
	/** @param {any} node */
	const visit = (node) => {
		if (
			node.type === 'element' &&
			node.tagName === 'a' &&
			typeof node.properties?.href === 'string'
		) {
			const href = node.properties.href;
			if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith(`${base}/`)) {
				node.properties.href = base + href;
			}
		}
		for (const child of node.children ?? []) visit(child);
	};
	return (/** @type {any} */ tree) => {
		visit(tree);
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://lsimons.github.io',
	base,
	markdown: {
		rehypePlugins: [rehypeBaseLinks],
	},
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
						{ slug: '12-getting-started-with-claude-code' },
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
