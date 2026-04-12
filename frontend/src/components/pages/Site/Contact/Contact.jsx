import ContactHeader from "./ContactHeader";
import ContactForm from "./ContactForm";
import ContactFaq from "./ContactFaq";
import ContactInfo from "./ContactInfo";
import ContactMap from "./ContactMap";

const Contact = () => (
  <div className="min-h-screen bg-slate-50 pb-12">
    {/* Page Title */}
    <ContactHeader />

    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form + FAQ */}
        <div className="lg:col-span-2 space-y-6">
          <ContactForm />
          <ContactFaq />
        </div>

        {/* Right: Contact Info Sidebar */}
        <div>
          <ContactInfo />
        </div>
      </div>

      {/* Full-width Map */}
      <ContactMap />
    </div>
  </div>
);

export default Contact;
