import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>nila<span>.</span></div>
        <div className={styles.info}>
          <p>Nila · Instagram 댓글 관리</p>
          <p>개인정보처리방침 · 공개 준비 중</p>
        </div>
      </div>
    </footer>
  );
}
