import { useState, useEffect } from 'react'
import { Thermometer, Droplets, Gauge, Sun, Battery, Camera } from 'lucide-react'

interface SensorData {
  temperature: number
  humidity: number
  pressure: number
  lightIntensity: number
  batteryLevel: number
  batteryVoltage: number
  solarInput: number
  images: string[]
}

const App = () => {
  const [data, setData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    pressure: 0,
    lightIntensity: 0,
    batteryLevel: 0,
    batteryVoltage: 0,
    solarInput: 0,
    images: []
  })

  useEffect(() => {
    // Simulate data fetching from ESP32
    const interval = setInterval(() => {
      setData({
        temperature: Math.random() * 30 + 10,
        humidity: Math.random() * 50 + 30,
        pressure: Math.random() * 30 + 990,
        lightIntensity: Math.random() * 100,
        batteryLevel: Math.random() * 100,
        batteryVoltage: Math.random() * 2 + 3.7,
        solarInput: Math.random() * 20,
        images: Array(6).fill(0).map((_, i) => `https://picsum.photos/seed/drone${i}/300/200`)
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusMessage = () => {
    if (data.temperature > 35) return 'High temperature warning!'
    if (data.humidity < 20) return 'Low humidity alert'
    if (data.batteryLevel < 20) return 'Low battery - please recharge'
    return 'All systems operational'
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Drone Monitoring Dashboard</h1>
        <p className="text-gray-600">Real-time sensor data from your drone</p>
      </header>

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusMessage().includes('warning') ? 'bg-warning' : 'bg-success'}`}></div>
          <p className="font-medium">{getStatusMessage()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SensorCard 
          icon={<Thermometer className="text-danger" />}
          title="Temperature"
          value={`${data.temperature.toFixed(1)}°C`}
          unit=""
          color="danger"
        />
        <SensorCard 
          icon={<Droplets className="text-primary" />}
          title="Humidity"
          value={`${data.humidity.toFixed(1)}%`}
          unit=""
          color="primary"
        />
        <SensorCard 
          icon={<Gauge className="text-secondary" />}
          title="Pressure"
          value={`${data.pressure.toFixed(1)}`}
          unit="hPa"
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <EnergyCard 
          batteryLevel={data.batteryLevel}
          batteryVoltage={data.batteryVoltage}
          solarInput={data.solarInput}
          lightIntensity={data.lightIntensity}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Camera className="text-gray-700" />
          <span>Camera Gallery</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {data.images.map((img, i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
              <img 
                src={img} 
                alt={`Drone capture ${i+1}`}
                className="w-full h-32 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SensorCard = ({ icon, title, value, unit, color }: { 
  icon: React.ReactNode, 
  title: string, 
  value: string, 
  unit: string,
  color: string
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <div className={`p-2 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-gray-500 mb-1">{unit}</span>
      </div>
    </div>
  )
}

const EnergyCard = ({ 
  batteryLevel, 
  batteryVoltage, 
  solarInput,
  lightIntensity
}: { 
  batteryLevel: number, 
  batteryVoltage: number,
  solarInput: number,
  lightIntensity: number
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="text-lg font-medium text-gray-700 mb-6 flex items-center gap-2">
        <Sun className="text-warning" />
        <span>Energy Monitoring</span>
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Battery Level</span>
            <span className="text-sm font-medium">{batteryLevel.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${batteryLevel < 20 ? 'bg-danger' : 'bg-success'}`} 
              style={{ width: `${batteryLevel}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Voltage</p>
            <p className="font-bold">{batteryVoltage.toFixed(2)}V</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Solar Input</p>
            <p className="font-bold">{solarInput.toFixed(2)}W</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium flex items-center gap-1">
              <Sun className="w-4 h-4" />
              Light Intensity
            </span>
            <span className="text-sm font-medium">{lightIntensity.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full bg-warning" 
              style={{ width: `${lightIntensity}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
