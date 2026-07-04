import { motion } from "framer-motion";
import {
  Wifi, ParkingCircle, Droplets, MapPin, UserCheck,
  Fuel, Shield, BedDouble, Check, Clock, Star, Phone
} from "lucide-react";
import { useTranslation } from "react-i18next";

const inclusions = [
  { icon: Wifi,          label: "Free Wi-Fi in Vehicle" },
  { icon: ParkingCircle, label: "Parking & Highway Tolls" },
  { icon: Droplets,      label: "Water Bottles" },
  { icon: MapPin,        label: "GPS Tracking" },
  { icon: UserCheck,     label: "Experienced Driver" },
  { icon: Fuel,          label: "All Fuel Costs" },
  { icon: Shield,        label: "Foreign Passenger Insurance" },
  { icon: BedDouble,     label: "Driver Accommodation" },
];

const P2PSidePanel = () => {
  const { t } = useTranslation();

  const steps = [
    { title: t("p2pBooking.sidePanel.step1Title"),   desc: t("p2pBooking.sidePanel.step1Desc") },
    { title: t("p2pBooking.sidePanel.step2Title"),  desc: t("p2pBooking.sidePanel.step2Desc") },
    { title: t("p2pBooking.sidePanel.step3Title"), desc: t("p2pBooking.sidePanel.step3Desc") },
  ];

  return (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="space-y-4"
  >
    {/* ── What's Included ──
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest text-white uppercase bg-[#00b0a5] rounded-full">
        Included
      </span>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-5">What's Included</h2>
      <div className="space-y-4">
        {inclusions.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors">
            <div className="w-10 h-10 bg-[#00b0a5]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-[#00b0a5]" />
            </div>
            <p className="font-bold text-slate-800 text-sm">{label}</p>
          </div>
        ))}
      </div>
    </div> */}

    {/* ── How It Works ── */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-2xl font-extrabold text-slate-800 mb-5">{t("p2pBooking.sidePanel.howItWorks")}</h2>
      <div className="space-y-4">
        {steps.map(({ title, desc }, i) => (
          <div key={title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-[#00b0a5] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className="w-0.5 h-6 bg-slate-200 mt-1" />}
            </div>
            <div className="pb-2">
              <p className="text-sm font-bold text-slate-800">{title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ── Emergency Assistance ── */}
    <div className="bg-[#00b0a5]/10 border border-[#00b0a5]/20 rounded-2xl p-6">
      <h3 className="font-extrabold text-slate-800 mb-1">{t("p2pBooking.sidePanel.emergencyTitle")}</h3>
      <p className="text-sm text-slate-600 mb-3">
        {t("p2pBooking.sidePanel.emergencyDesc")}
      </p>
      <a
        href="tel:+94778619582"
        className="flex items-center gap-2 text-[#00b0a5] font-semibold hover:text-[#009b91] transition-colors"
      >
        <Phone className="w-5 h-5" />
        +94 77 861 9582
      </a>
    </div>

    {/* ── Payment Note ── */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
      <p className="text-sm font-bold text-slate-700 mb-1">💳 {t("p2pBooking.sidePanel.paymentPolicy")}</p>
      <p className="text-xs text-slate-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: t("p2pBooking.sidePanel.paymentDesc").replace("single full payment", "<strong>single full payment</strong>").replace("එක් සම්පූර්ණ ගෙවීමක්", "<strong>එක් සම්පූර්ණ ගෙවීමක්</strong>") }}>
      </p>
    </div>
  </motion.div>
  );
};

export default P2PSidePanel;
