import { useState } from 'react';
import { useImageCache } from '@/hooks/useImageCache';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CacheManager() {
  const { getCacheStats, clearCache } = useImageCache();
  const [stats, setStats] = useState(getCacheStats());

  const handleClearCache = () => {
    clearCache();
    setStats(getCacheStats());
  };

  const refreshStats = () => {
    setStats(getCacheStats());
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🗄️ Cache Manager
          <Button variant="outline" size="sm" onClick={refreshStats}>
            🔄
          </Button>
        </CardTitle>
        <CardDescription>
          Manage cached color extraction and CORS proxy URLs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.activeColors}</div>
            <div className="text-sm text-gray-600">Cached Colors</div>
            <Badge variant="outline" className="mt-1">
              {stats.totalColors} total
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.activeImages}</div>
            <div className="text-sm text-gray-600">Cached Images</div>
            <Badge variant="outline" className="mt-1">
              {stats.totalImages} total
            </Badge>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-600">Cache Size</div>
          <div className="text-lg font-mono">{formatBytes(stats.cacheSize)}</div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleClearCache} 
            variant="destructive" 
            className="w-full"
          >
            🗑️ Clear All Cache
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Colors cache for 7 days, images cache for 24 hours
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 