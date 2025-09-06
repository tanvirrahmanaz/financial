// src/components/Testimonials.jsx
import { testimonials } from "../data/testimonials.js";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">What parents say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
            <p className="text-gray-700">“{t.quote}”</p>
          </div>
        ))}
      </div>
    </section>
  );
}