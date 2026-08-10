export function ScoreCard({ score }: { score: number }) {
  return (
    <section className="card quality-card" aria-labelledby="quality-score-title">
      <p className="section-kicker">Mock quality model</p>
      <h2 id="quality-score-title">Quality score</h2>
      <strong className="quality-score">{score}<span>/100</span></strong>
    </section>
  );
}
