import styles from './SiteHeader.module.css';
import { APP_URL, SECTION_IDS } from '../constants/navigation';

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`site-container ${styles.inner}`}>
        <a href="#main" className={styles.brand} aria-label="Nila 첫 화면">
          <img src="/nila-wordmark.svg" alt="" width="1799" height="1000" />
        </a>
        <nav aria-label="주요 메뉴" className={styles.nav}>
          <a href={`#${SECTION_IDS.features}`}>기능 살펴보기</a>
          <a href="#contact" className={styles.contact}>Contact <span aria-hidden="true">↗</span></a>
          <a href={APP_URL} className={`btn btn-primary ${styles.appLink}`}>nila 바로가기 <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}
