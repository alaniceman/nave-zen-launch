import React, { useState, useEffect } from 'react'

interface OptimizedImageProps {
  srcBase: string // Path without extension (e.g., "/images/hero/nave-hero")
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  placeholder?: string // base64 blur placeholder
}

/**
 * OptimizedImage Component
 * 
 * Generates responsive <picture> elements with multiple formats and sizes.
 * 
 * File naming convention:
 * - srcBase="/images/hero/nave-hero" expects files like:
 *   - nave-hero-320.avif, nave-hero-320.webp, nave-hero-320.jpg
 *   - nave-hero-640.avif, nave-hero-640.webp, nave-hero-640.jpg
 *   - nave-hero-1024.avif, nave-hero-1024.webp, nave-hero-1024.jpg
 *   - nave-hero-1440.avif, nave-hero-1440.webp, nave-hero-1440.jpg
 *   - nave-hero-1920.avif, nave-hero-1920.webp, nave-hero-1920.jpg
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  srcBase,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  placeholder = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Generate srcset for different formats
  const generateSrcSet = (format: 'webp' | 'jpg') => {
    const widths = [320, 640, 1024, 1920]
    return widths
      .map(w => `${srcBase}-${w}.${format} ${w}w`)
      .join(', ')
  }

  // Fallback image (highest quality available)
  const fallbackSrc = `${srcBase}-1920.jpg`

  // Preload link for LCP images
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.imageSrcset = generateSrcSet('webp')
      link.imageSizes = sizes
      document.head.appendChild(link)

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      }
    }
  }, [priority, srcBase, sizes])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {placeholder && !isLoaded && (
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-sm transition-opacity duration-300"
          style={{ 
            backgroundImage: `url(${placeholder})`,
            opacity: isLoaded ? 0 : 1
          }}
        />
      )}

      <picture className="block w-full h-full">
        {/* WebP format - good compression, wide support */}
        <source
          type="image/webp"
          srcSet={generateSrcSet('webp')}
          sizes={sizes}
        />
        
        {/* JPEG fallback - universal support */}
        <img
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${hasError ? 'bg-neutral-light' : ''}`}
          style={{
            aspectRatio: `${width} / ${height}`
          }}
        />
      </picture>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-light text-neutral-mid text-sm">
          Error al cargar imagen
        </div>
      )}
    </div>
  )
}

/**
 * Usage Examples:
 * 
 * // Hero image (LCP - high priority)
 * <OptimizedImage
 *   srcBase="/images/hero/nave-hero"
 *   alt="Interior de Nave Studio con tina de hielo"
 *   width={1920}
 *   height={1080}
 *   priority
 *   sizes="100vw"
 *   className="w-full h-[70vh] object-cover"
 * />
 * 
 * // Coach avatars (smaller, lazy)
 * <OptimizedImage
 *   srcBase="/images/coaches/coach-alan"
 *   alt="Alan Iceman - Instructor Wim Hof"
 *   width={320}
 *   height={320}
 *   sizes="(max-width: 768px) 128px, 160px"
 *   className="w-32 h-32 rounded-full object-cover"
 * />
 * 
 * // Grid cards (responsive)
 * <OptimizedImage
 *   srcBase="/images/methodologies/ice-bath"
 *   alt="Sesión de Ice Bath"
 *   width={640}
 *   height={480}
 *   sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 33vw"
 *   className="w-full h-64 object-cover rounded-xl"
 * />
 */