"use client"

interface WeatherProps {
  weatherAtLocation?: {
    location: string
    temperature: number
    description: string
    humidity: number
    windSpeed: number
  }
}

export function Weather({ weatherAtLocation }: WeatherProps) {
  if (!weatherAtLocation) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border p-4">
        <div className="bg-muted h-4 w-32 animate-pulse rounded-md" />
        <div className="bg-muted h-4 w-24 animate-pulse rounded-md" />
      </div>
    )
  }

  const { location, temperature, description, humidity, windSpeed } =
    weatherAtLocation

  return (
    <div className="flex flex-col gap-2 rounded-xl border p-4">
      <div className="text-lg font-medium">{location}</div>
      <div className="flex flex-row gap-4">
        <div>
          <div className="text-muted-foreground text-sm">Temperature</div>
          <div>{temperature}°C</div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">Description</div>
          <div>{description}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">Humidity</div>
          <div>{humidity}%</div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">Wind Speed</div>
          <div>{windSpeed} km/h</div>
        </div>
      </div>
    </div>
  )
}
