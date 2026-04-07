import { useState, useEffect, FormEvent, useRef } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { X, Plus, Upload, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

type DetailSection = {
  title: string;
  description: string;
  existingImages: string[];
  newImages: File[];
};

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('interior');
  const [shortDescription, setShortDescription] = useState('');
  
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  
  const [details, setDetails] = useState<DetailSection[]>([
    { title: '', description: '', existingImages: [], newImages: [] }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projData);
    }, (error) => {
      console.error("Error fetching projects:", error);
    });
    
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId('');
    setTitle('');
    setCategory('interior');
    setShortDescription('');
    setCoverImageFile(null);
    setCoverImageUrl('');
    setDetails([{ title: '', description: '', existingImages: [], newImages: [] }]);
  };

  const handleEdit = (project: any) => {
    setIsEditing(true);
    setCurrentId(project.id);
    setTitle(project.title);
    setCategory(project.category);
    setShortDescription(project.shortDescription);
    setCoverImageUrl(project.coverImage);
    setCoverImageFile(null);
    
    let parsedDetails = [];
    try {
      parsedDetails = typeof project.details === 'string' ? JSON.parse(project.details) : project.details;
    } catch (e) {
      parsedDetails = [];
    }
    
    setDetails(parsedDetails.map((d: any) => ({
      title: d.title || '',
      description: d.description || '',
      existingImages: d.images || [],
      newImages: []
    })));
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteDoc(doc(db, 'projects', projectToDelete));
      setMessage({ type: 'success', text: 'Амжилттай устгагдлаа' });
    } catch (error) {
      console.error("Error deleting:", error);
      setMessage({ type: 'error', text: 'Устгахад алдаа гарлаа' });
    }
    setProjectToDelete(null);
  };

  const uploadImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const cancelUpload = () => {
    setIsUploading(false);
    setMessage({ type: 'error', text: 'Зураг хуулах үйлдэл цуцлагдлаа' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coverImageUrl && !coverImageFile) {
      setMessage({ type: 'error', text: 'Гаднах нүүр зураг оруулна уу!' });
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload Cover Image if new
      let finalCoverUrl = coverImageUrl;
      if (coverImageFile) {
        if (coverImageFile.size > 1048576) {
          setMessage({ type: 'error', text: 'Нүүр зураг хэтэрхий том байна (1MB-аас бага байх ёстой).' });
          setIsUploading(false);
          return;
        }
        finalCoverUrl = await uploadImage(coverImageFile);
      }

      // 2. Upload Detail Images
      const finalDetails = await Promise.all(details.map(async (detail, index) => {
        const uploadedUrls = await Promise.all(detail.newImages.map(async (file) => {
           if (file.size > 1048576) {
              throw new Error("Failed to convert: Зургийн хэмжээ хэт том байна (1MB-аас бага байх ёстой).");
           }
           return uploadImage(file);
        }));
        return {
          title: detail.title,
          description: detail.description,
          images: [...detail.existingImages, ...uploadedUrls]
        };
      }));

      const projectData = {
        title,
        category,
        coverImage: finalCoverUrl,
        shortDescription,
        details: JSON.stringify(finalDetails),
        createdAt: isEditing ? undefined : new Date() // Keep original date if editing
      };

      if (isEditing) {
        // Remove undefined fields for update
        const updateData = { ...projectData };
        if (!updateData.createdAt) delete updateData.createdAt;
        
        await updateDoc(doc(db, 'projects', currentId), updateData);
        setMessage({ type: 'success', text: 'Амжилттай шинэчлэгдлээ' });
      } else {
        await addDoc(collection(db, 'projects'), projectData);
        setMessage({ type: 'success', text: 'Амжилттай нэмэгдлээ' });
      }
      resetForm();
    } catch (error: any) {
      console.error("Error saving:", error);
      if (error.message && error.message.includes('Failed to convert')) {
         setMessage({ type: 'error', text: 'Зургийг хөрвүүлэхэд алдаа гарлаа.' });
      } else {
        setMessage({ type: 'error', text: 'Хадгалахад алдаа гарлаа. Зургийн хэмжээ хэт том байж магадгүй.' });
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Detail section handlers
  const addDetailSection = () => {
    setDetails([...details, { title: '', description: '', existingImages: [], newImages: [] }]);
  };

  const removeDetailSection = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const updateDetail = (index: number, field: keyof DetailSection, value: any) => {
    const newDetails = [...details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setDetails(newDetails);
  };

  const handleDetailImagesChange = (index: number, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const newDetails = [...details];
    newDetails[index].newImages = [...newDetails[index].newImages, ...fileArray];
    setDetails(newDetails);
  };

  const removeExistingImage = (sectionIndex: number, imageIndex: number) => {
    const newDetails = [...details];
    newDetails[sectionIndex].existingImages = newDetails[sectionIndex].existingImages.filter((_, i) => i !== imageIndex);
    setDetails(newDetails);
  };

  const removeNewImage = (sectionIndex: number, imageIndex: number) => {
    const newDetails = [...details];
    newDetails[sectionIndex].newImages = newDetails[sectionIndex].newImages.filter((_, i) => i !== imageIndex);
    setDetails(newDetails);
  };

  if (loading) return <div className="p-8 text-center">Уншиж байна...</div>;

  const ADMIN_EMAILS = ['umirbyek0731@gmail.com', 'kadu0126@gmail.com'];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-serif mb-6">Удирдлагын хэсэг</h1>
          <p className="text-text-secondary mb-8">Зөвхөн админ нэвтрэх боломжтой.</p>
          <button 
            onClick={handleLogin}
            className="w-full py-3 bg-text-primary text-bg-primary rounded-full hover:bg-accent transition-colors"
          >
            Google-ээр нэвтрэх
          </button>
        </div>
      </div>
    );
  }

  if (!ADMIN_EMAILS.includes(user.email || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-serif mb-6">Хандах эрхгүй</h1>
          <p className="text-text-secondary mb-8">Таны <b>{user.email}</b> хаяг админ эрхгүй байна.</p>
          <button 
            onClick={handleLogout}
            className="w-full py-3 border border-text-primary text-text-primary rounded-full hover:bg-bg-secondary transition-colors"
          >
            Гарах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary p-6 md:p-12 relative">
      {/* Toast Message */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg text-white animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{message.text}</p>
          <button type="button" onClick={() => setMessage(null)} className="ml-4 hover:opacity-70"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-serif mb-2">Төсөл устгах</h3>
            <p className="text-text-secondary text-sm mb-6">Та энэ төслийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setProjectToDelete(null)} className="flex-1 py-2 border border-bg-secondary rounded-lg hover:bg-bg-secondary transition-colors">Болих</button>
              <button type="button" onClick={confirmDelete} className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Устгах</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-serif">Төсөл удирдах</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary hidden md:block">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-text-primary/20 rounded-full text-sm hover:bg-text-primary hover:text-white transition-colors"
            >
              Гарах
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm h-fit">
            <h2 className="text-2xl font-serif mb-8">{isEditing ? 'Төсөл засах' : 'Шинэ төсөл нэмэх'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">Гарчиг</label>
                  <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border-b border-bg-secondary py-2 focus:outline-none focus:border-text-primary transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">Ангилал</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border-b border-bg-secondary py-2 focus:outline-none focus:border-text-primary transition-colors bg-transparent">
                    <option value="interior">Интериер</option>
                    <option value="drawing">Ажлын зураг</option>
                    <option value="furniture">Тавилга</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">Гаднах нүүр зураг</label>
                <div className="flex items-center gap-4">
                  {coverImageUrl && !coverImageFile && (
                    <img src={coverImageUrl} alt="Cover" className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setCoverImageFile(e.target.files?.[0] || null)} 
                    className="text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-bg-secondary file:text-text-primary hover:file:bg-accent hover:file:text-white transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">Товч тайлбар</label>
                <textarea required value={shortDescription} onChange={e => setShortDescription(e.target.value)} className="w-full border border-bg-secondary rounded-xl p-4 focus:outline-none focus:border-text-primary transition-colors resize-none" rows={3}></textarea>
              </div>

              <div className="border-t border-bg-secondary pt-8 mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-serif">Дэлгэрэнгүй хэсгүүд</h3>
                  <button type="button" onClick={addDetailSection} className="flex items-center text-sm text-accent hover:text-text-primary transition-colors">
                    <Plus className="w-4 h-4 mr-1" /> Хэсэг нэмэх
                  </button>
                </div>

                <div className="space-y-8">
                  {details.map((detail, index) => (
                    <div key={index} className="bg-bg-secondary/30 p-6 rounded-2xl relative border border-bg-secondary">
                      <button type="button" onClick={() => removeDetailSection(index)} className="absolute top-4 right-4 text-text-secondary hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="space-y-4 mb-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-text-secondary mb-1">Хэсгийн нэр (Жишээ: Гал тогоо)</label>
                          <input required type="text" value={detail.title} onChange={e => updateDetail(index, 'title', e.target.value)} className="w-full border-b border-bg-secondary py-2 bg-transparent focus:outline-none focus:border-text-primary" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-text-secondary mb-1">Тайлбар</label>
                          <textarea required value={detail.description} onChange={e => updateDetail(index, 'description', e.target.value)} className="w-full border border-bg-secondary rounded-lg p-3 bg-transparent focus:outline-none focus:border-text-primary resize-none" rows={2}></textarea>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">Зургууд оруулах</label>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={e => handleDetailImagesChange(index, e.target.files)}
                          className="text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-white file:text-text-primary hover:file:bg-accent hover:file:text-white transition-colors mb-4" 
                        />
                        
                        <div className="flex flex-wrap gap-2">
                          {/* Existing Images */}
                          {detail.existingImages.map((img, imgIdx) => (
                            <div key={`ext-${imgIdx}`} className="relative group w-20 h-20">
                              <img src={img} alt="Existing" className="w-full h-full object-cover rounded-lg" />
                              <button type="button" onClick={() => removeExistingImage(index, imgIdx)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <X className="w-5 h-5 text-white" />
                              </button>
                            </div>
                          ))}
                          {/* New Images */}
                          {detail.newImages.map((file, fileIdx) => (
                            <div key={`new-${fileIdx}`} className="relative group w-20 h-20">
                              <img src={URL.createObjectURL(file)} alt="New" className="w-full h-full object-cover rounded-lg border-2 border-accent" />
                              <button type="button" onClick={() => removeNewImage(index, fileIdx)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <X className="w-5 h-5 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                {isUploading ? (
                  <div className="flex-1 flex gap-4">
                    <button type="button" disabled className="flex-1 py-4 bg-text-primary/50 text-bg-primary rounded-full font-medium tracking-wide flex justify-center items-center">
                      <Upload className="w-4 h-4 mr-2 animate-bounce" /> Хуулж байна...
                    </button>
                    <button type="button" onClick={cancelUpload} className="px-8 py-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium tracking-wide">
                      Цуцлах
                    </button>
                  </div>
                ) : (
                  <button type="submit" className="flex-1 py-4 bg-text-primary text-bg-primary rounded-full hover:bg-accent transition-colors font-medium tracking-wide flex justify-center items-center">
                    {isEditing ? 'Өөрчлөлтийг хадгалах' : 'Төсөл нийтлэх'}
                  </button>
                )}
                {!isUploading && isEditing && (
                  <button type="button" onClick={resetForm} className="px-8 py-4 border border-text-primary/20 rounded-full hover:border-text-primary transition-colors font-medium tracking-wide">
                    Болих
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm h-fit">
            <h2 className="text-2xl font-serif mb-8">Нийтлэгдсэн төслүүд</h2>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="group border border-bg-secondary p-4 rounded-2xl flex gap-4 hover:border-accent/30 transition-colors">
                  <img src={project.coverImage} alt={project.title} className="w-24 h-24 object-cover rounded-xl" />
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-serif font-medium text-lg">{project.title}</h3>
                    <p className="text-xs tracking-wider uppercase text-text-secondary mt-1">{project.category}</p>
                    <div className="flex gap-4 mt-auto">
                      <button onClick={() => handleEdit(project)} className="text-sm font-medium text-accent hover:text-text-primary transition-colors">Засах</button>
                      <button onClick={() => handleDeleteClick(project.id)} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">Устгах</button>
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-12 text-text-secondary font-light">
                  Одоогоор төсөл байхгүй байна.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

