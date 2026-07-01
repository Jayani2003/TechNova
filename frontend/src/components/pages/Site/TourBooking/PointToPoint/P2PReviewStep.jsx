import { MapPin, Calendar, Users, Car, Phone, FileText, Clock, AlertTriangle, Briefcase } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import { useTranslation } from "react-i18next";

const VEHICLE_LABELS = {
  mini_car: "Mini Car",
  normal_car: "Normal Car",
  sedan_car: "Sedan Car",
  mpv: "MPV",
  suv: "SUV",
  mini_van: "Mini Van",
  van: "Van",
  large_van: "Large Van",
};

const ReviewRow = ({ icon: Icon, label, value }) =>
  value ? (
    <div className="flex items-start gap-3 py-3 border-b border-[#F5820D]/10 last:border-0">
      <div className="w-8 h-8 bg-[#F0A500]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#F0A500]" />
      </div>
      <div>
        <p className="text-xs text-[#6B7280]/70 font-medium">{label}</p>
        <p className="text-sm font-semibold text-[#2C2F3A] mt-0.5">{value}</p>
      </div>
    </div>
  ) : null;

const P2PReviewStep = ({ data }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  // Build luggage summary string
  const luggageParts = [];
  if (data.luggage10kg  > 0) luggageParts.push(`${data.luggage10kg}× 10 kg`);
  if (data.luggage25kg  > 0) luggageParts.push(`${data.luggage25kg}× 25 kg`);
  if (data.luggage35kg  > 0) luggageParts.push(`${data.luggage35kg}× 35 kg`);
  if ((data.luggageCustomItems || []).length > 0) {
    data.luggageCustomItems.forEach((item, i) => {
      luggageParts.push(`Custom ${i + 1}: ${item.weight ? `${item.weight} kg` : "weight not set"}`);
    });
  }
  const luggageSummary = luggageParts.length > 0 ? luggageParts.join(" · ") : t("p2pBooking.reviewStep.noLuggage", "No luggage");

  const customerFullName = data.customerName?.trim() || user?.name || "—";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#2C2F3A] mb-1">{t("p2pBooking.reviewStep.title")}</h3>
        <p className="text-sm text-[#6B7280]">
          {t("p2pBooking.reviewStep.desc")}
        </p>
      </div>

      {/* Booking type badge */}
      <div className="inline-flex items-center gap-2 bg-[#F0A500]/10 text-[#F0A500] px-4 py-2 rounded-full text-sm font-bold">
        🚗 {t("p2pBooking.reviewStep.badge")}
      </div>

      {/* Trip Details */}
      <div className="bg-white rounded-2xl border border-[#F5820D]/10 shadow-sm p-5">
        <p className="text-xs font-bold text-[#6B7280]/70 uppercase tracking-wider mb-3">{t("p2pBooking.reviewStep.tripDetails")}</p>
        <ReviewRow icon={MapPin}     label={t("p2pBooking.reviewStep.pickupLoc")}   value={data.startLocation} />
        <ReviewRow icon={MapPin}     label={t("p2pBooking.reviewStep.dropoffLoc")} value={data.endLocation} />
        <ReviewRow icon={Calendar}   label={t("p2pBooking.reviewStep.travelDates")}      value={`${data.startDate} → ${data.endDate}`} />
        <ReviewRow icon={Clock}      label={t("p2pBooking.reviewStep.pickupTime")}       value={data.pickupTime} />
        <ReviewRow icon={Calendar}   label={t("p2pBooking.reviewStep.totalDays")}        value={`${data.totalDays} day(s)`} />
      </div>

      {/* Passengers & Vehicle */}
      <div className="bg-white rounded-2xl border border-[#F5820D]/10 shadow-sm p-5">
        <p className="text-xs font-bold text-[#6B7280]/70 uppercase tracking-wider mb-3">{t("p2pBooking.reviewStep.passVeh")}</p>
        <ReviewRow icon={Users}    label={t("p2pBooking.reviewStep.adults")}           value={`${data.noOfAdults} adult(s)`} />
        {data.noOfChildren > 0 && (
          <ReviewRow
            icon={Users}
            label={t("p2pBooking.reviewStep.children")}
            value={`${data.noOfChildren} child(ren) — Ages: ${data.agesOfChildren || "not specified"}${data.babySeatNeeded ? " · Baby seat requested" : ""}`}
          />
        )}
        <ReviewRow icon={Briefcase} label={t("p2pBooking.reviewStep.luggage")}          value={luggageSummary} />
        <ReviewRow icon={Car}       label={t("p2pBooking.reviewStep.vehCategory")} value={VEHICLE_LABELS[data.categoryId] || data.categoryId} />
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-2xl border border-[#F5820D]/10 shadow-sm p-5">
        <p className="text-xs font-bold text-[#6B7280]/70 uppercase tracking-wider mb-3">{t("p2pBooking.reviewStep.contactDetails")}</p>
        <ReviewRow icon={Phone} label={t("p2pBooking.reviewStep.fullName")}    value={customerFullName} />
        <ReviewRow icon={Phone} label={t("p2pBooking.reviewStep.email")}        value={user?.email || "—"} />
        <ReviewRow icon={Phone} label={t("p2pBooking.reviewStep.phone")}        value={data.customerPhone || "—"} />
        {data.notes && (
          <ReviewRow icon={FileText} label={t("p2pBooking.reviewStep.notes")} value={data.notes} />
        )}
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-2xl border border-[#F5820D]/10 shadow-sm p-5">
        <p className="text-xs font-bold text-[#6B7280]/70 uppercase tracking-wider mb-3 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> {t("p2pBooking.reviewStep.emergencyContact")}
        </p>
        {data.emergencyName || data.emergencyPhone ? (
          <>
            <ReviewRow icon={Phone} label={t("p2pBooking.reviewStep.emergencyName")}         value={data.emergencyName || "—"} />
            <ReviewRow icon={Phone} label={t("p2pBooking.reviewStep.relationship")}                   value={data.emergencyRelationship || "—"} />
            <ReviewRow icon={Phone} label={t("p2pBooking.reviewStep.emergencyPhone")}        value={data.emergencyPhone || "—"} />
          </>
        ) : (
          <p className="text-sm text-[#6B7280]/70 italic py-2">{t("p2pBooking.reviewStep.noEmergency")}</p>
        )}
      </div>

      {/* What happens next */}
      <div className="bg-[#FFF8F0] rounded-2xl p-5 border border-[#F5820D]/10">
        <p className="text-sm font-bold text-[#2C2F3A] mb-3">{t("p2pBooking.reviewStep.whatHappensNext")}</p>
        {[
          t("p2pBooking.reviewStep.nextStep1"),
          t("p2pBooking.reviewStep.nextStep2"),
          t("p2pBooking.reviewStep.nextStep3"),
          t("p2pBooking.reviewStep.nextStep4"),
          t("p2pBooking.reviewStep.nextStep5"),
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-[#F0A500] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
              {i + 1}
            </div>
            <p className="text-sm text-[#2C2F3A]/70">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default P2PReviewStep;
