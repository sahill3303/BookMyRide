// ============================================================
// db.js — localStorage Database Layer
// Collections: users, drivers, cabs, bookings, payments
// ============================================================

const DB = (() => {
  const COLLECTIONS = ['users', 'drivers', 'cabs', 'bookings', 'payments'];

  // ── Internal helpers ────────────────────────────────────────
  function _read(collection) {
    try {
      return JSON.parse(localStorage.getItem('cab_' + collection)) || [];
    } catch { return []; }
  }

  function _write(collection, data) {
    localStorage.setItem('cab_' + collection, JSON.stringify(data));
  }

  function _genId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // ── Public API ───────────────────────────────────────────────
  function getAll(collection) {
    return _read(collection);
  }

  function getById(collection, id) {
    return _read(collection).find(r => r.id === id) || null;
  }

  function find(collection, predicate) {
    return _read(collection).filter(predicate);
  }

  function findOne(collection, predicate) {
    return _read(collection).find(predicate) || null;
  }

  function create(collection, data) {
    const records = _read(collection);
    const record = { id: _genId(), createdAt: new Date().toISOString(), ...data };
    records.push(record);
    _write(collection, records);
    return record;
  }

  function update(collection, id, data) {
    const records = _read(collection);
    const idx = records.findIndex(r => r.id === id);
    if (idx === -1) return null;
    records[idx] = { ...records[idx], ...data, updatedAt: new Date().toISOString() };
    _write(collection, records);
    return records[idx];
  }

  function remove(collection, id) {
    const records = _read(collection);
    const filtered = records.filter(r => r.id !== id);
    _write(collection, filtered);
    return filtered.length < records.length;
  }

  function count(collection) {
    return _read(collection).length;
  }

  // ── Seed Data ───────────────────────────────────────────────
  function seed() {
    if (localStorage.getItem('cab_seeded')) return;

    // Admin user
    create('users', {
      name: 'Admin',
      email: 'admin@cab.com',
      phone: '9999900000',
      password: 'admin123',
      role: 'admin'
    });

    // Sample drivers
    const drivers = [
      { driver_name: 'Rajan Kumar',   phone: '9876543210', license_no: 'DL012345', cab_number: 'KA01AB1234', status: 'Available' },
      { driver_name: 'Suresh Patil',  phone: '9845001122', license_no: 'MH567890', cab_number: 'MH02CD5678', status: 'Available' },
      { driver_name: 'Vikram Singh',  phone: '9123456789', license_no: 'UP334455', cab_number: 'UP32EF9012', status: 'Busy' },
    ];
    drivers.forEach(d => create('drivers', d));

    // Sample cabs
    const cabs = [
      { cab_number: 'KA01AB1234', cab_type: 'Mini',  availability: 'Available' },
      { cab_number: 'MH02CD5678', cab_type: 'Sedan', availability: 'Available' },
      { cab_number: 'UP32EF9012', cab_type: 'SUV',   availability: 'Not Available' },
      { cab_number: 'DL04GH3456', cab_type: 'Sedan', availability: 'Available' },
    ];
    cabs.forEach(c => create('cabs', c));

    // Sample bookings
    const bookings = [
      { customer_name: 'Priya Sharma', phone: '9001122334', pickup_location: 'MG Road, Bangalore', drop_location: 'Indiranagar, Bangalore', cab_number: 'KA01AB1234', driver_name: 'Rajan Kumar', booking_date: '2026-02-25', status: 'Completed' },
      { customer_name: 'Arjun Mehta',  phone: '9112233445', pickup_location: 'Andheri, Mumbai',     drop_location: 'Bandra, Mumbai',            cab_number: '',             driver_name: '',           booking_date: '2026-02-26', status: 'Pending' },
    ];
    bookings.forEach(b => create('bookings', b));

    // Sample payments
    create('payments', {
      customer_name: 'Priya Sharma',
      booking_reference: getAll('bookings')[0]?.id || '',
      amount: 350,
      payment_mode: 'Online',
      payment_status: 'Paid'
    });

    localStorage.setItem('cab_seeded', '1');
  }

  function reset() {
    COLLECTIONS.forEach(c => localStorage.removeItem('cab_' + c));
    localStorage.removeItem('cab_seeded');
    seed();
  }

  return { getAll, getById, find, findOne, create, update, remove, count, seed, reset };
})();

// Auto-seed on first load
document.addEventListener('DOMContentLoaded', () => DB.seed());
