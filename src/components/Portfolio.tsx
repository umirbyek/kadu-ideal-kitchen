import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

type ProjectDetail = {
  title: string;
  description: string;
  images: string[];
};

type Project = {
  id: number;
  title: string;
  category: string;
  coverImage: string;
  shortDescription: string;
  details: ProjectDetail[];
};

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from Firestore
  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projData = snapshot.docs.map(doc => {
        const data = doc.data();
        let parsedDetails = [];
        try {
          parsedDetails = typeof data.details === 'string' ? JSON.parse(data.details) : data.details;
        } catch (e) {
          console.error("Error parsing details JSON for project", doc.id);
        }
        
        return {
          id: doc.id as any, // Using string ID from Firestore
          title: data.title,
          category: data.category,
          coverImage: data.coverImage,
          shortDescription: data.shortDescription,
          details: parsedDetails
        };
      });
      setProjects(projData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  if (loading) {
    return <section id="portfolio" className="py-24 md:py-32 bg-bg-secondary relative text-center">Уншиж байна...</section>;
  }

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-bg-secondary relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">
              Төслүүд
            </span>
            <h2 className="text-4xl md:text-5xl font-serif">
              Сүүлийн үеийн <span className="italic text-text-secondary">бүтээлүүд</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {['all', 'interior', 'drawing', 'furniture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm tracking-wider uppercase transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-text-primary text-bg-primary' 
                    : 'border border-text-primary/20 text-text-primary hover:border-text-primary'
                }`}
              >
                {cat === 'all' ? 'Бүгд' : cat === 'interior' ? 'Интериер' : cat === 'drawing' ? 'Ажлын зураг' : 'Тавилга'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-bg-secondary hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full">
                  <p className="text-xs font-medium tracking-wider uppercase text-text-primary">
                    {project.category === 'interior' ? 'Интериер дизайн' : project.category === 'drawing' ? 'Ажлын зураг' : 'Захиалгат тавилга'}
                  </p>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif mb-3">{project.title}</h3>
                <p className="text-text-secondary font-light leading-relaxed mb-8 flex-grow">
                  {project.shortDescription}
                </p>
                
                <button 
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center text-sm font-medium tracking-wider uppercase text-text-primary hover:text-accent transition-colors group/btn w-fit"
                >
                  Дэлгэрэнгүй үзэх
                  <ArrowRight className="ml-2 w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-bg-primary w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-bg-secondary sticky top-0 bg-bg-primary/95 backdrop-blur-md z-10">
                <div>
                  <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-1">
                    {selectedProject.category === 'interior' ? 'Интериер дизайн' : selectedProject.category === 'drawing' ? 'Ажлын зураг' : 'Захиалгат тавилга'}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-serif">{selectedProject.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center hover:bg-text-primary hover:text-white transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto p-6 md:p-8 flex-grow">
                <p className="text-lg text-text-secondary font-light leading-relaxed mb-12 max-w-3xl">
                  {selectedProject.shortDescription}
                </p>

                <div className="space-y-16">
                  {selectedProject.details.map((detail, idx) => (
                    <div key={idx} className="space-y-6">
                      <div className="max-w-2xl">
                        <h4 className="text-2xl font-serif mb-3 flex items-center">
                          <span className="w-8 h-[1px] bg-accent mr-4"></span>
                          {detail.title}
                        </h4>
                        <p className="text-text-secondary font-light leading-relaxed">
                          {detail.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {detail.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="rounded-2xl overflow-hidden bg-bg-secondary aspect-[4/3]">
                            <img 
                              src={img} 
                              alt={`${detail.title} - ${imgIdx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
