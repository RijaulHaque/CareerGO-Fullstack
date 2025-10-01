// filepath: frontend/src/components/Header.tsx

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white shadow-xl/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo - REPLACED WITH IMAGE */}
        <div className="flex items-center space-x-2">
            <img 
                src="/CareerGO_logo.jpg" // Referenced directly from the public folder root
                alt="CareerGO Logo"
                className="h-8 w-auto rounded-full" // Set height and rounded-full for styling
            />
            <span className="text-2xl font-extrabold text-gray-800">
                Career<span className="text-purple-600">GO</span>
            </span>
        </div>

        {/* Navigation Links remain the same */}
        <nav className="hidden lg:flex space-x-8 text-gray-600 font-medium">
          <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#career-form" className="hover:text-blue-600 transition-colors">Roadmap</a>
        </nav>

        {/* Authentication Buttons remain the same */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => alert('Login functionality coming soon!')}
            className="px-5 py-2 text-sm font-semibold border border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => alert('Signup functionality coming soon!')}
            className="px-5 py-2 text-sm font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors shadow-md"
          >
            Signup
          </button>
        </div>
      </div>
    </header>
  );
};