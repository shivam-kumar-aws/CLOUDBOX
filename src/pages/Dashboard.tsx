import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Plus, 
  Grid3X3, 
  List, 
  Filter, 
  Download, 
  Share2, 
  Star, 
  Trash2, 
  MoreHorizontal,
  FolderPlus,
  Search,
  ArrowUpDown,
  Eye,
  Edit,
  Copy,
  Move,
  X,
  ChevronRight,
  Home,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Calendar,
  Clock,
  Users,
  Lock,
  Globe
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { FileItem, getFileIcon, formatFileSize, getFileTypeColor } from '@/lib/mockData';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ShareData {
  emails: string[];
  permissions: 'view' | 'edit' | 'download';
  expiry?: Date | null;
  password?: string | null;
  isPublic: boolean;
}

const Dashboard: React.FC = () => {
  const {
    files,
    currentPath,
    selectedFiles,
    searchQuery,
    sortBy,
    viewMode,
    setCurrentPath,
    setSelectedFiles,
    setSortBy,
    setViewMode,
    toggleFavorite,
    moveToTrash,
    shareFile,
    uploadProgress,
  } = useApp();

  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [shareModalFile, setShareModalFile] = useState<FileItem | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Filter and sort files
  const filteredFiles = useMemo(() => {
    const filtered = files.filter(file => 
      !file.isInTrash && 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      file.path.startsWith(currentPath)
    );

    // Sort files
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return (b.size || 0) - (a.size || 0);
        case 'date':
          return b.dateModified.getTime() - a.dateModified.getTime();
        case 'type':
          return (a.mimeType || '').localeCompare(b.mimeType || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [files, searchQuery, currentPath, sortBy]);

  const breadcrumbs = useMemo(() => {
    const parts = currentPath.split('/').filter(Boolean);
    return [
      { name: 'Home', path: '/' },
      ...parts.map((part, index) => ({
        name: part,
        path: '/' + parts.slice(0, index + 1).join('/'),
      })),
    ];
  }, [currentPath]);

  const handleFileSelect = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'delete':
        moveToTrash(selectedFiles);
        toast.success(`${selectedFiles.length} items moved to trash`);
        break;
      case 'download':
        toast.info('Download started');
        break;
      case 'share':
        toast.info('Bulk sharing coming soon');
        break;
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      toast.success(`Folder "${newFolderName}" created`);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        toast.success(`Uploading ${file.name}...`);
      });
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files) {
      Array.from(files).forEach(file => {
        toast.success(`Uploading ${file.name}...`);
      });
    }
  };

  const handleShare = (shareData: ShareData) => {
    if (shareModalFile) {
      shareFile(shareModalFile.id, shareData);
      toast.success('File shared successfully');
      setShareModalFile(null);
    }
  };

  const FilePreviewModal = ({ file, onClose }: { file: FileItem; onClose: () => void }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [zoom, setZoom] = useState(100);

    const renderPreview = () => {
      if (!file.mimeType) return <div>No preview available</div>;

      if (file.mimeType.startsWith('image/')) {
        return (
          <div className="relative">
            <img
              src={file.thumbnail || '/api/placeholder/800/600'}
              alt={file.name}
              className="max-w-full max-h-96 object-contain mx-auto"
              style={{ transform: `scale(${zoom / 100})` }}
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      }

      if (file.mimeType.startsWith('video/')) {
        return (
          <video
            controls
            className="max-w-full max-h-96 mx-auto"
            src="/api/placeholder/video"
          >
            Your browser does not support video playback.
          </video>
        );
      }

      if (file.mimeType.startsWith('audio/')) {
        return (
          <div className="text-center space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto flex items-center justify-center">
              <Volume2 className="h-16 w-16 text-white" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="rounded-full"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex items-center gap-2">
                  <VolumeX className="h-4 w-4" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-20"
                  />
                  <Volume2 className="h-4 w-4" />
                </div>
              </div>
              <Progress value={33} className="w-64 mx-auto" />
              <p className="text-sm text-gray-500">1:23 / 3:45</p>
            </div>
          </div>
        );
      }

      if (file.mimeType === 'application/pdf') {
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-600 dark:text-gray-400">PDF Preview</p>
            <p className="text-sm text-gray-500 mt-2">Click download to view full document</p>
          </div>
        );
      }

      return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-gray-600 dark:text-gray-400">No preview available</p>
          <p className="text-sm text-gray-500 mt-2">Download to view this file</p>
        </div>
      );
    };

    return (
      <Dialog open={!!file} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {file.name}
            </DialogTitle>
            <DialogDescription>
              {formatFileSize(file.size)} • Modified {file.dateModified.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {renderPreview()}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => toast.info('Download started')}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => setShareModalFile(file)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const ShareModal = ({ file, onClose, onShare }: { 
    file: FileItem; 
    onClose: () => void; 
    onShare: (data: ShareData) => void; 
  }) => {
    const [shareEmails, setShareEmails] = useState('');
    const [permissions, setPermissions] = useState<'view' | 'edit' | 'download'>('view');
    const [hasExpiry, setHasExpiry] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');
    const [hasPassword, setHasPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    const handleSubmit = () => {
      const shareData: ShareData = {
        emails: shareEmails.split(',').map(email => email.trim()),
        permissions,
        expiry: hasExpiry ? new Date(expiryDate) : null,
        password: hasPassword ? password : null,
        isPublic,
      };
      onShare(shareData);
    };

    return (
      <Dialog open={!!file} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share {file.name}
            </DialogTitle>
            <DialogDescription>
              Configure sharing settings for this file
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="public-share"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public-share" className="flex items-center gap-2">
                {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {isPublic ? 'Public link' : 'Private sharing'}
              </Label>
            </div>

            {!isPublic && (
              <div className="space-y-2">
                <Label htmlFor="share-emails">Email addresses</Label>
                <Textarea
                  id="share-emails"
                  placeholder="Enter email addresses separated by commas"
                  value={shareEmails}
                  onChange={(e) => setShareEmails(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="permissions">Permissions</Label>
              <Select value={permissions} onValueChange={(value: 'view' | 'edit' | 'download') => setPermissions(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View only</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="download">Can download</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="expiry-toggle"
                checked={hasExpiry}
                onCheckedChange={setHasExpiry}
              />
              <Label htmlFor="expiry-toggle">Set expiry date</Label>
            </div>

            {hasExpiry && (
              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry date</Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="password-toggle"
                checked={hasPassword}
                onCheckedChange={setHasPassword}
              />
              <Label htmlFor="password-toggle">Password protect</Label>
            </div>

            {hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="share-password">Password</Label>
                <Input
                  id="share-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Layout>
      <div
        className={`space-y-6 ${dragOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your files and folders</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </span>
              </Button>
            </label>
            <Button
              variant="outline"
              onClick={() => setIsCreatingFolder(true)}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              <button
                onClick={() => setCurrentPath(crumb.path)}
                className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                {index === 0 ? <Home className="h-4 w-4" /> : crumb.name}
              </button>
              {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
            </React.Fragment>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {selectedFiles.length > 0 && (
              <>
                <Badge variant="secondary">
                  {selectedFiles.length} selected
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('download')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('share')}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value: 'name' | 'size' | 'date' | 'type') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-lg">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading files...</span>
                  <Button size="sm" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {Object.entries(uploadProgress).map(([fileId, progress]) => (
                  <div key={fileId} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>file-{fileId}.jpg</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Grid/List */}
        <div className="space-y-4">
          {/* Select All */}
          {filteredFiles.length > 0 && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedFiles.length === filteredFiles.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Select all ({filteredFiles.length} items)
              </span>
            </div>
          )}

          {/* Files */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file.mimeType, file.type);
                const isSelected = selectedFiles.includes(file.id);

                return (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative group cursor-pointer ${
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Card className="h-full">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Checkbox */}
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => 
                                handleFileSelect(file.id, checked as boolean)
                              }
                            />
                          </div>

                          {/* Actions */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.info('Download started')}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShareModalFile(file)}>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toggleFavorite(file.id)}>
                                  <Star className={`h-4 w-4 mr-2 ${file.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
                                  {file.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Move className="h-4 w-4 mr-2" />
                                  Move
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => moveToTrash([file.id])}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* File Icon/Thumbnail */}
                          <div className="flex justify-center">
                            {file.type === 'folder' ? (
                              <div 
                                className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center cursor-pointer"
                                onClick={() => setCurrentPath(file.path)}
                              >
                                <Icon className="h-8 w-8 text-blue-600" />
                              </div>
                            ) : file.thumbnail ? (
                              <img
                                src={file.thumbnail}
                                alt={file.name}
                                className="w-16 h-16 object-cover rounded-lg"
                                onClick={() => setPreviewFile(file)}
                              />
                            ) : (
                              <div 
                                className={`w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer`}
                                onClick={() => setPreviewFile(file)}
                              >
                                <Icon className={`h-8 w-8 ${getFileTypeColor(file.mimeType, file.type)}`} />
                              </div>
                            )}
                          </div>

                          {/* File Info */}
                          <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {file.name}
                            </p>
                            {file.size && (
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            )}
                          </div>

                          {/* Badges */}
                          <div className="flex justify-center gap-1">
                            {file.isFavorite && (
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            )}
                            {file.isShared && (
                              <Share2 className="h-3 w-3 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredFiles.map((file) => {
                    const Icon = getFileIcon(file.mimeType, file.type);
                    const isSelected = selectedFiles.includes(file.id);

                    return (
                      <motion.div
                        key={file.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleFileSelect(file.id, checked as boolean)
                          }
                        />

                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {file.thumbnail ? (
                            <img
                              src={file.thumbnail}
                              alt={file.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <Icon className={`h-6 w-6 ${getFileTypeColor(file.mimeType, file.type)}`} />
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {file.name}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{file.dateModified.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {file.isFavorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          {file.isShared && (
                            <Share2 className="h-4 w-4 text-blue-500" />
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info('Download started')}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setShareModalFile(file)}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => moveToTrash([file.id])}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No files found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
            </p>
            {!searchQuery && (
              <label htmlFor="file-upload">
                <Button asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </span>
                </Button>
              </label>
            )}
          </div>
        )}

        {/* Create Folder Dialog */}
        <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Enter a name for your new folder
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsCreatingFolder(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* File Preview Modal */}
        {previewFile && (
          <FilePreviewModal
            file={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        )}

        {/* Share Modal */}
        {shareModalFile && (
          <ShareModal
            file={shareModalFile}
            onClose={() => setShareModalFile(null)}
            onShare={handleShare}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;