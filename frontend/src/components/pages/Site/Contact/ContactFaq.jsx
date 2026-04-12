const faqs = [
  {
    question: "Is insurance included in the quoted price?",
    answer:
      "Yes, all our tours have foreign passenger insurance included in the price.",
  },
  {
    question: "Can I pick up the car at the airport?",
    answer:
      "Absolutely yes! Just let us know your flight details.",
  },
  {
    question: "What happens if you face an accident while travelling?",
    answer:
      "After reporting the insurance, if the vehicle is suitable for the Journey will continue the tour with the same vehicle. If necessary, the vehicle will be replaced with another same range of the vehicle as soon as possible.",
  },
  {
    question: "What are the excludes from the quoted price?",
    answer:
      "You'll need to pay for any services like Entrance tickets, food and beverages, accommodation.",
  },
];
 
const ContactFaq = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
    <h2 className="text-lg font-bold text-slate-800 mb-5">
      Frequently Asked Questions
    </h2>
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i}>
          {/* Question — dark slate box */}
          <div className="bg-blue-100 rounded-t-xl px-5 py-3">
            <p className="text-blue-600 font-semibold text-sm">{faq.question}</p>
          </div>
          {/* Answer — light background */}
          <div className="bg-slate-50 border border-slate-100 rounded-b-xl px-5 py-3">
            <p className="text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
 
export default ContactFaq;