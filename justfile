# Agent Engineer Course

# Docs: start dev server
docs-dev:
    cd docs && bun run dev

# Docs: build static site
docs-build:
    cd docs && bun run build

# Docs: preview production build
docs-preview:
    cd docs && bun run preview

# Docs: install dependencies
docs-install:
    cd docs && bun install

# Docs: check for Astro issues
docs-check:
    cd docs && bunx astro check

# Docs: clean build artifacts
docs-clean:
    rm -rf docs/dist docs/.astro
