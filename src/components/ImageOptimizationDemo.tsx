import { OptimizedImage } from "@/components/OptimizedImage"

/**
 * Demo component showing proper usage of OptimizedImage
 * This demonstrates the naming convention and different use cases
 */
export const ImageOptimizationDemo = () => {
  return (
    <div className="space-y-8 p-8">
      {/* Hero Image - LCP Priority */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hero Image (LCP - High Priority)</h2>
        <OptimizedImage
          srcBase="src/assets/hero/nave-hero"
          alt="Interior de Nave Studio con tina de hielo"
          width={1920}
          height={1080}
          priority
          sizes="100vw"
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </section>

      {/* Coach Avatars */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Coach Avatars (Lazy Loading)</h2>
        <div className="flex gap-4">
          <OptimizedImage
            srcBase="/images/coaches/alan-iceman"
            alt="Alan Iceman - Instructor Wim Hof"
            width={320}
            height={320}
            sizes="128px"
            className="w-32 h-32 rounded-full object-cover"
          />
          <OptimizedImage
            srcBase="/images/coaches/coach-2"
            alt="Coach 2"
            width={320}
            height={320}
            sizes="128px"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      </section>

      {/* Method Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Method Cards (Responsive)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OptimizedImage
            srcBase="src/assets/methods/ice-bath"
            alt="Sesión de Ice Bath"
            width={640}
            height={480}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-64 object-cover rounded-xl"
          />
          <OptimizedImage
            srcBase="src/assets/methods/breathwork"
            alt="Sesión de Breathwork"
            width={640}
            height={480}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>
      </section>
    </div>
  )
}

/**
 * File naming convention for srcBase="/images/hero/nave-hero":
 * 
 * Create these files in your public folder:
 * - /images/hero/nave-hero-320.avif
 * - /images/hero/nave-hero-320.webp
 * - /images/hero/nave-hero-320.jpg
 * - /images/hero/nave-hero-640.avif
 * - /images/hero/nave-hero-640.webp
 * - /images/hero/nave-hero-640.jpg
 * - /images/hero/nave-hero-1024.avif
 * - /images/hero/nave-hero-1024.webp
 * - /images/hero/nave-hero-1024.jpg
 * - /images/hero/nave-hero-1440.avif
 * - /images/hero/nave-hero-1440.webp
 * - /images/hero/nave-hero-1440.jpg
 * - /images/hero/nave-hero-1920.avif
 * - /images/hero/nave-hero-1920.webp
 * - /images/hero/nave-hero-1920.jpg
 * 
 * Recommended compression settings:
 * - AVIF: ~85% quality
 * - WebP: ~80% quality  
 * - JPEG: ~75% quality
 */