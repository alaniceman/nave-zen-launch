import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 80
}: OptimizedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasWebPSupport, setHasWebPSupport] = useState(true);

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };
    
    setHasWebPSupport(checkWebPSupport());
  }, []);

  // Generate responsive image sources
  const generateSrcSet = (baseSrc: string, extension: string) => {
    const baseName = baseSrc.replace(/\.[^/.]+$/, '');
    const breakpoints = [320, 640, 1024, 1440, 1920];
    
    return breakpoints
      .map(bp => `${baseName}-${bp}.${extension} ${bp}w`)
      .join(', ');
  };

  // Get base filename without extension
  const baseSrc = src.replace(/\.[^/.]+$/, '');
  const originalExt = src.split('.').pop() || 'jpg';

  // Generate WebP and fallback srcsets
  const webpSrcSet = generateSrcSet(src, 'webp');
  const fallbackSrcSet = generateSrcSet(src, originalExt);

  // Default image for fallback
  const defaultSrc = `${baseSrc}-1920.${originalExt}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div 
          className="absolute inset-0 bg-neutral-light animate-pulse"
          style={{ aspectRatio: `${width} / ${height}` }}
        />
      )}
      
      <picture>
        {/* WebP source */}
        <source
          type="image/webp"
          srcSet={webpSrcSet}
          sizes={sizes}
        />
        
        {/* Fallback source */}
        <source
          type={`image/${originalExt}`}
          srcSet={fallbackSrcSet}
          sizes={sizes}
        />
        
        {/* Main img element */}
        <img
          src={defaultSrc}
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
          onError={(e) => {
            // Fallback to original src if responsive images fail
            e.currentTarget.src = src;
          }}
        />
      </picture>
    </div>
  );
};