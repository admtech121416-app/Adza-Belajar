import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DashboardStats as Stats } from '../../types';
import { Package, Layers, PlayCircle, PauseCircle } from 'lucide-react';

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return <div className="animate-pulse">Loading stats...</div>;
  }

  const statCards = [
    { name: 'Total Aplikasi', value: stats.totalApps, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Kategori', value: stats.totalCategories, icon: Layers, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Aplikasi Aktif', value: stats.activeApps, icon: PlayCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Aplikasi Nonaktif', value: stats.inactiveApps, icon: PauseCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
