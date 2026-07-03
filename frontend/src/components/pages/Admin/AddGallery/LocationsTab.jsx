import React, { useState } from "react";
import { Search, Plus, MapPin, Edit3, Trash2, Map } from "lucide-react";
import SriLankaMap from "./SriLankaMap";
import { PIN_COLORS } from "./constants";

export default function LocationsTab({ locations, onToast, onCreateLocation, onUpdateLocation, onDeleteLocation }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [mapPoint, setMapPoint] = useState(null);
  const [selColor, setSelColor] = useState(PIN_COLORS[0]);
  const [form, setForm] = useState({ name: "", region: "", lat: "", lng: "", desc: "" });
  const [saving, setSaving] = useState(false);

  const REGIONS = [
    "all",
    "Western Province",
    "Central Province",
    "Southern Province",
    "Eastern Province",
    "Cultural Triangle",
    "Sabaragamuwa",
    "Uva Province",
  ];

  const filtered = locations.filter((l) => {
    const matchSearch =
      !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.region.toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === "all" || l.region === regionFilter;
    return matchSearch && matchRegion;
  });

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", region: "", lat: "", lng: "", desc: "" });
    setSelColor(PIN_COLORS[0]);
    setMapPoint(null);
    setShowForm(true);
  };

  const openEdit = (loc) => {
    setEditId(loc.id);
    setForm({ name: loc.name, region: loc.region, lat: String(loc.lat), lng: String(loc.lng), desc: loc.desc });
    setSelColor(loc.col);
    setMapPoint({ lat: loc.lat, lng: loc.lng });
    setShowForm(true);
  };

  const normalizeProvince = (regionName) => {
    if (!regionName) return "";
    const name = regionName.toLowerCase();
    
    if (name.includes("western")) return "Western Province";
    if (name.includes("central") && !name.includes("north")) return "Central Province";
    if (name.includes("southern")) return "Southern Province";
    if (name.includes("eastern")) return "Eastern Province";
    if (name.includes("sabaragamuwa")) return "Sabaragamuwa";
    if (name.includes("uva")) return "Uva Province";
    if (name.includes("north central")) return "North Central";
    if (name.includes("northern")) return "Northern Province";
    if (name.includes("north western")) return "North Western";
    
    return regionName;
  };

  const handleMapPin = ({ lat, lng, name, region }) => {
    setMapPoint({ lat, lng });
    const normalized = normalizeProvince(region);
    setForm((f) => ({
      ...f,
      name: name || f.name,
      region: normalized || f.region,
      lat: String(lat),
      lng: String(lng),
    }));
  };

  const handleLatChange = (val) => {
    setForm((f) => ({ ...f, lat: val }));
    const l = parseFloat(val);
    if (!isNaN(l)) {
      setMapPoint((prev) => ({ lat: l, lng: prev ? prev.lng : 80.7718 }));
    }
  };

  const handleLngChange = (val) => {
    setForm((f) => ({ ...f, lng: val }));
    const l = parseFloat(val);
    if (!isNaN(l)) {
      setMapPoint((prev) => ({ lat: prev ? prev.lat : 7.8731, lng: l }));
    }
  };

  const handleCoordsBlur = async () => {
    const latNum = parseFloat(form.lat);
    const lngNum = parseFloat(form.lng);
    if (isNaN(latNum) || isNaN(lngNum)) return;

    if (latNum < 5.0 || latNum > 10.5 || lngNum < 79.0 || lngNum > 82.5) {
      onToast("Coordinates are outside Sri Lanka bounding area.");
      return;
    }

    try {
      setMapPoint({ lat: latNum, lng: lngNum });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latNum)}&lon=${encodeURIComponent(lngNum)}&zoom=12&addressdetails=1`
      );
      if (response.ok) {
        const data = await response.json();
        const address = data?.address || {};
        const rawName = data?.name || address?.tourism || address?.city || address?.town || address?.village || "";
        const rawRegion = address?.state || address?.province || address?.state_district || "";
        const province = normalizeProvince(rawRegion);
        
        setForm((f) => ({
          ...f,
          name: rawName ? String(rawName).split(",")[0].trim() : f.name,
          region: province || f.region
        }));
        
        onToast(`Verified coordinates. Auto-detected province: ${province || "Unknown"}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNameBlur = async () => {
    const query = form.name.trim();
    if (!query) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Sri Lanka")}&limit=1&addressdetails=1`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          const latVal = parseFloat(result.lat);
          const lngVal = parseFloat(result.lon);
          
          const rawRegion = result.address?.state || result.address?.province || result.address?.state_district || "";
          const province = normalizeProvince(rawRegion);

          setMapPoint({ lat: latVal, lng: lngVal });
          setForm((f) => ({
            ...f,
            lat: String(latVal.toFixed(6)),
            lng: String(lngVal.toFixed(6)),
            region: province || f.region,
          }));

          onToast(`Found "${query}" on map! Auto-detected province: ${province || "Unknown"}`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const save = async () => {
    if (!form.name.trim() || !form.region) {
      onToast("Destination name and region province are required.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      region: form.region,
      lat: parseFloat(form.lat) || 7.5,
      lng: parseFloat(form.lng) || 80.8,
      desc: form.desc,
      col: selColor,
    };

    try {
      setSaving(true);
      if (editId) {
        await onUpdateLocation(editId, payload);
        onToast(`"${form.name}" has been updated.`);
      } else {
        await onCreateLocation(payload);
        onToast(`"${form.name}" successfully added to our Sri Lanka network map.`);
      }
      setShowForm(false);
    } catch (error) {
      onToast(error.message || "Failed to save destination.");
    } finally {
      setSaving(false);
    }
  };

  const del = async (loc) => {
    try {
      await onDeleteLocation(loc.id);
      onToast(`Destination "${loc.name}" deleted.`);
    } catch (error) {
      onToast(error.message || "Failed to delete destination.");
    }
  };

  return (
    <div>
      <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 outline-none focus:border-teal-600 focus:bg-white text-stone-800 font-medium"
              placeholder="Search destination maps..."
            />
          </div>

          <button
            onClick={openAdd}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md cursor-pointer transition-all flex items-center gap-1.5 self-end md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Location
          </button>
        </div>

        <div className="flex gap-1.5 flex-wrap mt-4 pt-4 border-t border-stone-100">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`text-[10px] px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                regionFilter === r
                  ? "bg-stone-900 text-stone-100 shadow-sm"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200/50"
              }`}
            >
              {r === "all" ? "All Provinces" : r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl shadow-sm">
              <div className="text-4xl mb-3 text-stone-400">🗺️</div>
              <h3 className="text-xs font-bold text-stone-800 mb-1">No destinations found</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                Add a new major Sri Lanka travel junction like Nuwara Eliya, Jaffna or Trincomalee.
              </p>
            </div>
          ) : (
            filtered.map((l) => (
              <div
                key={l.id}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 border-2 border-white shadow-sm" style={{ background: l.col }} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-extrabold text-stone-900">{l.name}</h4>
                  <p className="text-[10px] text-stone-400 font-bold uppercase mt-0.5">{l.region}</p>
                  <p className="text-xs mt-1 text-stone-500 line-clamp-1">{l.desc || "A glorious tourism focal point."}</p>
                </div>
                <div className="hidden sm:block text-right flex-shrink-0">
                  <p className="text-[10px] font-mono font-bold text-stone-400">{l.lat.toFixed(4)}° N</p>
                  <p className="text-[10px] font-mono font-bold text-stone-400">{l.lng.toFixed(4)}° E</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(l)}
                    className="p-1.5 rounded-xl border border-stone-250 text-stone-600 bg-white hover:bg-stone-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => del(l)}
                    className="p-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-5">
          {showForm ? (
            <div className="bg-white border-2 border-teal-600 rounded-2xl overflow-hidden shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between px-6 py-4 bg-teal-50 border-b border-teal-100">
                <h3 className="text-xs font-extrabold text-teal-900 tracking-wide uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-700" />
                  {editId ? "Edit Destination" : "Create New Destination"}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                  ✕
                </button>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-stone-600 mb-1 block">
                      Destination Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      onBlur={handleNameBlur}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 outline-none focus:border-teal-600 focus:bg-white text-stone-800 font-semibold"
                      placeholder="e.g. Knuckles Forest Range"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-stone-600 mb-1 block">
                      Province Province <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.region}
                      onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 outline-none focus:border-teal-600 focus:bg-white text-stone-800 font-semibold"
                    >
                      <option value="">Choose Province...</option>
                      {REGIONS.filter((r) => r !== "all").map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                      <option value="North Central">North Central Province</option>
                      <option value="Northern Province">Northern Province</option>
                      <option value="North Western">North Western Province</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 mb-1 block">Latitude (°N)</label>
                    <input
                      value={form.lat}
                      onChange={(e) => handleLatChange(e.target.value)}
                      onBlur={handleCoordsBlur}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 outline-none text-stone-800 font-mono"
                      placeholder="e.g. 7.4500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 mb-1 block">Longitude (°E)</label>
                    <input
                      value={form.lng}
                      onChange={(e) => handleLngChange(e.target.value)}
                      onBlur={handleCoordsBlur}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 outline-none text-stone-800 font-mono"
                      placeholder="e.g. 80.7900"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-[11px] font-bold text-stone-500 block mb-1.5 uppercase">Interactive Pin Locator</label>
                  <SriLankaMap onPin={handleMapPin} lat={mapPoint?.lat} lng={mapPoint?.lng} pinColor={selColor} hoverLocName={form.name} />
                </div>

                <div className="mb-4">
                  <label className="text-xs font-bold text-stone-600 mb-1 block">Description / Short intro</label>
                  <textarea
                    value={form.desc}
                    onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 border border-stone-200 outline-none focus:border-teal-600 focus:bg-white text-stone-700 leading-relaxed"
                    placeholder="Brief guide details..."
                  />
                </div>

                <div className="mb-5">
                  <label className="text-xs font-bold text-stone-600 mb-2 block">Map Pin Colour Theme</label>
                  <div className="flex gap-2 flex-wrap">
                    {PIN_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelColor(c)}
                        className="w-6 h-6 rounded-full transition-all duration-150 flex-shrink-0 border border-white cursor-pointer shadow-sm"
                        style={{
                          background: c,
                          outline: selColor === c ? "2.5px solid #110E0B" : "none",
                          transform: selColor === c ? "scale(1.15)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-stone-100">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={save}
                    disabled={saving}
                    className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl cursor-pointer shadow-md"
                  >
                    {saving ? "Saving..." : "Save Destination"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-[-20px] bottom-[-20px] text-white opacity-10">
                <Map className="w-48 h-48" />
              </div>
              <h3 className="text-lg font-bold font-serif-display mb-1">Sri Lanka Navigation Mesh</h3>
              <p className="text-xs text-teal-100 leading-relaxed mb-4">
                We catalog coordinates for Kandy, Ella, Galle, Trinco, and high-altitude tea domains to dynamically cluster travel photos.
              </p>
              <button
                onClick={openAdd}
                className="w-full py-2.5 px-4 bg-white text-teal-900 font-bold text-xs rounded-xl hover:bg-stone-50 transition-all cursor-pointer shadow-md"
              >
                + Create New Destination Point
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}