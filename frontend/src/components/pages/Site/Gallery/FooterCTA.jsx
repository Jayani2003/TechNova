import { useTranslation } from "react-i18next";

export default function FooterCTA() {
  const { t } = useTranslation();
  return (
    <footer className="relative py-24 px-6 text-center">
      <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{t("gallery.cta.title")}</h2>
      <p className="text-slate-500 mb-10 text-lg">{t("gallery.cta.desc")}</p>
      <button className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold">
        {t("gallery.cta.btn")}
      </button>
    </footer>
  );
}