import React, { useMemo, useRef, useState } from "react";
import { ImagePlus, UploadCloud, Sparkles, FileImage, X } from "lucide-react";
import { MOODS, SEASONS } from "./constants";

export default function UploadTab({ locations, onToast, onAddPhoto }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [form, setForm] = useState({
    title: "",
    location: locations[0]?.name ?? "",
    season: SEASONS[0]?.key ?? "dry",
    mood: MOODS[0]?.key ?? "adventure",
    event: "",
    tourist: "",
    date: new Date().toISOString().slice(0, 10),
    desc: "",
    tags: "",
    withTourists: false,
    status: "draft",
  });

  const locationOptions = useMemo(() => locations.map((location) => location.name), [locations]);

  const resetForm = () => {
    setForm({
      title: "",
      location: locations[0]?.name ?? "",
      season: SEASONS[0]?.key ?? "dry",
      mood: MOODS[0]?.key ?? "adventure",
      event: "",
      tourist: "",
      date: new Date().toISOString().slice(0, 10),
      desc: "",
      tags: "",
      withTourists: false,
      status: "draft",
    });
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onToast("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      onToast("Photo title is required.");
      return;
    }

    if (!form.location) {
      onToast("Please select a location.");
      return;
    }

    const image = previewUrl || "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80";

    onAddPhoto({
      id: Date.now(),
      title: form.title.trim(),
      image,
      season: form.season,
      mood: form.mood,
      loc: form.location,
      event: form.event.trim() || null,
      status: form.status,
      tourist: form.tourist.trim() || "Unknown traveler",
      date: form.date,
      desc: form.desc.trim(),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      withTourists: form.withTourists,
    });

    onToast(`"${form.title.trim()}" added to the gallery.`);
    resetForm();
  };

  return (
    <section className="mb-8">
      <div className="rounded-3xl border border-teal-100 bg-white shadow-sm overflow-hidden">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-stone-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-200">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-teal-700">Upload Photos</p>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900">Publish a new travel moment</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Photo Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-teal-600 focus:bg-white"
                  placeholder="e.g. Sigiriya Sunset Over the Plains"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Location</label>
                <select
                  value={form.location}
                  onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-teal-600 focus:bg-white"
                >
                  {locationOptions.map((locationName) => (
                    <option key={locationName} value={locationName}>
                      {locationName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Season</label>
                <select
                  value={form.season}
                  onChange={(e) => setForm((current) => ({ ...current, season: e.target.value }))}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-teal-600 focus:bg-white"
                >
                  {SEASONS.map((season) => (
                    <option key={season.key} value={season.key}>
                      {season.icon} {season.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Mood</label>
                <select
                  value={form.mood}
                  onChange={(e) => setForm((current) => ({ ...current, mood: e.target.value }))}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-teal-600 focus:bg-white"
                >
                  {MOODS.map((mood) => (
                    <option key={mood.key} value={mood.key}>
                      {mood.icon} {mood.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Linked Festival Event</label>
                <input
                  value={form.event}
                  onChange={(e) => setForm((current) => ({ ...current, event: e.target.value }))}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-teal-600 focus:bg-white"
                  placeholder="e.g. Sinhala New Year, Esala Perahera"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Tourist Name</label>
                <input
                  value={form.tourist}
                  onChange={(e) => setForm((current) => ({ ...current, tourist: e.target.value }))}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-teal-600 focus:bg-white"
                  placeholder="e.g. Priya & Rohan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Description</label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((current) => ({ ...current, desc: e.target.value }))}
                  rows={4}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-teal-600 focus:bg-white"
                  placeholder="Add a short story, highlight, or caption for the photo."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Tags</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm((current) => ({ ...current, tags: e.target.value }))}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 outline-none transition focus:border-teal-600 focus:bg-white"
                  placeholder="sigiriya, sunrise, heritage, hiking"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.withTourists}
                    onChange={(e) => setForm((current) => ({ ...current, withTourists: e.target.checked }))}
                    className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-600"
                  />
                  Contains customers / travelers
                </label>

                <label className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.status === "published"}
                    onChange={(e) => setForm((current) => ({ ...current, status: e.target.checked ? "published" : "draft" }))}
                    className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-600"
                  />
                  Publish immediately
                </label>
              </div>

              <div className="sm:col-span-2 flex items-center gap-3">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-700 transition hover:border-teal-300 hover:text-teal-700 cursor-pointer"
                >
                  <FileImage className="w-4 h-4" />
                  Choose Image
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-teal-200 transition hover:bg-teal-500 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Save to Gallery
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gradient-to-br from-stone-950 via-[#0f766e] to-teal-600 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.22),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(196,154,60,0.25),_transparent_38%)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/10">
                  <ImagePlus className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-teal-100/80">Live Preview</p>
                  <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">What will appear in the gallery</h3>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/20 min-h-[18rem] shadow-2xl">
                {previewUrl ? (
                  <img src={previewUrl} alt="Upload preview" className="h-64 w-full object-cover" />
                ) : (
                  <div className="h-64 flex items-center justify-center text-center px-8">
                    <div>
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <UploadCloud className="h-7 w-7 text-teal-100" />
                      </div>
                      <p className="text-sm font-bold text-white">Pick an image to preview it here</p>
                      <p className="mt-1 text-xs text-teal-50/80">The new photo will be added to the gallery when you save the form.</p>
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100/70">Title</p>
                      <p className="truncate text-base font-extrabold">{form.title || "Untitled travel story"}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {form.status}
                    </span>
                  </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-teal-50/90">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-teal-100/65">Location</p>
                      <p className="mt-1 font-bold">{form.location || "Select a location"}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-teal-100/65">Mood</p>
                      <p className="mt-1 font-bold">{MOODS.find((mood) => mood.key === form.mood)?.label ?? form.mood}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-teal-100/65">Linked Festival Event</p>
                    <p className="mt-1 font-bold text-xs text-teal-50/90">{form.event.trim() || "Not linked to an event"}</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-teal-100/65">Preview Text</p>
                    <p className="mt-1 text-xs leading-relaxed text-teal-50/85 break-words line-clamp-3 overflow-hidden">
                      {form.desc || "Add a short description to help the gallery card feel complete."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {form.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((tag) => (
                        <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-teal-50">
                          #{tag}
                        </span>
                      ))}
                    {!form.tags.trim() && <span className="text-[10px] text-teal-50/65">No tags yet</span>}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-teal-50/80">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Frontend-only upload flow
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-bold text-white transition hover:bg-white/15 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}