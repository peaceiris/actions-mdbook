# Repository Guidelines

## Project Structure & Module Organization

This repository contains a TypeScript GitHub Action for installing and using
mdBook. Runtime code lives in `src/`, with `src/index.ts` as the entry point and
small modules for URL selection, OS detection, version discovery, and
installation. Action metadata is defined in `action.yml`, which points to the
compiled `lib/index.js` bundle. Tests live in `__tests__/`; fixture responses are
under `__tests__/data/`, and the Docker test image is `__tests__/Dockerfile`.
Workflow, release, and dependency automation lives in `.github/`. Static README
assets live in `images/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies and configure Husky hooks.
- `npm run lint`: run ESLint over `src/**/*.ts`.
- `npm run format:check`: check TypeScript formatting with Prettier.
- `npm run tsc`: type-check the project.
- `npm test`: run Jest tests with coverage and verbose output.
- `npm run build`: bundle `src/index.ts` into `lib/` with `@vercel/ncc`.
- `make build`: build the Docker test image.
- `make test`: run `npm test` inside the Docker test container.

Use Node `24.15.0` from `.nvmrc` when working locally.

## Coding Style & Naming Conventions

Use TypeScript with 2-space indentation, LF line endings, final newlines, and no
trailing whitespace. Prettier enforces 80-column formatting, single quotes,
semicolons, no trailing commas, and compact bracket spacing. Keep modules small
and named by behavior, following existing patterns such as `get-url.ts` and
`get-os.ts`. Prefer explicit, testable functions over inline action logic.

## Testing Guidelines

Jest with `ts-jest` and `jest-circus` runs all `**/*.test.ts` files. Place new
unit tests in `__tests__/` using the module name, for example
`get-url.test.ts`. Store reusable mocked API payloads in `__tests__/data/`.
Run `npm test` before submitting changes; use `make test` when Docker parity is
important.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit-style prefixes such as `ci:`,
`deps:`, and `fix:`. Keep commit subjects imperative and scoped to the change,
for example `fix: handle mdBook latest release lookup`. Pull requests should
explain the change, link related issues when available, and include test results
such as `npm test`, `npm run lint`, and `npm run build`. For action behavior
changes, mention affected inputs or generated `lib/` output.

## Agent-Specific Instructions

Use English for repository-facing content, including documentation, code comments, commit messages, and pull request text, unless the task explicitly requires another language.
