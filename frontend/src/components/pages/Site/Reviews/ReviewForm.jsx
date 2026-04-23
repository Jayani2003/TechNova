import { useState, useRef } from 'react';
import { getReviewableTours } from './reviewsData';

const MAX_IMAGES = 5;

const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '6px', cursor: 'pointer' }}>
      {[1,2,3,4,5].map(i => {
        const filled = i <= (hovered || value);
        return (
          <svg
            key={i}
            width="36" height="36" viewBox="0 0 18 18"
            fill={filled ? '#00b0a5' : 'none'}
            stroke={filled ? '#00b0a5' : '#c0d8d5'}
            strokeWidth="1.5"
            style={{ transition: 'all 0.15s ease', transform: hovered === i ? 'scale(1.2)' : 'scale(1)' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i)}
          >
            <path d="M9 1.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L9 12.1l-4.2 2.4.8-4.7-3.4-3.3 4.7-.7L9 1.5z"/>
          </svg>
        );
      })}
    </div>
  );
};

const STAR_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };

const ReviewForm = ({ onSubmit, onCancel }) => {
  const reviewableTours = getReviewableTours();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    tourId:  reviewableTours[0]?.id || '',
    stars:   0,
    title:   '',
    comment: '',
  });
  const [images,    setImages]    = useState([]);   // { file, preview }
  const [submitted, setSubmitted] = useState(false);
  const [errors,    setErrors]    = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...toAdd]);
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const e = {};
    if (!form.tourId)              e.tourId  = 'Please select a tour.';
    if (form.stars === 0)          e.stars   = 'Please give a star rating.';
    if (!form.title.trim())        e.title   = 'Please add a review title.';
    if (form.comment.trim().length < 20) e.comment = 'Comment must be at least 20 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, images });
    setSubmitted(true);
  };

  const handleClear = () => {
    setForm({ tourId: reviewableTours[0]?.id || '', stars: 0, title: '', comment: '' });
    setImages([]);
    setErrors({});
  };

  // ── No reviewable tours ──────────────────────────────────
  if (reviewableTours.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>🗓️</div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0d2b2b', letterSpacing: '-0.02em' }}>
          No completed tours yet
        </h3>
        <p style={{ fontSize: '14px', fontWeight: 300, color: '#5a8080', maxWidth: '320px', lineHeight: 1.7 }}>
          Reviews become available once our team marks your tour as <strong>Completed</strong>.
          Check back after your journey ends!
        </p>
        <button
          onClick={onCancel}
          style={{
            marginTop: '8px', padding: '12px 28px', borderRadius: '10px',
            border: '1.5px solid rgba(0,176,165,0.3)', background: 'transparent',
            color: '#00b0a5', fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    );
  }

  // ── Success state ────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '56px' }}>🎉</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d2b2b', letterSpacing: '-0.03em' }}>
          Thank you for your review!
        </h3>
        <p style={{ fontSize: '15px', fontWeight: 300, color: '#5a8080', maxWidth: '360px', lineHeight: 1.7 }}>
          Your review has been published and can be found on the reviews page and in <strong>My Reviews</strong> in your dashboard.
        </p>
        <button
          onClick={onCancel}
          style={{
            marginTop: '8px', padding: '14px 32px', borderRadius: '10px',
            background: '#00b0a5', border: 'none', color: '#fff',
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            boxShadow: '0 6px 24px -4px rgba(0,176,165,0.45)',
          }}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .rvf-wrap { display: flex; flex-direction: column; gap: 24px; }

        /* Field */
        .rvf-field { display: flex; flex-direction: column; gap: 8px; }
        .rvf-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #3a5a5a;
        }
        .rvf-error {
          font-size: 11px; font-weight: 600; color: #cc3344;
          margin-top: -4px;
        }

        /* Select */
        /*
        .rvf-select {
          padding: 12px 16px; border-radius: 10px;
          border: 1.5px solid rgba(0,176,165,0.25);
          background: #f7fffe; color: #0d2b2b;
          font-size: 14px; font-weight: 400;
          outline: none; cursor: pointer;
          transition: border-color 0.2s ease;
          appearance: none;
        }
        .rvf-select:focus { border-color: #00b0a5; background: #fff; }
        .rvf-select.error { border-color: #cc3344; }
        */

        /* Input */
        .rvf-input {
          padding: 12px 16px; border-radius: 10px;
          border: 1.5px solid rgba(0,176,165,0.25);
          background: #f7fffe; color: #0d2b2b;
          font-size: 14px; font-weight: 400;
          outline: none; font-family: inherit;
          transition: border-color 0.2s ease;
        }
        .rvf-input:focus { border-color: #00b0a5; background: #fff; }
        .rvf-input.error { border-color: #cc3344; }

        /* Textarea */
        .rvf-textarea {
          padding: 14px 16px; border-radius: 10px;
          border: 1.5px solid rgba(0,176,165,0.25);
          background: #f7fffe; color: #0d2b2b;
          font-size: 14px; font-weight: 300;
          outline: none; resize: vertical; min-height: 130px;
          font-family: inherit; line-height: 1.7;
          transition: border-color 0.2s ease;
        }
        .rvf-textarea:focus { border-color: #00b0a5; background: #fff; }
        .rvf-textarea.error { border-color: #cc3344; }
        .rvf-char-count {
          font-size: 10px; font-weight: 600; color: #7a9a9a;
          text-align: right; margin-top: -4px;
        }

        /* Star label */
        .rvf-star-label {
          font-size: 12px; font-weight: 600;
          color: #00b0a5; letter-spacing: 0.06em;
          min-height: 18px;
        }

        /* Image upload */
        .rvf-img-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .rvf-img-thumb-wrap {
          position: relative; width: 80px; height: 70px;
          border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(0,176,165,0.2);
        }
        .rvf-img-thumb { width: 100%; height: 100%; object-fit: cover; }
        .rvf-img-remove {
          position: absolute; top: 3px; right: 3px;
          width: 18px; height: 18px; border-radius: 50%;
          background: rgba(0,0,0,0.55); color: #fff;
          font-size: 10px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .rvf-img-add {
          width: 80px; height: 70px; border-radius: 10px;
          border: 1.5px dashed rgba(0,176,165,0.4);
          background: rgba(0,176,165,0.04);
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 4px;
          cursor: pointer; color: #00b0a5;
          font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
          transition: all 0.2s ease;
        }
        .rvf-img-add:hover { background: rgba(0,176,165,0.08); border-color: #00b0a5; }
        .rvf-img-hint {
          font-size: 10px; font-weight: 400; color: #7a9a9a;
          margin-top: 4px;
        }

        /* Rule */
        .rvf-rule {
          height: 1px;
          background: linear-gradient(90deg, rgba(0,176,165,0.15), transparent);
        }

        /* Actions */
        .rvf-actions { display: flex; gap: 10px; }
        .rvf-submit {
          flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: #00b0a5; color: #fff;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 14px 24px; border-radius: 10px; border: none;
          cursor: pointer;
          box-shadow: 0 6px 24px -4px rgba(0,176,165,0.45);
          transition: all 0.25s ease;
        }
        .rvf-submit:hover { background: #009e94; transform: translateY(-1px); }
        .rvf-clear {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 14px 20px; border-radius: 10px;
          border: 1.5px solid rgba(0,176,165,0.25);
          background: transparent; color: #5a8080;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .rvf-clear:hover { border-color: #cc3344; color: #cc3344; }
      `}</style>

      <div className="rvf-wrap">

        {/* Tour selector */}
        {/* <div className="rvf-field">
          <label className="rvf-label">Select Your Tour</label>
          <select
            className={`rvf-select ${errors.tourId ? 'error' : ''}`}
            value={form.tourId}
            onChange={e => set('tourId', e.target.value)}
          >
            {reviewableTours.map(t => (
              <option key={t.id} value={t.id}>
                {t.packageTitle} ({t.packageType}) — Completed {t.completedDate}
              </option>
            ))}
          </select>
          {errors.tourId && <span className="rvf-error">{errors.tourId}</span>}
        </div> */}

        {/* Stars */}
        <div className="rvf-field">
          <label className="rvf-label">Overall Rating</label>
          <StarPicker value={form.stars} onChange={v => set('stars', v)} />
          <div className="rvf-star-label">
            {form.stars ? `${STAR_LABELS[form.stars]} — ${form.stars}/5` : 'Tap a star to rate'}
          </div>
          {errors.stars && <span className="rvf-error">{errors.stars}</span>}
        </div>

        <div className="rvf-rule" />

        {/* Title */}
        <div className="rvf-field">
          <label className="rvf-label">Review Title</label>
          <input
            type="text"
            className={`rvf-input ${errors.title ? 'error' : ''}`}
            placeholder="Summarise your experience in a sentence…"
            value={form.title}
            maxLength={100}
            onChange={e => set('title', e.target.value)}
          />
          {errors.title && <span className="rvf-error">{errors.title}</span>}
        </div>

        {/* Comment */}
        <div className="rvf-field">
          <label className="rvf-label">Your Review</label>
          <textarea
            className={`rvf-textarea ${errors.comment ? 'error' : ''}`}
            placeholder="Tell others about your experience — what made it special, what you loved, what surprised you…"
            value={form.comment}
            maxLength={1000}
            onChange={e => set('comment', e.target.value)}
          />
          <div className="rvf-char-count">{form.comment.length}/1000</div>
          {errors.comment && <span className="rvf-error">{errors.comment}</span>}
        </div>

        {/* Images */}
        <div className="rvf-field">
          <label className="rvf-label">Photos (up to {MAX_IMAGES})</label>
          <div className="rvf-img-row">
            {images.map((img, i) => (
              <div key={i} className="rvf-img-thumb-wrap">
                <img src={img.preview} alt="" className="rvf-img-thumb" />
                <button className="rvf-img-remove" onClick={() => removeImage(i)}>✕</button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <div className="rvf-img-add" onClick={() => fileInputRef.current?.click()}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Photo
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImages}
            />
          </div>
          <div className="rvf-img-hint">{images.length}/{MAX_IMAGES} photos added</div>
        </div>

        <div className="rvf-rule" />

        {/* Actions */}
        <div className="rvf-actions">
          <button className="rvf-submit" onClick={handleSubmit}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Submit Review
          </button>
          <button className="rvf-clear" onClick={handleClear} title="Clear form">
            Clear
          </button>
        </div>

      </div>
    </>
  );
};

export default ReviewForm;
