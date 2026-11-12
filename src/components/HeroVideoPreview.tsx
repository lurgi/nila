import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';
import styles from './HeroVideoPreview.module.css';

const scenarios = [
  '배송 불만 추이',
  '재입고 문의',
  '배송 불만 유형',
  '가격 부담 이유',
];

export function HeroVideoPreview() {
  const id = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<EmblaCarouselType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const carousel = EmblaCarousel(viewport, {
      align: 'center',
      containScroll: false,
      loop: true,
      watchFocus: false,
      breakpoints: { '(prefers-reduced-motion: reduce)': { duration: 0 } },
    });
    carouselRef.current = carousel;

    function syncSelection(api: EmblaCarouselType) {
      const index = api.selectedScrollSnap();
      setSelectedIndex(index);
      if (viewport?.contains(document.activeElement)) {
        api.slideNodes()[index]?.querySelector('button')?.focus({ preventScroll: true });
      }
    }

    carousel.on('select', syncSelection).on('reInit', syncSelection);
    carousel.on('pointerUp', (api) => {
      // Drag release uses its own duration, even when the default is zero.
      if (reducedMotion.matches) api.scrollTo(api.selectedScrollSnap(), true);
    });
    syncSelection(carousel);

    return () => {
      carouselRef.current = null;
      carousel.destroy();
    };
  }, []);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const index = carousel.selectedScrollSnap();
    const lastIndex = scenarios.length - 1;
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = index === 0 ? lastIndex : index - 1;
        break;
      case 'ArrowRight':
        nextIndex = index === lastIndex ? 0 : index + 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = lastIndex;
        break;
      default:
        return;
    }

    event.preventDefault();
    carousel.scrollTo(nextIndex);
  }

  return (
    <div className={styles.preview}>
      <div className={styles.frame}>
        {scenarios.map((label, index) => (
          <div
            key={label}
            id={`${id}-panel-${index}`}
            className={styles.panel}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${index}`}
            aria-hidden={index !== selectedIndex}
            inert={index !== selectedIndex}
          >
            <p>{label}</p>
          </div>
        ))}
      </div>
      <div ref={viewportRef} className={styles.viewport}>
        <div className={styles.track} role="tablist" aria-label="댓글 분석 시나리오">
          {scenarios.map((label, index) => {
            const selected = index === selectedIndex;
            return (
              <div key={label} className={styles.slide} role="presentation">
                <button
                  id={`${id}-tab-${index}`}
                  className={`btn ${selected ? 'btn-active ' : ''}${styles.tab}`}
                  type="button"
                  role="tab"
                  aria-controls={`${id}-panel-${index}`}
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => carouselRef.current?.scrollTo(index)}
                  onKeyDown={onTabKeyDown}
                >
                  {label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
