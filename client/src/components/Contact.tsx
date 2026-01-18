import React from 'react';
import { Mail, Phone, MapPin, Send, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import Map from './Map';

const Contact = () => {
  return (
    <section id="contact" className="py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-50 to-white opacity-50 -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-slate-900">Get in Touch</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ready to improve your game? Contact me for private lessons, group sessions, or any inquiries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Contact Info & Locations */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-panel p-8 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white/90">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-bold uppercase tracking-wider">Email</p>
                    <div className="flex items-center gap-2">
                      <a href="mailto:anis.federe@gmail.com" className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                        anis.federe@gmail.com
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("anis.federe@gmail.com");
                          toast.success("Email copied to clipboard!");
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                        title="Copy email"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-bold uppercase tracking-wider">Phone</p>
                    <a href="tel:+15148120621" className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                      +1 (514) 812-0621
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-bold uppercase tracking-wider">Location</p>
                    <p className="text-lg font-bold text-slate-900">
                      Montréal, QC
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl shadow-xl relative overflow-hidden bg-white/90">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-10 -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-10 -ml-10 -mb-10"></div>

              <h3 className="text-xl font-bold mb-4 relative z-10 text-slate-900">Training Locations</h3>
              <ul className="space-y-4 relative z-10 text-slate-700">
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <div>
                    <span className="font-bold block text-slate-900">Sani Sport Brossard</span>
                    <span className="text-sm">7777 Bd Marie-Victorin, Brossard, QC J4W 3H3</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <div>
                    <span className="font-bold block text-slate-900">Stade IGA</span>
                    <span className="text-sm">285 Rue Gary-Carter, Montréal, QC H2R 2W1</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <div>
                    <span className="font-bold block text-slate-900">Complexe Sportif Longueuil</span>
                    <span className="text-sm">550 Boulevard Curé-Poirier O, Longueuil, QC J4J 2H6</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <div>
                    <span className="font-bold block text-slate-900">Tennis - parc Jeanne-Mance</span>
                    <span className="text-sm">4422 Av. de l'Esplanade, Montréal, QC H2W 1B9</span>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-panel p-8 rounded-2xl shadow-xl bg-white/90"
          >
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Send a Message</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                // Show loading state if you had one, or just toast
                const loadingToast = toast.loading("Sending message...");

                try {
                  const response = await fetch("https://formsubmit.co/ajax/anis.federe@gmail.com", {
                    method: "POST",
                    body: formData,
                    headers: {
                      'Accept': 'application/json'
                    }
                  });

                  if (response.ok) {
                    toast.dismiss(loadingToast);
                    toast.success("Message sent successfully! I will get back to you soon.");
                    (e.target as HTMLFormElement).reset();
                  } else {
                    throw new Error("Failed to send");
                  }
                } catch (err) {
                  toast.dismiss(loadingToast);
                  toast.error("Something went wrong. Please try again or email me directly.");
                  console.error(err);
                }
              }}
              className="space-y-6"
            >
              <input type="hidden" name="_subject" value="New Inquiry from Website" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none"
                >
                  <option value="">Select a topic</option>
                  <option value="Private Coaching">Private Coaching</option>
                  <option value="Group Session">Group Session</option>
                  <option value="Other Inquiry">Other Inquiry</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  placeholder="How can I help you?"
                ></textarea>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Send Message</span>
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                {/* <p className="text-xs text-center text-slate-500">
                  Powered by FormSubmit. <br />
                  <span className="font-bold text-emerald-600">IMPORTANT:</span> For the first message, you (Anis) will receive an activation email. Please click it to enable the form.
                </p> */}
              </div>
            </form>
          </motion.div>
        </div>

        {/* Map Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="rounded-2xl overflow-hidden shadow-lg h-96 w-full relative z-0 border border-slate-200"
        >
          <Map />
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
