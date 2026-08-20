import { AppData, CategoryData, SettingsData, DashboardStats } from '../types';
import { supabase } from '../lib/supabase';

export const api = {
  // Auth (keeping simple local token for this demo unless Supabase Auth is strictly setup)
  login: async (username: string, password: string) => {
    if (username === '234567' && password === 'admin') {
      const token = 'admin-secret-token-123';
      localStorage.setItem('adminToken', token);
      return { token };
    }
    throw new Error('Invalid credentials');
  },
  logout: () => {
    localStorage.removeItem('adminToken');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  // Settings
  getSettings: async (): Promise<SettingsData> => {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (error) {
      console.warn('Supabase settings not found, using defaults.');
      return {
        appName: 'Adza Belajar',
        heroTitle: 'SAYA SUKA BELAJAR',
        heroSubtitle: 'Ayo main dan belajar bersama di Adza Belajar!',
        logoUrl: '/logo.png',
        faviconUrl: '/logo.png'
      };
    }
    return data as SettingsData;
  },
  updateSettings: async (settings: Partial<SettingsData>): Promise<SettingsData> => {
    const { data, error } = await supabase.from('settings').update(settings).eq('id', 1).select().single();
    if (error) throw error;
    return data as SettingsData;
  },

  // Categories
  getCategories: async (): Promise<CategoryData[]> => {
    const { data, error } = await supabase.from('categories').select('*').order('order');
    if (error) {
       console.warn('Supabase categories error:', error);
       return [{ id: 'default', name: 'Semua', order: 1 }];
    }
    return data as CategoryData[];
  },
  createCategory: async (category: Omit<CategoryData, 'id'>): Promise<CategoryData> => {
    const { data, error } = await supabase.from('categories').insert([category]).select().single();
    if (error) throw error;
    return data as CategoryData;
  },
  updateCategory: async (id: string, category: Partial<CategoryData>): Promise<CategoryData> => {
    const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single();
    if (error) throw error;
    return data as CategoryData;
  },
  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },

  // Apps
  getApps: async (): Promise<AppData[]> => {
    const { data, error } = await supabase.from('apps').select('*').order('order');
    if (error) {
       console.warn('Supabase apps error:', error);
       return [];
    }
    return data as AppData[];
  },
  createApp: async (app: Omit<AppData, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppData> => {
    const { data, error } = await supabase.from('apps').insert([{
      ...app,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }]).select().single();
    if (error) throw error;
    return data as AppData;
  },
  updateApp: async (id: string, app: Partial<AppData>): Promise<AppData> => {
    const { data, error } = await supabase.from('apps').update({
      ...app,
      updatedAt: new Date().toISOString()
    }).eq('id', id).select().single();
    if (error) throw error;
    return data as AppData;
  },
  deleteApp: async (id: string): Promise<void> => {
    const { error } = await supabase.from('apps').delete().eq('id', id);
    if (error) throw error;
  },

  // Stats
  getStats: async (): Promise<DashboardStats> => {
    const apps = await api.getApps();
    const categories = await api.getCategories();
    return {
      totalApps: apps.length,
      activeApps: apps.filter(a => a.active).length,
      inactiveApps: apps.filter(a => !a.active).length,
      totalCategories: categories.length
    };
  }
};
