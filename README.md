# 📦 CLOUDBOX – Cloud Storage Platform  

[![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)](https://react.dev/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)  
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)  
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)  
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  

> **CLOUDBOX** is a secure and efficient cloud storage platform tailored for individuals and businesses.  
It offers **intuitive navigation**, **comprehensive file management**, and **analytics on storage usage** to ensure a seamless user experience.  

---

## ✨ Features  

- **🏠 Home Dashboard** – Recent activity, storage stats, quick actions, and user greetings.  
- **📁 Files Manager** – Upload files, create folders, move files, drag & drop, and real-time feedback.  
- **🔗 Shared** – Manage files shared with you and permissions.  
- **⭐ Starred** – Quick access to favorited files.  
- **🕒 Recent** – View recently accessed items.  
- **🗑️ Trash** – Restore or permanently delete files.  
- **👤 Profile** – Manage personal details.  
- **⚙️ Settings** – Configure account security and privacy.  
- **📊 Analytics** – Visual insights into file usage and storage trends.  
- **📱 Responsive Navigation** – Collapsible sidebar optimized for mobile devices.  

---

## 🖼️ Screenshots  

> *(Add actual screenshots once available – placeholders below)*  

| Dashboard | File Manager | Analytics |
|-----------|--------------|-----------|
| ![Dashboard](public/screenshots/dashboard.png) | ![Files](public/screenshots/files.png) | ![Analytics](public/screenshots/analytics.png) |

---

## 🛠️ Technology Stack  

- **Framework**: [React 19.1.1](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)  
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [PostCSS](https://postcss.org/)  
- **UI/UX**: [Radix UI](https://www.radix-ui.com/) + [Framer Motion](https://www.framer.com/motion/) + [Lucide Icons](https://lucide.dev/)  
- **State & Forms**: React Context API, [React Hook Form](https://react-hook-form.com/) + [Zod Validation](https://zod.dev/)  
- **Routing**: [React Router](https://reactrouter.com/)  
- **Data Visualization**: [Recharts](https://recharts.org/en-US/)  
- **Tooling**: [Vite](https://vitejs.dev/), [pnpm](https://pnpm.io/), [ESLint](https://eslint.org/)  

---

## 📂 Project Structure  

shadcn-ui/
├── README.md # Project overview and setup
├── components.json # Component definitions
├── eslint.config.js # ESLint rules
├── index.html # Root HTML
├── package.json # Dependencies & scripts
├── pnpm-lock.yaml # Lockfile
├── postcss.config.js # PostCSS config
├── public/ # Static assets (favicon, robots.txt, screenshots)
├── src/ # Core application
│ ├── App.css # Main CSS
│ ├── App.tsx # Root App component with routing
│ ├── components/ # Reusable UI components
│ ├── contexts/ # Global state via Context API
│ ├── hooks/ # Custom React hooks
│ ├── lib/ # Utilities & mock data
│ ├── pages/ # Pages (Home, Files, Shared, etc.)
│ └── main.tsx # App entry point
├── styles/theme.css # Theme customization
├── tailwind.config.ts # Tailwind setup
├── template_config.json # Template settings
├── todo.md # Future enhancements
├── tsconfig.* # TypeScript configs
├── LOCAL_SETUP_GUIDE.md # Local development setup guide
└── vite.config.ts # Vite config

---

## ⚡ Getting Started  

### 1️⃣ Prerequisites  
- Node.js **>=18**  
- [pnpm](https://pnpm.io/) installed globally  

### 2️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/cloudbox.git
cd cloudbox
3️⃣ Install Dependencies

pnpm install
4️⃣ Run Development Server
pnpm dev
App will run on: http://localhost:5173

5️⃣ Build for Production
pnpm build
6️⃣ Preview Production Build

pnpm preview
🧩 Contribution Guide
We welcome contributions! To get started:

Fork the repo

Create a feature branch

git checkout -b feature/amazing-feature
Commit your changes

git commit -m "Add amazing feature"
Push the branch

git push origin feature/amazing-feature
Open a Pull Request 🎉

📌 Roadmap
 Add dark mode toggle

 Enhance analytics dashboard

 Integrate cloud storage backend (AWS S3 / Firebase)

 Multi-user collaboration features

 Offline file support

📜 License
This project is licensed under the MIT License – see the LICENSE file for details.

👨‍💻 Author
Shivam Kumar
📧 shivamkumar8021@gmail.com
🔗 GitHub | LinkedIn

---

Shivam, would you like me to also add a **"Deployment" section** (showing how this can be deployed to AWS S3/EC2/Netlify/Vercel) so recruiters see it as a complete **cloud-ready project**?




