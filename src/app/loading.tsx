export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[50vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo/20 border-t-indigo rounded-full animate-spin"></div>
      <p className="mt-4 text-ink/60 font-medium animate-pulse">Loading...</p>
    </div>
  )
}
