import './ui_styles/complianceStatus.css'

const statusLabels = {
  compliant: 'Compliant',
  non_compliant: 'Non-Compliant',
  pending_review: 'Pending Review',
}

export default function ComplianceStatus({ status }) {
  const label = statusLabels[status] ?? 'Unknown'

  return (
    <span className={`compliance-status compliance-status-${status} pcd-status pcd-status-${status}`}>
      {label}
    </span>
  )
}