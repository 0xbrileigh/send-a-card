import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-[#6b9f76] via-[#5a8e68] to-[#4a7d5a]">
      <div className="text-center max-w-lg">
        {/* Envelope icon */}
        <div className="text-7xl mb-6" style={{ animation: 'bounce 2s ease-in-out infinite' }}>
          &#9993;&#65039;
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
          You&apos;ve Got Mail
        </h1>

        <p className="text-lg sm:text-xl text-white/85 mb-8 leading-relaxed">
          Create beautiful interactive cards and share them with a link.
          No account needed.
        </p>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#4a7d5a] font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          Create a Card
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-1">
            <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <footer className="absolute bottom-6 text-white/50 text-sm">
        Made with care
      </footer>
    </div>
  );
}
