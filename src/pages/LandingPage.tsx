import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Gamepad2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { AppData, CategoryData, SettingsData } from '../types';
import { formatImageUrl } from '../lib/utils';

export default function LandingPage({ settings }: { settings: SettingsData | null }) {
  const [apps, setApps] = useState<AppData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    api.getApps().then(setApps).catch(console.error);
    api.getCategories().then(setCategories).catch(console.error);
    
    const favs = JSON.parse(localStorage.getItem('adza_favorites') || '[]');
    setFavorites(favs);
    const recs = JSON.parse(localStorage.getItem('adza_recent') || '[]');
    setRecent(recs);
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    let newFavs = [...favorites];
    if (newFavs.includes(id)) {
      newFavs = newFavs.filter(f => f !== id);
    } else {
      newFavs.push(id);
    }
    setFavorites(newFavs);
    localStorage.setItem('adza_favorites', JSON.stringify(newFavs));
  };

  const filteredApps = apps
    .filter(a => a.active)
    .filter(a => activeCategory === 'Semua' || activeCategory === '' || (a.category && a.category.trim().toLowerCase() === activeCategory.trim().toLowerCase()))
    .filter(a => 
      a.name.toLowerCase().includes(search.toLowerCase()) || 
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.order - b.order);

  const favoriteApps = apps.filter(a => favorites.includes(a.id) && a.active);
  const recentApps = recent.map(id => apps.find(a => a.id === id)).filter((a): a is AppData => !!a && a.active);

  return (
    <div className="min-h-screen bg-sky-300 text-slate-900 font-sans selection:bg-yellow-300 relative">
      {/* Playful dots background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 4px, transparent 4px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-slate-900 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={settings?.logoUrl || '/logo.png'} alt="Logo" className="h-12 w-12 object-contain bg-yellow-100 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] transform -rotate-3" />
            <span className="font-black text-2xl tracking-tight text-slate-900 uppercase [-webkit-text-stroke:1px_#0f172a] text-white drop-shadow-[2px_2px_0_#0f172a]">
              {settings?.appName || 'Adza Belajar'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/login" 
              className="font-black uppercase text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all px-4 py-2 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0f172a]"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase [-webkit-text-stroke:2px_#0f172a] md:[-webkit-text-stroke:3px_#0f172a] drop-shadow-[6px_6px_0_#0f172a]">
            {settings?.heroTitle || 'SAYA SUKA BELAJAR'}
          </h1>
        </motion.div>
        
        <p className="text-xl md:text-2xl font-bold text-slate-900 max-w-3xl mx-auto mb-10 bg-white inline-block px-6 py-3 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0_0_#0f172a] transform rotate-1">
          {settings?.heroSubtitle || 'Ayo main dan belajar bersama di Adza Belajar!'}
        </p>
        
        <div className="max-w-xl mx-auto relative group mt-8">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-900">
            <Search className="h-8 w-8 stroke-[3px]" />
          </div>
          <input
            type="text"
            className="block w-full pl-16 pr-6 py-5 bg-white border-4 border-slate-900 rounded-3xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 font-black text-xl shadow-[6px_6px_0_0_#0f172a] transform transition-transform focus:scale-[1.02]"
            placeholder="Cari mainan & game belajarmu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10 space-y-16">
        
        {/* Recent & Favorites */}
        {!search && (recentApps.length > 0 || favoriteApps.length > 0) && (
          <div className="space-y-16">
            {recentApps.length > 0 && (
              <section className="bg-white/90 backdrop-blur border-4 border-slate-900 p-8 rounded-[2rem] shadow-[8px_8px_0_0_#0f172a]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-orange-400 p-2 border-4 border-slate-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] transform -rotate-6">
                     <Clock className="w-8 h-8 text-white stroke-[3px]" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase">Baru Saja Dimainkan</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {recentApps.slice(0, 4).map((app, i) => (
                    <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <AppCard app={app} isFav={favorites.includes(app.id)} onFav={toggleFavorite} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {favoriteApps.length > 0 && (
              <section className="bg-white/90 backdrop-blur border-4 border-slate-900 p-8 rounded-[2rem] shadow-[8px_8px_0_0_#0f172a]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-yellow-400 p-2 border-4 border-slate-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] transform rotate-3">
                     <Star className="w-8 h-8 text-white stroke-[3px] fill-white" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase">Game Favoritmu</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {favoriteApps.map((app, i) => (
                    <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <AppCard app={app} isFav={true} onFav={toggleFavorite} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* All Apps */}
        <section>
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10 bg-white/90 backdrop-blur p-4 rounded-3xl border-4 border-slate-900 shadow-[6px_6px_0_0_#0f172a]">
            <div className="flex items-center gap-3 px-2">
              <div className="bg-blue-500 p-2 border-4 border-slate-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] transform -rotate-3">
                 <Gamepad2 className="w-8 h-8 text-white stroke-[3px]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase">Semua Game</h2>
            </div>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-2 px-2 hide-scrollbar">
              <button
                onClick={() => setActiveCategory('Semua')}
                className={`shrink-0 px-6 py-3 rounded-2xl text-lg font-black uppercase border-4 border-slate-900 transition-all ${
                  activeCategory === 'Semua' 
                    ? 'bg-rose-400 text-white shadow-[4px_4px_0_0_#0f172a] translate-y-[-2px]' 
                    : 'bg-white text-slate-900 hover:bg-slate-100 shadow-[2px_2px_0_0_#0f172a]'
                }`}
              >
                Semua
              </button>
              {categories.sort((a,b) => a.order - b.order).filter(c => c.name !== 'Semua').map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`shrink-0 px-6 py-3 rounded-2xl text-lg font-black uppercase border-4 border-slate-900 transition-all ${
                    activeCategory === cat.name
                      ? 'bg-violet-400 text-white shadow-[4px_4px_0_0_#0f172a] translate-y-[-2px]'
                      : 'bg-white text-slate-900 hover:bg-slate-100 shadow-[2px_2px_0_0_#0f172a]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredApps.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                >
                  <AppCard app={app} isFav={favorites.includes(app.id)} onFav={toggleFavorite} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a]">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border-4 border-slate-900 bg-slate-100 text-slate-400 mb-6 transform rotate-6">
                <Search className="w-10 h-10 stroke-[3px]" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">Yah, Gamenya Ga Ada!</h3>
              <p className="text-slate-600 font-bold text-lg">Coba cari pakai kata yang lain ya.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 mt-20 relative z-10 border-t-8 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
             <img src={settings?.logoUrl || '/logo.png'} alt="Logo" className="h-10 w-10 object-contain rounded-lg bg-white p-1" />
             <span className="font-black text-white tracking-widest text-2xl uppercase">
               {settings?.appName || 'Adza Belajar'}
             </span>
          </div>
          <p className="text-slate-300 font-bold mb-6 text-lg">{settings?.heroSubtitle}</p>
          <p className="text-slate-500 font-bold text-sm">© {new Date().getFullYear()} {settings?.appName || 'Adza Belajar'}</p>
        </div>
      </footer>
    </div>
  );
}

function AppCard({ app, isFav, onFav }: { app: AppData, isFav: boolean, onFav: (e: React.MouseEvent, id: string) => void }) {
  // Array of fun colors for the card background icon container
  const bgColors = ['bg-pink-300', 'bg-blue-300', 'bg-yellow-300', 'bg-green-300', 'bg-purple-300', 'bg-orange-300'];
  const randomBg = bgColors[Math.abs(app.id.charCodeAt(0)) % bgColors.length];

  return (
    <Link 
      to={`/app/${app.id}`}
      className="group flex flex-col h-full bg-white rounded-[2rem] p-6 border-4 border-slate-900 shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-2 hover:shadow-[10px_10px_0_0_#0f172a] transition-all duration-200 relative"
    >
      <div className="absolute top-5 right-5 z-10">
        <button 
          onClick={(e) => onFav(e, app.id)}
          className="w-12 h-12 flex items-center justify-center bg-white border-4 border-slate-900 rounded-full hover:bg-yellow-100 shadow-[2px_2px_0_0_#0f172a] transform hover:scale-110 transition-transform"
        >
          <Star className={`w-6 h-6 stroke-[3px] ${isFav ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
        </button>
      </div>

      <div className={`w-24 h-24 mb-6 rounded-[1.5rem] ${randomBg} flex items-center justify-center shrink-0 border-4 border-slate-900 p-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] transform -rotate-3 group-hover:rotate-0 transition-transform`}>
         {app.icon ? (
           <img src={formatImageUrl(app.icon)} alt={app.name} className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
         ) : (
           <Gamepad2 className="w-12 h-12 text-slate-900 stroke-[3px]" />
         )}
      </div>
      
      <div className="mb-4 flex-1">
        <span className="inline-block px-3 py-1.5 bg-yellow-300 text-slate-900 text-xs font-black rounded-xl mb-4 uppercase border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]">
          {app.category}
        </span>
        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">{app.name}</h3>
        <p className="text-slate-600 font-bold text-sm line-clamp-3">{app.description}</p>
      </div>

      <div className="mt-4 bg-emerald-400 border-4 border-slate-900 text-slate-900 font-black py-4 px-5 rounded-2xl flex items-center justify-between group-hover:bg-emerald-300 shadow-[4px_4px_0_0_#0f172a] group-hover:translate-y-1 group-hover:shadow-[2px_2px_0_0_#0f172a] transition-all">
        <span className="text-lg">MAIN SEKARANG</span>
        <ArrowRight className="w-6 h-6 stroke-[3px]" />
      </div>
    </Link>
  );
}
