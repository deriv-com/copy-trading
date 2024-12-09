import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="font-heading text-h1 text-secondary-900">
            Welcome to <span className="text-primary-500">Copy Trading</span>
          </h1>
          <p className="text-body text-secondary-600 max-w-2xl mx-auto">
            A modern trading platform built with React, Vite, and Tailwind CSS.
          </p>
        </div>

        {/* Interactive Element */}
        <div className="flex flex-col items-center space-y-4 mt-12">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-accent-500 text-white rounded-lg 
                           hover:bg-accent-600 transition-colors">
              Learn More
            </button>
            <button className="px-4 py-2 border-2 border-primary-500 text-primary-500 
                           rounded-lg hover:bg-primary-50 transition-colors">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
