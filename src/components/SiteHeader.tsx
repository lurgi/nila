import styles from './SiteHeader.module.css';
import { ABOUT_PATH, APP_URL } from '../constants/navigation';

export function SiteHeader({ isAbout = false }: { isAbout?: boolean }) {
  return (
    <header className={styles.header}>
      <div className={`site-container ${styles.inner}`}>
        <a href="/" className={styles.brand} aria-label="nila 첫 화면">
          <img src="/nila-wordmark.svg" alt="" width="1799" height="1000" />
        </a>
        <nav aria-label="주요 메뉴" className={styles.nav}>
          <a href={ABOUT_PATH} aria-current={isAbout ? 'page' : undefined}>About</a>
          <a href={APP_URL} className={`btn btn-primary ${styles.appLink}`}>nila 바로가기</a>
        </nav>
      </div>
    </header>
  );
}
