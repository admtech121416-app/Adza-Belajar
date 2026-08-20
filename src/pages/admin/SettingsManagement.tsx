import { useState } from 'react';
import { api } from '../../services/api';
import { SettingsData } from '../../types';
import { Save } from 'lucide-react';

export default function SettingsManagement({ settings }: { settings: SettingsData | null }) {
  const [formData, setFormData] = useState<SettingsData>({
    appName: settings?.appName || '',
    heroTitle: settings?.heroTitle || '',
    heroSubtitle: settings?.heroSubtitle || '',
    logoUrl: settings?.logoUrl || '',
    faviconUrl: settings?.faviconUrl || ''
  });
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.updateSettings(formData);
      setMessage('Pengaturan berhasil disimpan. Refresh halaman untuk melihat perubahan pada judul/favicon.');
    } catch (err) {
      setMessage('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Pengaturan Aplikasi</h1>

      {message && (
        <div className={`p-4 rounded-xl mb-6 font-medium text-sm ${message.includes('berhasil') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Aplikasi</label>
          <input 
            type="text" 
            required 
            value={formData.appName} 
            onChange={e => setFormData({...formData, appName: e.target.value})} 
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Title</label>
          <input 
            type="text" 
            required 
            value={formData.heroTitle} 
            onChange={e => setFormData({...formData, heroTitle: e.target.value})} 
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Subtitle</label>
          <textarea 
            required 
            rows={2} 
            value={formData.heroSubtitle} 
            onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} 
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" 
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-1">URL Logo Utama</label>
          <p className="text-xs text-slate-500 mb-2">Gunakan direct URL gambar (JPG/PNG/SVG). Direkomendasikan ukuran persegi.</p>
          <input 
            type="url" 
            value={formData.logoUrl} 
            onChange={e => setFormData({...formData, logoUrl: e.target.value})} 
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
          {formData.logoUrl && (
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block">
              <img src={formData.logoUrl} alt="Logo Preview" className="h-10 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">URL Favicon</label>
          <input 
            type="url" 
            value={formData.faviconUrl} 
            onChange={e => setFormData({...formData, faviconUrl: e.target.value})} 
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center disabled:opacity-70"
          >
            {saving ? (
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
