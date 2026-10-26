import styles from './ContactSection.module.css';

export function ContactSection() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={`container ${styles.grid}`}>
        <div>
          <p className="eyebrow">LET’S TALK</p>
          <h2 id="contact-title">댓글 관리의 다음 흐름,<br />함께 이야기해요.</h2>
          <p className={styles.description}>관리 중인 채널과 고민을 나눌 수 있는<br className={styles.desktopBreak} /> 문의 창구를 준비하고 있습니다.</p>
        </div>
        <div className={styles.details}>
          <span className={styles.label}>CONTACT</span>
          <p className={styles.status}>문의 채널 준비 중</p>
          <p className={styles.note}>연락처가 확정되면 이곳에서 안내해 드릴게요.</p>
          <div className={styles.divider} />
          <p className={styles.note}>지원 계정 · 연결 방법 · 데이터 관리에 대한 안내도 함께 준비합니다.</p>
        </div>
      </div>
    </section>
  );
}
