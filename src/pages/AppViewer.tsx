import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Maximize, RotateCw } from 'lucide-react';
import { api } from '../services/api';
import { AppData } from '../types';

export default function AppViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (!id) return;
    
    api.getApps().then(apps => {
      const found = apps.find(a => a.id === id);
      if (found && found.active) {
        setApp(found);
        
        const recentStr = localStorage.getItem('adza_recent') || '[]';
        let recent: string[] = JSON.parse(recentStr);
        recent = [id, ...recent.filter(r => r !== id)].slice(0, 8);
        localStorage.setItem('adza_recent', JSON.stringify(recent));
      } else {
        setError(true);
      }
    }).catch(() => setError(true))
    .finally(() => setLoading(false));
  }, [id]);

  const handleRefresh = () => {
    setLoading(true);
    setIframeKey(k => k + 1);
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById('app-iframe');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    }
  };

  const handleOpenExternal = () => {
    if (app?.url) {
      window.location.href = app.url;
    }
  };

  if (loading && !app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-300">
        <div className="w-20 h-20 bg-yellow-400 border-8 border-slate-900 rounded-full animate-bounce shadow-[8px_8px_0_0_#0f172a] mb-8"></div>
        <p className="text-3xl font-black text-white [-webkit-text-stroke:2px_#0f172a] drop-shadow-[4px_4px_0_#0f172a] animate-pulse uppercase">Membuka Game...</p>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-300 p-4 text-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-[12px_12px_0_0_#0f172a] border-4 border-slate-900 max-w-lg w-full">
          <div className="w-24 h-24 bg-red-400 rounded-[2rem] border-4 border-slate-900 flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-[6px_6px_0_0_#0f172a]">
             <span className="text-5xl">🥺</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase">Ups, Gamenya Hilang!</h2>
          <p className="text-slate-600 font-bold text-xl mb-8">Aplikasi ini mungkin sedang diperbaiki atau sudah dihapus.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-xl py-4 px-6 border-4 border-slate-900 rounded-2xl shadow-[6px_6px_0_0_#0f172a] hover:translate-y-1 hover:shadow-[3px_3px_0_0_#0f172a] transition-all uppercase"
          >
            Kembali Main
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* App Viewer Header */}
      <header className="h-20 bg-sky-400 border-b-4 border-slate-900 flex items-center justify-between px-4 shrink-0 shadow-[0_4px_0_0_rgba(0,0,0,0.3)] z-10">
        <div className="flex items-center gap-4">
          <Link 
            to="/"
            className="flex items-center text-lg font-black text-slate-900 uppercase bg-rose-400 hover:bg-rose-300 border-4 border-slate-900 py-2 px-4 rounded-xl shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0f172a] transition-all"
          >
            <ArrowLeft className="w-6 h-6 mr-2 stroke-[3px]" />
            Kembali
          </Link>
          
          <div className="hidden sm:flex items-center gap-3 border-l-4 border-slate-900 pl-4 ml-2">
            {app.icon && <img src={app.icon} alt="" className="w-12 h-12 object-contain bg-white border-2 border-slate-900 rounded-lg p-1 shadow-[2px_2px_0_0_#0f172a]" />}
            <div>
              <h1 className="font-black text-white text-2xl leading-tight uppercase [-webkit-text-stroke:1px_#0f172a] drop-shadow-[2px_2px_0_#0f172a]">{app.name}</h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="p-3 bg-white border-4 border-slate-900 text-slate-900 hover:bg-slate-200 rounded-xl shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0f172a] transition-all"
            title="Muat Ulang"
          >
            <RotateCw className="w-6 h-6 stroke-[3px]" />
          </button>
          <button 
            onClick={handleFullscreen}
            className="p-3 bg-white border-4 border-slate-900 text-slate-900 hover:bg-slate-200 rounded-xl shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0f172a] transition-all hidden sm:block"
            title="Layar Penuh"
          >
            <Maximize className="w-6 h-6 stroke-[3px]" />
          </button>
          <button 
            onClick={handleOpenExternal}
            className="flex items-center text-lg font-black text-slate-900 uppercase bg-yellow-400 hover:bg-yellow-300 border-4 border-slate-900 py-2 px-4 rounded-xl shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0f172a] transition-all ml-2"
          >
            Buka Terpisah
            <ExternalLink className="w-6 h-6 ml-2 stroke-[3px]" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-white relative rounded-b-3xl overflow-hidden m-2 border-4 border-slate-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
               <div className="w-20 h-20 bg-blue-500 border-8 border-slate-900 rounded-full animate-bounce shadow-[6px_6px_0_0_#0f172a] mb-6"></div>
               <p className="text-3xl font-black text-slate-900 uppercase">Membuka...</p>
          </div>
        )}
        <iframe
          key={iframeKey}
          id="app-iframe"
          src={app.url}
          title={app.name}
          className="w-full h-full border-0 rounded-b-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone; camera; display-capture"
          allowFullScreen
          onLoad={() => setLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
        ></iframe>
      </main>
    </div>
  );
}
