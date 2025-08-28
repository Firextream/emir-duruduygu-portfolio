"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw, Clock } from "lucide-react"

export default function ReadTimeManager() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [singlePageId, setSinglePageId] = useState("")
  const [singleLoading, setSingleLoading] = useState(false)
  const [singleResults, setSingleResults] = useState<any>(null)

  const updateAllReadTimes = async () => {
    setLoading(true)
    setResults(null)
    
    try {
      // Static mode: This feature is not available in static export
      setResults({
        success: false,
        error: 'This feature is not available in static export mode',
        details: 'API routes are not supported in static export. Please use the development server for this functionality.'
      })
    } catch (error) {
      setResults({
        success: false,
        error: 'Failed to update read times',
        details: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSingleReadTime = async () => {
    if (!singlePageId.trim()) return
    
    setSingleLoading(true)
    setSingleResults(null)
    
    try {
      // Static mode: This feature is not available in static export
      setSingleResults({
        success: false,
        error: 'This feature is not available in static export mode',
        details: 'API routes are not supported in static export. Please use the development server for this functionality.'
      })
    } catch (error) {
      setSingleResults({
        success: false,
        error: 'Failed to update read time',
        details: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setSingleLoading(false)
    }
  }

  const checkReadTime = async () => {
    if (!singlePageId.trim()) return
    
    setSingleLoading(true)
    setSingleResults(null)
    
    try {
      // Static mode: This feature is not available in static export
      setSingleResults({
        success: false,
        error: 'This feature is not available in static export mode',
        details: 'API routes are not supported in static export. Please use the development server for this functionality.'
      })
    } catch (error) {
      setSingleResults({
        success: false,
        error: 'Failed to check read time',
        details: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setSingleLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog Read Time Manager</h1>
        <p className="text-muted-foreground">
          Automatically calculate and update read times for your Notion blog posts based on content length.
        </p>
      </div>

      <div className="space-y-6">
        {/* Bulk Update Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Update All Blog Posts
            </CardTitle>
            <CardDescription>
              Calculate and update read times for all blog posts in your Notion database.
              Read time is calculated at ~200 words per minute.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={updateAllReadTimes} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Update All Read Times
                </>
              )}
            </Button>

            {results && (
              <div className="mt-4">
                {results.success ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">{results.message}</span>
                    </div>
                    
                    {results.summary && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="font-semibold text-green-600">{results.summary.successCount}</div>
                          <div className="text-green-700">Successful</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="font-semibold text-red-600">{results.summary.errorCount}</div>
                          <div className="text-red-700">Failed</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="font-semibold text-blue-600">{results.summary.total}</div>
                          <div className="text-blue-700">Total</div>
                        </div>
                      </div>
                    )}

                    {results.results && results.results.length > 0 && (
                      <div className="max-h-64 overflow-y-auto">
                        <h4 className="font-medium mb-2">Detailed Results:</h4>
                        <div className="space-y-2">
                          {results.results.map((result: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                              <div className="flex-1">
                                <div className="font-medium">{result.title}</div>
                                <div className="text-muted-foreground">
                                  {result.wordCount} words → {result.readTime} min read
                                </div>
                              </div>
                              <Badge variant={result.success ? "default" : "destructive"}>
                                {result.success ? "Updated" : "Failed"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{results.error}</div>
                      {results.details && (
                        <div className="text-sm text-red-500">{results.details}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Single Post Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Single Post Manager
            </CardTitle>
            <CardDescription>
              Check or update read time for a specific blog post by its Notion page ID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pageId">Notion Page ID</Label>
                <Input
                  id="pageId"
                  placeholder="e.g., 12345678-1234-1234-1234-123456789abc"
                  value={singlePageId}
                  onChange={(e) => setSinglePageId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can find the page ID in the Notion URL after the last slash
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={checkReadTime} 
                  disabled={singleLoading || !singlePageId.trim()}
                  variant="outline"
                >
                  {singleLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Clock className="mr-2 h-4 w-4" />
                  )}
                  Check Current
                </Button>
                
                <Button 
                  onClick={updateSingleReadTime} 
                  disabled={singleLoading || !singlePageId.trim()}
                >
                  {singleLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Update Read Time
                </Button>
              </div>

              {singleResults && (
                <div className="mt-4">
                  {singleResults.success ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">{singleResults.message}</span>
                      </div>
                      
                      {singleResults.data && (
                        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                          <div><strong>Title:</strong> {singleResults.data.title}</div>
                          <div><strong>Word Count:</strong> {singleResults.data.wordCount}</div>
                          {singleResults.data.calculatedReadTime && (
                            <div><strong>Calculated:</strong> {singleResults.data.calculatedReadTime}</div>
                          )}
                          {singleResults.data.currentReadTime && (
                            <div><strong>Current:</strong> {singleResults.data.currentReadTime}</div>
                          )}
                          {singleResults.data.needsUpdate !== undefined && (
                            <Badge variant={singleResults.data.needsUpdate ? "destructive" : "default"}>
                              {singleResults.data.needsUpdate ? "Needs Update" : "Up to Date"}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{singleResults.error}</div>
                        {singleResults.details && (
                          <div className="text-sm text-red-500">{singleResults.details}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>Command Line (Recommended):</strong>
              <code className="block mt-1 p-2 bg-gray-100 rounded">npm run update-read-times</code>
            </div>
            <div>
              <strong>Update Single Post:</strong>
              <code className="block mt-1 p-2 bg-gray-100 rounded">npm run update-single-read-time &lt;page-id&gt;</code>
            </div>
            <div>
              <strong>Automation:</strong> You can set up a webhook or cron job to automatically run the read time update when posts are published.
            </div>
            <div>
              <strong>Reading Speed:</strong> Calculation is based on 200 words per minute (average reading speed).
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
