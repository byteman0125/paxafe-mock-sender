import samplePayloadsData from '../data/sample-payloads.json'

const samplePayloads = samplePayloadsData as {
  payloads: SamplePayload[]
  invalid_payloads: SamplePayload[]
}

export interface SamplePayload {
  name: string
  description: string
  payload: any
}

export const getSamplePayloads = (): SamplePayload[] => {
  return samplePayloads.payloads
}

export const getInvalidPayloads = (): SamplePayload[] => {
  return samplePayloads.invalid_payloads
}

// Generate random payload based on template
export const generateRandomPayload = (template?: any): any => {
  const base = template || getSamplePayloads()[0].payload
  const now = Date.now()
  const randomOffset = Math.floor(Math.random() * 86400000) // Random within 24h
  
  return {
    ...base,
    EntryTimeEpoch: now - randomOffset,
    EntryTimeUtc: new Date(now - randomOffset).toISOString(),
    Temperature: {
      Celsius: Math.round((Math.random() * 30 - 10) * 100) / 100, // -10 to 20°C
      Fahrenheit: null,
    },
    Humidity: {
      Percentage: Math.round((Math.random() * 100) * 10) / 10, // 0-100%
    },
    Battery: {
      Percentage: Math.floor(Math.random() * 100),
      Estimation: ['N/A', 'Days', 'Weeks', 'Months'][Math.floor(Math.random() * 4)],
      IsCharging: Math.random() > 0.8,
    },
    Location: {
      ...base.Location,
      Latitude: (Math.random() * 180 - 90), // -90 to 90
      Longitude: (Math.random() * 360 - 180), // -180 to 180
      Accuracy: {
        Meters: Math.floor(Math.random() * 500),
        Kilometers: null,
        Miles: null,
      },
    },
  }
}

