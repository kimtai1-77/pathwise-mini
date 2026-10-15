import './styles/EvidenceUpload.css'

export default function EvidenceUpload({ hasEvidence, file, note, onFileChange, onNoteChange, onSubmit }) {
  return (
    <section className='pcd-drawer-section'>
      <h3>{hasEvidence ? 'Replace evidence file' : 'Upload audit evidence'}</h3>
      <label className='pcd-upload'><input type='file' accept='.pdf,.csv,.png,.jpg,.jpeg' onChange={onFileChange} /><strong>{file ? file.name : 'Choose an evidence file'}</strong><span>{file ? file.sizeLabel : 'PDF, CSV, or image · Maximum 25 MB'}</span></label>
      {file && <div className='pcd-upload-submit'><textarea rows='3' placeholder='Add submission notes...' value={note} onChange={(event) => onNoteChange(event.target.value)} /><button type='button' onClick={onSubmit}>Submit Evidence</button></div>}
    </section>
  )
}