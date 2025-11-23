import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-primary via-primary to-accent dark:from-gray-700 dark:to-gray-800 rounded-full shadow-2xl hover:shadow-primary/50 dark:hover:shadow-gray-600/50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/20 dark:border-gray-600/30 backdrop-blur-sm group"
      aria-label="Toggle theme"
    >
      {/* Moon Icon for Dark Mode */}
      {theme === 'light' ? (
        <i className="fas fa-moon text-white text-xl group-hover:rotate-12 transition-transform duration-300"></i>
      ) : (
        <i className="fas fa-sun text-yellow-300 text-xl group-hover:rotate-180 transition-transform duration-500"></i>
      )}
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-primary/20 dark:bg-gray-600/20 blur-xl group-hover:bg-primary/30 dark:group-hover:bg-gray-600/30 transition-all duration-300"></div>
    </button>
  )
}

