import styles from './ContactSection.module.css';

export function ContactSection() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className="site-container">
        <h2 id="contact-title" className={styles.title}>어떤 이야기든 좋아요.</h2>
        <p className={styles.description}>
          닐라는 혼자 만들고 있어요.<br />
          쓰면서 불편했던 점이나 있었으면 하는 기능,{' '}<br className={styles.desktopBreak} />
          사소한 질문도 편하게 보내주세요.
        </p>
        <a className={styles.email} href="mailto:talk.nila@gmail.com">
          <span>talk.nila@gmail.com</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
