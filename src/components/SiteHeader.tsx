import styles from './SiteHeader.module.css';

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#main" className={styles.brand} aria-label="Nila 첫 화면">nila<span aria-hidden="true">.</span></a>
        <nav aria-label="주요 메뉴" className={styles.nav}>
          <a href="#scenarios">기능 살펴보기</a>
          <a href="#contact" className={styles.contact}>Contact <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}
