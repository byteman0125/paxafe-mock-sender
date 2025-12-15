'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getSamplePayloads, generateRandomPayload, type SamplePayload } from '@/lib/payloads'
import { CheckCircle2, XCircle, Loader2, Send, RefreshCw, Eye, EyeOff } from 'lucide-react'

interface RequestHistory {
  id: string
  timestamp: Date
  success: boolean
  response?: any
  error?: string
  payload: any
}

export default function Home() {
  const [apiUrl, setApiUrl] = useState('http://localhost:3000/api/webhook/tive')
  const [apiKey, setApiKey] = useState('')
  const [payload, setPayload] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<RequestHistory[]>([])
  const [showRawData, setShowRawData] = useState<Record<string, boolean>>({})
  const [lastResponse, setLastResponse] = useState<any>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  const samplePayloads = getSamplePayloads()

  const loadSamplePayload = (sample: SamplePayload) => {
    setPayload(JSON.stringify(sample.payload, null, 2))
    setLastResponse(null)
    setLastError(null)
  }

  const generateRandom = () => {
    try {
      const currentPayload = payload ? JSON.parse(payload) : null
      const random = generateRandomPayload(currentPayload)
      setPayload(JSON.stringify(random, null, 2))
      setLastResponse(null)
      setLastError(null)
    } catch (error) {
      setLastError('Invalid JSON in payload editor')
    }
  }

  const sendPayload = async () => {
    if (!apiUrl || !apiKey) {
      setLastError('Please provide both API URL and API Key')
      return
    }

    let parsedPayload: any
    try {
      parsedPayload = JSON.parse(payload)
    } catch (error) {
      setLastError('Invalid JSON payload')
      return
    }

    setLoading(true)
    setLastError(null)
    setLastResponse(null)

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(parsedPayload),
      })

      const data = await response.json()
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        success: response.ok,
        response: data,
        payload: parsedPayload,
      }

      if (!response.ok) {
        historyItem.error = data.message || 'Request failed'
        setLastError(data.message || `Error: ${response.status} ${response.statusText}`)
      } else {
        setLastResponse(data)
      }

      setHistory([historyItem, ...history])
    } catch (error: any) {
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        success: false,
        error: error.message,
        payload: parsedPayload,
      }
      setHistory([historyItem, ...history])
      setLastError(error.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const toggleRawData = (id: string) => {
    setShowRawData(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">PAXAFE Mock Tive Sender</h1>
          <p className="text-gray-600">Generate and send test Tive payloads to your Integration API</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Configuration & Payload */}
          <div className="space-y-6">
            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Set your Integration API endpoint and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    API URL
                  </label>
                  <Input
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://your-api.vercel.app/api/webhook/tive"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    API Key
                  </label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Your API key"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sample Payloads */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Payloads</CardTitle>
                <CardDescription>Load pre-configured test payloads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {samplePayloads.map((sample, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => loadSamplePayload(sample)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{sample.name}</div>
                        <div className="text-xs text-gray-500">{sample.description}</div>
                      </div>
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={generateRandom}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Random Payload
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payload Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Payload Editor</CardTitle>
                <CardDescription>Edit the JSON payload before sending</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  placeholder="Paste or edit JSON payload here..."
                  className="font-mono text-sm min-h-[400px]"
                />
              </CardContent>
            </Card>

            {/* Send Button */}
            <Button
              onClick={sendPayload}
              disabled={loading || !payload || !apiUrl || !apiKey}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Payload
                </>
              )}
            </Button>

            {/* Response/Error Display */}
            {lastError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{lastError}</AlertDescription>
              </Alert>
            )}

            {lastResponse && (
              <Alert variant="success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(lastResponse, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Column: History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Request History</CardTitle>
                <CardDescription>View previous requests and responses</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No requests yet. Send a payload to see history.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[800px] overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 space-y-2 bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.success ? (
                              <Badge variant="success">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Success
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {item.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRawData(item.id)}
                          >
                            {showRawData[item.id] ? (
                              <>
                                <EyeOff className="w-3 h-3 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3 mr-1" />
                                Show Raw
                              </>
                            )}
                          </Button>
                        </div>

                        {item.error && (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {item.error}
                          </div>
                        )}

                        {item.response && (
                          <div className="text-sm bg-gray-50 p-2 rounded">
                            <div className="font-medium mb-1">Response:</div>
                            <pre className="text-xs overflow-auto">
                              {JSON.stringify(item.response, null, 2)}
                            </pre>
                          </div>
                        )}

                        {showRawData[item.id] && (
                          <div className="text-sm bg-blue-50 p-2 rounded">
                            <div className="font-medium mb-1">Payload:</div>
                            <pre className="text-xs overflow-auto">
                              {JSON.stringify(item.payload, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

