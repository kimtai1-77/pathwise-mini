import './styles/StrategyColumn.css'

export default function StrategyColumn({ tone, title, items, emptyText }) {
  return (
    <section className={`strategy-column pcd-column-${tone}`}>
      <h4><i aria-hidden='true'>{tone === 'missing' ? '!' : '+'}</i>{title}</h4>
      {items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className='pcd-column-empty'>{emptyText}</p>}
    </section>
  )
}