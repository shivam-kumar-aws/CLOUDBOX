import { FileText, Image, Video, Music, Archive, Folder, Star, Trash2 } from 'lucide-react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  dateModified: Date;
  isFavorite: boolean;
  isShared: boolean;
  isInTrash: boolean;
  path: string;
  thumbnail?: string;
  sharedWith?: string[];
  sharePermissions?: 'view' | 'edit' | 'download';
  shareExpiry?: Date;
}

export const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    dateModified: new Date('2024-01-15'),
    isFavorite: false,
    isShared: false,
    isInTrash: false,
    path: '/Documents',
  },
  {
    id: '2',
    name: 'Photos',
    type: 'folder',
    dateModified: new Date('2024-01-20'),
    isFavorite: true,
    isShared: true,
    isInTrash: false,
    path: '/Photos',
    sharedWith: ['john@example.com'],
    sharePermissions: 'view',
  },
  {
    id: '3',
    name: 'presentation.pdf',
    type: 'file',
    size: 2048000,
    mimeType: 'application/pdf',
    dateModified: new Date('2024-01-25'),
    isFavorite: true,
    isShared: false,
    isInTrash: false,
    path: '/Documents/presentation.pdf',
    thumbnail: '/api/placeholder/150/200',
  },
  {
    id: '4',
    name: 'vacation.jpg',
    type: 'file',
    size: 1024000,
    mimeType: 'image/jpeg',
    dateModified: new Date('2024-01-22'),
    isFavorite: false,
    isShared: true,
    isInTrash: false,
    path: '/Photos/vacation.jpg',
    thumbnail: '/api/placeholder/300/200',
    sharedWith: ['sarah@example.com'],
    sharePermissions: 'download',
  },
  {
    id: '5',
    name: 'music.mp3',
    type: 'file',
    size: 5120000,
    mimeType: 'audio/mpeg',
    dateModified: new Date('2024-01-18'),
    isFavorite: false,
    isShared: false,
    isInTrash: true,
    path: '/Music/music.mp3',
  },
];

export const getFileIcon = (mimeType?: string, type?: string) => {
  if (type === 'folder') return Folder;
  if (!mimeType) return FileText;
  
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType.startsWith('audio/')) return Music;
  if (mimeType.includes('pdf')) return FileText;
  if (mimeType.includes('zip') || mimeType.includes('rar')) return Archive;
  
  return FileText;
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const getFileTypeColor = (mimeType?: string, type?: string): string => {
  if (type === 'folder') return 'text-blue-500';
  if (!mimeType) return 'text-gray-500';
  
  if (mimeType.startsWith('image/')) return 'text-green-500';
  if (mimeType.startsWith('video/')) return 'text-purple-500';
  if (mimeType.startsWith('audio/')) return 'text-orange-500';
  if (mimeType.includes('pdf')) return 'text-red-500';
  
  return 'text-gray-500';
};

export const storageData = {
  used: 15.6, // GB
  total: 50, // GB
  fileTypes: [
    { name: 'Images', value: 35, color: '#22c55e' },
    { name: 'Videos', value: 25, color: '#8b5cf6' },
    { name: 'Documents', value: 20, color: '#ef4444' },
    { name: 'Audio', value: 15, color: '#f97316' },
    { name: 'Others', value: 5, color: '#6b7280' },
  ],
  usageOverTime: [
    { month: 'Jan', usage: 8.2 },
    { month: 'Feb', usage: 10.5 },
    { month: 'Mar', usage: 12.1 },
    { month: 'Apr', usage: 13.8 },
    { month: 'May', usage: 15.6 },
  ],
};

export const mockUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  username: 'alexj',
  avatar: '/api/placeholder/100/100',
  joinDate: new Date('2023-06-15'),
  plan: 'Pro',
};