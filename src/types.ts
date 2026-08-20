export interface AppData {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryData {
  id: string;
  name: string;
  order: number;
}

export interface SettingsData {
  appName: string;
  heroTitle: string;
  heroSubtitle: string;
  logoUrl: string;
  faviconUrl: string;
}

export interface DashboardStats {
  totalApps: number;
  activeApps: number;
  inactiveApps: number;
  totalCategories: number;
}
