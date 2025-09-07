/**
 * Cross-browser compatibility utilities and polyfills
 * Ensures consistent behavior across all modern browsers
 */

// Feature detection utilities
export const browserSupport = {
  // Check for modern JavaScript features
  hasES6: () => {
    try {
      new Function('() => {}')();
      return true;
    } catch {
      return false;
    }
  },

  // Check for CSS Grid support
  hasCSSGrid: () => {
    if (typeof window === 'undefined') return true;
    return CSS.supports('display', 'grid');
  },

  // Check for Flexbox support
  hasFlexbox: () => {
    if (typeof window === 'undefined') return true;
    return CSS.supports('display', 'flex');
  },

  // Check for CSS Custom Properties (variables)
  hasCSSVariables: () => {
    if (typeof window === 'undefined') return true;
    return CSS.supports('color', 'var(--test)');
  },

  // Check for IntersectionObserver API
  hasIntersectionObserver: () => {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window;
  },

  // Check for Service Worker support
  hasServiceWorker: () => {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator;
  },

  // Check for WebP image support
  hasWebP: () => {
    if (typeof window === 'undefined') return true;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  },

  // Check for AVIF image support
  hasAVIF: () => {
    if (typeof window === 'undefined') return true;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  },
};

// Browser detection (for edge cases where feature detection isn't enough)
export const getBrowserInfo = () => {
  if (typeof window === 'undefined') {
    return { name: 'server', version: '0', mobile: false };
  }

  const ua = navigator.userAgent;
  const mobile = /Mobi|Android/i.test(ua);

  // Detect browser
  let name = 'unknown';
  let version = '0';

  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    name = 'chrome';
    version = ua.match(/Chrome\/(\d+)/)?.[1] || '0';
  } else if (ua.includes('Firefox')) {
    name = 'firefox';
    version = ua.match(/Firefox\/(\d+)/)?.[1] || '0';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    name = 'safari';
    version = ua.match(/Version\/(\d+)/)?.[1] || '0';
  } else if (ua.includes('Edg')) {
    name = 'edge';
    version = ua.match(/Edg\/(\d+)/)?.[1] || '0';
  }

  return { name, version: parseInt(version), mobile };
};

// Polyfill loader for older browsers
export const loadPolyfills = async () => {
  const polyfills = [];

  // IntersectionObserver polyfill
  if (!browserSupport.hasIntersectionObserver()) {
    polyfills.push(
      import('intersection-observer').catch(() => {
        console.warn('IntersectionObserver polyfill failed to load');
      })
    );
  }

  // ResizeObserver polyfill
  if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
    polyfills.push(
      import('@juggle/resize-observer')
        .then((module) => {
          // @ts-ignore - Dynamic polyfill assignment
          window.ResizeObserver = module.ResizeObserver;
        })
        .catch(() => {
          console.warn('ResizeObserver polyfill failed to load');
        })
    );
  }

  await Promise.all(polyfills);
};

// CSS fallbacks for older browsers
export const cssSupport = {
  // Apply CSS Grid fallback
  applyGridFallback: (element: HTMLElement) => {
    if (!browserSupport.hasCSSGrid()) {
      element.style.display = 'flex';
      element.style.flexWrap = 'wrap';
    }
  },

  // Apply Flexbox fallback
  applyFlexFallback: (element: HTMLElement) => {
    if (!browserSupport.hasFlexbox()) {
      element.style.display = 'block';
      element.style.overflow = 'hidden';
    }
  },
};

// Performance optimization for older browsers
export const performanceOptimizations = {
  // Debounce function for older browsers
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  },

  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Lazy loading images for browsers without native support
  lazyLoadImages: () => {
    if (typeof window === 'undefined') return;

    const images = document.querySelectorAll('img[data-src]');

    if (browserSupport.hasIntersectionObserver()) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach((img) => {
        const element = img as HTMLImageElement;
        element.src = element.dataset.src || '';
        element.classList.remove('lazy');
      });
    }
  },
};

// Font loading optimization
export const fontOptimization = {
  // Preload critical fonts
  preloadFonts: () => {
    if (typeof document === 'undefined') return;

    const fontLinks = [
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        as: 'style',
      },
    ];

    fontLinks.forEach(({ href, as }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },

  // Font display optimization
  optimizeFontDisplay: () => {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  },
};

// Initialize cross-browser optimizations
export const initCrossBrowserOptimizations = async () => {
  // Load polyfills
  await loadPolyfills();

  // Initialize font optimizations
  fontOptimization.preloadFonts();
  fontOptimization.optimizeFontDisplay();

  // Initialize lazy loading
  if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceOptimizations.lazyLoadImages();
    });
  }

  console.log('Cross-browser optimizations initialized');
};
