import './styles/EvidenceReviewActions.css'

export default function EvidenceReviewActions({ role, status, evidence, rejecting, rejection, onRejectStart, onRejectChange, onRejectCancel, onRejectConfirm, onApprove }) {
  if (role === 'technician') return <p className='pcd-review-message'>Compliance approval requires supervisor sign-off.</p>
  if (status !== 'pending_review') return <p className='pcd-review-message'>{status === 'compliant' ? 'Strategy verified and approved.' : 'Awaiting evidence submission.'}</p>
  if (rejecting) return (
    <div className='pcd-reject-form'>
      <label>Reason for rejection<textarea rows='2' value={rejection} onChange={(event) => onRejectChange(event.target.value)} placeholder='Explain what needs to be corrected.' /></label>
      <div><button className='pcd-secondary-button' type='button' onClick={onRejectCancel}>Cancel</button><button className='pcd-danger-button' type='button' disabled={!rejection.trim()} onClick={onRejectConfirm}>Confirm Rejection</button></div>
    </div>
  )
  return <><button className='pcd-danger-button' type='button' onClick={onRejectStart}>Reject Evidence</button><button className='pcd-approve-button' type='button' disabled={!evidence} onClick={onApprove}>Approve Evidence</button></>
}