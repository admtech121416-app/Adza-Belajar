/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SettingsData } from './types';
import { api } from './services/api';

// Pages
import LandingPage from './pages/LandingPage';
import AppViewer from './pages/AppViewer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [settings, setSettings] = useState<SettingsData | null>(null);

  useEffect(() => {
    api.getSettings().then(data => {
      setSettings(data);
      if (data.faviconUrl) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = data.faviconUrl;
      }
      if (data.appName) {
        document.title = data.appName;
      }
    }).catch(console.error);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage settings={settings} />} />
        <Route path="/app/:id" element={<AppViewer />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard settings={settings} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
