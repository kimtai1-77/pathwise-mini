import './styles/OverallScoreGauge.css'

export default function OverallScoreGauge({ score }) {
  const circumference = 2 * Math.PI * 38
  return (
    <div className='overall-score' role='img' aria-label={`${score}% overall score`}>
      <svg viewBox='0 0 100 100' aria-hidden='true'>
        <circle className='overall-score-track' cx='50' cy='50' r='38' />
        <circle className='overall-score-progress' cx='50' cy='50' r='38' strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} />
      </svg>
      <span><b>{score}%</b><small>Score</small></span>
    </div>
  )
}