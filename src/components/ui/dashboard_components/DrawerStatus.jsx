import './styles/DrawerStatus.css'

export default function DrawerStatus({ strategy }) {
  const label = strategy.status === 'pending_review' ? 'Pending Review' : strategy.status.replace('_', ' ')
  return <section className={`pcd-drawer-status pcd-status-${strategy.status}`}><span className='pcd-kicker'>Strategy compliance state</span><strong>{label}</strong><small>{strategy.evidence ? `Evidence ref: ${strategy.evidence.id}` : 'No evidence attached'}</small></section>
}