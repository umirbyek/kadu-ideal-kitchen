import { motion } from 'motion/react';
import { PenTool, Hammer, Ruler } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <PenTool className="w-8 h-8 stroke-1" />,
      title: "Интериер Дизайн",
      description: "Орон зайн зөв төлөвлөлт, өнгөний зохицол, гэрэлтүүлгийн шийдэл бүхий цогц дизайны концепц гаргана."
    },
    {
      icon: <Ruler className="w-8 h-8 stroke-1" />,
      title: "Ажлын Зураг",
      description: "Засвар засал, тавилга үйлдвэрлэлд зориулсан хэмжээст, нарийвчилсан, алдаагүй ажлын зураг боловсруулна."
    },
    {
      icon: <Hammer className="w-8 h-8 stroke-1" />,
      title: "Захиалгат Тавилга",
      description: "Дизайны дагуу, чанартай материал ашиглан, орон зайд тань төгс нийцэх тавилгыг өөрийн гараар урлана."
    }
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">
            Юу хийдэг вэ?
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Үйлчилгээний <span className="italic text-text-secondary">чиглэл</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group p-8 border border-bg-secondary hover:border-accent/30 rounded-2xl transition-all duration-500 hover:shadow-xl hover:shadow-accent/5 bg-white"
            >
              <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center text-text-primary mb-8 group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                {service.icon}
              </div>
              <h3 className="text-xl font-serif mb-4">{service.title}</h3>
              <p className="text-text-secondary font-light leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
