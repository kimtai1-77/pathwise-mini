import './styles/StrategyToolbar.css'

const statusLabels = {
  ALL: 'All Statuses',
  pending_review: 'Pending Review',
  compliant: 'Compliant',
  non_compliant: 'Non-Compliant',
}

export default function StrategyToolbar({ count, status, onStatusChange }) {
  return (
    <section className='dash-toolbar' aria-label='Strategy filters'>
      <div className='dash-toolbar-title'><h2>Mitigation Strategies</h2><span>{count} Controls</span></div>
      <div className='dash-filters'>
        <label className='dash-status'>
          <span className='dash-status-text'>
            <span className='pcd-visually-hidden'>Filter by status</span>
            {statusLabels[status]}
            <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
              <option value='ALL'>All Statuses</option>
              <option value='pending_review'>Pending Review</option>
              <option value='compliant'>Compliant</option>
              <option value='non_compliant'>Non-Compliant</option>
            </select>
          </span>
          <span className='dash-status-icon' aria-hidden='true' />
        </label>
      </div>
    </section>
  )
}