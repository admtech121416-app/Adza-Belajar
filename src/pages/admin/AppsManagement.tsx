import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AppData, CategoryData } from '../../types';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export default function AppsManagement() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    category: '',
    icon: '',
    active: true,
    order: 1
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsData, catsData] = await Promise.all([api.getApps(), api.getCategories()]);
      setApps(appsData.sort((a,b) => a.order - b.order));
      setCategories(catsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (app?: AppData) => {
    if (app) {
      setEditingApp(app);
      setFormData({
        name: app.name,
        description: app.description,
        url: app.url,
        category: app.category,
        icon: app.icon,
        active: app.active,
        order: app.order
      });
    } else {
      setEditingApp(null);
      setFormData({
        name: '',
        description: '',
        url: '',
        category: categories[0]?.name || 'Semua',
        icon: '',
        active: true,
        order: apps.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApp(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate URL simple
      new URL(formData.url); // will throw if invalid
      
      if (editingApp) {
        await api.updateApp(editingApp.id, formData);
      } else {
        await api.createApp(formData);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      alert('Gagal menyimpan. Pastikan URL valid (http:// atau https://)');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus aplikasi ini?')) {
      try {
        await api.deleteApp(id);
        loadData();
      } catch (err) {
        alert('Gagal menghapus');
      }
    }
  };

  const toggleActive = async (app: AppData) => {
    try {
      await api.updateApp(app.id, { active: !app.active });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Kelola Aplikasi</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Aplikasi
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Aplikasi</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Belum ada aplikasi.
                  </td>
                </tr>
              ) : (
                apps.map((app, index) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {app.icon ? (
                           <img src={app.icon} alt="" className="w-10 h-10 object-contain rounded-lg bg-slate-100 p-1 border border-slate-200" />
                        ) : (
                           <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">?</div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{app.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{app.url}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">{app.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleActive(app)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          app.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {app.active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(app)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(app.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg text-slate-800">{editingApp ? 'Edit Aplikasi' : 'Tambah Aplikasi'}</h3>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="app-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Aplikasi</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi</label>
                  <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">URL Web App (https://...)</label>
                  <input type="url" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                      {categories.filter(c => c.name !== 'Semua').map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Urutan Tampil</label>
                    <input type="number" min="1" required value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 1})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">URL Icon (Opsional)</label>
                  <input type="url" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="https://..." />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                  <label htmlFor="active" className="text-sm font-semibold text-slate-700">Aplikasi Aktif (Tampil di Publik)</label>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50 rounded-b-3xl">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" form="app-form" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
