import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Collection from './pages/Collection';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import Reports from './pages/Reports';
import { registerServiceWorker } from './utils/registerSW';

function App() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Register service worker for PWA
    registerServiceWorker();

    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // We no longer need the prompt. Clear it up.
      setDeferredPrompt(null);
      setIsInstallable(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {isInstallable && (
        <div className="bg-indigo-600 text-white px-4 py-2 flex justify-between items-center">
          <p className="text-sm">Install this app on your device for a better experience!</p>
          <button 
            onClick={handleInstallClick}
            className="text-xs bg-white text-indigo-600 px-3 py-1 rounded-full font-medium"
          >
            Install
          </button>
        </div>
      )}
      
      <main className="container mx-auto px-4 pb-24 pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;