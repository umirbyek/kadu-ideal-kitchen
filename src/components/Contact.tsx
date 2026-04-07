import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">
              Хамтран ажиллах
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8">
              Санаагаа бодит <br />
              <span className="italic text-text-secondary">болгоцгооё</span>
            </h2>
            <p className="text-text-secondary font-light leading-relaxed mb-12 max-w-md">
              Та шинэ гэрийнхээ интериер дизайныг гаргуулах эсвэл өөртөө зориулан тавилга хийлгэхийг хүсвэл надтай холбогдоорой.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full border border-bg-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-text-primary stroke-1" />
                </div>
                <div>
                  <p className="text-sm tracking-wider uppercase text-text-secondary mb-1">Утас</p>
                  <p className="text-lg font-serif">+976 9911 2233</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full border border-bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-text-primary stroke-1" />
                </div>
                <div>
                  <p className="text-sm tracking-wider uppercase text-text-secondary mb-1">И-мэйл</p>
                  <p className="text-lg font-serif">hello@kadu.mn</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full border border-bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-text-primary stroke-1" />
                </div>
                <div>
                  <p className="text-sm tracking-wider uppercase text-text-secondary mb-1">Хаяг</p>
                  <p className="text-lg font-serif">Улаанбаатар хот, Сүхбаатар дүүрэг</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex space-x-4">
              <a href="#" className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center hover:bg-accent hover:text-white transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center hover:bg-accent hover:text-white transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-bg-secondary"
          >
            <h3 className="text-2xl font-serif mb-8">Зурвас үлдээх</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm tracking-wider uppercase text-text-secondary mb-2">Нэр</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full border-b border-bg-secondary py-3 bg-transparent focus:outline-none focus:border-text-primary transition-colors"
                  placeholder="Таны нэр"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm tracking-wider uppercase text-text-secondary mb-2">Утасны дугаар</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full border-b border-bg-secondary py-3 bg-transparent focus:outline-none focus:border-text-primary transition-colors"
                  placeholder="Утасны дугаар"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm tracking-wider uppercase text-text-secondary mb-2">Зурвас</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full border-b border-bg-secondary py-3 bg-transparent focus:outline-none focus:border-text-primary transition-colors resize-none"
                  placeholder="Юуны талаар ярилцах вэ?"
                ></textarea>
              </div>
              <button 
                type="button"
                className="w-full py-4 bg-text-primary text-bg-primary rounded-full hover:bg-accent transition-colors duration-300 font-medium tracking-wide mt-4"
              >
                Илгээх
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
