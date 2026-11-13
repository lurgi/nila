import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';
import styles from './HeroVideoPreview.module.css';

const scenarios = [
  {
    label: '배송 불만 추이',
    src: '/videos/01-delivery-complaints.mp4',
    description: '댓글을 바탕으로 배송 불만이 언제 늘었는지 살펴봐요.',
  },
  {
    label: '재입고 문의',
    src: '/videos/02-restock-interest.mp4',
    description: '어떤 상품의 재입고를 묻는 댓글이 있는지 찾아봐요.',
  },
  {
    label: '배송 불만 유형',
    src: '/videos/03-shipping-issue-types.mp4',
    description: '배송 지연이나 포장 문제처럼 불만을 유형별로 살펴봐요.',
  },
  {
    label: '가격 부담 이유',
    src: '/videos/04-price-concerns.mp4',
    description: '고객이 어떤 이유로 가격이 부담스럽다고 말하는지 살펴봐요.',
  },
];

type Presentation = { index: number; status: 'loading' | 'ready' | 'error' };

export function HeroVideoPreview() {
  const id = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<EmblaCarouselType | null>(null);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const [selection, setSelection] = useState({ index: 0 });
  const selectionRef = useRef(selection);
  const selectedIndex = selection.index;
  const [requested, setRequested] = useState(() => new Set([0]));
  const [preloadRemaining, setPreloadRemaining] = useState(false);
  const [presentation, setPresentation] = useState<Presentation>({ index: 0, status: 'loading' });
  const [manualSelection, setManualSelection] = useState<typeof selection | null>(null);

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
      if (index !== selectionRef.current.index) {
        videosRef.current[selectionRef.current.index]?.pause();
        const nextSelection = { index };
        selectionRef.current = nextSelection;
        setSelection(nextSelection);
        setRequested((previous) => previous.has(index) ? previous : new Set([...previous, index]));
      }
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

  useEffect(() => {
    const first = videosRef.current[0];
    // The first request starts in the initial HTML and can finish before hydration.
    if (first && (first.error || first.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA)) {
      setPreloadRemaining(true);
    }
  }, []);

  useEffect(() => {
    const { index } = selection;
    const video = videosRef.current[index];
    if (!video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let revealed = false;

    const reveal = () => {
      if (revealed || selectionRef.current !== selection || video.seeking ||
          video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return;

      revealed = true;
      setPresentation({ index, status: 'ready' });
      if (reducedMotion.matches) {
        setManualSelection(selection);
      } else {
        void video.play().catch(() => {
          if (selectionRef.current === selection) setManualSelection(selection);
        });
      }
    };

    function showError() {
      if (selectionRef.current === selection) {
        setPresentation({ index, status: 'error' });
      }
    }

    function advance() {
      if (selectionRef.current === selection) {
        carouselRef.current?.scrollNext(reducedMotion.matches);
      }
    }

    video.addEventListener('canplay', reveal);
    video.addEventListener('seeked', reveal);
    video.addEventListener('error', showError);
    video.addEventListener('ended', advance);
    if (video.error) {
      showError();
    } else {
      if (video.currentTime > 0) video.currentTime = 0;
      reveal();
    }

    return () => {
      video.removeEventListener('canplay', reveal);
      video.removeEventListener('seeked', reveal);
      video.removeEventListener('error', showError);
      video.removeEventListener('ended', advance);
      video.pause();
    };
  }, [selection]);

  function playManually() {
    void videosRef.current[selectedIndex]?.play().then(() => {
      setManualSelection((current) => current === selection ? null : current);
    }).catch(() => {});
  }

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
      <div className={styles.descriptions}>
        {scenarios.map(({ label, description }, index) => (
          <p key={label} data-visible={index === presentation.index}>
            {description}
          </p>
        ))}
      </div>
      <div ref={viewportRef} className={styles.viewport}>
        <div className={styles.track} role="tablist" aria-label="댓글 분석 시나리오">
          {scenarios.map(({ label }, index) => {
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
      <div className={styles.frame}>
        {scenarios.map(({ label, src }, index) => {
          const selected = index === selectedIndex;
          const visible = index === presentation.index;
          const ready = visible && presentation.status === 'ready';
          const failed = visible && presentation.status === 'error';
          const releasePreload = index === 0 ? () => setPreloadRemaining(true) : undefined;

          return (
            <div
              key={label}
              id={`${id}-panel-${index}`}
              className={styles.panel}
              data-visible={visible}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${index}`}
              aria-hidden={!selected}
              aria-busy={selected && (!visible || presentation.status === 'loading')}
              inert={!selected}
              tabIndex={selected && !ready ? 0 : undefined}
            >
              <video
                ref={(element) => { videosRef.current[index] = element; }}
                className={styles.video}
                src={preloadRemaining || requested.has(index) ? src : undefined}
                preload="auto"
                muted
                playsInline
                aria-label={label}
                aria-hidden={!ready}
                onCanPlay={releasePreload}
                onError={releasePreload}
              />
              {selected && ready && manualSelection === selection && (
                <button
                  className={`btn btn-square ${styles.playback}`}
                  type="button"
                  aria-label="재생"
                  onClick={playManually}
                >
                  <span className={styles.playIcon} aria-hidden="true" />
                </button>
              )}
              {visible && !ready && (
                <div className={styles.placeholder}>
                  <p>{label}</p>
                  {failed && <p role="status">영상을 불러오지 못했어요.</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
