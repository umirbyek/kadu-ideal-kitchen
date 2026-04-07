import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop"
          alt="Interior Design Background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">
              Интериер Дизайн & Захиалгат Тавилга
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] mb-6">
              Орон зайг <br />
              <span className="italic text-text-secondary">урлаг</span> болгоно.
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-xl mb-10 font-light leading-relaxed">
              Интериер дизайны мэргэжлийн ажлын зураг гаргаж, таны хүсэлд нийцсэн цор ганц тавилгыг урлан бүтээж байна.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center px-8 py-4 bg-text-primary text-bg-primary rounded-full hover:bg-accent transition-colors duration-300 font-medium tracking-wide"
              >
                Бүтээлүүд үзэх
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-text-primary/20 text-text-primary rounded-full hover:border-text-primary transition-colors duration-300 font-medium tracking-wide"
              >
                Холбоо барих
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-xs tracking-[0.2em] uppercase text-text-secondary mb-2" style={{ writingMode: 'vertical-rl' }}>Доош гүйлгэх</span>
        <div className="w-[1px] h-12 bg-text-secondary/30 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1/2 bg-text-primary"
            animate={{ top: ['-50%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
