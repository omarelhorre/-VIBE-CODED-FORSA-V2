import { useAuth } from '../../contexts/AuthContext'

export default function AdminForsaPlusTab() {
  const { user } = useAuth()
  const hospitalName = user?.hospitalName || 'Hospital'

  const plusPlanFeatures = [
    {
      icon: 'fa-bell',
      title: 'Send Notifications to Patients',
      description: 'Keep your patients informed with real-time updates about their appointments, queue status, and important announcements.',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: 'fa-clock',
      title: 'Estimated Remaining Time in Queue',
      description: 'Provide patients with accurate wait time estimates based on current queue length and historical data.',
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: 'fa-brain',
      title: 'AI Prediction When Hospital is Busy',
      description: 'Get intelligent insights about peak hours and busy periods to optimize staffing and resource allocation.',
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-secondary dark:text-gray-200 mb-2">Subscribe to Forsa+</h2>
        <p className="text-text dark:text-gray-300 text-lg">
          Unlock advanced features for <span className="font-semibold text-red-600 dark:text-red-500">{hospitalName}</span>
        </p>
      </div>

      {/* Plus Plan Card */}
      <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-primary/20 dark:border-primary/30 p-8 mb-8 relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          {/* Plan Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-xl">
              <i className="fas fa-star text-white text-4xl"></i>
            </div>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-secondary via-primary to-accent dark:from-primary dark:via-accent dark:to-primary bg-clip-text text-transparent mb-2">
              Forsa+
            </h3>
            <p className="text-text/70 dark:text-gray-400 text-lg">
              Essential features to enhance patient experience
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plusPlanFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 dark:border-gray-700/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <i className={`fas ${feature.icon} ${feature.iconColor} text-2xl`}></i>
                </div>
                <h4 className="text-xl font-bold text-secondary dark:text-gray-200 mb-2">
                  {feature.title}
                </h4>
                <p className="text-text/80 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button className="px-8 py-4 bg-gradient-to-r from-primary via-primary to-accent text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mx-auto">
              <i className="fas fa-rocket"></i>
              <span>Subscribe to Forsa+</span>
            </button>
            <p className="text-sm text-text/60 dark:text-gray-500 mt-4">
              Start your 14-day free trial today
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-2xl p-6 border border-primary/10 dark:border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-info-circle text-primary dark:text-primary text-xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-secondary dark:text-gray-200 mb-2">
              Why Choose Forsa+?
            </h4>
            <p className="text-text/80 dark:text-gray-400 text-sm leading-relaxed">
              Forsa+ Plus helps you improve patient satisfaction by providing real-time updates, 
              accurate wait times, and intelligent insights. All features are designed to streamline 
              hospital operations and enhance the patient experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

