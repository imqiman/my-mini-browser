'use client'

import { useState, useRef } from 'react'
import { Page } from '@/components/PageLayout'
import { AuthButton } from '../components/AuthButton'

function MiniBrowserPage() {
  const homepage = 'https://example.com';
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentUrl = history[currentIndex] || '';

  const handleGo = () => {
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    const isValid = safeUrl.match(/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}/i);

    if (!isValid) {
      alert('Please enter a valid HTTPS URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);

    const newHistory = history.slice(0, currentIndex + 1).concat(safeUrl);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goHome = () => {
    const newHistory = history.slice(0, currentIndex + 1).concat(homepage);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setLoading(true);
  };

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (!document.fullscreenElement) {
        iframeRef.current.requestFullscreen().catch((err) => {
          console.error('Failed to enter fullscreen:', err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`p-4 w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <button
        onClick={toggleDarkMode}
        className="mb-2 bg-purple-600 text-white px-4 py-2 rounded"
      >
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <h1 className="text-xl font-bold mb-4">Mini Browser</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter a URL (e.g. https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleGo}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go
        </button>
        <button
          onClick={goBack}
          className="bg-gray-500 text-white px-3 py-2 rounded"
          disabled={currentIndex <= 0}
        >
          Back
        </button>
        <button
          onClick={goForward}
          className="bg-gray-500 text-white px-3 py-2 rounded"
          disabled={currentIndex >= history.length - 1}
        >
          Forward
        </button>
        <button
          onClick={goHome}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Home
        </button>
      </div>
      {loading && <p className="text-sm text-gray-600 mb-2">Loading...</p>}
      {currentUrl && (
        <>
          <iframe
            ref={iframeRef}
            src={currentUrl}
            onLoad={() => setLoading(false)}
            className="w-full h-[80vh] border rounded"
            sandbox="allow-scripts allow-same-origin"
          />
          <button
            onClick={toggleFullscreen}
            className="mt-2 bg-black text-white px-4 py-2 rounded"
          >
            Fullscreen
          </button>
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-center justify-center w-full">
        <AuthButton />
        <MiniBrowserPage />
      </Page.Main>
    </Page>
  )
}
