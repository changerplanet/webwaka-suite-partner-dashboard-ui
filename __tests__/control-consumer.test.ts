/**
 * Phase 4C Required Tests
 * - Visibility changes when control inputs change
 * - Determinism (10x identical evaluations)
 * - No UI file imports control packages except control-consumer.ts
 * - Snapshot integrity verification
 * - Nigeria-first currency enforcement
 */

import { describe, it, expect } from 'vitest';
import {
  resolveDashboard,
  generateDashboardSnapshot,
  verifyDashboardSnapshot,
  evaluateFromSnapshot,
  DEFAULT_PARTNER_SECTIONS,
  PartnerPermission,
} from '../src/lib/control-consumer';
import type {
  DashboardDeclaration,
  DashboardContext,
  PermissionResult,
  EntitlementSnapshot,
  FeatureSnapshot,
} from '../src/lib/control-consumer';
import * as fs from 'fs';
import * as path from 'path';

function createDeclaration(): DashboardDeclaration {
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

function createContext(): DashboardContext {
  return {
    tenantId: 'tenant-001',
    partnerId: 'partner-001',
    subjectId: 'user-001',
    subjectType: 'partner_admin',
    roles: ['partner_admin'],
    evaluationTime: new Date('2026-01-21T12:00:00Z'),
  };
}

function createFullPermissions(): PermissionResult {
  return {
    subjectId: 'user-001',
    capabilities: Object.values(PartnerPermission),
    deniedCapabilities: [],
  };
}

function createLimitedPermissions(): PermissionResult {
  return {
    subjectId: 'user-001',
    capabilities: [PartnerPermission.VIEW_DASHBOARD],
    deniedCapabilities: [
      PartnerPermission.VIEW_ANALYTICS,
      PartnerPermission.EDIT_PROFILE,
      PartnerPermission.MANAGE_BILLING,
      PartnerPermission.MANAGE_USERS,
      PartnerPermission.VIEW_REPORTS,
    ],
  };
}

function createEntitlements(): EntitlementSnapshot {
  return {
    tenantId: 'tenant-001',
    activeEntitlements: ['partner-basic'],
    expiredEntitlements: [],
  };
}

function createFeatures(): FeatureSnapshot {
  return {
    enabledFeatures: ['dashboard-v2'],
    disabledFeatures: [],
  };
}

describe('Dashboard Resolution', () => {
  it('should resolve dashboard with full permissions', () => {
    const declaration = createDeclaration();
    const context = createContext();
    const permissions = createFullPermissions();
    const entitlements = createEntitlements();
    const features = createFeatures();

    const resolved = resolveDashboard(
      declaration,
      context,
      permissions,
      entitlements,
      features
    );

    expect(resolved).toBeDefined();
    expect(resolved.visibleSections).toBeDefined();
    expect(Array.isArray(resolved.visibleSections)).toBe(true);
  });

  it('should change visibility when permissions change', () => {
    const declaration = createDeclaration();
    const context = createContext();
    const entitlements = createEntitlements();
    const features = createFeatures();

    const fullResolved = resolveDashboard(
      declaration,
      context,
      createFullPermissions(),
      entitlements,
      features
    );

    const limitedResolved = resolveDashboard(
      declaration,
      context,
      createLimitedPermissions(),
      entitlements,
      features
    );

    const fullVisibleCount = fullResolved.visibleSections.length;
    const limitedVisibleCount = limitedResolved.visibleSections.length;

    expect(fullVisibleCount).toBeGreaterThan(limitedVisibleCount);
  });
});

describe('Determinism (10x identical evaluations)', () => {
  it('should produce identical results for same input', () => {
    const declaration = createDeclaration();
    const context = createContext();
    const permissions = createFullPermissions();
    const entitlements = createEntitlements();
    const features = createFeatures();

    const results: string[] = [];
    for (let i = 0; i < 10; i++) {
      const resolved = resolveDashboard(
        declaration,
        context,
        permissions,
        entitlements,
        features
      );
      results.push(JSON.stringify(resolved));
    }

    const firstResult = results[0];
    for (const result of results) {
      expect(result).toBe(firstResult);
    }
  });
});

describe('Snapshot Integrity', () => {
  it('should generate and verify snapshot', () => {
    const declaration = createDeclaration();
    const context = createContext();
    const permissions = createFullPermissions();
    const entitlements = createEntitlements();
    const features = createFeatures();

    const resolved = resolveDashboard(
      declaration,
      context,
      permissions,
      entitlements,
      features
    );

    const snapshot = generateDashboardSnapshot(
      declaration,
      resolved,
      context,
      3600000
    );

    expect(snapshot).toBeDefined();
    const isValid = verifyDashboardSnapshot(snapshot);
    expect(isValid).toBe(true);
  });

  it('should evaluate from snapshot correctly', () => {
    const declaration = createDeclaration();
    const context = createContext();
    const permissions = createFullPermissions();
    const entitlements = createEntitlements();
    const features = createFeatures();

    const resolved = resolveDashboard(
      declaration,
      context,
      permissions,
      entitlements,
      features
    );

    const snapshot = generateDashboardSnapshot(
      declaration,
      resolved,
      context,
      3600000
    );

    const fromSnapshot = evaluateFromSnapshot(snapshot, context.evaluationTime);
    expect(fromSnapshot.visibleSections.length).toBe(resolved.visibleSections.length);
  });
});

describe('Single Control Consumer Pattern', () => {
  it('should only have control-consumer.ts importing @webwaka packages', () => {
    const srcDir = path.join(process.cwd(), 'src');
    const appDir = path.join(process.cwd(), 'app');
    
    const checkFiles = (dir: string, files: string[] = []): string[] => {
      if (!fs.existsSync(dir)) return files;
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          checkFiles(fullPath, files);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
          files.push(fullPath);
        }
      }
      return files;
    };

    const allFiles = [...checkFiles(srcDir), ...checkFiles(appDir)];
    const violations: string[] = [];

    for (const file of allFiles) {
      if (file.includes('control-consumer.ts')) continue;
      
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes("from '@webwaka/") && 
          !content.includes("from '@/src/lib/control-consumer'")) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });
});

describe('Nigeria-First Currency Enforcement', () => {
  it('should use NGN (₦) currency only', () => {
    const componentPath = path.join(process.cwd(), 'src/components/DashboardUI.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    expect(content).toContain('₦');
    expect(content).not.toContain('$12');
    expect(content).not.toMatch(/\$\d/);
    expect(content.toLowerCase()).not.toContain('usd');
    expect(content.toLowerCase()).not.toContain('eur');
    expect(content.toLowerCase()).not.toContain('gbp');
  });
});
