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

const STORAGE_KEY = 'sl_admin_packages';
const PACKAGES_CHANGED_EVENT = 'sl-admin-packages-changed';

// ── Load from localStorage (falls back to seed data) ────────
const loadPackages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedPackages;
  } catch {
    return seedPackages;
  }
};

// ── Persist to localStorage ──────────────────────────────────
const savePackages = (pkgs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pkgs));
  } catch (e) {
    console.error('Failed to persist packages:', e);
  }
};

const emitPackagesChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PACKAGES_CHANGED_EVENT));
  }
};

// ── In-memory store (shared singleton) ──────────────────────
let _packages = loadPackages();
const _subscribers = new Set();

const notify = () => _subscribers.forEach(fn => fn([..._packages]));

export const packageStore = {
  // Subscribe to changes (returns unsubscribe fn)
  subscribe: (fn) => {
    _subscribers.add(fn);
    fn([..._packages]);
    return () => _subscribers.delete(fn);
  },

  getAll: () => [..._packages],

  // ── CREATE ──────────────────────────────────────────────
  create: (data) => {
    const newPkg = {
      ...data,
      id: `pkg-${Date.now()}`,
      destinations: data.destinations || [],
      highlights:   data.highlights   || [],
    };
    _packages = [newPkg, ..._packages];
    savePackages(_packages);
    notify();
    emitPackagesChanged();
    return newPkg;
  },

  // ── UPDATE ──────────────────────────────────────────────
  update: (id, data) => {
    _packages = _packages.map(p => p.id === id ? { ...p, ...data } : p);
    savePackages(_packages);
    notify();
    emitPackagesChanged();
  },

  // ── DELETE ──────────────────────────────────────────────
  delete: (id) => {
    _packages = _packages.filter(p => p.id !== id);
    savePackages(_packages);
    notify();
    emitPackagesChanged();
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
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
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
    { name: '', days: 1, description: '', image: '' },
  ],
});