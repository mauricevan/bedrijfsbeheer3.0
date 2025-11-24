/**
 * Performance monitoring utilities
 * Tracks Core Web Vitals and other performance metrics
 */

export interface WebVitals {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

/**
 * Track Core Web Vitals
 */
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };
        const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
        console.log('LCP:', lcp);
        // TODO: Send to analytics service
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP tracking not supported', e);
    }

    // Track FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry & { processingStart?: number; startTime?: number }) => {
          const fid = entry.processingStart! - entry.startTime!;
          console.log('FID:', fid);
          // TODO: Send to analytics service
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID tracking not supported', e);
    }

    // Track CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
            console.log('CLS:', clsValue);
            // TODO: Send to analytics service
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS tracking not supported', e);
    }

    // Track FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime);
            // TODO: Send to analytics service
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP tracking not supported', e);
    }
  }
};

/**
 * Measure component render time
 */
export const measureRenderTime = (componentName: string) => {
  if (import.meta.env.DEV) {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
      return renderTime;
    };
  }
  return () => {};
};

/**
 * Track bundle size
 */
export const trackBundleSize = () => {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    const transferSize = navigation.transferSize;
    const decodedBodySize = navigation.decodedBodySize;
    
    console.log('Bundle Size:', {
      transferSize: `${(transferSize / 1024).toFixed(2)} KB`,
      decodedBodySize: `${(decodedBodySize / 1024).toFixed(2)} KB`,
    });
  }
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Track Web Vitals
  trackWebVitals();

  // Track bundle size after page load
  if (document.readyState === 'complete') {
    trackBundleSize();
  } else {
    window.addEventListener('load', trackBundleSize);
  }
};

