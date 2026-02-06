export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-muted-foreground flex items-center justify-between">
        <div>
          <span className="font-semibold text-gradient">LuxStay</span> — Elevate your travel
        </div>
        <div className="opacity-70">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  )
}
