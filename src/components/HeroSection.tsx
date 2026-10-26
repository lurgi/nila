import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className="eyebrow">INSTAGRAM COMMENT MANAGEMENT</p>
        <h1 id="hero-title">댓글을 살피는<br />더 나은 흐름.</h1>
        <p className={styles.description}>확인이 필요한 댓글부터 검토와 처리 기록까지.<br className={styles.desktopBreak} /> Nila에서 댓글 관리의 흐름을 이어가세요.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#contact">도입 문의하기 <span aria-hidden="true">↗</span></a>
          <a className={styles.secondary} href="#scenarios">기능 살펴보기 <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <figure className={styles.media}>
        <div className={styles.placeholder}>
          <span className={styles.placeholderLabel}>PRODUCT WALKTHROUGH</span>
          <span className={styles.mediaTitle}>Nila의 사용 흐름을 한눈에.</span>
          <span className={styles.mediaNote}>이곳에 제품 소개 영상이 들어갈 예정입니다.</span>
        </div>
        <figcaption className={styles.flow}>
          <span>댓글 분석</span><span aria-hidden="true">→</span>
          <span>검토</span><span aria-hidden="true">→</span>
          <span>처리</span><span aria-hidden="true">→</span><span>기록 확인</span>
        </figcaption>
      </figure>
    </section>
  );
}
