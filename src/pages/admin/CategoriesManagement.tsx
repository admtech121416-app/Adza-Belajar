import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { CategoryData } from '../../types';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    order: 1
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data.sort((a,b) => a.order - b.order));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (cat?: CategoryData) => {
    if (cat) {
      if (cat.name === 'Semua') {
        alert('Kategori "Semua" tidak dapat diedit.');
        return;
      }
      setEditingCategory(cat);
      setFormData({ name: cat.name, order: cat.order });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', order: categories.length + 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.toLowerCase() === 'semua' && !editingCategory) {
      alert('Nama kategori "Semua" sudah digunakan oleh sistem.');
      return;
    }
    
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
      } else {
        await api.createCategory(formData);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      alert('Gagal menyimpan kategori');
    }
  };

  const handleDelete = async (cat: CategoryData) => {
    if (cat.name === 'Semua') {
      alert('Kategori "Semua" tidak dapat dihapus.');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${cat.name}"?`)) {
      try {
        await api.deleteCategory(cat.id);
        loadData();
      } catch (err) {
        alert('Gagal menghapus kategori');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Kelola Kategori</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-3xl">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-20">Urutan</th>
              <th className="px-6 py-4">Nama Kategori</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono">{cat.order}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{cat.name}</td>
                <td className="px-6 py-4 text-right">
                  {cat.name !== 'Semua' && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(cat)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form id="cat-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Kategori</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Urutan</label>
                  <input type="number" min="1" required value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)||1})} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" form="cat-form" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center">
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
