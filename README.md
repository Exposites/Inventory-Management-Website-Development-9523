# DVD Collection Catalog 📀

A modern Progressive Web App (PWA) for cataloging and managing your DVD collection with barcode scanning capabilities.

## ✨ Features

- 📱 **Mobile-First Design** - Responsive design that works on all devices
- 📷 **Barcode Scanning** - Use your camera to scan DVD barcodes
- 🎬 **Movie Database Integration** - Automatically fetch movie details from TMDB
- 🔍 **Smart Search** - Search by title or cast members
- 📊 **Collection Reports** - Generate printable PDF reports
- 💾 **Offline Support** - Works offline once installed
- 🚀 **PWA Ready** - Install on your device like a native app

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/dvd-catalog-app.git
cd dvd-catalog-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 Usage

### Scanning DVDs
1. Navigate to the "Scan" page
2. Allow camera permissions
3. Point your camera at the DVD barcode
4. The app will automatically fetch movie details
5. Review and save to your collection

### Managing Collection
- View all movies in your collection
- Search by title or cast
- Generate printable reports
- Edit movie details

### Installing as PWA
1. Open the app in your mobile browser
2. Look for the "Install" prompt
3. Add to home screen for native app experience

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: IndexedDB (Dexie)
- **Barcode Scanning**: HTML5-QRCode
- **PDF Generation**: jsPDF
- **Movie Data**: TMDB API
- **PWA**: Vite PWA Plugin

## 📦 Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data
- [HTML5-QRCode](https://github.com/mebjas/html5-qrcode) for barcode scanning
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

## 📞 Support

If you have any questions or issues, please [open an issue](https://github.com/YOUR_USERNAME/dvd-catalog-app/issues) on GitHub.

---

⭐ **Star this repo if you found it helpful!**