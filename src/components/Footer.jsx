export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div>
          <p className="font-extrabold text-lg">Learn<span className="text-indigo-600">Hub</span></p>
          <p className="text-gray-600 mt-2">Simple courses, clear progress.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm">
            <li className="font-semibold">Product</li>
            <li><a href="#courses" className="hover:text-indigo-600">Courses</a></li>
            <li><a href="#testimonials" className="hover:text-indigo-600">Reviews</a></li>
          </ul>
          <ul className="space-y-2 text-sm">
            <li className="font-semibold">Company</li>
            <li><a href="#" className="hover:text-indigo-600">About</a></li>
            <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
          </ul>
        </div>
        <div className="text-sm text-gray-500">© {new Date().getFullYear()} LearnHub. All rights reserved.</div>
      </div>
    </footer>
  );
}