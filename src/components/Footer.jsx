export default function Footer() {
  const payBadges = [
    'Pay With', 'VISA', 'Mastercard', 'AmEx', 'Discover',
    'bKash', 'Nagad', 'Rocket', 'Upay', 'TapPay',
    'City', 'DBBL', 'MTB', 'EBL', 'UCB', 'Brac', 'Prime',
    'AB', 'SIBL', 'SCB', 'SBL', 'IFIC', 'SBL-DU', 'Bank Asia',
  ];

  return (
    <footer className="mt-auto bg-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Social media */}
        <h3 className="text-center text-2xl font-semibold">Social Media</h3>
        <div className="mt-5 flex justify-center gap-6">
          <a className="w-10 h-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-xl" aria-label="Facebook">f</a>
          <a className="w-10 h-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-xl" aria-label="Twitter">t</a>
          <a className="w-10 h-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-xl" aria-label="Instagram">ig</a>
          <a className="w-10 h-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-xl" aria-label="YouTube">▶</a>
          <a className="w-10 h-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-xl" aria-label="LinkedIn">in</a>
        </div>

        <hr className="my-8 border-t border-black/10" />

        {/* Info columns */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-800">
              <div className="flex items-center gap-3"><span className="text-2xl">💬</span> Whatsapp Us</div>
              <div className="flex items-center gap-3"><span className="text-2xl">📧</span> <a className="underline text-amber-700" href="mailto:fiancial@gmail.com">fiancial@gmail.com</a></div>
              <div className="flex items-center gap-3"><span className="text-2xl">📞</span> (671) 555-0110</div>
              <div className="flex items-center gap-3"><span className="text-2xl">📍</span> 6391 Elgin St. Celina, Delaware 10299</div>
            </div>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Information</h4>
            <ul className="space-y-3 text-gray-800">
              <li><a href="#about" className="hover:underline">About Us</a></li>
              <li><a href="#contact" className="text-amber-700 underline">Contact Us</a></li>
              <li><a href="#career" className="hover:underline">Career</a></li>
              <li><a href="#gallery" className="hover:underline">Gallery</a></li>
              <li><a href="#news" className="hover:underline">News and Blog</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Policies</h4>
            <ul className="space-y-3 text-gray-800">
              <li><a href="#terms" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="#privacy" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-t border-black/10" />

        {/* Payment badges */}
        <div className="text-center">
          <div className="text-amber-700 font-semibold mb-4">We Accept</div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {payBadges.map((b, i) => (
              <span key={i} className="px-3 py-1 text-xs rounded-lg border bg-white shadow-sm">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="bg-amber-200/70 text-center py-3 text-sm text-gray-800">
        2025 Financial literacy for kids
      </div>
    </footer>
  );
}
