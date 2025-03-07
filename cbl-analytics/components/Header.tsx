'use client';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'CBL Analytics' }) => {
  return (
    <div className="header w-full mb-6 p-5 md:p-8 bg-[var(--card-bg)] rounded-2xl shadow-[var(--shadow)] flex justify-between items-center border border-[var(--border-color)] max-w-[1920px] mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--primary-gradient)]"></div>
      
      <div className="header-brand flex items-center gap-2.5">
        <h1 className="text-2xl font-bold bg-[var(--primary-gradient)] bg-clip-text text-transparent">{title}</h1>
      </div>
      
      <div className="header-actions flex gap-2">
        <button 
          className="btn"
          onClick={() => alert('Export functionality would be implemented here')}
        >
          Export
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => alert('Settings functionality would be implemented here')}
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default Header;