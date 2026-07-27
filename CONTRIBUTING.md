# Contributing to MedRemind

Thank you for helping improve MedRemind.

## How to Contribute

Use this workflow for every contribution:

1. Start from the latest `main` branch.

```bash
git checkout main
git pull origin main
```

2. Create a new feature branch for your work.

```bash
git checkout -b feature/short-description
```

3. Make your changes and check them locally.

```bash
git status
git diff
```

4. Commit your work with a clear message.

```bash
git add .
git commit -m "feat: describe your change"
```

5. Push the branch to the remote repository.

```bash
git push -u origin feature/short-description
```

6. Open a pull request from your branch into `main`.

7. Wait for review and approval.

## Who Merges?

- Contributors should not merge directly into `main`.
- Contributors open a pull request and stop there.
- Maintainers review the change and merge it into `main` after approval.

For coding standards, pull request rules, and common git commands, see [PROJECT_GUIDELINES.md](PROJECT_GUIDELINES.md).
