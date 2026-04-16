import React from 'react';
import { MessageSquare, Mail, PhoneCall, CheckCircle2 } from 'lucide-react';

const ContactAdmin = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="mb-10 inline-flex p-5 bg-blue-50 text-blue-600 rounded-[40px]">
        <MessageSquare size={48} />
      </div>
      <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight italic">Want to List Your Property?</h1>
      <p className="text-xl text-gray-500 font-bold max-w-2xl mx-auto mb-12">
        Bhai, security aur quality maintain karne ke liye hum properties ko verify karke khud list karte hain. 
        Niche diye gaye options se humein contact karein.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Option */}
        <a href="https://wa.me/91XXXXXXXXXX" className="p-8 bg-white border-2 border-transparent hover:border-green-500 rounded-[32px] shadow-sm transition-all group">
          <PhoneCall size={32} className="mx-auto text-green-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black text-lg">WhatsApp Us</h3>
          <p className="text-gray-400 font-bold text-sm mt-2">Send details & photos</p>
        </a>

        {/* Email Option */}
        <a href="mailto:admin@example.com" className="p-8 bg-white border-2 border-transparent hover:border-blue-500 rounded-[32px] shadow-sm transition-all group">
          <Mail size={32} className="mx-auto text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black text-lg">Email Details</h3>
          <p className="text-gray-400 font-bold text-sm mt-2">Professional Listing</p>
        </a>

        {/* Process Info */}
        <div className="p-8 bg-gray-900 text-white rounded-[32px] shadow-lg">
          <CheckCircle2 size={32} className="mx-auto text-yellow-400 mb-4" />
          <h3 className="font-black text-lg">Verification</h3>
          <p className="text-gray-400 font-bold text-sm mt-2">Listed within 24 hours</p>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;