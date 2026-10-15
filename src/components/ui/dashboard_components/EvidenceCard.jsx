import './styles/EvidenceCard.css'

export default function EvidenceCard({ evidence }) {
  if (!evidence) return null
  return (
    <section className='pcd-evidence-card'>
      <div className='pcd-evidence-heading'><div><span className='pcd-kicker'>Attached evidence</span><strong>{evidence.fileName}</strong></div><span className={`pcd-evidence-state pcd-evidence-${evidence.status}`}>{evidence.status.replace('_', ' ')}</span></div>
      <p>{evidence.fileSize} · Uploaded by {evidence.uploadedBy}</p><p>{evidence.createdAt}</p>
      {evidence.note && <blockquote>{evidence.note}</blockquote>}
      {evidence.rejectionReason && <p className='pcd-rejection-note'><strong>Review feedback:</strong> {evidence.rejectionReason}</p>}
    </section>
  )
}