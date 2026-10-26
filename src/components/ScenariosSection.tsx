import styles from './ScenariosSection.module.css';
import { SECTION_IDS } from '../constants/navigation';

const scenarios = [
  { number: '01', label: '분석', title: '무엇부터 확인할지 막막할 때.', description: '댓글과 분류 결과를 함께 살펴보고, 확인이 필요한 댓글을 찾아보세요.', media: '댓글 분석 화면' },
  { number: '02', label: '검토', title: '조금 더 살펴볼 댓글이 있을 때.', description: '검토할 댓글을 한곳에 모으고, 판단과 처리의 흐름을 이어가세요.', media: '검토함 화면' },
  { number: '03', label: '기록', title: '지난 처리 내역이 궁금할 때.', description: '전체·숨김 댓글과 삭제 기록을 확인하며 관리 흐름을 되짚어보세요.', media: '처리 기록 화면' },
];

export function ScenariosSection() {
  return (
    <section id={SECTION_IDS.features} className={styles.section} aria-labelledby="scenarios-title">
      <div className="site-container">
        <div className={styles.heading}>
          <p className="eyebrow">A CLEARER WORKFLOW</p>
          <h2 id="scenarios-title">댓글 관리의 순간마다.</h2>
          <p>분석부터 기록까지, 하나의 흐름으로 살펴보세요.</p>
        </div>
        <div className={styles.rows}>
          {scenarios.map((scenario) => (
            <article key={scenario.number} className={styles.row}>
              <div className={styles.copy}>
                <p className={styles.label}><span>{scenario.number}</span>{scenario.label}</p>
                <h3>{scenario.title}</h3>
                <p className={styles.description}>{scenario.description}</p>
              </div>
              <figure className={styles.screen}>
                <div className={styles.frame} aria-hidden="true"><i /><i /><i /></div>
                <div className={styles.screenBody}>
                  <span className={styles.mediaLabel}>{scenario.media}</span>
                  <p>실제 제품 화면으로 교체 예정</p>
                </div>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
