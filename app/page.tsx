/**
 * Server-Side Dashboard Resolution
 * All control package calls happen here (server component)
 * Client components receive pre-resolved data only
 */

import { DashboardUI } from '@/src/components/DashboardUI';
import { RequireAuth } from '@webwaka/core-auth-ui';
import {
  resolveDashboard,
  generateDashboardSnapshot,
  DEFAULT_PARTNER_SECTIONS,
  PartnerPermission,
} from '@/src/lib/control-consumer';
import type {
  DashboardDeclaration,
  DashboardContext,
  PermissionResult,
  EntitlementSnapshot,
  FeatureSnapshot,
} from '@/src/lib/control-consumer';
import './globals.css';

function createDashboardDeclaration(): DashboardDeclaration {
  return {
    dashboardId: 'partner-dashboard',
    label: 'Partner Dashboard',
    allowedSubjects: ['partner_admin', 'staff'],
    sections: DEFAULT_PARTNER_SECTIONS.map(section => ({
      sectionId: section.id,
      label: section.label,
      requiredCapabilities: [section.requiredPermission],
    })),
  };
}

function createMockContext(): DashboardContext {
  return {
    tenantId: 'tenant-001',
    partnerId: 'partner-001',
    subjectId: 'user-001',
    subjectType: 'partner_admin',
    roles: ['partner_admin'],
    evaluationTime: new Date('2026-01-21T12:00:00Z'),
  };
}

function createMockPermissions(): PermissionResult {
  return {
    subjectId: 'user-001',
    capabilities: [
      PartnerPermission.VIEW_DASHBOARD,
      PartnerPermission.VIEW_ANALYTICS,
      PartnerPermission.VIEW_REPORTS,
    ],
    deniedCapabilities: [
      PartnerPermission.EDIT_PROFILE,
      PartnerPermission.MANAGE_BILLING,
      PartnerPermission.MANAGE_USERS,
    ],
  };
}

function createMockEntitlements(): EntitlementSnapshot {
  return {
    tenantId: 'tenant-001',
    activeEntitlements: ['partner-basic', 'analytics-view'],
    expiredEntitlements: [],
  };
}

function createMockFeatures(): FeatureSnapshot {
  return {
    enabledFeatures: ['dashboard-v2', 'analytics-basic'],
    disabledFeatures: ['advanced-analytics', 'api-access'],
  };
}

export default async function PartnerDashboardPage() {
  const declaration = createDashboardDeclaration();
  const context = createMockContext();
  const permissions = createMockPermissions();
  const entitlements = createMockEntitlements();
  const features = createMockFeatures();

  const resolvedDashboard = resolveDashboard(
    declaration,
    context,
    permissions,
    entitlements,
    features
  );

  const snapshot = generateDashboardSnapshot(
    declaration,
    resolvedDashboard,
    context,
    3600000
  );

  const sections = [
    ...resolvedDashboard.visibleSections.map(section => ({
      id: section.sectionId,
      label: section.label,
      visible: true,
      hiddenReason: undefined,
    })),
    ...resolvedDashboard.hiddenSections.map(sectionId => {
      const reason = resolvedDashboard.reasons.find(r => r.sectionId === sectionId);
      return {
        id: sectionId,
        label: sectionId,
        visible: false,
        hiddenReason: reason?.details || reason?.reason,
      };
    }),
  ];

  return (
    <RequireAuth>
      <DashboardUI
        sections={sections}
        title="Partner Dashboard"
      />
    </RequireAuth>
  );
}
