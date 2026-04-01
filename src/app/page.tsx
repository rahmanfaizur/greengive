export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg text-text">
      <div className="text-center space-y-4 px-6">
        <div className="inline-flex items-center gap-2 badge badge-active mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-impact animate-pulse" />
          Platform coming soon
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
          Play. Win.{' '}
          <span className="gradient-text">Give Back.</span>
        </h1>
        <p className="text-text-muted text-xl max-w-lg mx-auto">
          A subscription golf platform where your game funds charities and enters you into monthly prize draws.
        </p>
      </div>
    </main>
  )
}
