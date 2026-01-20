# Contributing Guide
Hello World
Thank you for your interest in contributing to DeveloperSSS! 🎉
This project is community-driven and grows with contributions from developers like you.

## 🚀 How Can I Contribute?

We use the **"Fork & Pull Request"** workflow to add resources, fix translations, or implement new features. Here are the steps:

### 1. Fork the Project
Click the **"Fork"** button at the top right of the GitHub page to copy the project to your own account.

### 2. Clone to Your Machine
```bash
git clone https://github.com/TunarJamalov/DeveloperSSS.git
cd DeveloperSSS
```

### 3. Create a New Branch
Always work on a clean branch:
```bash
git checkout -b add-new-resource
```

### 4. Make Your Changes
For example, if you want to add a new YouTube channel:
1.  Open `src/data.js`.
2.  Find the relevant category (e.g., `cyber-security`).
3.  Add the new item to the `resources` array in the correct format.

**Example Data Format:**
```javascript
{ 
    type: 'youtube', 
    title: 'Channel Name', 
    url: 'https://youtube.com/...', 
    desc: 'Short description.', 
    lang: 'tr' // or 'en', 'global'
}
```

### 5. Commit and Push
```bash
git add .
git commit -m "Added a new resource to Cyber Security"
git push origin add-new-resource
```

### 6. Open a Pull Request (PR)
1.  Go to your forked repository on GitHub.
2.  Click the **"Compare & pull request"** button.
3.  Describe your changes and submit.

---

## ⚠️ Important Notes

*   **Format:** Be careful not to break the JSON/Object structure in `data.js`. A single missing comma can crash the app.
*   **Language:** Keep descriptions short and clear.
*   **Ads:** Only add genuinely useful, educational resources. Promotional content will not be accepted.

Thank you! 💙
The DeveloperSSS Team
