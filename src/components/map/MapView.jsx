export default function MapView() {
  // Saniat Rmel Hospital coordinates (Tetouan, Morocco)
  const saniatRmel = [35.5889, -5.3626]

  // Mock nearby hospitals
  const hospitals = [
    {
      id: 1,
      name: 'Saniat Rmel Hospital',
      address: 'Tetouan, Morocco',
      phone: '+212 539-XXXXXX',
      isMain: true,
    },
    {
      id: 2,
      name: 'Tetouan Medical Center',
      address: 'Tetouan, Morocco',
      phone: '+212 539-XXXXXX',
      isMain: false,
    },
    {
      id: 3,
      name: 'Ibn Sina Hospital',
      address: 'Tetouan, Morocco',
      phone: '+212 539-XXXXXX',
      isMain: false,
    },
    {
      id: 4,
      name: 'Al Andalus Clinic',
      address: 'Tetouan, Morocco',
      phone: '+212 539-XXXXXX',
      isMain: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2">Hospital Locations</h1>
          <p className="text-text text-lg">Find Saniat Rmel Hospital and nearby medical facilities</p>
        </div>

        {/* Static Map Image with Modern Design */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-4xl">📍</span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-secondary mb-2">Saniat Rmel Hospital</h2>
              <p className="text-text mb-4">Tetouan, Morocco</p>
              <p className="text-primary font-semibold">Coordinates: 35.5889° N, 5.3626° W</p>
            </div>
          </div>
        </div>

        {/* Hospital Cards - Modern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                hospital.isMain
                  ? 'bg-gradient-to-br from-primary to-accent text-white'
                  : 'bg-white'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      hospital.isMain ? 'bg-white/20' : 'bg-primary/10'
                    }`}>
                      <span className="text-2xl">🏥</span>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      hospital.isMain ? 'text-white' : 'text-secondary'
                    }`}>
                      {hospital.name}
                    </h3>
                    {hospital.isMain && (
                      <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm rounded-full font-semibold mb-3">
                        Main Location
                      </span>
                    )}
                  </div>
                </div>
                <div className={`space-y-2 ${
                  hospital.isMain ? 'text-white/90' : 'text-text'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <span className="text-sm">{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    <span className="text-sm">{hospital.phone}</span>
                  </div>
                </div>
              </div>
              {!hospital.isMain && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

