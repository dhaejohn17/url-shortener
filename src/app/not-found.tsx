import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <h1>404 — Not Found</h1>
      <p className="subtitle">That short URL doesn't exist.</p>
      <Link href="/">← Go back home</Link>
    </div>
  );
}
