import styles from './ContactSection.module.css';
import { NILA_CONTACT_EMAIL } from '../constants/navigation';

export function ContactSection() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className="site-container text-body">
        <h2 id="contact-title" className="text-section-title">어떤 이야기든 좋아요.</h2>
        <p className={styles.description}>
          닐라는 혼자 만들고 있어요.<br />
          쓰면서 불편했던 점이나 있었으면 하는 기능,{' '}<br className={styles.desktopBreak} />
          사소한 질문도 편하게 보내주세요.
        </p>
        <a className={`text-contact-link ${styles.email}`} href={`mailto:${NILA_CONTACT_EMAIL}`}>
          {NILA_CONTACT_EMAIL}
        </a>
      </div>
    </section>
  );
}
