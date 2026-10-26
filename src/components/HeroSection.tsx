import styles from './HeroSection.module.css';
import { APP_URL, SECTION_IDS } from '../constants/navigation';

interface HeroImage {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  placeholder: string;
}

interface Props {
  image: HeroImage;
}

export function HeroSection({ image }: Props) {
  return (
    <section className={`site-container ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <h1 id="hero-title">댓글을 살피는<br />더 나은 흐름.</h1>
        <p className={styles.description}>Instagram 댓글을 분석하고,<br className={styles.desktopBreak} /> 검토와 처리 내역을 한곳에서 관리하세요.</p>
        <div className={styles.actions}>
          <a className="btn btn-primary" href={APP_URL}>nila 바로가기 <span aria-hidden="true">↗</span></a>
          <a className="btn" href={`#${SECTION_IDS.features}`}>기능 살펴보기 <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <figure className={styles.media}>
        <div className={styles.imageFrame} style={{ backgroundImage: `url("${image.placeholder}")` }}>
          <img
            className={styles.productImage}
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            width={image.width}
            height={image.height}
            alt="Nila에서 대응이 필요한 Instagram 댓글을 분류하고 검토·처리하는 화면"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </figure>
    </section>
  );
}
