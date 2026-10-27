import styles from './SiteFooter.module.css';
import { APP_URL } from '../constants/navigation';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`site-container ${styles.inner}`}>
        <div className={styles.brand}>
          <img src="/nila-wordmark.svg" alt="nila." width="1799" height="1000" />
        </div>
        <a className={styles.privacy} href={`${APP_URL}/privacy`}>개인정보처리방침</a>
      </div>
    </footer>
  );
}
