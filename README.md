# ASSENTRIM GATE COMMAND

ASSENTRIM Gate Command is a modern, responsive React-based web application designed for monitoring and controlling gate activities in a high-security facility. The application offers a comprehensive dashboard with real-time camera feeds, activity logs, an operator help desk, and manual gate control capabilities.

## 🚀 Features

- **Real-Time Dashboard Monitoring**: View live statuses of multiple gates, complete with mock video feeds, geographic coordinates, and active gate analytics.
- **Activity Logs Tracking**: Detailed, paginated tables to view past access records (Allowed / Denied), including vehicle types, driver info, and time logs.
- **Operator Help Desk**: An interface designed for operators to manage access requests, view live vehicle information (license plate, driver photo), and process authorizations.
- **Manual Gate Control Modal**: A multi-step interactive modal for operators to manually force open a gate with required reason-logging.
- **Dual Theme Support**: Beautifully crafted Light and Dark modes with custom glass-morphism effects and tailored assets for each theme.
- **Responsive Design**: Built with Tailwind CSS to ensure the layout looks great on both large command-center monitors and standard screens.

## 🛠️ Tech Stack

- **Frontend Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: Internal state-based routing for a single-page application feel.
- **Date Picking**: `react-date-range` / `date-fns`

## 📦 Project Structure

```
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Images, SVGs, and brand assets for Light/Dark themes
│   ├── components/         # Reusable UI components
│   │   ├── Header.jsx           # Top navigation and theme toggle
│   │   ├── CustomSelect.jsx     # Custom styled dropdowns
│   │   ├── CheckboxSelect.jsx   # Multi-select dropdowns
│   │   └── DateRangePicker.jsx  # Calendar date picker
│   ├── pages/              # Application views
│   │   ├── Login.jsx            # Authentication page
│   │   ├── Dashboard.jsx        # Main command dashboard
│   │   ├── ActivityLogs.jsx     # Access history table
│   │   ├── OperatorHelpDesk.jsx # Gate processing interface
│   │   └── Profile.jsx          # User profile view
│   ├── App.jsx             # Root component and router
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global Tailwind styles
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite bundler configuration
└── package.json            # Project dependencies and scripts
```

## ⚙️ Setup and Installation

Follow these steps to get the project running locally:

### 1. Clone the repository
```bash
git clone https://github.com/ArifMunawarr/ASSENTRIM-GATE.git
cd ASSENTRIM-GATE
```

### 2. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 3. Start the Development Server
Run the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## 📜 Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the app for production to the `dist` folder.
- **`npm run lint`**: Runs ESLint to check for code quality issues.
- **`npm run preview`**: Serves the production build locally for testing.

## 🎨 Theming

The application fully supports dynamic switching between **Dark Mode** and **Light Mode**. Assets, border colors, and backdrop blurs seamlessly transition to provide the best contrast depending on the environment. The toggle switch can be found in the header settings dropdown.
