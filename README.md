# M. Emily Chang | Portfolio

A sleek, retro-inspired personal portfolio that functions as both a static document and an interactive terminal. Built with vanilla JavaScript, CSS3, and HTML5.

## 🚀 Features

* **Dual View Modes:**
    * **Terminal View:** A fully functional, interactive CLI environment with command history, autocomplete, and fuzzy-matching for commands.
    * **Reader View:** A clean, accessible, and readable layout for users who prefer standard web navigation.
* **Command Line Experience:**
    * Supports familiar commands like `help`, `about`, `skills`, `projects`, `contact`, and `neofetch`.
    * Fuzzy-matching logic handles typos gracefully.
    * Tab-completion for faster interaction.
* **Themes:** Dark and Light mode support with persistence via `localStorage`.
* **Responsive Design:** Fully fluid layout that adjusts from desktop terminals to mobile device touch targets.
* **Performance:** Zero dependencies, lightning-fast loading, and no build process required.

## 🛠 Tech Stack

* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
* **Styling:** CSS Variables for easy theme management and modular component design.
* **Deployment:** Static site hosting friendly (GitHub Pages, GitLab Pages, Netlify, etc.).

## ⚙️ Customization

Everything is configured via a single `CONFIG` object inside the `script` tag.

1. Open the `index.html` file.
2. Locate the `const CONFIG = { ... }` block.
3. Update the fields:
    * **`name`, `role`, `tagline`**: Your professional header info.
    * **`about`**: An array of strings representing your bio paragraphs.
    * **`skills`**: A nested array of `[Category, Description]` pairs.
    * **`projects`**: An array of objects with `title`, `stack`, `desc`, and `url`.
    * **`contact`**: Links for email, LinkedIn, GitHub, etc.

## 🖥 Commands Reference

Once in the Terminal View, users can type the following:

| Command | Description |
| :--- | :--- |
| `help` | Displays all available commands. |
| `about` | Shows your professional summary. |
| `skills` | Lists your technical stack and expertise. |
| `projects` | Displays your portfolio highlights. |
| `contact` | Lists your contact methods and links. |
| `cv` | Triggers a download/view of your CV. |
| `theme` | Toggles between Dark and Light mode. |
| `clear` | Clears the terminal screen. |

## 📦 Usage

Simply host the `index.html` file on any static web host. No database or backend server is required.

---

*This portfolio was designed and built to showcase technical versatility and a focus on clean, readable documentation. It was created with help from **Claude**.*
