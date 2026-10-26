import styles from './HeroSection.module.css';
import { APP_URL, SECTION_IDS } from '../constants/navigation';

export function HeroSection() {
  return (
    <section className={`site-container ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <h1 id="hero-title">댓글을 살피는<br />더 나은 흐름.</h1>
        <p className={styles.description}>Instagram 댓글을 분석하고,<br className={styles.desktopBreak} /> 검토와 처리 내역을 한곳에서 관리하세요.</p>
        <div className={styles.actions}>
          <a className="btn btn-primary" href={APP_URL}>Nila 바로가기 <span aria-hidden="true">↗</span></a>
          <a className="btn" href={`#${SECTION_IDS.features}`}>기능 살펴보기 <span aria-hidden="true">↓</span></a>
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
