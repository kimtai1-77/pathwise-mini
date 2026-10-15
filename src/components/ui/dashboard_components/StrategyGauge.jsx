import './styles/StrategyGauge.css'

const circumference = 2 * Math.PI * 16
const segment = circumference / 12

export default function StrategyGauge({ score, status }) {
  const filledSegments = Math.round(score / 100 * 12)
  return (
    <div className={`strategy-percentage strategy-percentage-${status}`} role='img' aria-label={`${score}% strategy score`}>
      <svg viewBox='0 0 44 44' aria-hidden='true'>
        {Array.from({ length: 12 }, (_, index) => <circle key={index} cx='22' cy='22' r='16' className={index < filledSegments ? 'is-filled' : ''} strokeDasharray={`${segment - 3.2} ${circumference - segment + 3.2}`} strokeDashoffset={-index * segment} />)}
      </svg>
      <span>{score}%</span>
    </div>
  )
}