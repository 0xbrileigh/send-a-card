import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="text-6xl mb-6">&#128237;</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Card Not Found</h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        This card doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/create"
        className="px-6 py-3 bg-[#6b9f76] text-white font-semibold rounded-xl hover:bg-[#5a8e68] transition-colors"
      >
        Create Your Own Card
      </Link>
    </div>
  );
}
