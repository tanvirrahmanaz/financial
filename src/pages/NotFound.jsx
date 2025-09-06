import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-extrabold mb-2">404</h1>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="px-5 py-3 rounded-xl bg-indigo-600 text-white">Go home</Link>
    </div>
  );
}