# AIWorkshop — Subscription Audit Dashboard

Multi-framework workshop comparing implementation of the same subscription tracking app across **SvelteKit**, **Go**, **Blazor**, and **React**.

---

## Prerequisites

Before the workshop, make sure you have the following installed on your machine.

### 1. AI-Enhanced Code Editor (Required)

You'll need at least one of the following editors with AI assistant support.

#### Visual Studio Code

| Platform | How to Install |
|----------|---------------|
| **Windows** | Download `.msi` or `.exe` from [code.visualstudio.com/download](https://code.visualstudio.com/download) |
| **macOS** | Download `.dmg` from the website, or run: `brew install --cask visual-studio-code` |
| **Linux (Deb)** | `wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg && sudo mv packages.microsoft.gpg /etc/apt/keyrings/ && sudo apt update && sudo apt install code` |
| **Linux (RPM)** | Download `.rpm` from the website or use the Microsoft repo for Fedora |
| **Snap** | `sudo snap install code --classic` |

#### Cursor

| Platform | How to Install |
|----------|---------------|
| **Windows** | Download from [cursor.com/download](https://cursor.com/download) |
| **macOS** | Download `.dmg` from the website, or run: `brew install --cask cursor` |
| **Linux** | Download `.tar.gz` from the website, extract, and run `./cursor` |

#### Claude Code (CLI)

| Platform | How to Install |
|----------|---------------|
| **All platforms** | If you have Node.js installed: `npm install -g @anthropic-ai/claude-code` |
| **Alternative** | Follow setup at [docs.anthropic.com/claude-code](https://docs.anthropic.com/claude-code) |

> **Note:** You'll also need access to GitHub Copilot, Claude, or a comparable AI coding assistant.

---

### 2. Node.js 18+ and npm 9+

Required for the SvelteKit and React implementations.

| Platform | How to Install |
|----------|---------------|
| **Windows / macOS** | Download the LTS installer from [nodejs.org](https://nodejs.org/) |
| **macOS (Homebrew)** | `brew install node` |
| **Linux (NVM)** | `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh \| bash && nvm install --lts` |
| **Linux (APT)** | `curl -fsSL https://deb.nodesource.com/setup_18.x \| sudo -E bash - && sudo apt install nodejs` |

Verify installation:
```bash
node -v   # Should be v18.x or higher
npm -v    # Should be 9.x or higher
```

#### pnpm (for React)

```bash
npm install -g pnpm
```

---

### 3. Go 1.21+

Required for the Go implementation.

| Platform | How to Install |
|----------|---------------|
| **Windows** | Download `.msi` from [go.dev/dl/](https://go.dev/dl/) |
| **macOS (Homebrew)** | `brew install go` |
| **Linux** | Download `.tar.gz` from [go.dev/dl/](https://go.dev/dl/), then `sudo tar -C /usr/local -xzf go*.tar.gz` |

Verify installation:
```bash
go version   # Should be go1.21.x or higher
```

---

### 4. .NET SDK 8.0

Required for the Blazor implementation.

| Platform | How to Install |
|----------|---------------|
| **Windows** | Download installer from [dotnet.microsoft.com/download/dotnet/8.0](https://dotnet.microsoft.com/download/dotnet/8.0) |
| **macOS (Homebrew)** | `brew install --cask dotnet-sdk@8` |
| **Linux (APT)** | `curl -sSL https://packages.microsoft.com/keys/microsoft.asc \| sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/microsoft.gpg && sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/dotnet-runtime/ubuntu $(lsb_release -cs) main" > /etc/apt/sources.list.d/dotnet.list' && sudo apt update && sudo apt install dotnet-sdk-8.0` |

Verify installation:
```bash
dotnet --version   # Should be 8.0.x
```

---

### 5. SQLite (Optional)

Useful for inspecting the database directly during the workshop.

| Platform | How to Install |
|----------|---------------|
| **Windows** | Download precompiled binaries from [sqlite.org/download.html](https://sqlite.org/download.html), or install via Scoop: `scoop install sqlite` |
| **macOS (Homebrew)** | `brew install sqlite` |
| **Linux (APT)** | `sudo apt install sqlite3` |
| **VS Code Extension** | Search for "SQLite" in the Extensions marketplace |

---

## Quick Checklist

- [ ] Code editor installed (VS Code, Cursor, or Claude Code)
- [ ] AI assistant configured (GitHub Copilot, Claude, or similar)
- [ ] Node.js 18+ and npm 9+
- [ ] pnpm (`npm install -g pnpm`)
- [ ] Go 1.21+
- [ ] .NET SDK 8.0
- [ ] SQLite (optional)

---

## What You'll Build

During the workshop you'll implement the same subscription tracking dashboard in four different frameworks:

1. **SvelteKit** — Reference implementation
2. **Go** — Backend-focused approach
3. **Blazor** — .NET-based full-stack
4. **React** — Component-driven UI

All implementations share the same data model (SQLite), color palette, and seed data.
