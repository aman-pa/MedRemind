# Project Guidelines

## Local Setup

### Clone the repository

```bash
git clone <your-repository-url>
cd MedRemind
```

### Install dependencies

Install frontend and backend dependencies separately:

```bash
cd frontend
npm install

cd ../backend
npm install
```

### Run the frontend locally

```bash
cd frontend
npm run dev
```

The backend is currently a scaffold and does not yet include a start script or server entry file.

## Workflow Rules

- Never push directly to `main`.
- Always create a branch for your work.
- Open a pull request for review before merging.
- Keep pull requests focused on one task or bug when possible.
- Pull the latest changes from `main` before starting new work.
- If your branch is behind `main`, rebase or merge `main` before opening a PR, following the project preference if one is established.

## Coding Standards

- Match the existing code style and file structure.
- Keep components and functions small and readable.
- Use descriptive names for variables, functions, and files.
- Avoid adding unnecessary dependencies.
- Write clear commit messages.
- Test your changes locally before opening a PR.
- Do not leave debugging code, commented-out code, or temporary logs in committed files.

## Suggested Commit Message Style

Use short, descriptive commit messages such as:

- `feat: add medication reminder card`
- `fix: prevent duplicate reminders`
- `docs: update setup guide`
- `chore: update dependencies`

## Common Git Commands

### Basic workflow

```bash
git status
git branch
git checkout -b feature/my-change
git add .
git commit -m "feat: describe your change"
git push origin feature/my-change
```

### Sync with remote

```bash
git fetch origin
git pull origin main
git pull --rebase origin main
```

### Inspect history and changes

```bash
git log --oneline --graph --decorate --all
git diff
git diff --staged
git show <commit-hash>
```

### Undo local changes carefully

```bash
git restore <file>
git restore --staged <file>
git clean -n
```

## Pull Request Checklist

Before opening a PR, make sure:

- Your branch is up to date with `main`.
- Your code runs locally.
- You have checked for lint or build issues.
- Your changes are described clearly in the PR.
- You have not committed unrelated files.

## Need Help?

If something is unclear, leave a note in the PR or ask the maintainers before merging into `main`.