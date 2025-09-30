import React, { createContext, useContext, useState, useEffect } from 'react';
import { FileItem, mockFiles, mockUser } from '@/lib/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  joinDate: Date;
  plan: string;
}

interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ShareData {
  emails: string[];
  permissions: 'view' | 'edit' | 'download';
  expiry?: Date | null;
  password?: string | null;
  isPublic: boolean;
}

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Files
  files: FileItem[];
  currentPath: string;
  selectedFiles: string[];
  searchQuery: string;
  sortBy: 'name' | 'size' | 'date' | 'type';
  viewMode: 'grid' | 'list';
  
  // File operations
  setCurrentPath: (path: string) => void;
  setSelectedFiles: (files: string[]) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'name' | 'size' | 'date' | 'type') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  toggleFavorite: (fileId: string) => void;
  moveToTrash: (fileIds: string[]) => void;
  restoreFromTrash: (fileIds: string[]) => void;
  permanentDelete: (fileIds: string[]) => void;
  
  // Upload/Download
  uploadProgress: { [key: string]: number };
  downloadProgress: { [key: string]: number };
  setUploadProgress: (fileId: string, progress: number) => void;
  setDownloadProgress: (fileId: string, progress: number) => void;
  
  // Sharing
  shareFile: (fileId: string, shareData: ShareData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'type'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadProgress, setUploadProgressState] = useState<{ [key: string]: number }>({});
  const [downloadProgress, setDownloadProgressState] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Check for existing auth
    const savedAuth = localStorage.getItem('cloudbox_auth');
    if (savedAuth) {
      setUser(mockUser);
      setIsAuthenticated(true);
    }
    
    // Check for dark mode preference
    const savedTheme = localStorage.getItem('cloudbox_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - replace with real auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('cloudbox_auth', 'true');
  };

  const signup = async (data: SignupData) => {
    // Mock signup - replace with real auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ ...mockUser, name: data.fullName, email: data.email, username: data.username });
    setIsAuthenticated(true);
    localStorage.setItem('cloudbox_auth', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cloudbox_auth');
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cloudbox_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cloudbox_theme', 'light');
    }
  };

  const toggleFavorite = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, isFavorite: !file.isFavorite } : file
    ));
  };

  const moveToTrash = (fileIds: string[]) => {
    setFiles(prev => prev.map(file => 
      fileIds.includes(file.id) ? { ...file, isInTrash: true } : file
    ));
    setSelectedFiles([]);
  };

  const restoreFromTrash = (fileIds: string[]) => {
    setFiles(prev => prev.map(file => 
      fileIds.includes(file.id) ? { ...file, isInTrash: false } : file
    ));
    setSelectedFiles([]);
  };

  const permanentDelete = (fileIds: string[]) => {
    setFiles(prev => prev.filter(file => !fileIds.includes(file.id)));
    setSelectedFiles([]);
  };

  const setUploadProgress = (fileId: string, progress: number) => {
    setUploadProgressState(prev => ({ ...prev, [fileId]: progress }));
  };

  const setDownloadProgress = (fileId: string, progress: number) => {
    setDownloadProgressState(prev => ({ ...prev, [fileId]: progress }));
  };

  const shareFile = (fileId: string, shareData: ShareData) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { 
        ...file, 
        isShared: true, 
        sharedWith: shareData.emails,
        sharePermissions: shareData.permissions,
        shareExpiry: shareData.expiry || undefined
      } : file
    ));
  };

  const value: AppContextType = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    isDarkMode,
    toggleDarkMode,
    files,
    currentPath,
    selectedFiles,
    searchQuery,
    sortBy,
    viewMode,
    setCurrentPath,
    setSelectedFiles,
    setSearchQuery,
    setSortBy,
    setViewMode,
    toggleFavorite,
    moveToTrash,
    restoreFromTrash,
    permanentDelete,
    uploadProgress,
    downloadProgress,
    setUploadProgress,
    setDownloadProgress,
    shareFile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};