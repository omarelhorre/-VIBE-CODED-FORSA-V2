import { Link } from 'react-router-dom'

export default function HospitalCard({ hospital }) {
  return (
    <Link
      to={`/hospital/${hospital.id}`}
      className="group block bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-md rounded-3xl shadow-xl dark:shadow-2xl p-8 border border-primary/20 dark:border-gray-700/50 hover:shadow-2xl hover:scale-[1.02] hover:border-primary/40 dark:hover:border-primary/50 transition-all duration-300 ease-out relative overflow-hidden"
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
      <div className="flex items-center justify-center mb-6">
          <div className="relative w-28 h-28 group-hover:scale-110 transition-all duration-300">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            {/* Main icon container */}
            <div className="relative w-28 h-28 bg-gradient-to-br from-primary via-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-primary/50 group-hover:rotate-3 transition-all duration-300 border-2 border-white/20 dark:border-gray-700/30">
              <i className="fas fa-hospital text-white text-5xl drop-shadow-lg"></i>
            </div>
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-3xl border-2 border-primary/30 group-hover:border-primary/60 animate-pulse"></div>
          </div>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary dark:from-primary dark:to-accent bg-clip-text text-transparent mb-3 text-center group-hover:scale-105 transition-transform duration-300">
        {hospital.name}
      </h3>
        <p className="text-text/80 dark:text-gray-300 text-center mb-6 font-medium">{hospital.location}</p>
      <div className="flex items-center justify-center">
          <span className="px-6 py-3 bg-gradient-to-r from-primary/15 to-accent/15 dark:from-primary/20 dark:to-accent/20 text-primary dark:text-primary rounded-xl font-semibold text-sm border border-primary/20 dark:border-primary/30 group-hover:from-primary/25 group-hover:to-accent/25 dark:group-hover:from-primary/30 dark:group-hover:to-accent/30 group-hover:border-primary/40 dark:group-hover:border-primary/50 transition-all duration-300 flex items-center gap-2">
            View Details
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </span>
        </div>
      </div>
    </Link>
  )
}

