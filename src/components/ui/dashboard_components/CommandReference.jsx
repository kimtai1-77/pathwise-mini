import './styles/CommandReference.css'

export default function CommandReference({ command, onCopy }) {
  return <section className='pcd-drawer-section'><h3>Execution script / command reference</h3><div className='pcd-command'><code>{command}</code><button type='button' onClick={onCopy}>Copy</button></div></section>
}