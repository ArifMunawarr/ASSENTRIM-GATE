# ASENTRIM GATE COMMAND

ASENTRIM Gate Command is a responsive React frontend for gate monitoring workflows, activity logs, and an operator help desk. The current application uses dummy login, sample activity data, and simulated gate authorization; it does not include a production authentication or gate-control backend.

## 🚀 Features

- **Real-Time Dashboard Monitoring**: Monitor five gates with one camera per gate in a two-column, three-row layout, with the lower-right position intentionally empty and an activity report alongside the feeds.
- **Activity Logs Tracking**: Detailed, paginated tables to view past access records (Allowed / Denied), including vehicle types, driver info, and time logs.
- **Operator Help Desk**: An interface designed for operators to manage access requests, view live vehicle information (license plate, driver photo), and process authorizations.
- **Manual Gate Control Modal**: A multi-step simulation of manual gate opening and reason entry.
- **Dual Theme Support**: Beautifully crafted Light and Dark modes with custom glass-morphism effects and tailored assets for each theme.
- **Responsive Design**: Built with Tailwind CSS to ensure the layout looks great on both large command-center monitors and standard screens.

## 🛠️ Tech Stack

- **Frontend Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: Internal state-based routing for a single-page application feel.
- **Date Picking**: Custom React `DateRangePicker` component.

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
│   │   ├── Login.jsx            # Dummy login page
│   │   ├── Dashboard.jsx        # Main command dashboard
│   │   ├── ActivityLogs.jsx     # Access history table
│   │   ├── OperatorHelpDesk.jsx # Gate processing interface
│   │   └── Profile.jsx          # User profile view
│   ├── App.jsx             # Root component and router
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global Tailwind styles
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite bundler configuration
├── deploy/nginx.conf       # Nginx server block for port 8080
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
Use Node.js 22.12 or newer, then install the locked dependencies. The installed Vite version declares the engine range `^20.19.0 || >=22.12.0`.

```bash
npm ci
```

### 3. Start the Development Server
Run the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) to view it in your browser. Check the terminal URL if that port is already in use.

## Deployment ke server Ubuntu

Target deployment adalah `kemhan@10.70.10.10`, dengan aplikasi di `/var/www/ASSENTRIM-GATE`. Server menggunakan Node.js `22.22.1` dan Nginx yang sudah terpasang. Aplikasi disajikan melalui IPv4 di [http://10.70.10.10:8080](http://10.70.10.10:8080); port 80 sudah digunakan aplikasi lain.

### Instalasi awal

Jalankan perintah berikut pada server melalui SSH. Akun `kemhan` memerlukan akses `sudo` untuk menyiapkan direktori dan konfigurasi Nginx.

```bash
ssh kemhan@10.70.10.10
node --version
npm --version
sudo install -d -o kemhan -g kemhan /var/www/ASSENTRIM-GATE
git clone https://github.com/ArifMunawarr/ASSENTRIM-GATE.git /var/www/ASSENTRIM-GATE
cd /var/www/ASSENTRIM-GATE
npm ci
npm run build
sudo install -m 644 deploy/nginx.conf /etc/nginx/sites-available/assentrim-gate
sudo ln -s /etc/nginx/sites-available/assentrim-gate /etc/nginx/sites-enabled/assentrim-gate
sudo nginx -t && sudo systemctl reload nginx
curl -I http://127.0.0.1:8080/
```

Perintah clone digunakan untuk instalasi baru dengan direktori tujuan kosong. Jika repository sudah ada, gunakan langkah pembaruan di bawah. Pastikan pengguna Nginx dapat membaca `dist` dan menelusuri direktori induknya. Akses dari komputer lain membutuhkan koneksi jaringan ke server dan port TCP 8080 yang diizinkan.

Konfigurasi [deploy/nginx.conf](deploy/nginx.conf) menyajikan hasil build statis dari `dist`, menyediakan fallback SPA ke `index.html`, mengembalikan 404 untuk aset yang tidak ditemukan, dan menolak file tersembunyi. `index.html` menggunakan `no-cache`, sedangkan hasil build dengan hash nama file di `/assets/` menggunakan cache immutable. Proses Node.js atau `npm run preview` tidak diperlukan untuk menjalankan aplikasi setelah build selesai.

### Konfigurasi kamera dan status integrasi

Variabel `VITE_CAM1_WEBRTC_URL` sampai `VITE_CAM5_WEBRTC_URL` adalah konfigurasi saat **build**, bukan saat Nginx mulai berjalan, dengan satu kamera untuk setiap gate. CAM-01 pada Gate 01 menggunakan `http://10.70.10.10:8889/gate-cam/whep` secara default; kamera lain memakai gambar contoh atau status offline selama URL-nya kosong. URL WHEP berbeda dari halaman pemutar `/gate-cam/`. Untuk mengatur endpoint WHEP/WebRTC, buat `.env.local` dari contoh, isi URL yang sesuai, lalu build ulang:

```bash
cp .env.example .env.local
nano .env.local
npm run build
```

Pertahankan `.env.local` yang sudah dikonfigurasi saat melakukan pembaruan. Variabel berawalan `VITE_` dimasukkan ke berkas frontend dan dapat dibaca oleh browser; gunakan hanya konfigurasi publik di dalamnya. Deployment ini memasang frontend dummy: login belum memverifikasi akun ke backend, dan otorisasi serta pembukaan gerbang masih berupa simulasi antarmuka.

### Pembaruan aplikasi

Jalankan dari server setelah perubahan tersedia pada branch `main`:

```bash
cd /var/www/ASSENTRIM-GATE
git pull --ff-only origin main
npm ci
npm run build
curl -I http://127.0.0.1:8080/
```

Nginx langsung menyajikan hasil build yang baru. Jika `deploy/nginx.conf` berubah, salin konfigurasi tersebut dan periksa sebelum reload:

```bash
sudo install -m 644 deploy/nginx.conf /etc/nginx/sites-available/assentrim-gate
sudo nginx -t && sudo systemctl reload nginx
```

## 📜 Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the app for production to the `dist` folder.
- **`npm run preview`**: Serves the production build locally for testing.

## 🎨 Theming

The application fully supports dynamic switching between **Dark Mode** and **Light Mode**. Assets, border colors, and backdrop blurs seamlessly transition to provide the best contrast depending on the environment. The toggle switch can be found in the header settings dropdown.

## Dashboard Cameras

The dashboard uses `VITE_CAM1_WEBRTC_URL` through `VITE_CAM5_WEBRTC_URL`, mapped directly to gates 01 through 05. Each gate has a single camera; camera endpoints 6-12 are no longer used by this dashboard. Gate 04 shows the offline placeholder until its endpoint is configured. The other gates include the reference camera images as visual fallbacks; configured WebRTC streams retain their connection-status indicators and fullscreen controls.
