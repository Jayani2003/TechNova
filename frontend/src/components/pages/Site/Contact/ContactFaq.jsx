import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ContactFaq = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("contact.faq.q1"),
      answer: t("contact.faq.a1"),
    },
    {
      question: t("contact.faq.q2"),
      answer: t("contact.faq.a2"),
    },
    {
      question: t("contact.faq.q3"),
      answer: t("contact.faq.a3"),
    },
    {
      question: t("contact.faq.q4"),
      answer: t("contact.faq.a4"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
    >
      <div className="mb-6">
        <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-widest text-white uppercase rounded-full" style={{ backgroundColor: "#00b0a5" }}>
          {t("contact.faq.badge")}
        </span>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          {t("contact.faq.title")}
        </h2>
      </div>

    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <div className="rounded-t-xl px-5 py-3" style={{ backgroundColor: "#00b0a5" }}>
            <p className="text-white font-semibold text-sm tracking-wide">{faq.question}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-b-xl px-5 py-3">
            <p className="text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
  );
};

export default ContactFaq;
