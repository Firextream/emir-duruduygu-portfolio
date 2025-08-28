import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-light mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            Go Home
          </Link>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">
              Portfolio
            </Link>
            <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
