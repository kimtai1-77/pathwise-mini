import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronRight, 
  X, 
  Lock, 
  Search,
  Bell,
  Check,
  Award,
  ChevronDown,
  Info,
  BadgeCheck
} from 'lucide-react';

const INITIAL_STRATEGIES = [
  {
    id: 'e8-1',
    code: 'E8-01',
    name: 'Patch Applications',
    category: 'Cyber Threat Prevention',
    levelReq: 'LEVEL 1 REQ',
    level: 1,
    scorePercent: 25,
    status: 'non_compliant',
    missingPoints: [
      'Critical application patches (Browser, Office, PDF readers) pending > 48 hours.',
      'Application vulnerability scanner not configured for automated weekly runs.',
      'Outdated third-party software repositories identified on 14 endpoints.'
    ],
    howToFixPoints: [
      'Configure centralized application patch manager (e.g., Intune / SCCM / NinjaOne).',
      'Deploy missing vendor security updates for web browsers and productivity tools.',
      'Automate vulnerability assessment scripts across all domain-joined assets.'
    ],
    evidence: null
  },
  {
    id: 'e8-2',
    code: 'E8-02',
    name: 'Application Control',
    category: 'Execution Prevention',
    levelReq: 'LEVEL 1 REQ',
    level: 1,
    scorePercent: 60,
    status: 'pending_review',
    missingPoints: [
      'Unverified script execution allowed in user AppData folders.',
      'Software execution policy auditing disabled on workstation ring 2.'
    ],
    howToFixPoints: [
      'Enforce AppLocker / WDAC rules blocking unapproved executables and DLLs.',
      'Restrict execution permissions on user-writable directories.'
    ],
    evidence: {
      id: 'ev-101',
      fileName: 'WDAC_Policy_Audit_Export_Oct2026.pdf',
      fileSize: '2.4 MB',
      uploadedBy: 'Alex Smith (Technician)',
      uploadedByRole: 'technician',
      createdAt: '2026-10-12 10:14 AM',
      status: 'pending_review',
      reviewedBy: null,
      note: 'AppLocker audit log exported from RMM. Policy set to Audit mode on 45 workstations.',
      rejectionReason: null
    }
  },
  {
    id: 'e8-3',
    code: 'E8-03',
    name: 'Configure MS Office Macro Settings',
    category: 'Malware Vector Defense',
    levelReq: 'LEVEL 1 REQ',
    level: 1,
    scorePercent: 100,
    status: 'compliant',
    missingPoints: [],
    howToFixPoints: [],
    evidence: {
      id: 'ev-098',
      fileName: 'GPO_Office_Macro_Block_Export.png',
      fileSize: '840 KB',
      uploadedBy: 'Alex Smith (Technician)',
      uploadedByRole: 'technician',
      createdAt: '2026-10-10 02:30 PM',
      status: 'approved',
      reviewedBy: 'SecOps Admin / Sarah Connor',
      note: 'Group Policy verified across Active Directory domain policy.',
      rejectionReason: null
    }
  },
  {
    id: 'e8-4',
    code: 'E8-04',
    name: 'User Application Hardening',
    category: 'Browser & Plugin Security',
    levelReq: 'LEVEL 1 REQ',
    level: 1,
    scorePercent: 40,
    status: 'non_compliant',
    missingPoints: [
      'Web browsers permit unauthorized third-party extension installations.',
      'Flash/Java legacy runtimes active in legacy intranet environments.'
    ],
    howToFixPoints: [
      'Deploy Edge & Chrome administrative templates blocking unsanctioned extensions.',
      'Disable OLE package execution across Microsoft Office suites.'
    ],
    evidence: null
  },
  {
    id: 'e8-5',
    code: 'E8-05',
    name: 'Restrict Administrative Privileges',
    category: 'Privilege Access Management',
    levelReq: 'LEVEL 1 REQ',
    level: 1,
    scorePercent: 75,
    status: 'pending_review',
    missingPoints: [
      'Re-certification of domain admin access overdue for 3 accounts.'
    ],
    howToFixPoints: [
      'Revoke permanent local admin rights on standard user accounts.',
      'Implement Just-In-Time (JIT) privileged access management.'
    ],
    evidence: {
      id: 'ev-104',
      fileName: 'EntraID_Admin_Privilege_Audit_Q4.csv',
      fileSize: '1.1 MB',
      uploadedBy: 'SecOps Admin (Supervisor)',
      uploadedByRole: 'supervisor',
      createdAt: '2026-10-12 11:45 AM',
      status: 'pending_review',
      reviewedBy: null,
      note: 'Self-performed audit. Removed 3 domain admin rights from regular staff.',
      rejectionReason: null
    }
  },
  {
    id: 'e8-6',
    code: 'E8-06',
    name: 'Patch Operating Systems',
    category: 'Vulnerability Remediation',
    levelReq: 'LEVEL 1 REQ',
    level: 1,
    scorePercent: 100,
    status: 'compliant',
    missingPoints: [],
    howToFixPoints: [],
    evidence: {
      id: 'ev-088',
      fileName: 'OS_Patch_Status_October.pdf',
      fileSize: '3.1 MB',
      uploadedBy: 'Alex Smith (Technician)',
      uploadedByRole: 'technician',
      createdAt: '2026-10-09 04:00 PM',
      status: 'approved',
      reviewedBy: 'SecOps Admin / Sarah Connor',
      note: 'All endpoints running current Windows 11 23H2 Cumulative Update.',
      rejectionReason: null
    }
  },
  {
    id: 'e8-7',
    code: 'E8-07',
    name: 'Multi-Factor Authentication',
    category: 'Identity & Access Control',
    levelReq: 'LEVEL 1 REQ',
    level: 1,
    scorePercent: 100,
    status: 'compliant',
    missingPoints: [],
    howToFixPoints: [],
    evidence: {
      id: 'ev-077',
      fileName: 'Entra_MFA_ConditionalAccess_Policy.pdf',
      fileSize: '1.8 MB',
      uploadedBy: 'Alex Smith (Technician)',
      uploadedByRole: 'technician',
      createdAt: '2026-10-08 11:20 AM',
      status: 'approved',
      reviewedBy: 'SecOps Admin / Sarah Connor',
      note: '100% MFA enforcement on all cloud logins.',
      rejectionReason: null
    }
  },
  {
    id: 'e8-8',
    code: 'E8-08',
    name: 'Regular Backups',
    category: 'Data Resilience & Recovery',
    levelReq: 'LEVEL 1 REQ',
    level: 1,
    scorePercent: 10,
    status: 'non_compliant',
    missingPoints: [
      'Immutable backup copy not verified for server cluster B.',
      'Restoration drill failed verification requirement for SQL databases.'
    ],
    howToFixPoints: [
      'Establish offsite, immutable backup repositories with MFA deletion locks.',
      'Perform and document quarterly backup restoration drills.'
    ],
    evidence: null
  }
];

export default function App() {
  const [strategies, setStrategies] = useState(INITIAL_STRATEGIES);
  const [selectedLevel, setSelectedLevel] = useState('Level 1 Baseline');
  const [activeRole, setActiveRole] = useState('supervisor'); // 'technician' | 'supervisor'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStrategyId, setSelectedStrategyId] = useState(null);

  // Drawer upload & feedback state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadNote, setUploadNote] = useState('');
  const [rejectionInput, setRejectionInput] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const selectedStrategy = useMemo(() => {
    return strategies.find(s => s.id === selectedStrategyId) || null;
  }, [strategies, selectedStrategyId]);

  const stats = useMemo(() => {
    const total = strategies.length;
    const compliant = strategies.filter(s => s.status === 'compliant').length;
    const score = Math.round((compliant / total) * 100);
    return { total, compliant, score };
  }, [strategies]);

  const filteredStrategies = useMemo(() => {
    return strategies.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [strategies, searchQuery, statusFilter]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSimulatedFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    });
  };

  const handleSubmitEvidence = () => {
    if (!uploadFile || !selectedStrategyId) return;

    const newEvidence = {
      id: `ev-${Math.floor(1000 + Math.random() * 9000)}`,
      fileName: uploadFile.name,
      fileSize: uploadFile.size,
      uploadedBy: activeRole === 'technician' ? 'Alex Smith (Field Tech)' : 'SecOps Admin (Supervisor)',
      uploadedByRole: activeRole,
      createdAt: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'pending_review',
      reviewedBy: null,
      note: uploadNote || 'Manual evidence file uploaded for compliance verification.',
      rejectionReason: null
    };

    setStrategies(prev => prev.map(s => {
      if (s.id === selectedStrategyId) {
        return {
          ...s,
          status: 'pending_review',
          evidence: newEvidence
        };
      }
      return s;
    }));

    setUploadFile(null);
    setUploadNote('');
    triggerToast('Evidence uploaded. Status set to Pending Review (Draft).');
  };

  const handleApproveEvidence = () => {
    if (!selectedStrategyId) return;

    setStrategies(prev => prev.map(s => {
      if (s.id === selectedStrategyId && s.evidence) {
        return {
          ...s,
          status: 'compliant',
          scorePercent: 100,
          missingPoints: [],
          howToFixPoints: [],
          evidence: {
            ...s.evidence,
            status: 'approved',
            reviewedBy: activeRole === 'supervisor' ? 'SecOps Admin / Sarah Connor' : 'Alex Smith (Technician)'
          }
        };
      }
      return s;
    }));

    triggerToast('Evidence Approved! Strategy set to 100% Compliant.');
  };

  const handleRejectEvidence = () => {
    if (!selectedStrategyId || !rejectionInput.trim()) return;

    setStrategies(prev => prev.map(s => {
      if (s.id === selectedStrategyId && s.evidence) {
        return {
          ...s,
          status: 'non_compliant',
          evidence: {
            ...s.evidence,
            status: 'rejected',
            reviewedBy: 'SecOps Admin / Sarah Connor',
            rejectionReason: rejectionInput
          }
        };
      }
      return s;
    }));

    setRejectionInput('');
    setShowRejectBox(false);
    triggerToast('Evidence rejected. Returned to technician with feedback.');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans antialiased flex flex-col selection:bg-teal-500 selection:text-slate-950">
      
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0a0e1a] px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xl">
        
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#14b8a6] p-2 rounded-xl text-slate-950 shadow-lg shadow-teal-500/20">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg text-white tracking-wider">PATHWISE</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-teal-500/10 text-[#14b8a6] border border-teal-500/30 rounded-full">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">ACSC Essential Eight Compliance Engine</p>
          </div>
        </div>

        {/* Center Maturity Tabs */}
        <div className="hidden md:flex items-center bg-[#111728] p-1 rounded-xl border border-slate-800">
          {['Level 1 Baseline', 'Level 2 Target', 'Level 3 Advanced'].map((tab) => {
            const isActive = selectedLevel === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedLevel(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#14b8a6] text-slate-950 shadow-md shadow-teal-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Right User & Role Control */}
        <div className="flex items-center space-x-4">
          
          <div className="relative cursor-pointer p-1.5 text-slate-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#14b8a6] rounded-full ring-2 ring-[#0a0e1a]"></span>
          </div>

          <div className="flex items-center space-x-3 bg-[#111728] pl-2 pr-3 py-1.5 rounded-xl border border-slate-800">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-[#14b8a6]">
              {activeRole === 'supervisor' ? 'SO' : 'TECH'}
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-white leading-tight">
                  {activeRole === 'supervisor' ? 'SecOps Admin' : 'Field Tech'}
                </span>
                <span className="text-[10px] text-slate-500">pathwise.io</span>
              </div>
            </div>

            <div className="pl-2 border-l border-slate-800">
              <button
                onClick={() => setActiveRole(activeRole === 'supervisor' ? 'technician' : 'supervisor')}
                className="text-[10px] font-bold px-2 py-1 bg-slate-900 hover:bg-slate-800 text-[#14b8a6] border border-teal-500/30 rounded-lg flex items-center space-x-1"
                title="Switch role view to test permissions"
              >
                <span>Role: {activeRole === 'supervisor' ? 'Supervisor' : 'Tech'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">

        {/* Hero Scorecard Banner */}
        <div className="bg-[#0f1525] border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-300">Active Assessment Workspace</span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Security Maturity Scorecard
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed">
              Continuous monitoring against the Essential Eight cybersecurity framework. Track gap analyses, remediation steps, and operational posture in real time.
            </p>
          </div>

          <div className="bg-[#131b2e] border border-slate-800/80 rounded-xl p-5 flex items-center space-x-5 min-w-[300px]">
            <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                <circle
                  className="text-slate-800"
                  strokeWidth="3.8"
                  strokeDasharray="3 1"
                  stroke="currentColor"
                  fill="none"
                  r="15.9155"
                  cx="21"
                  cy="21"
                />
                <circle
                  className="text-[#14b8a6] transition-all duration-700"
                  strokeDasharray={`${stats.score}, 100`}
                  strokeDashoffset="0"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  r="15.9155"
                  cx="21"
                  cy="21"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-black text-white">{stats.score}%</span>
                <span className="block text-[8px] font-bold text-slate-400">SCORE</span>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CURRENT MATURITY</p>
              <p className="text-xl font-black text-white">
                Level 1 <span className="text-xs font-normal text-slate-500">/ 3</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Enforcing Maturity Level 1 mitigation policies across endpoints.
              </p>
            </div>
          </div>

        </div>

        {/* Strategy Section Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Mitigation Strategies</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
              {strategies.length} Controls
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search strategies or gaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0f1525] border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0f1525] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="compliant">Compliant</option>
              <option value="non_compliant">Non-Compliant</option>
            </select>
          </div>

        </div>

        <div className="space-y-4">
          {filteredStrategies.map((strategy) => {
            const isCompliant = strategy.status === 'compliant' || strategy.scorePercent === 100;
            const isPending = strategy.status === 'pending_review';

            return (
              <div 
                key={strategy.id} 
                className="bg-[#0f1525] border border-slate-800/80 rounded-2xl p-6 transition-all hover:border-slate-700 shadow-lg"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Column: Enlarged Segmented Circular Indicator (80px), Code, Title */}
                  <div className={`lg:col-span-3 flex items-center space-x-4 ${!isCompliant ? 'border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-4 lg:pb-0 lg:pr-4' : 'lg:pr-2'}`}>
                    <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                        <circle
                          className="text-slate-800"
                          strokeWidth="3.8"
                          strokeDasharray="3 1.2"
                          stroke="currentColor"
                          fill="none"
                          r="15.9155"
                          cx="21"
                          cy="21"
                        />
                        <circle
                          className={isCompliant ? 'text-[#14b8a6]' : isPending ? 'text-amber-400' : 'text-rose-500'}
                          strokeDasharray={`${strategy.scorePercent}, 100`}
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          r="15.9155"
                          cx="21"
                          cy="21"
                        />
                      </svg>
                      <span className="absolute text-xs font-black text-white">{strategy.scorePercent}%</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded">
                        {strategy.levelReq}
                      </span>
                      <h3 className="text-base font-extrabold text-[#14b8a6] mt-1 leading-snug">
                        {strategy.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">{strategy.category}</p>
                    </div>
                  </div>

                  {/* 100% COMPLIANT STATE CONDITIONAL RENDERING */}
                  {isCompliant ? (
                    <div className="lg:col-span-9 bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-teal-500/10 text-[#14b8a6] border border-teal-500/30 rounded-xl">
                          <BadgeCheck className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-white flex items-center space-x-2">
                            <span>Control Fully Implemented & Verified</span>
                            <span className="text-[10px] bg-teal-500/20 text-[#14b8a6] font-mono px-2 py-0.5 rounded-full border border-teal-500/30">
                              Maturity L1 Satisfied
                            </span>
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            All requirements actively met. Zero missing gaps or required remediation actions.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:border-l sm:border-slate-800 sm:pl-4">
                        <button
                          onClick={() => setSelectedStrategyId(strategy.id)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#14b8a6]" />
                          <span>View Evidence</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* NON-100% STATE: Show WHAT'S MISSING, HOW TO FIX, and Start Fix Button */
                    <>
                      {/* Middle Column: WHAT'S MISSING */}
                      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-4 lg:pb-0 lg:px-4">
                        <p className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>WHAT'S MISSING</span>
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {strategy.missingPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-rose-500 font-bold">•</span>
                              <span className="leading-tight">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right Column: HOW TO FIX & Action Button */}
                      <div className="lg:col-span-5 flex flex-col justify-between space-y-4 lg:pl-2">
                        <div>
                          <p className="text-xs font-bold text-[#14b8a6] uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>HOW TO FIX</span>
                          </p>
                          <ul className="space-y-1.5 text-xs text-slate-300 max-h-24 overflow-y-auto pr-1">
                            {strategy.howToFixPoints.map((fix, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="text-[#14b8a6] font-bold">•</span>
                                <span className="leading-tight">{fix}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Button / Status Pill Row */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xs">
                            {isPending && (
                              <span className="inline-flex items-center space-x-1 text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                <Clock className="w-3.5 h-3.5 animate-pulse" />
                                <span>Evidence Pending Review</span>
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => setSelectedStrategyId(strategy.id)}
                            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 shadow-lg ${
                              isPending && activeRole === 'supervisor'
                                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-400/20'
                                : 'bg-[#14b8a6] text-slate-950 hover:bg-[#0d9488] hover:text-white shadow-teal-500/20'
                            }`}
                          >
                            <span>{isPending && activeRole === 'supervisor' ? 'Review Fix Evidence' : 'Start Fix'}</span>
                            <ChevronRight className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>

                      </div>
                    </>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </main>

      {selectedStrategy && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div 
            className="w-full max-w-2xl bg-[#0d1220] border-l border-slate-800 shadow-2xl h-full flex flex-col justify-between transform transition-transform ease-in-out duration-300 animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 bg-[#0f1525] flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 bg-slate-800 text-[#14b8a6] rounded border border-slate-700">
                    {selectedStrategy.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{selectedStrategy.levelReq}</span>
                </div>
                <h2 className="text-2xl font-black text-white">{selectedStrategy.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedStrategy.category}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedStrategyId(null);
                  setUploadFile(null);
                  setShowRejectBox(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Status Indicator */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                selectedStrategy.status === 'compliant' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                selectedStrategy.status === 'pending_review' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center space-x-3">
                  {selectedStrategy.status === 'compliant' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {selectedStrategy.status === 'pending_review' && <Clock className="w-5 h-5 text-amber-400 animate-pulse" />}
                  {selectedStrategy.status === 'non_compliant' && <ShieldAlert className="w-5 h-5 text-rose-400" />}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Strategy Compliance State</p>
                    <p className="text-sm font-semibold capitalize">
                      {selectedStrategy.status === 'pending_review' ? 'Pending Review (Draft)' : selectedStrategy.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono opacity-80">
                  {selectedStrategy.evidence ? `Ref: ${selectedStrategy.evidence.id}` : 'No Evidence'}
                </span>
              </div>

              {/* Remediation Guide (Only show step list if fix steps exist) */}
              {selectedStrategy.howToFixPoints.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <Info className="w-4 h-4 text-[#14b8a6]" />
                    <span>Remediation & Evidence Gathering Guide</span>
                  </h3>
                  <div className="bg-[#111728] p-4 rounded-xl border border-slate-800 space-y-2">
                    {selectedStrategy.howToFixPoints.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs text-slate-300">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900 text-[#14b8a6] font-mono font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Evidence Card */}
              {selectedStrategy.evidence && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Attached Evidence Card</span>
                    <span className="text-[10px] text-slate-500 font-mono">SUPABASE STORAGE</span>
                  </h3>

                  <div className="bg-[#111728] p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-[#14b8a6]">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{selectedStrategy.evidence.fileName}</p>
                          <p className="text-xs text-slate-400">
                            {selectedStrategy.evidence.fileSize} • Uploaded by {selectedStrategy.evidence.uploadedBy}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{selectedStrategy.evidence.createdAt}</p>
                        </div>
                      </div>

                      {selectedStrategy.evidence.status === 'pending_review' && (
                        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                          Pending Review
                        </span>
                      )}
                      {selectedStrategy.evidence.status === 'approved' && (
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                          Approved
                        </span>
                      )}
                      {selectedStrategy.evidence.status === 'rejected' && (
                        <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold">
                          Rejected
                        </span>
                      )}
                    </div>

                    {selectedStrategy.evidence.note && (
                      <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 italic">
                        "{selectedStrategy.evidence.note}"
                      </p>
                    )}

                    {selectedStrategy.evidence.rejectionReason && (
                      <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg text-xs text-rose-300 space-y-1">
                        <p className="font-bold flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Supervisor Rejection Note:</span>
                        </p>
                        <p>{selectedStrategy.evidence.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Drop Zone */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {selectedStrategy.evidence ? 'Replace Evidence File' : 'Upload Audit Evidence'}
                </h3>

                <div className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 text-center bg-[#111728]/50 hover:bg-[#111728] transition-all cursor-pointer group">
                  <input 
                    type="file" 
                    id="evidence-upload" 
                    className="hidden" 
                    onChange={handleSimulatedFileUpload} 
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer space-y-2 block">
                    <div className="w-12 h-12 bg-teal-500/10 text-[#14b8a6] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {uploadFile ? uploadFile.name : 'Drag & drop exported PDF, CSV, or screenshot here'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Supports exports from NinjaOne, Datto, M365 (Max 25MB)</p>
                    </div>
                  </label>
                </div>

                {uploadFile && (
                  <div className="space-y-3 bg-[#111728] p-4 rounded-xl border border-teal-500/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{uploadFile.name}</span>
                      <span className="text-slate-400">{uploadFile.size}</span>
                    </div>

                    <textarea
                      placeholder="Add technician submission notes..."
                      value={uploadNote}
                      onChange={(e) => setUploadNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      rows={2}
                    />

                    <button
                      onClick={handleSubmitEvidence}
                      className="w-full py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-slate-950 hover:text-white rounded-xl text-xs font-black transition-all shadow-md shadow-teal-500/20"
                    >
                      Submit Evidence (Sets Status to Pending Review)
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Footer Action Bar */}
            <div className="p-5 border-t border-slate-800 bg-[#0f1525] space-y-3">
              
              {/* Field Tech View */}
              {activeRole === 'technician' && (
                <div className="space-y-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Compliance Gate Locked</span>
                    </span>
                    <span className="text-[11px] italic">Requires Senior Supervisor Sign-off</span>
                  </div>

                  <button
                    disabled
                    className="w-full py-3 bg-slate-800 text-slate-500 rounded-xl text-xs font-bold cursor-not-allowed border border-slate-700/50 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Complete (Disabled for Field Tech)</span>
                  </button>
                </div>
              )}

              {/* Senior Supervisor View */}
              {activeRole === 'supervisor' && (
                <div className="space-y-3">
                  {selectedStrategy.status === 'pending_review' ? (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                        <span className="font-semibold flex items-center space-x-1.5">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>Supervisor Decision Panel</span>
                        </span>
                        {selectedStrategy.evidence?.uploadedByRole === 'supervisor' && (
                          <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-mono">SELF-UPLOADED</span>
                        )}
                      </div>

                      {!showRejectBox ? (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setShowRejectBox(true)}
                            className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject Evidence</span>
                          </button>

                          <button
                            onClick={handleApproveEvidence}
                            className="py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-slate-950 hover:text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                            <span>Approve Evidence</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-rose-500/30">
                          <p className="text-xs font-bold text-rose-300">Specify Rejection Reason:</p>
                          <textarea
                            value={rejectionInput}
                            onChange={(e) => setRejectionInput(e.target.value)}
                            placeholder="Provide feedback on why this evidence is insufficient..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                            rows={2}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setShowRejectBox(false)}
                              className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleRejectEvidence}
                              className="w-1/2 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold"
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : selectedStrategy.status === 'compliant' ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                      <span className="flex items-center space-x-1.5 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-[#14b8a6]" />
                        <span>Strategy Verified & Approved</span>
                      </span>
                      <span className="text-[11px] opacity-80">Reviewed by {selectedStrategy.evidence?.reviewedBy}</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
                      Awaiting initial evidence submission from field technician.
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f1525] border border-teal-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="p-1.5 bg-teal-500/20 text-[#14b8a6] rounded-lg">
            <Info className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}