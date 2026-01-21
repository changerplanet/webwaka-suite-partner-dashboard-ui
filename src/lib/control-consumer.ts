/**
 * Single Control Consumer - ONLY place that imports @webwaka/* control packages
 * Per WebWaka Constitution v1.5+ - No other file may import control packages directly
 */

import {
  resolveDashboard,
  generateDashboardSnapshot,
  verifyDashboardSnapshot,
  verifySnapshotIntegrity,
  evaluateFromSnapshot,
} from '@webwaka/core-dashboard-control';

import type {
  DashboardDeclaration,
  DashboardContext,
  PermissionResult,
  EntitlementSnapshot,
  FeatureSnapshot,
  ResolvedDashboard,
  DashboardSnapshot,
} from '@webwaka/core-dashboard-control';

import {
  DEFAULT_PARTNER_SECTIONS,
  validatePartnerDashboardConfig,
  PartnerPermission,
} from '@webwaka/suite-partner-dashboard-control';

import type {
  PartnerDashboardCapabilities,
  PartnerDashboardConfig,
  PartnerDashboardFeatureFlags,
  DashboardSection,
} from '@webwaka/suite-partner-dashboard-control';

export {
  resolveDashboard,
  generateDashboardSnapshot,
  verifyDashboardSnapshot,
  verifySnapshotIntegrity,
  evaluateFromSnapshot,
  DEFAULT_PARTNER_SECTIONS,
  validatePartnerDashboardConfig,
  PartnerPermission,
};

export type {
  DashboardDeclaration,
  DashboardContext,
  PermissionResult,
  EntitlementSnapshot,
  FeatureSnapshot,
  ResolvedDashboard,
  DashboardSnapshot,
  PartnerDashboardCapabilities,
  PartnerDashboardConfig,
  PartnerDashboardFeatureFlags,
  DashboardSection,
};
