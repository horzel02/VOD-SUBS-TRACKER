# 💳 Subscription & Budget Tracker

A modern web application designed to monitor recurring expenses, manage VoD/gaming subscriptions, and analyze monthly budgets. 

Built with **React**, **TypeScript**, and **Chakra UI**, featuring interactive dashboards, data visualization, and local data persistence.

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript-blue)

## 🚀 Key Features

* **📊 Financial Dashboard:** Real-time overview of monthly costs, active subscriptions, and budget utilization.
* **📅 Renewal Calendar:** Visual timeline (Monthly/Weekly views) for upcoming payment dates using `react-big-calendar`.
* **💰 Budget Control:** Set limits per category (VoD, Music, Games) and track spending with progress bars.
* **📈 Analytics:** Charts visualization for category distribution and cost forecasting using `Recharts`.
* **⚙️ Data Management:** * Full **CRUD** for subscriptions (currency, billing cycle, status).
    * **JSON Import/Export** for data backup and migration.
* **🎨 UI/UX:** Dark/Light mode toggle, interactive animations (`Framer Motion`), and responsive design.

## 🛠️ Tech Stack

* **Core:** React 18, TypeScript, Vite
* **UI Framework:** Chakra UI
* **Data Visualization:** Recharts, react-big-calendar
* **State & Logic:** LocalStorage (persistence), dayjs (date manipulation)
* **Routing:** React Router

## 📂 Architecture Note

Currently, the application operates as a **Serverless/Client-side** solution. All data is stored securely in the user's browser via **LocalStorage**. 
The architecture is designed to be easily adaptable to a REST API backend in the future.

## 🔧 Installation & Setup

1.  Clone the repository:
    ```bash
    git clone [https://github.com/horzel02/VOD-SUBS-TRACKER.git](https://github.com/horzel02/VOD-SUBS-TRACKER.git)
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
