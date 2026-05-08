// ─────────────────────────────────────────────────────────────
//  ADMIN PACKAGES CRUD STORE
//  In production replace with API calls (REST/GraphQL).
//  This module acts as the single source of truth shared
//  between admin and user-side pages.
//
//  User-side PackagesPage reads from packagesData.js which
//  in production points to the same API/database.
//  Here we simulate that with a shared in-memory store +
//  localStorage persistence for demo purposes.
// ─────────────────────────────────────────────────────────────

import { packages as seedPackages, PACKAGE_TYPES, PACKAGE_DAYS } from '../../Site/TourBooking/Package/packagesData';
import { buildApiUrl } from '../../../../config/api';

const PACKAGES_CHANGED_EVENT = 'sl-admin-packages-changed';

let _packages = [];
const _subscribers = new Set();

const notify = () => _subscribers.forEach(fn => fn([..._packages]));

const emitPackagesChanged = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(PACKAGES_CHANGED_EVENT));
};

const savePackages = (_pkgs) => {
  // persistence removed in favor of backend API; keep a no-op for compatibility
};

const reloadFromBackend = async () => {
  try {
    const res = await fetch(buildApiUrl('/packages/admin/packages'));
    if (!res.ok) return;
    const data = await res.json();
    _packages = data.map(p => ({
      id: `pkg-${p.package_id || p.id || Math.random().toString(36).slice(2,9)}`,
      title: p.title,
      type: p.type,
      days: Number(p.days) || (p.days ? Number(p.days) : 0),
      description: p.description,
      image: p.image_url || p.image || '',
      destinations: Array.isArray(p.destinations) ? p.destinations : [],
    }));
    notify();
    emitPackagesChanged();
  } catch (e) {
    console.error('reloadFromBackend failed', e);
  }
};

export const packageStore = {
  // Subscribe to changes (returns unsubscribe fn)
  subscribe: (fn) => {
    _subscribers.add(fn);
    // fetch packages from backend and notify
    (async () => {
      try {
        const res = await fetch(buildApiUrl('/packages/admin/packages'));
        if (res.ok) {
          const data = await res.json();
          // map backend shape to frontend store shape
          _packages = data.map(p => ({
            id: `pkg-${p.package_id || p.id || Math.random().toString(36).slice(2,9)}`,
            title: p.title,
            type: p.type,
            days: Number(p.days) || (p.days ? Number(p.days) : 0),
            description: p.description,
            image: p.image_url || p.image_url || p.image || '',
            destinations: Array.isArray(p.destinations) ? p.destinations : [],
          }));
        } else {
          _packages = [...seedPackages];
        }
      } catch (e) {
        _packages = [...seedPackages];
      }
      fn([..._packages]);
    })();
    return () => _subscribers.delete(fn);
  },

  getAll: () => [..._packages],

  // ── CREATE ──────────────────────────────────────────────
  create: async (data) => {
    try {
      const form = new FormData();
      form.append('title', data.title);
      form.append('type', data.type);
      form.append('days', String(data.days));
      form.append('description', data.description || '');

      if (data.packageImageFile) {
        form.append('packageImage', data.packageImageFile);
      }

      // collect dest images and strip from object sent inside JSON
      const dests = (data.destinations || []).map((d, i) => {
        if (d.imageFile) {
          form.append('destImages', d.imageFile);
        }
        return {
          name: d.name,
          description: d.description,
          dayNumber: d.days || (i + 1),
          activities: d.activities || [],
        };
      });

      form.append('destinations', JSON.stringify(dests));

      const res = await fetch(buildApiUrl('/packages/admin/packages'), {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        let message = 'Failed to create package';
        try {
          const errorBody = await res.json();
          message = errorBody.error || errorBody.message || message;
        } catch {
          try {
            message = await res.text();
          } catch {
            // keep default message
          }
        }
        throw new Error(message);
      }
      const created = await res.json();
      const newPkg = {
        id: `pkg-${created.package_id || created.packageId || Date.now()}`,
        title: created.title || data.title,
        type: created.type || data.type,
        days: created.days || data.days,
        description: created.description || data.description,
        image: created.image_url || created.image || data.image || '',
        destinations: data.destinations || [],
        highlights: data.highlights || [],
      };
      _packages = [newPkg, ..._packages];
      notify();
      emitPackagesChanged();
      return newPkg;
    } catch (err) {
      console.error('package create failed', err);
      throw err;
    }
  },

  // ── UPDATE ──────────────────────────────────────────────
  update: async (id, data) => {
    try {
      // extract numeric package id
      const m = String(id).match(/(\d+)/);
      if (!m) throw new Error('Invalid package id');
      const pkgId = m[1];

      const form = new FormData();
      if (data.title != null) form.append('title', data.title);
      if (data.type != null) form.append('type', data.type);
      if (data.days != null) form.append('days', String(data.days));
      if (data.description != null) form.append('description', data.description || '');
      if (data.packageImageFile) form.append('packageImage', data.packageImageFile);

      const dests = (data.destinations || []).map((d, i) => {
        if (d.imageFile) form.append('destImages', d.imageFile);
        return {
          name: d.name,
          description: d.description,
          dayNumber: d.days || (i + 1),
          activities: d.activities || [],
        };
      });
      form.append('destinations', JSON.stringify(dests));

      const res = await fetch(buildApiUrl(`/packages/admin/packages/${pkgId}`), {
        method: 'PUT',
        body: form,
      });
      if (!res.ok) {
        let msg = 'Failed to update package';
        try { const body = await res.json(); msg = body.error || body.message || msg; } catch {}
        throw new Error(msg);
      }

      // reload full list from backend to keep store in sync
      await reloadFromBackend();
    } catch (err) {
      console.error('package update failed', err);
      throw err;
    }
  },

  // ── DELETE ──────────────────────────────────────────────
  delete: async (id) => {
    try {
      const m = String(id).match(/(\d+)/);
      if (!m) throw new Error('Invalid package id');
      const pkgId = m[1];
      const res = await fetch(buildApiUrl(`/packages/admin/packages/${pkgId}`), { method: 'DELETE' });
      if (!res.ok) {
        let msg = 'Failed to delete package';
        try { const body = await res.json(); msg = body.error || body.message || msg; } catch {}
        throw new Error(msg);
      }
      await reloadFromBackend();
    } catch (err) {
      console.error('package delete failed', err);
      throw err;
    }
  },

  // ── RESET to seed data (dev utility) ────────────────────
  reset: () => {
    _packages = [...seedPackages];
    savePackages(_packages);
    notify();
    emitPackagesChanged();
  },
};

// ── Re-export constants for use in admin forms ───────────────
export { PACKAGE_TYPES, PACKAGE_DAYS };

// ── Admin filter helper ──────────────────────────────────────
export const adminFilter = (pkgs, { search, type, days }) => {
  const q = search.toLowerCase().trim();
  return pkgs.filter(p => {
    const safeType = (p.type || '').toLowerCase();
    const safeTitle = (p.title || '').toLowerCase();
    const matchSearch = !q ||
      safeTitle.includes(q) ||
      safeType.includes(q) ||
      p.destinations.some(d => d.name.toLowerCase().includes(q));
    const matchType = type === 'All' || p.type === type;
    const matchDays = days === 'All' || p.days === Number(days);
    return matchSearch && matchType && matchDays;
  });
};

// ── Empty package template for "Add New" form ───────────────
export const emptyPackage = () => ({
  id:           '',
  type:         PACKAGE_TYPES[0],
  days:         7,
  title:        '',
  description:  '',
  image:        '',
  highlights:   ['', '', '', ''],
  destinations: [
    { name: '', days: 1, description: '', image: '', imageFile: null, activities: [] },
  ],
});