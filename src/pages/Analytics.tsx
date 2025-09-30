import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  HardDrive, 
  Files, 
  FolderOpen, 
  Download, 
  Upload, 
  Users, 
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { useApp } from '@/contexts/AppContext';
import { storageData } from '@/lib/mockData';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Analytics: React.FC = () => {
  const { files } = useApp();
  const [timeRange, setTimeRange] = useState('30d');

  // Calculate statistics
  const totalFiles = files.filter(f => !f.isInTrash).length;
  const totalFolders = files.filter(f => f.type === 'folder' && !f.isInTrash).length;
  const sharedFiles = files.filter(f => f.isShared && !f.isInTrash).length;
  const favoriteFiles = files.filter(f => f.isFavorite && !f.isInTrash).length;

  const activityData = [
    { name: 'Mon', uploads: 12, downloads: 8, views: 24 },
    { name: 'Tue', uploads: 19, downloads: 15, views: 32 },
    { name: 'Wed', uploads: 8, downloads: 12, views: 18 },
    { name: 'Thu', uploads: 15, downloads: 22, views: 28 },
    { name: 'Fri', uploads: 25, downloads: 18, views: 45 },
    { name: 'Sat', uploads: 6, downloads: 9, views: 12 },
    { name: 'Sun', uploads: 4, downloads: 6, views: 8 },
  ];

  const recentFiles = files
    .filter(f => !f.isInTrash)
    .sort((a, b) => b.dateModified.getTime() - a.dateModified.getTime())
    .slice(0, 5);

  const largestFiles = files
    .filter(f => f.size && !f.isInTrash)
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 5);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    color = 'text-blue-600' 
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {change && (
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your storage usage and file activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Files"
            value={totalFiles}
            icon={Files}
            change="+12% from last month"
            color="text-blue-600"
          />
          <StatCard
            title="Total Folders"
            value={totalFolders}
            icon={FolderOpen}
            change="+5% from last month"
            color="text-green-600"
          />
          <StatCard
            title="Shared Files"
            value={sharedFiles}
            icon={Users}
            change="+8% from last month"
            color="text-purple-600"
          />
          <StatCard
            title="Storage Used"
            value={`${storageData.used} GB`}
            icon={HardDrive}
            change="+2.1 GB this month"
            color="text-orange-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                File Type Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of your files by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={storageData.fileTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {storageData.fileTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {storageData.fileTypes.map((type) => (
                  <div key={type.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <span>{type.name}</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{type.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Storage Usage Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Storage Usage Over Time
              </CardTitle>
              <CardDescription>
                Your storage growth over the past months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={storageData.usageOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} GB`, 'Storage Used']} />
                    <Area
                      type="monotone"
                      dataKey="usage"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>
              File uploads, downloads, and views over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="uploads" fill="#3b82f6" name="Uploads" />
                  <Bar dataKey="downloads" fill="#10b981" name="Downloads" />
                  <Bar dataKey="views" fill="#f59e0b" name="Views" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Top Files */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recently Modified
              </CardTitle>
              <CardDescription>
                Your most recently updated files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Files className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.dateModified.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.isFavorite && (
                        <Badge variant="secondary" className="text-xs">
                          Favorite
                        </Badge>
                      )}
                      {file.isShared && (
                        <Badge variant="outline" className="text-xs">
                          Shared
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Largest Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Largest Files
              </CardTitle>
              <CardDescription>
                Files taking up the most storage space
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {largestFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Files className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.mimeType?.split('/')[0] || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;