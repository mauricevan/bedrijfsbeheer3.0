# Git Workflow & Conventions
**Versie:** 1.0.0
**Laatst bijgewerkt:** November 2024

---

## 📋 Inhoudsopgave

1. [Branch Strategy](#branch-strategy)
2. [Commit Conventions](#commit-conventions)
3. [Pull Request Workflow](#pull-request-workflow)
4. [Code Review Guidelines](#code-review-guidelines)
5. [Git Hooks](#git-hooks)
6. [Versioning](#versioning)

---

## 🌿 Branch Strategy

### Git Flow (Recommended for Teams)

```
main (production)
  ↑
develop (integration)
  ↑
feature/*, bugfix/*, hotfix/*
```

**Branch Types:**

```bash
# Main branches (long-lived)
main                    # Production-ready code
develop                 # Integration branch

# Supporting branches (short-lived)
feature/*              # New features
bugfix/*               # Bug fixes
hotfix/*               # Urgent production fixes
release/*              # Release preparation
chore/*                # Maintenance tasks
```

### Branch Naming Convention

```bash
# Format: <type>/<ticket-id>-<short-description>

# ✅ GOOD
feature/AUTH-123-add-login-page
bugfix/DASH-456-fix-chart-rendering
hotfix/PROD-789-critical-security-patch
chore/update-dependencies

# ❌ BAD
new-feature
fix
maurice-changes
test-branch
```

**Naming Rules:**
- ✅ Lowercase with hyphens
- ✅ Include ticket/issue ID (if applicable)
- ✅ Descriptive but concise (max 50 chars)
- ❌ No spaces or special characters
- ❌ No personal names

### Creating Branches

```bash
# Update your local repository
git checkout develop
git pull origin develop

# Create feature branch from develop
git checkout -b feature/AUTH-123-add-login-page

# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/PROD-789-security-patch

# Push new branch to remote
git push -u origin feature/AUTH-123-add-login-page
```

### Branch Lifecycle

```bash
# 1. Create branch
git checkout -b feature/new-feature

# 2. Work on feature (commit regularly)
git add .
git commit -m "feat: add login form validation"

# 3. Keep branch updated with develop
git checkout develop
git pull origin develop
git checkout feature/new-feature
git merge develop
# Or use rebase (cleaner history):
git rebase develop

# 4. Push to remote
git push origin feature/new-feature

# 5. Create Pull Request (on GitHub/GitLab)

# 6. After PR is merged, delete branch
git checkout develop
git pull origin develop
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

---

## 📝 Commit Conventions

### Conventional Commits

Format: `<type>(<scope>): <subject>`

```bash
# Structure
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

```bash
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation only
style:    # Formatting, missing semicolons, etc (no code change)
refactor: # Code change that neither fixes a bug nor adds a feature
perf:     # Performance improvement
test:     # Adding or updating tests
build:    # Build system or external dependencies
ci:       # CI configuration files and scripts
chore:    # Other changes that don't modify src or test files
revert:   # Reverts a previous commit
```

### Commit Examples

```bash
# ✅ GOOD COMMITS

# Feature
feat(auth): add JWT authentication
feat(dashboard): implement user analytics chart

# Bug fix
fix(api): resolve null pointer in user service
fix(ui): correct button alignment on mobile

# Documentation
docs(readme): update installation instructions
docs(api): add endpoint documentation

# Refactoring
refactor(utils): simplify date formatting logic
refactor(components): extract reusable Button component

# Performance
perf(dashboard): optimize chart rendering
perf(api): add caching layer for user queries

# Testing
test(auth): add unit tests for login flow
test(utils): increase coverage for validators

# Build/CI
build(deps): upgrade React to v19
ci(github): add automated testing workflow

# Chore
chore(lint): fix ESLint warnings
chore(cleanup): remove unused imports

# ❌ BAD COMMITS
git commit -m "fix"
git commit -m "updates"
git commit -m "WIP"
git commit -m "changes"
git commit -m "asdasd"
```

### Commit Message Guidelines

**Subject Line (first line):**
```bash
# ✅ DO
- Use imperative mood ("add" not "added" or "adds")
- Start with lowercase (after type)
- No period at the end
- Max 72 characters
- Be specific and concise

# Examples
feat(auth): add password reset functionality
fix(api): resolve race condition in data fetch
docs(contributing): update PR template

# ❌ DON'T
- "Added new feature"           # Past tense
- "Adds authentication."        # Present tense + period
- "auth stuff"                  # Too vague
- "This commit adds a very long description..." # Too long
```

**Body (optional):**
```bash
# Use body to explain WHAT and WHY, not HOW
git commit -m "feat(auth): add two-factor authentication

Implement 2FA using TOTP (Time-based One-Time Password).
This adds an additional security layer for user accounts.

- Add QR code generation for authenticator apps
- Implement backup codes for account recovery
- Add settings page for 2FA management

Closes #123"
```

**Footer (optional):**
```bash
# Breaking changes
BREAKING CHANGE: API endpoint /api/users changed to /api/v2/users

# Issue references
Closes #123
Fixes #456
Refs #789

# Multiple issues
Closes #123, #456, #789
```

### Complete Commit Example

```bash
git commit -m "feat(api): add user pagination support

Implement cursor-based pagination for /api/users endpoint
to improve performance with large datasets.

Changes:
- Add pagination parameters (limit, cursor)
- Update User model with cursor field
- Add integration tests for pagination

BREAKING CHANGE: Response format changed to include pagination metadata

Closes #234"
```

---

## 🔄 Pull Request Workflow

### Creating a Pull Request

```bash
# 1. Ensure your branch is up to date
git checkout feature/my-feature
git fetch origin
git rebase origin/develop

# 2. Push your branch
git push origin feature/my-feature

# 3. Create PR on GitHub/GitLab
# - Add descriptive title
# - Fill in PR template
# - Link related issues
# - Request reviewers
# - Add labels
```

### PR Title Convention

```bash
# Format: Same as commit convention
<type>(<scope>): <description>

# Examples
feat(auth): Add OAuth 2.0 login
fix(dashboard): Resolve chart rendering bug
docs(api): Update authentication guide
```

### PR Description Template

```markdown
## Description
[Brief description of the changes]

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that breaks existing functionality)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] CI/CD changes

## Related Issues
Closes #123
Refs #456

## Changes Made
- [Change 1]
- [Change 2]
- [Change 3]

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

### Test Instructions
1. Step 1
2. Step 2
3. Expected result

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Tested on multiple browsers (if UI change)
- [ ] Mobile responsive (if UI change)

## Breaking Changes
[List any breaking changes or N/A]

## Additional Notes
[Any additional context or notes]
```

### PR Best Practices

```markdown
# ✅ DO
- Keep PRs small and focused (< 400 lines changed)
- Link related issues
- Add screenshots for UI changes
- Write clear description
- Respond to reviews promptly
- Squash commits before merging (if many WIP commits)

# ❌ DON'T
- Mix multiple unrelated changes
- Submit PRs without testing
- Ignore review comments
- Force push after reviews started
- Leave unresolved conversations
```

---

## 👀 Code Review Guidelines

### For PR Authors

```markdown
### Before Requesting Review
- [ ] Code is complete and tested
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Code is self-reviewed
- [ ] Documentation updated
- [ ] Branch is up to date with target branch

### During Review
- [ ] Respond to all comments
- [ ] Make requested changes
- [ ] Mark conversations as resolved
- [ ] Re-request review after changes
- [ ] Be open to feedback
```

### For Reviewers

```markdown
### Review Checklist
- [ ] Code follows style guidelines
- [ ] Logic is sound and efficient
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Tests are adequate
- [ ] No security vulnerabilities
- [ ] No performance issues
- [ ] Documentation is clear
- [ ] No unnecessary complexity

### Review Comments Format

# ✅ GOOD COMMENTS
"Consider using `useMemo` here to avoid re-calculation on every render"
"This could throw if `user` is null. Add a null check?"
"Great solution! Minor: variable name could be more descriptive"

# ❌ BAD COMMENTS
"This is wrong"
"Change this"
"I don't like this"

### Comment Tags
- **[BLOCKING]:** Must be fixed before merge
- **[SUGGESTION]:** Nice to have, not required
- **[QUESTION]:** Need clarification
- **[NITPICK]:** Minor style/preference issue
```

### Review Approval Process

```bash
# Small changes (< 100 lines)
→ 1 approval required

# Medium changes (100-400 lines)
→ 2 approvals required

# Large changes (> 400 lines)
→ Should be split into smaller PRs
→ Or 2+ approvals + team lead approval

# Critical changes (security, data, breaking)
→ 2+ approvals + team lead/architect approval
```

---

## 🪝 Git Hooks

### Husky Setup

```bash
# Install Husky
npm install -D husky
npx husky install

# Add to package.json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# 1. Lint staged files
npm run lint-staged

# 2. Type check
npm run type-check

# 3. Run tests (optional)
# npm run test:changed

echo "✅ Pre-commit checks passed!"
```

### Commit Message Hook

```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate commit message format
npx --no-install commitlint --edit $1
```

### Commitlint Configuration

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
  },
};
```

### Lint-staged Configuration

```javascript
// .lintstagedrc.js
module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  '*.{json,md,yml,yaml}': [
    'prettier --write',
  ],
};
```

### Pre-push Hook

```bash
# .husky/pre-push
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# 1. Run all tests
npm run test

# 2. Build project
npm run build

# 3. Check for console.logs (optional)
git diff origin/develop --name-only | grep -E '\.(ts|tsx|js|jsx)$' | xargs grep -n "console\\.log" && echo "⚠️  Found console.log statements" && exit 1 || true

echo "✅ Pre-push checks passed!"
```

---

## 🏷️ Versioning

### Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH

Example: 2.3.1

MAJOR: Breaking changes (2.0.0)
MINOR: New features, backwards compatible (2.3.0)
PATCH: Bug fixes, backwards compatible (2.3.1)
```

### Version Bumping

```bash
# Patch release (bug fixes)
npm version patch
# 1.0.0 → 1.0.1

# Minor release (new features)
npm version minor
# 1.0.1 → 1.1.0

# Major release (breaking changes)
npm version major
# 1.1.0 → 2.0.0

# Pre-release versions
npm version prepatch
# 1.0.0 → 1.0.1-0

npm version preminor
# 1.0.0 → 1.1.0-0

npm version premajor
# 1.0.0 → 2.0.0-0
```

### Release Process

```bash
# 1. Ensure you're on develop branch
git checkout develop
git pull origin develop

# 2. Create release branch
git checkout -b release/v2.3.0

# 3. Bump version
npm version minor  # or patch/major

# 4. Update CHANGELOG.md
# Add release notes for v2.3.0

# 5. Commit changes
git add .
git commit -m "chore(release): prepare v2.3.0"

# 6. Push release branch
git push origin release/v2.3.0

# 7. Create PR to main
# Title: "Release v2.3.0"
# Merge to main

# 8. Tag the release
git checkout main
git pull origin main
git tag -a v2.3.0 -m "Release v2.3.0"
git push origin v2.3.0

# 9. Merge back to develop
git checkout develop
git merge main
git push origin develop

# 10. Delete release branch
git branch -d release/v2.3.0
git push origin --delete release/v2.3.0
```

### Changelog Template

```markdown
# Changelog

## [2.3.0] - 2024-11-14

### Added
- New user authentication system with OAuth 2.0
- Dashboard analytics with real-time updates
- Export functionality for reports

### Changed
- Improved performance of data table rendering
- Updated UI design for better accessibility
- Refactored API client for better error handling

### Fixed
- Fixed memory leak in chart component
- Resolved race condition in user service
- Corrected timezone issues in date picker

### Removed
- Deprecated legacy authentication method
- Removed unused dependencies

### Security
- Updated dependencies to patch vulnerabilities
- Added rate limiting to API endpoints

## [2.2.1] - 2024-11-01

### Fixed
- Hotfix: Critical security vulnerability in auth module
```

---

## 🛡️ Git Best Practices

### DO's

```bash
# ✅ Commit often (small, logical commits)
git commit -m "feat(auth): add login form"
git commit -m "feat(auth): add form validation"
git commit -m "feat(auth): integrate with API"

# ✅ Pull before push
git pull origin develop
git push origin feature/my-feature

# ✅ Use descriptive branch names
feature/AUTH-123-oauth-integration

# ✅ Keep commits atomic (one logical change per commit)

# ✅ Write meaningful commit messages

# ✅ Review your own PR before requesting review
```

### DON'Ts

```bash
# ❌ Don't commit directly to main/develop
git checkout main
git commit -m "quick fix"  # NO!

# ❌ Don't force push to shared branches
git push --force origin develop  # NO!

# ❌ Don't commit sensitive data
git add .env  # NO! (use .gitignore)

# ❌ Don't use generic commit messages
git commit -m "fix stuff"  # NO!

# ❌ Don't push incomplete/broken code

# ❌ Don't mix unrelated changes in one commit
```

### Useful Git Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Amend last commit (before push)
git commit --amend

# Stash changes temporarily
git stash
git stash pop

# View commit history
git log --oneline --graph --all

# Cherry-pick specific commit
git cherry-pick <commit-hash>

# Clean untracked files
git clean -fd

# View changes before committing
git diff
git diff --staged

# Revert a commit
git revert <commit-hash>

# Interactive rebase (clean up history)
git rebase -i HEAD~3

# Find bugs with bisect
git bisect start
git bisect bad
git bisect good <commit-hash>
```

---

## 📋 Git Workflow Checklist

### Starting New Work

```markdown
- [ ] Pull latest from develop: `git pull origin develop`
- [ ] Create new branch: `git checkout -b feature/...`
- [ ] Set up tracking: `git push -u origin feature/...`
```

### While Working

```markdown
- [ ] Commit regularly with meaningful messages
- [ ] Follow commit convention
- [ ] Keep branch updated: `git merge develop` or `git rebase develop`
- [ ] Push commits: `git push`
```

### Before Creating PR

```markdown
- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Self-review completed
- [ ] Branch up to date with develop
- [ ] Meaningful commit messages
```

### PR Process

```markdown
- [ ] Fill in PR template
- [ ] Link related issues
- [ ] Request reviewers
- [ ] Respond to review comments
- [ ] Make requested changes
- [ ] Squash commits (if needed)
```

### After Merge

```markdown
- [ ] Delete feature branch locally: `git branch -d feature/...`
- [ ] Delete remote branch: `git push origin --delete feature/...`
- [ ] Pull latest develop: `git pull origin develop`
```

---

## 📚 Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Semantic Versioning](https://semver.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint](https://commitlint.js.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## 🎯 Quick Reference

```bash
# Common workflow
git checkout develop
git pull origin develop
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "feat: add new feature"
git push -u origin feature/new-feature
# Create PR on GitHub/GitLab

# Hotfix workflow
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix
# ... make fix ...
git commit -m "fix: critical security patch"
git push -u origin hotfix/critical-fix
# Create PR to main
# After merge, backport to develop
```
