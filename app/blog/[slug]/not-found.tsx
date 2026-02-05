import Link from "next/link"
import { ArrowLeft, FileX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <div className="mb-8">
          <FileX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-4xl font-light mb-4">Article Not Found</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The article you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/blog" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
