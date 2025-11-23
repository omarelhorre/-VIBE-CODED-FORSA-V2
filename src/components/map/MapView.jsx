import { useState } from 'react'

export default function MapView() {
  // Mock nearby hospitals with coordinates
  const hospitals = [
    {
      id: 'saniat-rmel',
      name: 'Saniat Rmel Hospital',
      address: 'Tetouan, Morocco',
      phone: '+212 539-XXXXXX',
      coordinates: [35.5889, -5.3626],
      isMain: false,
      color: '#4CAF50', // Primary green
      googleMapsLink: 'https://maps.app.goo.gl/UafjWqdfhsu7nZns8',
    },
    {
      id: 'mohammed-6',
      name: 'Tetouan Medical center',
      address: 'Tetouan, Morocco',
      phone: '+212 539-XXXXXX',
      coordinates: [35.5723, -5.3701],
      isMain: false,
      color: '#43A047', // Accent green
      googleMapsLink: 'https://maps.app.goo.gl/DXSCQ9whzVeokBy27',
    },
    {
      id: 'ibn-sina',
      name: 'Ibn Sina Hospital',
      address: 'Tetouan, Morocco',
      phone: '+212 539-XXXXXX',
      coordinates: [35.5950, -5.3550],
      isMain: false,
      color: '#66BB6A', // Light green
      googleMapsLink: 'https://maps.app.goo.gl/example',
    },
    {
      id: 'al-andalus',
      name: 'Al Andalus Clinic',
      address: 'Tetouan, Morocco',
      phone: '+212 539-XXXXXX',
      coordinates: [35.5800, -5.3750],
      isMain: false,
      color: '#81C784', // Lighter green
      googleMapsLink: 'https://maps.app.goo.gl/example',
    },
  ]

  // No hospital selected by default
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [particleColor, setParticleColor] = useState('#4CAF50') // Default primary color

  const handleHospitalClick = (hospital) => {
    setIsTransitioning(true)
    setParticleColor(hospital.color)
    
    setTimeout(() => {
      setSelectedHospital(hospital)
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background dark:bg-gray-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary dark:text-gray-200 mb-2">Hospital Locations</h1>
          <p className="text-text dark:text-gray-300 text-lg">Find hospitals and medical facilities in your area</p>
        </div>

        {/* Static Map Image with Modern Design */}
        {selectedHospital ? (
          <div 
            className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 mb-8 backdrop-blur-sm transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${particleColor}15, ${particleColor}08)`,
              boxShadow: `0 20px 60px ${particleColor}20`,
            }}
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl dark:shadow-2xl p-6 border border-white/20 dark:border-gray-700/50 transform transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center justify-center mb-6">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-12"
                  style={{
                    background: `linear-gradient(135deg, ${particleColor}, ${particleColor}CC)`,
                    boxShadow: `0 10px 30px ${particleColor}40`,
                  }}
                >
                  <i className="fas fa-map-marker-alt text-white text-4xl"></i>
                </div>
              </div>
              <div className="text-center">
                <h2 
                  className="text-2xl font-bold mb-2 transition-colors duration-500"
                  style={{ color: particleColor }}
                >
                  {selectedHospital.name}
                </h2>
                <p className="text-text dark:text-gray-300 mb-4">{selectedHospital.address}</p>
                <p 
                  className="font-semibold transition-colors duration-500 mb-4"
                  style={{ color: particleColor }}
                >
                  Coordinates: {Math.abs(selectedHospital.coordinates[0]).toFixed(4)}° {selectedHospital.coordinates[0] >= 0 ? 'N' : 'S'}, {Math.abs(selectedHospital.coordinates[1]).toFixed(4)}° {selectedHospital.coordinates[1] >= 0 ? 'E' : 'W'}
                </p>
                {selectedHospital.googleMapsLink && (
                  <a
                    href={selectedHospital.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Take me there</span>
                    <i className="fas fa-external-link-alt text-sm"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl dark:shadow-2xl p-6 border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center shadow-lg">
                  <i className="fas fa-map-marker-alt text-primary dark:text-primary text-4xl"></i>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 mb-2">Select a Hospital</h2>
                <p className="text-text dark:text-gray-300">Click on any hospital card below to view its details</p>
              </div>
            </div>
          </div>
        )}

        {/* Hospital Cards - Modern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {hospitals.map((hospital) => {
            const isSelected = selectedHospital?.id === hospital.id
            return (
              <div
                key={hospital.id}
                onClick={() => handleHospitalClick(hospital)}
                className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform ${
                  isSelected
                    ? 'scale-105 ring-4 z-10'
                    : 'hover:scale-[1.02]'
                } ${
                  hospital.isMain
                    ? 'bg-gradient-to-br from-primary to-accent text-white'
                    : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm'
                }`}
                style={{
                  boxShadow: isSelected 
                    ? `0 20px 60px ${hospital.color}40, 0 0 0 4px ${hospital.color}60`
                    : undefined,
                  border: isSelected ? `4px solid ${hospital.color}60` : undefined,
                }}
              >
                {/* Animated background gradient on selection */}
                {isSelected && (
                  <div 
                    className="absolute inset-0 opacity-20 animate-pulse"
                    style={{
                      background: `radial-gradient(circle at center, ${hospital.color}, transparent)`,
                    }}
                  />
                )}
                
                {/* Particle burst effect on click */}
                {isSelected && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${hospital.color}20, transparent 70%)`,
                      animation: 'particleBurst 0.6s ease-out',
                    }}
                  />
                )}

                <div className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-500 ${
                          hospital.isMain ? 'bg-white/20' : 'bg-primary/10'
                        }`}
                        style={{
                          background: isSelected && !hospital.isMain 
                            ? `${hospital.color}20` 
                            : undefined,
                          transform: isSelected ? 'scale(1.1) rotate(5deg)' : undefined,
                        }}
                      >
                        <i 
                          className={`fas fa-hospital text-2xl transition-colors duration-500 ${
                            hospital.isMain ? 'text-white' : 'text-primary'
                          }`}
                          style={{
                            color: isSelected && !hospital.isMain ? hospital.color : undefined,
                          }}
                        ></i>
                      </div>
                      <h3 
                        className={`text-xl font-bold mb-2 transition-colors duration-500 ${
                          hospital.isMain ? 'text-white' : 'text-secondary'
                        }`}
                        style={{
                          color: isSelected && !hospital.isMain ? hospital.color : undefined,
                        }}
                      >
                        {hospital.name}
                      </h3>
                      {hospital.isMain && (
                        <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm rounded-full font-semibold mb-3">
                          Main Location
                        </span>
                      )}
                      {isSelected && !hospital.isMain && (
                        <span 
                          className="inline-block px-3 py-1 text-white text-sm rounded-full font-semibold mb-3 animate-fade-in"
                          style={{ backgroundColor: hospital.color }}
                        >
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`space-y-2 ${
                    hospital.isMain ? 'text-white/90' : 'text-text dark:text-gray-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <i 
                        className={`fas fa-map-marker-alt text-lg transition-colors duration-500 ${
                          hospital.isMain ? 'text-white/90' : 'text-primary'
                        }`}
                        style={{
                          color: isSelected && !hospital.isMain ? hospital.color : undefined,
                        }}
                      ></i>
                      <span className="text-sm">{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i 
                        className={`fas fa-phone text-lg transition-colors duration-500 ${
                          hospital.isMain ? 'text-white/90' : 'text-primary'
                        }`}
                        style={{
                          color: isSelected && !hospital.isMain ? hospital.color : undefined,
                        }}
                      ></i>
                      <span className="text-sm">{hospital.phone}</span>
                    </div>
                    {hospital.googleMapsLink && (
                      <a
                        href={hospital.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                          hospital.isMain 
                            ? 'bg-white/20 hover:bg-white/30 text-white' 
                            : 'bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 text-primary'
                        }`}
                        style={{
                          background: isSelected && !hospital.isMain 
                            ? `${hospital.color}20` 
                            : undefined,
                          color: isSelected && !hospital.isMain ? hospital.color : undefined,
                        }}
                      >
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Take me there</span>
                        <i className="fas fa-external-link-alt text-xs"></i>
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                {!hospital.isMain && !isSelected && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${hospital.color}10, transparent)`,
                    }}
                  />
                )}

                {/* Shine effect on selection */}
                {isSelected && (
                  <div 
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    style={{
                      background: `linear-gradient(45deg, transparent 30%, ${hospital.color}20 50%, transparent 70%)`,
                      animation: 'shine 2s infinite',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

