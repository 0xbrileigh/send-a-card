'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [copied, setCopied] = useState(false);

  if (!slug) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-500">No card found.</p>
          <Link href="/create" className="text-[#6b9f76] font-medium mt-2 inline-block hover:underline">
            Create a new card
          </Link>
        </div>
      </div>
    );
  }

  const cardUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/c/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select the text
      const input = document.querySelector<HTMLInputElement>('#card-url-input');
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-[#6b9f76] via-[#5a8e68] to-[#4a7d5a]">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Success icon */}
        <div className="text-6xl mb-4">&#127881;</div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Card Created!
        </h1>
        <p className="text-gray-500 mb-6">
          Share this link with your recipient:
        </p>

        {/* URL field + copy button */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 mb-6">
          <input
            id="card-url-input"
            type="text"
            readOnly
            value={cardUrl}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none px-2 truncate"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-[#6b9f76] text-white hover:bg-[#5a8e68]'
            }`}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Action links */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/c/${slug}`}
            className="text-[#6b9f76] font-medium hover:underline"
          >
            Preview your card &rarr;
          </Link>
          <Link
            href="/create"
            className="text-gray-400 text-sm hover:text-gray-600"
          >
            Create another card
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
