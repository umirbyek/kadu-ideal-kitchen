export default function Footer() {
  return (
    <footer className="bg-text-primary text-bg-primary py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <a href="#home" className="text-2xl font-serif font-semibold tracking-tight">
            Kadu Ideal Kitchen<span className="text-accent italic">.</span>
          </a>
          <p className="text-bg-secondary/60 text-sm mt-2 font-light">
            Интериер дизайн & Захиалгат тавилга
          </p>
        </div>
        
        <div className="text-center md:text-right text-sm text-bg-secondary/60 font-light flex flex-col items-center md:items-end gap-2">
          <p>&copy; {new Date().getFullYear()} Kadu Ideal Kitchen. Бүх эрх хуулиар хамгаалагдсан.</p>
          <a href="/admin" className="text-xs opacity-50 hover:opacity-100 transition-opacity">Удирдлагын хэсэг</a>
        </div>
      </div>
    </footer>
  );
}
