import './styles/RemediationChecklist.css'

export default function RemediationChecklist({ steps }) {
  if (!steps.length) return null
  return <section className='pcd-drawer-section'><h3>Action steps</h3><div className='pcd-remediation-steps'>{steps.map((step, index) => <label key={step}><input type='checkbox' /><b>{String(index + 1).padStart(2, '0')}</b><span>{step}</span></label>)}</div></section>
}