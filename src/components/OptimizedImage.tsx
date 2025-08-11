import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw'
}: OptimizedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // For now, use direct image source since we don't have all responsive variants
  // In production, you would generate all sizes: 320w, 640w, 1024w, 1440w, 1920w
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div 
          className="absolute inset-0 bg-neutral-light animate-pulse"
          style={{ aspectRatio: `${width} / ${height}` }}
        />
      )}
      
      {/* Error placeholder */}
      {imageError && (
        <div 
          className="absolute inset-0 bg-neutral-light flex items-center justify-center"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <span className="text-neutral-mid text-sm">Image not found</span>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(false);
        }}
      />
    </div>
  );
};