'use client';

/**
 * Pure Declarative UI Component
 * - Renders based on pre-resolved data only
 * - No imports from @webwaka/* packages (all via control-consumer)
 * - No permission/entitlement/flag checks
 * - Currency: NGN (₦) only - Nigeria-first
 */

interface ResolvedSection {
  id: string;
  label: string;
  visible: boolean;
  hiddenReason?: string;
}

interface DashboardUIProps {
  sections: ResolvedSection[];
  title: string;
}

export function DashboardUI({ sections, title }: DashboardUIProps) {
  const visibleSections = sections.filter(s => s.visible);
  
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <h2>WebWaka Suite</h2>
          <span>Partner Dashboard</span>
        </div>
        <nav className="nav">
          {sections.map(section => (
            <div
              key={section.id}
              className={`nav-item ${section.visible ? 'active' : 'hidden'}`}
              title={section.hiddenReason}
            >
              {section.label}
              {!section.visible && section.hiddenReason && (
                <span className="hidden-reason"> ({section.hiddenReason})</span>
              )}
            </div>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <header className="header">
          <h1>{title}</h1>
        </header>
        <div className="content">
          <div className="cards">
            <div className="card">
              <h3>Total Partners</h3>
              <p className="stat">24</p>
            </div>
            <div className="card">
              <h3>Active Sessions</h3>
              <p className="stat">128</p>
            </div>
            <div className="card">
              <h3>Revenue (Nigeria)</h3>
              <p className="stat">₦12,450,000</p>
            </div>
            <div className="card">
              <h3>Visible Sections</h3>
              <p className="stat">{visibleSections.length}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
