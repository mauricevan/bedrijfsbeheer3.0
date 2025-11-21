---
description: DOCUMENTATION PATTERNS
---

# Documentation Patterns & Style Guide
**Versie:** 1.0.0
**Laatst bijgewerkt:** November 2024
**Bron:** Geëxtraheerd uit bedrijfsbeheer2.0 project

---

## 📋 Inhoudsopgave

1. [Documentation Structure](#documentation-structure)
2. [Markdown Conventions](#markdown-conventions)
3. [Code Examples](#code-examples)
4. [Emoji Usage](#emoji-usage)
5. [Templates](#templates)

---

## 📁 Documentation Structure

### Recommended Folder Structure

```
docs/
├── 01-getting-started/       # Onboarding
│   ├── installation.md
│   ├── quick-start.md
│   └── README.md
│
├── 02-architecture/          # Technical architecture
│   ├── adr/                 # Architecture Decision Records
│   │   ├── 001-decision.md
│   │   └── README.md
│   ├── technical-stack.md
│   ├── project-structure.md
│   └── README.md
│
├── 03-features/              # Feature documentation
│   ├── feature-1.md
│   ├── feature-2.md
│   └── README.md
│
├── 04-api/                   # API documentation
│   ├── endpoints.md
│   ├── authentication.md
│   └── README.md
│
├── 05-guides/                # How-to guides
│   ├── deployment.md
│   ├── troubleshooting.md
│   └── README.md
│
├── 06-changelog/             # Version history
│   ├── v1.x.md
│   ├── v2.x.md
│   └── README.md
│
├── INDEX.md                  # Master index
└── README.md                 # Main documentation entry
```

### Principles

1. **Numbered folders** voor logische volgorde
2. **Descriptive names** (niet "misc" of "other")
3. **Max 3 niveaus** diep
4. **README.md** in elke folder als index
5. **INDEX.md** als master overzicht

---

## 📝 Markdown Conventions

### Heading Hierarchy

```markdown
# H1 - Document Title (1x per document)

## H2 - Main Sections

### H3 - Subsections

#### H4 - Details (avoid deeper than H4)
```

**Rules:**
- ✅ Always space after `#`: `## Title` (not `##Title`)
- ✅ Logical progression: H1 → H2 → H3
- ❌ Never skip levels: H1 → H3 is wrong

### Lists

#### Ordered Lists

```markdown
1. First step - use for sequences
2. Second step - order matters
3. Third step - numbered
```

#### Unordered Lists

```markdown
- Item 1 - use for groups
- Item 2 - order doesn't matter
- Item 3 - bulleted
```

#### Nested Lists

```markdown
1. **Main step**
   - Substep A
   - Substep B
     - Detail 1
     - Detail 2
2. **Next main step**
```

**Rules:**
- ✅ 2 spaces for nested items (not tabs)
- ✅ Bold for important list items
- ✅ Max 3 levels deep

### Code Blocks

#### With Syntax Highlighting

````markdown
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function createUser(data: User): User {
  return data;
}
```
````

#### Terminal Commands

````markdown
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
````

#### DO/DON'T Examples

````markdown
```typescript
// ✅ CORRECT
const user: User = { id: '1', name: 'John' };
setUsers([...users, newUser]);

// ❌ WRONG
const user: any = { id: '1', name: 'John' };  // Never use 'any'
users.push(newUser);                           // Direct mutation
```
````

### Links

#### Internal Links

```markdown
<!-- Relative paths -->
See [Technical Stack](./02-architecture/technical-stack.md) for details.
Read more in [README](../README.md).
```

#### External Links

```markdown
<!-- Full URL -->
Check the [React docs](https://react.dev/) for more information.
```

#### Anchor Links

```markdown
## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Installation
Content here...
```

**Rules:**
- ✅ Lowercase for anchors: `#installation`
- ✅ Hyphens for spaces: `#quick-start`
- ✅ Remove emoji from anchors: `#installation` (not `#⚙️-installation`)

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data A   | Data B   | Data C   |
| Data D   | Data E   | Data F   |
```

**Alignment:**

```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L1   |   C1   |    R1 |
```

**Rules:**
- ✅ Header row required
- ✅ Max 5 columns (otherwise use lists)
- ✅ Align pipes for readability

### Blockquotes

```markdown
> **Note:** This is an important note.

> ⚠️ **Warning:** This may cause data loss!

> 💡 **Tip:** Use Ctrl+F for quick search.
```

**Types:**
- **Note**: Neutral information
- **Warning**: Potential issues
- **Tip**: Helpful suggestions
- **Danger**: Critical warnings

---

## 💡 Code Examples

### Complete Examples

````markdown
### User Management Example

**Purpose:** Show how to create and manage users

```typescript
import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div>
      <h1>Users: {users.length}</h1>
      {/* UI implementation */}
    </div>
  );
}

export default UserManagement;
```

**Key Features:**
- Immutable state updates
- TypeScript type safety
- Clean separation of concerns
````

### Inline Code

```markdown
Use the `useState` hook for local state management.
The `map()` function creates a new array.
Install with `npm install react`.
```

---

## 🎨 Emoji Usage

### Consistent Emoji Mapping

```markdown
## Section Headers
🎯 Goal/Objective
📋 Overview/Summary
🚀 Quick Start
⚙️ Configuration
🏗️ Architecture
📚 Features
🔒 Security
🐛 Troubleshooting
📖 Examples
💡 Tips
⚠️ Warnings
❓ FAQ
📞 Support

## Status Indicators
✅ Correct/Done
❌ Wrong/Avoid
⚠️ Warning
🔄 In Progress
📝 TODO
🎯 Recommendation
⚡ Performance
🔐 Security
```

**Rules:**
- ✅ Max 1 emoji per heading
- ✅ Max 3 emojis per paragraph
- ✅ Use consistently across documents
- ❌ Don't overuse emojis

---

## 📄 Templates

### Feature Documentation Template

````markdown
# [Feature Name]

**Status:** ✅ Available / 🔄 In Development / 📅 Planned
**Version:** [X.Y.Z]
**Last Updated:** [Month Year]

---

## Overview

[1-2 sentences explaining what this feature does]

## Key Features

- ✅ Feature 1 - Description
- ✅ Feature 2 - Description
- 🔄 Feature 3 - In development

## Usage

### For End Users

**Step 1: [Title]**
[Description + screenshot if applicable]

**Step 2: [Title]**
[Description + screenshot if applicable]

### For Developers

**Installation:**
```bash
npm install [package]
```

**Basic Usage:**
```typescript
[Code example]
```

## Technical Details

### Architecture
[Diagram or description]

### API

```typescript
interface FeatureAPI {
  method1(): void;
  method2(param: string): Promise<Result>;
}
```

## Best Practices

- 💡 Tip 1
- 💡 Tip 2

## Troubleshooting

### Issue: [Common problem]
**Symptoms:**
- Symptom 1
- Symptom 2

**Solution:**
1. Step 1
2. Step 2

## Related Documentation

- [Link 1](./path/to/doc.md)
- [Link 2](./path/to/doc.md)

---

**Last Reviewed:** [Month Year]
````

### API Documentation Template

````markdown
## [Endpoint Name]

**URL:** `[METHOD] /api/path`
**Auth Required:** Yes/No
**Permissions:** Admin/User/Public

### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "field": "value"
}
```

### Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid input"
}
```

### Example

```typescript
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ field: 'value' })
});

const data = await response.json();
```

### Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Server Error |
````

### README Template

````markdown
# [Project Name]

**Version:** [X.Y.Z]
**Status:** Active/Beta/Deprecated
**Last Updated:** [Month Year]

---

## Overview

[Brief description of the project in 2-3 sentences]

## Features

- ✅ Feature 1
- ✅ Feature 2
- 🔄 Feature 3 (In development)
- 📅 Feature 4 (Planned)

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL
- **Testing:** Vitest, React Testing Library
- **Build:** Vite

## Quick Start

```bash
# Clone repository
git clone <repository-url>
cd <project-folder>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/       # UI components
├── features/         # Business logic
├── pages/            # Page components
└── types/            # TypeScript types
```

## Documentation

- [Getting Started](./docs/01-getting-started/README.md)
- [Architecture](./docs/02-architecture/README.md)
- [API Reference](./docs/04-api/README.md)

## Contributing

[Contribution guidelines]

## License

[License information]

## Contact

[Contact information]

---

**Happy coding! 🚀**
````

---

## ✅ Documentation Best Practices

### General Guidelines

**1. Write for Your Audience**
- For users: Step-by-step guides, screenshots
- For developers: Code examples, API docs
- For architects: ADRs, design decisions

**2. Keep it DRY (Don't Repeat Yourself)**
```markdown
// ✅ GOOD
See [User Roles](./user-roles.md) for permissions

// ❌ BAD
[Copy-paste entire user roles section in every doc]
```

**3. Update Timestamps**
```markdown
**Last Updated:** November 2024
**Status:** Current
```

**4. Use Semantic Versioning**
```
1.0.0 - Initial documentation
1.1.0 - Added new section
1.1.1 - Fixed typos
2.0.0 - Major restructure
```

**5. Cross-Link Liberally**
```markdown
## Related Documentation
- [Related Topic 1](./link.md) - Brief description
- [Related Topic 2](./link.md) - Brief description
```

**6. Always Test Code Examples**
```markdown
// ✅ GOOD - Tested and working code
// ❌ BAD - Untested pseudo-code
```

**7. Use Visual Hierarchy**
```markdown
# Main Topic

## Subtopic

### Detail

Regular paragraph text
```

---

## 📏 Quality Checklist

Every document should have:

```markdown
- [ ] Clear title (H1)
- [ ] Table of contents (if >500 lines)
- [ ] "Last Updated" timestamp
- [ ] "Related Documentation" section
- [ ] Practical examples
- [ ] Consistent formatting
- [ ] No broken links
- [ ] Proper markdown syntax
- [ ] Tested code examples
- [ ] Appropriate emoji usage
```

---

## 🔗 Related Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Write the Docs](https://www.writethedocs.org/)

