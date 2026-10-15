import StrategyColumn from './StrategyColumn.jsx'
import StrategyGauge from './StrategyGauge.jsx'
import ComplianceStatus from '../complianceStatus.jsx'
import './styles/StrategyRow.css'

export default function StrategyRow({ strategy, role, onOpen }) {
  const pending = strategy.status === 'pending_review'
  const compliant = strategy.status === 'compliant'
  return (
    <article className='strategy-card'>
      <div className='strategy-row'>
        <div className='strategy-name-section'>
          <StrategyGauge score={strategy.score} status={strategy.status} />
          <div className='strategy-name'>
            <span className='strategy-name-label'>LEVEL 1 REQ</span>
            <h3>{strategy.name}</h3>
            <ComplianceStatus status={strategy.status} />
          </div>
        </div>
        <StrategyColumn tone='missing' title="What's Missing" items={strategy.missing} emptyText='No open gaps identified for this strategy.' />
        <StrategyColumn tone='fixes' title='How to Fix' items={strategy.fixes} emptyText='No remediation actions outstanding.' />
        <div className='strategy-row-actions'>
          {pending && <small>Evidence pending review</small>}
          <button type='button' className={pending && role === 'supervisor' ? 'is-review' : ''} onClick={() => onOpen(strategy.id)}>
            {compliant ? 'View Evidence' : pending && role === 'supervisor' ? 'Review Evidence' : 'Start Fix'}<b aria-hidden='true'>›</b>
          </button>
        </div>
      </div>
    </article>
  )
}