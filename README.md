# MD Block Copier

Copy the inner content of fenced ` ```md ` blocks in Visual Studio Code, without the backtick markers.

## ✨ What it does

- Copies only the content inside ` ```md ` blocks
- Skips the ` ```md ` / ` ``` ` markers
- Jump to the next block and copy in one step

Designed for fast prompt / task extraction workflows.

## ⌨️ Shortcuts

| Action             | Shortcut         |
| ------------------ | ---------------- |
| Copy current block | Cmd + Option + M |
| Copy next block    | Cmd + Option + N |

## 🧪 Example

Input:

````
```md
Task 1
```

```md
Task 2
```
````

Result when copying:

```text
Task 1
```

Then Cmd + Option + N -> Result:

```text
Task 2
```

## 🚀 Installation (local)

1. Build the extension:

   `npm run compile`

2. Package it:

   `vsce package`

3. Install in VS Code:

- Open Command Palette
- Run: Extensions: Install from VSIX
- Select the generated `.vsix` file

---

## 🛠 Development

Run extension in dev mode:

`npm run compile`

Then press:

`F5`

---

## ⚠️ Scope & Limitations

- Only supports fenced ` ```md ` blocks
- Does NOT support:
  - ` ```markdown `
  - `~~~md`
- mixed or custom fence formats

This is intentional and optimized for a specific workflow.

## 💡 Notes

- The extension may move your cursor to the selected block
- Clipboard copy happens automatically

## 📦 Version

0.1.0 – initial usable version
