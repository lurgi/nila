import { Fragment, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import styles from './ScenariosSection.module.css';
import { SECTION_IDS } from '../constants/navigation';

const features = [
  { id: 'analysis', title: ['살펴볼 댓글을', '더 빠르게 찾으세요.'], description: '댓글의 비난 표현과 게시물 관련성을 언어 모델로 분석해, 먼저 대응할 댓글과 추가로 확인할 댓글을 나눠 보여줍니다.' },
  { id: 'review', title: ['검토부터 처리까지,', '한곳에서 이어가세요.'], description: '바로 판단하기 어려운 댓글은 검토함에 모아 살펴보고, Instagram 댓글을 바로 숨기거나 삭제하세요.' },
  { id: 'history', title: ['삭제 내역을 확인하고,', '관리 기록으로 남기세요.'], description: '어떤 댓글을 삭제했는지 확인하고 내역을 CSV로 내려받으세요. 엑셀에 하나씩 옮겨 적지 않아도 관리 기록을 남길 수 있습니다.' },
];

const trackId = `${SECTION_IDS.features}-carousel`;

type Navigation = {
  mode: 'fallback' | 'grid' | 'carousel';
  canPrevious: boolean;
  canNext: boolean;
};

export function ScenariosSection() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<EmblaCarouselType | null>(null);
  const reducedMotionRef = useRef<MediaQueryList | null>(null);
  const [navigation, setNavigation] = useState<Navigation>({
    mode: 'fallback', canPrevious: false, canNext: false,
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const gridMedia = window.matchMedia('(min-width: 1280px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = reducedMotion;

    const update = () => {
      const carousel = carouselRef.current;
      setNavigation({
        mode: gridMedia.matches ? 'grid' : carousel ? 'carousel' : 'fallback',
        canPrevious: carousel?.canScrollPrev() ?? false,
        canNext: carousel?.canScrollNext() ?? false,
      });
    };
    const destroy = () => {
      const carousel = carouselRef.current;
      carouselRef.current = null;
      if (carousel) {
        carousel.off('select', update);
        carousel.off('reInit', update);
        carousel.destroy();
      }
      delete viewport.dataset.emblaReady;
      viewport.scrollLeft = 0;
    };
    const setMode = () => {
      if (gridMedia.matches) {
        destroy();
        update();
        return;
      }
      if (carouselRef.current) return;

      // Let Embla measure the visible-overflow layout, not the native fallback.
      viewport.scrollLeft = 0;
      viewport.dataset.emblaReady = 'true';
      try {
        const carousel = EmblaCarousel(viewport, {
          align: 'start',
          containScroll: 'trimSnaps',
          slidesToScroll: 1,
          loop: false,
          dragFree: false,
          watchSlides: true,
          watchResize: true,
          breakpoints: { '(prefers-reduced-motion: reduce)': { duration: 0 } },
        }, [WheelGesturesPlugin({ forceWheelAxis: 'x' })]);
        carouselRef.current = carousel;
        carousel.on('select', update);
        carousel.on('reInit', update);
        update();
      } catch (error) {
        destroy();
        update();
        console.error('기능 캐러셀을 초기화하지 못했습니다.', error);
      }
    };

    gridMedia.addEventListener('change', setMode);
    setMode();
    return () => {
      gridMedia.removeEventListener('change', setMode);
      destroy();
      reducedMotionRef.current = null;
    };
  }, []);

  const goPrevious = () => carouselRef.current?.scrollPrev(reducedMotionRef.current?.matches ?? false);
  const goNext = () => carouselRef.current?.scrollNext(reducedMotionRef.current?.matches ?? false);
  const onKeydown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!carouselRef.current || event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowRight') goNext();
    else goPrevious();
  };
  const isCarousel = navigation.mode === 'carousel';

  return (
    <section id={SECTION_IDS.features} className={styles.section} aria-label="주요 기능" data-feature-carousel>
      <div
        ref={viewportRef}
        id={trackId}
        className={styles.viewport}
        role="group"
        aria-label="기능 카드"
        aria-roledescription={isCarousel ? '캐러셀' : undefined}
        tabIndex={navigation.mode === 'grid' ? undefined : 0}
        onKeyDown={onKeydown}
        data-carousel-viewport
      >
        <div className={styles.track} data-carousel-track>
          {features.map((feature, index) => (
            <article
              key={feature.id}
              className={`card ${styles.featureCard}`}
              data-feature={feature.id}
              role={isCarousel ? 'group' : undefined}
              aria-roledescription={isCarousel ? '슬라이드' : undefined}
              aria-label={isCarousel ? `${index + 1} / ${features.length}` : undefined}
            >
              <div className={styles.body}>
                <h2>{feature.title.map((line, index) => <Fragment key={index}>{index > 0 && <br />}{line}</Fragment>)}</h2>
                <p className={styles.description}>{feature.description}</p>
              </div>
              <div className={styles.imageSlot} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
      <div className="site-container">
        <div className={styles.controls} data-carousel-controls hidden={!navigation.canPrevious && !navigation.canNext}>
          <button type="button" className={`btn btn-circle ${styles.control}`} aria-label="이전 기능" aria-controls={trackId} data-carousel-previous disabled={!navigation.canPrevious} onClick={goPrevious}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" className={`btn btn-circle ${styles.control}`} aria-label="다음 기능" aria-controls={trackId} data-carousel-next disabled={!navigation.canNext} onClick={goNext}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
