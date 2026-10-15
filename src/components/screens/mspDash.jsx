import { useEffect, useState } from 'react'
import DashboardHeader from '../ui/dashboard_components/DashboardHeader.jsx'
import DashboardSummary from '../ui/dashboard_components/DashboardSummary.jsx'
import RemediationDrawer from '../ui/dashboard_components/RemediationDrawer.jsx'
import StrategyList from '../ui/dashboard_components/StrategyList.jsx'
import StrategyToolbar from '../ui/dashboard_components/StrategyToolbar.jsx'
import ToastNotification from '../ui/dashboard_components/ToastNotification.jsx'
import './mspDash.css'

const initialStrategies = [
  { id: 'e8-1', code: 'E8-01', name: 'Patch Applications', category: 'Cyber Threat Prevention', score: 25, status: 'non_compliant', missing: ['Critical application patches (Browser, Office, PDF readers) pending > 48 hours.', 'Application vulnerability scanner not configured for automated weekly runs.', 'Outdated third-party software repositories identified on 14 endpoints.'], fixes: ['Configure centralized application patch manager (e.g., Intune / SCCM / NinjaOne).', 'Deploy missing vendor security updates for web browsers and productivity tools.', 'Automate vulnerability assessment scripts across all domain-joined assets.'], command: 'Set-PathwisePolicy -Control "PatchApps" -MaxPatchDelayHours 48 -AutoEnforce $true', evidence: null },
  { id: 'e8-2', code: 'E8-02', name: 'Application Control', category: 'Execution Prevention', score: 60, status: 'pending_review', missing: ['Unverified script execution allowed in user AppData folders.', 'Software execution policy auditing disabled on workstation ring 2.'], fixes: ['Enforce AppLocker / WDAC rules blocking unapproved executables and DLLs.', 'Restrict execution permissions on user-writable directories.'], command: 'Set-ExecutionPolicy -Scope MachinePolicy -ExecutionPolicy AllSigned', evidence: { id: 'ev-101', fileName: 'WDAC_Policy_Audit_Export_Oct2026.pdf', fileSize: '2.4 MB', uploadedBy: 'Alex Smith (Technician)', uploadedByRole: 'technician', createdAt: '2026-10-12 10:14 AM', status: 'pending_review', reviewedBy: null, note: 'AppLocker audit log exported from RMM. Policy set to Audit mode on 45 workstations.', rejectionReason: null } },
  { id: 'e8-3', code: 'E8-03', name: 'Configure MS Office Macro Settings', category: 'Malware Vector Defense', score: 100, status: 'compliant', missing: [], fixes: [], command: 'Set-GPOConfiguration -Target "OfficeMacroSecurity" -BlockInternetMacros $true', evidence: { id: 'ev-098', fileName: 'GPO_Office_Macro_Block_Export.png', fileSize: '840 KB', uploadedBy: 'Alex Smith (Technician)', uploadedByRole: 'technician', createdAt: '2026-10-10 02:30 PM', status: 'approved', reviewedBy: 'SecOps Admin / Sarah Connor', note: 'Group Policy verified across Active Directory domain policy.', rejectionReason: null } },
  { id: 'e8-4', code: 'E8-04', name: 'User Application Hardening', category: 'Browser & Plugin Security', score: 40, status: 'non_compliant', missing: ['Web browsers permit unauthorized third-party extension installations.', 'Flash/Java legacy runtimes active in legacy intranet environments.'], fixes: ['Deploy Edge & Chrome administrative templates blocking unsanctioned extensions.', 'Disable OLE package execution across Microsoft Office suites.'], command: 'Disable-BrowserExtension -ExtensionPolicy "StrictWhitelistOnly"', evidence: null },
  { id: 'e8-5', code: 'E8-05', name: 'Restrict Administrative Privileges', category: 'Privilege Access Management', score: 75, status: 'pending_review', missing: ['Re-certification of domain admin access overdue for 3 accounts.'], fixes: ['Revoke permanent local admin rights on standard user accounts.', 'Implement Just-In-Time (JIT) privileged access management.'], command: 'Enable-PrivilegedIdentityManagement -Role "GlobalAdmin" -MaxDurationHours 4', evidence: { id: 'ev-104', fileName: 'EntraID_Admin_Privilege_Audit_Q4.csv', fileSize: '1.1 MB', uploadedBy: 'SecOps Admin (Supervisor)', uploadedByRole: 'supervisor', createdAt: '2026-10-12 11:45 AM', status: 'pending_review', reviewedBy: null, note: 'Self-performed audit. Removed 3 domain admin rights from regular staff.', rejectionReason: null } },
  { id: 'e8-6', code: 'E8-06', name: 'Patch Operating Systems', category: 'Vulnerability Remediation', score: 100, status: 'compliant', missing: [], fixes: [], command: 'Update-SystemPatchMatrix -TargetGroup "Servers-Production" -MandateCritical $true', evidence: { id: 'ev-088', fileName: 'OS_Patch_Status_October.pdf', fileSize: '3.1 MB', uploadedBy: 'Alex Smith (Technician)', uploadedByRole: 'technician', createdAt: '2026-10-09 04:00 PM', status: 'approved', reviewedBy: 'SecOps Admin / Sarah Connor', note: 'All endpoints running current Windows 11 23H2 Cumulative Update.', rejectionReason: null } },
  { id: 'e8-7', code: 'E8-07', name: 'Multi-Factor Authentication', category: 'Identity & Access Control', score: 100, status: 'compliant', missing: [], fixes: [], command: 'Set-EntraConditionalAccessPolicy -RequirePhishingResistantMFA -ApplyTo "AllAdmins"', evidence: { id: 'ev-077', fileName: 'Entra_MFA_ConditionalAccess_Policy.pdf', fileSize: '1.8 MB', uploadedBy: 'Alex Smith (Technician)', uploadedByRole: 'technician', createdAt: '2026-10-08 11:20 AM', status: 'approved', reviewedBy: 'SecOps Admin / Sarah Connor', note: '100% MFA enforcement on all cloud logins.', rejectionReason: null } },
  { id: 'e8-8', code: 'E8-08', name: 'Regular Backups', category: 'Data Resilience & Recovery', score: 10, status: 'non_compliant', missing: ['Immutable backup copy not verified for server cluster B.', 'Restoration drill failed verification requirement for SQL databases.'], fixes: ['Establish offsite, immutable backup repositories with MFA deletion locks.', 'Perform and document quarterly backup restoration drills.'], command: 'Test-PathwiseBackupIntegrity -StorageVault "OffsiteWORMVault01"', evidence: null },
]

function formatFileSize(size) {
  return size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`
}

export default function MspDash({ user, onSignOut }) {
  const [strategies, setStrategies] = useState(initialStrategies)
  const [role, setRole] = useState('supervisor')
  const [darkTheme, setDarkTheme] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [organizationsOpen, setOrganizationsOpen] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState('Northstar Legal Group')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedId, setSelectedId] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadNote, setUploadNote] = useState('')
  const [rejection, setRejection] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [toast, setToast] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState('')

  const selected = strategies.find((strategy) => strategy.id === selectedId)
  const compliantCount = strategies.filter((strategy) => strategy.status === 'compliant').length
  const score = Math.round(compliantCount / strategies.length * 100)
  const filteredStrategies = strategies.filter((strategy) => statusFilter === 'ALL' || strategy.status === statusFilter)

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 3500)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function updateStrategy(id, transform) {
    setStrategies((current) => current.map((strategy) => strategy.id === id ? transform(strategy) : strategy))
  }

  function closeDrawer() {
    setSelectedId(null)
    setUploadFile(null)
    setUploadNote('')
    setRejection('')
    setRejecting(false)
  }

  function handleFileSelect(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 25 * 1024 * 1024) {
      setToast('Evidence files must be 25 MB or smaller.')
      event.target.value = ''
      return
    }
    setUploadFile(file)
  }

  function submitEvidence() {
    if (!selected || !uploadFile) return
    const evidence = {
      id: `ev-${Math.floor(1000 + Math.random() * 9000)}`,
      fileName: uploadFile.name,
      fileSize: formatFileSize(uploadFile.size),
      uploadedBy: role === 'technician' ? 'Field Tech' : 'SecOps Admin',
      uploadedByRole: role,
      createdAt: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'pending_review',
      reviewedBy: null,
      note: uploadNote || 'Manual evidence file uploaded for compliance verification.',
      rejectionReason: null,
    }
    updateStrategy(selected.id, (strategy) => ({ ...strategy, status: 'pending_review', evidence }))
    setUploadFile(null)
    setUploadNote('')
    setToast('Evidence submitted for review.')
  }

  function approveEvidence() {
    if (!selected?.evidence) return
    updateStrategy(selected.id, (strategy) => ({
      ...strategy,
      status: 'compliant',
      score: 100,
      missing: [],
      fixes: [],
      evidence: { ...strategy.evidence, status: 'approved', reviewedBy: 'SecOps Admin' },
    }))
    setToast('Evidence approved. Strategy is now compliant.')
  }

  function rejectEvidence() {
    if (!selected?.evidence || !rejection.trim()) return
    updateStrategy(selected.id, (strategy) => ({
      ...strategy,
      status: 'non_compliant',
      evidence: { ...strategy.evidence, status: 'rejected', reviewedBy: 'SecOps Admin', rejectionReason: rejection.trim() },
    }))
    setRejection('')
    setRejecting(false)
    setToast('Evidence rejected and returned with feedback.')
  }

  async function handleSignOut() {
    setSigningOut(true)
    setSignOutError('')
    try { await onSignOut() } catch { setSignOutError('Sign out failed. Please try again.') } finally { setSigningOut(false) }
  }

  async function copyCommand() {
    try { await navigator.clipboard.writeText(selected.command); setToast('Command copied to clipboard.') }
    catch { setToast('Clipboard access is unavailable in this browser.') }
  }

  const rootClass = `pcd-shell${darkTheme ? ' pcd-theme-dark' : ''}`
  const organizations = [
    'Northstar Legal Group',
    'Juniper Health Partners',
    'Cedar & Stone Manufacturing',
    'Brightline Accounting',
    'Redwood Property Group',
    'Harborview Education',
    'Summit Ridge Logistics',
    'Bluewater Community Bank',
  ]
  return (
    <div className={rootClass}>
      <DashboardHeader user={user} role={role} darkTheme={darkTheme} onRoleChange={() => setRole((current) => current === 'supervisor' ? 'technician' : 'supervisor')} onThemeChange={() => setDarkTheme((current) => !current)} onSignOut={handleSignOut} signingOut={signingOut} />
      <main className={`pcd-main${sidebarCollapsed ? ' pcd-sidebar-collapsed' : ''}`} id='overview'>
        <aside className={`pcd-sidebar${sidebarCollapsed ? ' is-collapsed' : ''}`} aria-label='Workspace navigation'>
          <div className='pcd-sidebar-heading'>
            <span className='pcd-sidebar-mark' aria-hidden='true'>P</span>
            <div><strong>Pathwise</strong><span>MSP workspace</span></div>
            <button className='pcd-sidebar-toggle' type='button' aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'} aria-expanded={!sidebarCollapsed} title={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'} onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}>
              <span className='pcd-sidebar-toggle-icon' aria-hidden='true' />
            </button>
          </div>
          <nav className='pcd-sidebar-nav' aria-label='Main navigation'>
            <a className='pcd-sidebar-link is-active' href='#overview' aria-current='page' title='Overview'><span className='pcd-sidebar-label'>Overview</span><span className='pcd-sidebar-short' aria-hidden='true'>O</span></a>
            <div className='pcd-organization-nav'>
              <button className='pcd-sidebar-link' type='button' aria-label='Organizations' title='Organizations' aria-expanded={organizationsOpen} aria-controls='pcd-organization-list' onClick={() => setOrganizationsOpen((open) => !open)}>
                <span className='pcd-sidebar-label'>Organizations</span><span className='pcd-sidebar-short' aria-hidden='true'>ORG</span><span className='pcd-sidebar-chevron' aria-hidden='true'>{organizationsOpen ? '\u2212' : '+'}</span>
              </button>
              {organizationsOpen && (
                <div className='pcd-organization-list' id='pcd-organization-list'>
                  {organizations.map((organization) => (
                    <button className={selectedOrganization === organization ? 'is-selected' : ''} key={organization} type='button' onClick={() => setSelectedOrganization(organization)}>
                      {organization}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <div className='pcd-sidebar-bottom'>
            <p>Current organization</p>
            <strong>{selectedOrganization}</strong>
            <a className='pcd-sidebar-settings' href='#account-settings' title='Settings'><span className='pcd-sidebar-label'>Settings</span><span className='pcd-sidebar-short' aria-hidden='true'>S</span><span aria-hidden='true'>&#8599;</span></a>
          </div>
        </aside>
        <section className='pcd-workspace' aria-label='Compliance overview'>
          <DashboardSummary score={score} />
          <StrategyToolbar count={filteredStrategies.length} status={statusFilter} onStatusChange={setStatusFilter} />
          <StrategyList strategies={filteredStrategies} role={role} onOpen={setSelectedId} />
          {signOutError && <p className='pcd-signout-error' role='alert'>{signOutError}</p>}
        </section>
      </main>
      <RemediationDrawer strategy={selected} role={role} file={uploadFile ? { name: uploadFile.name, sizeLabel: formatFileSize(uploadFile.size) } : null} note={uploadNote} rejection={rejection} rejecting={rejecting} onClose={closeDrawer} onFileChange={handleFileSelect} onNoteChange={setUploadNote} onSubmit={submitEvidence} onCopy={copyCommand} onRejectStart={() => setRejecting(true)} onRejectChange={setRejection} onRejectCancel={() => setRejecting(false)} onRejectConfirm={rejectEvidence} onApprove={approveEvidence} />
      <ToastNotification message={toast} />
    </div>
  )
}