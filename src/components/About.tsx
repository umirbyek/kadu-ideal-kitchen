import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-t-full rounded-b-full overflow-hidden relative z-10">
              <img
                src="https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=1000&auto=format&fit=crop"
                alt="Portrait of the designer"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full border border-accent/30 -z-0"></div>
            <div className="absolute top-1/4 -left-8 w-24 h-24 rounded-full bg-accent/10 -z-0"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-8">
              Миний <span className="italic text-accent">тухай</span>
            </h2>
            <div className="space-y-6 text-text-secondary font-light leading-relaxed">
              <p>
                Сайн байна уу? Намайг [Таны Нэр] гэдэг. Би интериер дизайны чиглэлээр мэргэшсэн бөгөөд орон зайн төлөвлөлт, ажлын зураг гаргах, мөн захиалгат тавилга үйлдвэрлэлийн чиглэлээр ажилладаг.
              </p>
              <p>
                Хүн бүрийн амьдралын хэв маяг, онцлогт тохирсон, тав тухтай, гоо зүйн өндөр мэдрэмжтэй орчныг бүрдүүлэхийг зорьдог. Зөвхөн үзэмжтэй байхаас гадна, хэрэглээнд бүрэн нийцсэн, чанартай тавилгыг өөрийн гараар урлан бүтээдэг нь миний давуу тал юм.
              </p>
              <p>
                Санааг тань бодит болгох нарийвчилсан ажлын зургаас эхлээд, эцсийн гүйцэтгэл хүртэлх бүх шатанд сэтгэл гарган ажиллана.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-4xl font-serif text-text-primary mb-2">5+</h4>
                <p className="text-sm tracking-wider uppercase text-text-secondary">Жилийн туршлага</p>
              </div>
              <div>
                <h4 className="text-4xl font-serif text-text-primary mb-2">50+</h4>
                <p className="text-sm tracking-wider uppercase text-text-secondary">Амжилттай төсөл</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
