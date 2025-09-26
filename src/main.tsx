import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// Enhanced Service Worker handling
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    // Register service worker for PWA functionality in production
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log('New service worker found, updating...');
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is available, clear caches and reload
                  console.log('New service worker installed, clearing caches...');
                  
                  caches.keys().then(cacheNames => {
                    return Promise.all(
                      cacheNames.map(cacheName => {
                        console.log('Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                      })
                    );
                  }).then(() => {
                    console.log('All caches cleared, reloading page...');
                    window.location.reload();
                  });
                } else if (newWorker.state === 'activated' && !navigator.serviceWorker.controller) {
                  // First time installation
                  console.log('Service worker activated for the first time');
                }
              });
            }
          });

          // Handle controller change (when new SW takes over)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service worker controller changed, reloading...');
            window.location.reload();
          });

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute for updates

        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });

    // Also clear caches on page load to ensure fresh content
    window.addEventListener('load', () => {
      // Clear browser caches programmatically on each visit
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          // Only clear old cache versions, keep the current one
          const currentCacheName = 'xolvetech-v3';
          return Promise.all(
            cacheNames
              .filter(cacheName => cacheName !== currentCacheName)
              .map(cacheName => {
                console.log('Clearing old cache:', cacheName);
                return caches.delete(cacheName);
              })
          );
        });
      }
    });

  } else {
    // Unregister any existing service workers in development mode
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then((success) => {
            if (success) {
              console.log('SW unregistered successfully in development mode');
            }
          });
        });
      });

      // Also clear all caches in development
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              console.log('Clearing dev cache:', cacheName);
              return caches.delete(cacheName);
            })
          );
        });
      }
    });
  }
}

// Force refresh function for critical updates (can be called manually)
if (import.meta.env.PROD) {
  (window as any).forceHardRefresh = async () => {
    console.log('Forcing hard refresh...');
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Unregister service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
    }
    
    // Force reload with cache bypass
    window.location.reload();
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
