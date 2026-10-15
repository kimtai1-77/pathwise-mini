import StrategyRow from './StrategyRow.jsx'
import './styles/StrategyList.css'

export default function StrategyList({ strategies, role, onOpen }) {
  if (!strategies.length) return <div className='pcd-empty-results'>No matching strategies. Try changing your search or status filter.</div>
  return <div className='dash-strategy-list'>{strategies.map((strategy) => <StrategyRow key={strategy.id} strategy={strategy} role={role} onOpen={onOpen} />)}</div>
}