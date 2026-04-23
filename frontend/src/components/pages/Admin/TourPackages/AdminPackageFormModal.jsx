import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PACKAGE_TYPES, PACKAGE_DAYS, emptyPackage } from './adminPackagesData';

// ── Small field components ───────────────────────────────────
const Field = ({ label, error, children }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
    <label style={{ fontSize:'9px', fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', color:'#5a8080' }}>
      {label}
    </label>
    {children}
    {error && <span style={{ fontSize:'11px', color:'#cc3344', fontWeight:600 }}>{error}</span>}
  </div>
);

const inputStyle = (error) => ({
  padding: '10px 14px', borderRadius: '9px',
  border: `1.5px solid ${error ? '#cc3344' : 'rgba(0,176,165,0.22)'}`,
  background: '#f7fffe', color: '#0d2b2b',
  fontSize: '13.5px', fontWeight: 400,
  outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 0.2s ease',
  width: '100%', boxSizing: 'border-box',
});

const taStyle = (error) => ({
  ...inputStyle(error),
  resize: 'vertical', minHeight: '80px', lineHeight: 1.7, fontWeight: 300,
});

// ── Destination row ──────────────────────────────────────────
const DestRow = ({ dest, index, onChange, onRemove, canRemove }) => (
  <div style={{
    background: '#f7fffe', border: '1px solid rgba(0,176,165,0.15)',
    borderRadius: '12px', padding: '16px', display:'flex', flexDirection:'column', gap:'10px',
  }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <span style={{ fontSize:'10px', fontWeight:800, letterSpacing:'0.18em', textTransform:'uppercase', color:'#00b0a5' }}>
        Stop {index + 1}
      </span>
      {canRemove && (
        <button
          onClick={() => onRemove(index)}
          style={{
            width:'24px', height:'24px', borderRadius:'50%',
            background:'rgba(204,51,68,0.08)', border:'1px solid rgba(204,51,68,0.2)',
            color:'#cc3344', fontSize:'12px', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}
        >✕</button>
      )}
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'10px' }}>
      <input
        style={inputStyle(false)}
        placeholder="Destination name"
        value={dest.name}
        onChange={e => onChange(index, 'name', e.target.value)}
      />
      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
        <input
          type="number" min="1" max="30"
          style={{ ...inputStyle(false), width:'60px', textAlign:'center' }}
          value={dest.days}
          onChange={e => onChange(index, 'days', Number(e.target.value))}
        />
        <span style={{ fontSize:'11px', color:'#7a9a9a', whiteSpace:'nowrap', fontWeight:600 }}>days</span>
      </div>
    </div>
    <textarea
      style={taStyle(false)}
      placeholder="Short description of this destination…"
      value={dest.description}
      onChange={e => onChange(index, 'description', e.target.value)}
    />
    <input
      style={inputStyle(false)}
      placeholder="Image URL for this destination"
      value={dest.image}
      onChange={e => onChange(index, 'image', e.target.value)}
    />
    {dest.image && (
      <img src={dest.image} alt="" style={{ height:'80px', borderRadius:'8px', objectFit:'cover', width:'100%' }} onError={e => e.target.style.display='none'} />
    )}
  </div>
);

// ── Main form modal ──────────────────────────────────────────
const AdminPackageFormModal = ({ isOpen, pkg, onSave, onClose }) => {
  const isEdit = !!pkg?.id;
  const [form,   setForm]   = useState(emptyPackage());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(pkg ? { ...pkg, highlights: [...(pkg.highlights || ['','','',''])], destinations: pkg.destinations.map(d => ({...d})) } : emptyPackage());
      setErrors({});
    }
  }, [isOpen, pkg]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const setHL = (i, val) => {
    const hl = [...form.highlights];
    hl[i] = val;
    set('highlights', hl);
  };
  const addHL = () => set('highlights', [...form.highlights, '']);
  const removeHL = (i) => set('highlights', form.highlights.filter((_, idx) => idx !== i));

  const setDest = (i, key, val) => {
    const dests = form.destinations.map((d, idx) => idx === i ? { ...d, [key]: val } : d);
    set('destinations', dests);
  };
  const addDest = () => set('destinations', [...form.destinations, { name:'', days:1, description:'', image:'' }]);
  const removeDest = (i) => set('destinations', form.destinations.filter((_, idx) => idx !== i));

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.type)               e.type        = 'Type is required.';
    if (!form.days)               e.days        = 'Duration is required.';
    if (!form.image.trim())       e.image       = 'Cover image URL is required.';
    if (form.destinations.length === 0) e.destinations = 'Add at least one destination.';
    if (form.destinations.some(d => !d.name.trim())) e.destinations = 'All destination names are required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      highlights:   form.highlights.filter(h => h.trim()),
      destinations: form.destinations,
    });
  };

  return (
    <>
      <style>{`
        .apfm-backdrop {
          position: fixed; inset: 0; z-index: 150;
          background: rgba(0,20,18,0.72); backdrop-filter: blur(6px);
          display: flex; align-items: flex-start; justify-content: center;
          padding: 24px; overflow-y: auto;
        }
        .apfm-modal {
          background: #fff; border-radius: 24px;
          max-width: 680px; width: 100%;
          margin: auto;
          box-shadow: 0 40px 80px rgba(0,60,50,0.25);
          overflow: hidden;
        }
        /* Teal top strip */
        .apfm-strip {
          height: 3px;
          background: linear-gradient(90deg, #00b0a5, #00ddd0, #00b0a5);
        }
        .apfm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 28px 0;
        }
        .apfm-header-tag {
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.22em; text-transform: uppercase; color: #00b0a5;
        }
        .apfm-header-title {
          font-size: 1.3rem; font-weight: 800;
          color: #0d2b2b; letter-spacing: -0.03em;
          margin-top: 4px;
        }
        .apfm-close {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,176,165,0.08);
          border: 1px solid rgba(0,176,165,0.2);
          color: #3a5a5a; font-size: 15px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s ease;
        }
        .apfm-close:hover { background: rgba(0,176,165,0.15); }

        .apfm-rule { height: 1px; margin: 18px 28px 0; background: linear-gradient(90deg, rgba(0,176,165,0.2), transparent); }

        .apfm-body {
          padding: 22px 28px 28px;
          display: flex; flex-direction: column; gap: 20px;
          max-height: 75vh; overflow-y: auto;
        }

        /* Section label */
        .apfm-section {
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #7a9a9a; margin-top: 6px;
          display: flex; align-items: center; gap: 10px;
        }
        .apfm-section::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(0,176,165,0.15),transparent); }

        /* Select */
        .apfm-select {
          padding: 10px 14px; border-radius: 9px;
          border: 1.5px solid rgba(0,176,165,0.22);
          background: #f7fffe; color: #0d2b2b;
          font-size: 13.5px; outline: none;
          font-family: inherit; cursor: pointer;
          transition: border-color 0.2s;
          width: 100%;
        }
        .apfm-select:focus { border-color: #00b0a5; background: #fff; }
        .apfm-select.error { border-color: #cc3344; }

        /* Highlight row */
        .apfm-hl-row { display: flex; gap: 8px; align-items: center; }
        .apfm-hl-input {
          flex: 1; padding: 9px 13px; border-radius: 9px;
          border: 1.5px solid rgba(0,176,165,0.2);
          background: #f7fffe; color: #0d2b2b;
          font-size: 13px; outline: none; font-family: inherit;
          transition: border-color 0.2s;
        }
        .apfm-hl-input:focus { border-color: #00b0a5; background: #fff; }
        .apfm-hl-remove {
          width: 28px; height: 28px; border-radius: '50%';
          background: rgba(204,51,68,0.07); border: 1px solid rgba(204,51,68,0.18);
          color: #cc3344; font-size: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; border-radius: 50%;
        }

        /* Add buttons */
        .apfm-add-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 16px; border-radius: 9px;
          border: 1.5px dashed rgba(0,176,165,0.3);
          background: rgba(0,176,165,0.04);
          color: #00b0a5; font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; width: 100%;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .apfm-add-btn:hover { background: rgba(0,176,165,0.09); border-color: #00b0a5; }

        /* Footer */
        .apfm-footer {
          display: flex; gap: 10px;
          padding: 20px 28px 24px;
          border-top: 1px solid rgba(0,176,165,0.1);
        }
        .apfm-save {
          flex: 1; padding: 13px; border-radius: 10px;
          background: #00b0a5; border: none; color: #fff;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 5px 20px rgba(0,176,165,0.4);
          transition: all 0.25s ease;
        }
        .apfm-save:hover { background: #009e94; transform: translateY(-1px); }
        .apfm-cancel {
          padding: 13px 24px; border-radius: 10px;
          border: 1.5px solid rgba(0,176,165,0.2);
          background: transparent; color: #5a8080;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s ease;
        }
        .apfm-cancel:hover { border-color: #00b0a5; color: #00b0a5; }

        /* 2-col grid */
        .apfm-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media(max-width:560px){ .apfm-2col { grid-template-columns: 1fr; } }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="apfm-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="apfm-modal"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
              onClick={e => e.stopPropagation()}
            >
              <div className="apfm-strip" />

              {/* Header */}
              <div className="apfm-header">
                <div>
                  <div className="apfm-header-tag">{isEdit ? '✦ Edit Package' : '✦ New Package'}</div>
                  <div className="apfm-header-title">{isEdit ? 'Update Package Details' : 'Add New Package'}</div>
                </div>
                <button className="apfm-close" onClick={onClose}>✕</button>
              </div>
              <div className="apfm-rule" />

              {/* Body */}
              <div className="apfm-body">

                {/* Basic info */}
                <div className="apfm-section">Basic Information</div>

                <Field label="Package Title *" error={errors.title}>
                  <input
                    style={inputStyle(errors.title)}
                    placeholder="e.g. Golden Coast Escape"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                  />
                </Field>

                <Field label="Description *" error={errors.description}>
                  <textarea
                    style={taStyle(errors.description)}
                    placeholder="A short compelling description of the package…"
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                  />
                </Field>

                <div className="apfm-2col">
                  <Field label="Package Type *" error={errors.type}>
                    <select
                      className={`apfm-select ${errors.type ? 'error' : ''}`}
                      value={form.type}
                      onChange={e => set('type', e.target.value)}
                    >
                      {PACKAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>

                  <Field label="Duration (Days) *" error={errors.days}>
                    <select
                      className={`apfm-select ${errors.days ? 'error' : ''}`}
                      value={form.days}
                      onChange={e => set('days', Number(e.target.value))}
                    >
                      {PACKAGE_DAYS.map(d => <option key={d} value={d}>{d} Days</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Cover Image URL *" error={errors.image}>
                  <input
                    style={inputStyle(errors.image)}
                    placeholder="https://images.unsplash.com/…"
                    value={form.image}
                    onChange={e => set('image', e.target.value)}
                  />
                  {form.image && (
                    <img src={form.image} alt="" style={{ height:'100px', borderRadius:'10px', objectFit:'cover', width:'100%', marginTop:'4px' }} onError={e => e.target.style.display='none'} />
                  )}
                </Field>

                {/* Highlights */}
                <div className="apfm-section">Highlights</div>
                {form.highlights.map((hl, i) => (
                  <div key={i} className="apfm-hl-row">
                    <input
                      className="apfm-hl-input"
                      placeholder={`Highlight ${i + 1} (e.g. Whale watching)`}
                      value={hl}
                      onChange={e => setHL(i, e.target.value)}
                    />
                    {form.highlights.length > 1 && (
                      <button className="apfm-hl-remove" onClick={() => removeHL(i)}>✕</button>
                    )}
                  </div>
                ))}
                {form.highlights.length < 6 && (
                  <button className="apfm-add-btn" onClick={addHL}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Add Highlight
                  </button>
                )}

                {/* Destinations */}
                <div className="apfm-section">Destinations & Itinerary</div>
                {errors.destinations && (
                  <span style={{ fontSize:'11px', color:'#cc3344', fontWeight:600 }}>{errors.destinations}</span>
                )}
                {form.destinations.map((dest, i) => (
                  <DestRow
                    key={i}
                    dest={dest}
                    index={i}
                    onChange={setDest}
                    onRemove={removeDest}
                    canRemove={form.destinations.length > 1}
                  />
                ))}
                <button className="apfm-add-btn" onClick={addDest}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  Add Destination
                </button>

              </div>

              {/* Footer */}
              <div className="apfm-footer">
                <button className="apfm-save" onClick={handleSave}>
                  {isEdit ? '✓ Save Changes' : '✓ Create Package'}
                </button>
                <button className="apfm-cancel" onClick={onClose}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPackageFormModal;