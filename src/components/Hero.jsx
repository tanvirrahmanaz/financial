// src/components/Hero.jsx
export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        {/* Top title */}
        <div className="text-center">
          <div className="font-kids tracking-[0.35em] text-gray-700 text-xl md:text-2xl mb-6">
            LEARN
          </div>
        </div>

        {/* Image with flanking words */}
        <div className="relative flex items-center justify-center">
          {/* Left word */}
          <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 text-5xl lg:text-6xl font-semibold text-black">
            How
          </div>

          {/* Image placeholder (replace src with your image) */}
          <div className="rounded-full overflow-hidden shadow-xl ring-1 ring-black/5">
            <img
              src="/hero.png"
              alt="Kids learning"
              className="w-[260px] h-[260px] md:w-[320px] md:h-[320px] object-cover"
            />
          </div>

          {/* Right word */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-5xl lg:text-6xl font-semibold text-black">
            To
          </div>
        </div>

        {/* Words for small screens (stacked) */}
        <div className="mt-6 md:hidden flex items-center justify-center gap-6 text-4xl font-semibold text-black">
          <span>How</span>
          <span>To</span>
        </div>

        {/* Action chips */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <button className="w-full rounded-2xl px-8 py-4 text-lg font-semibold text-gray-800 bg-sky-200 hover:bg-sky-300 transition-shadow shadow-sm hover:shadow-md">
            Earn
          </button>
          <button className="w-full rounded-2xl px-8 py-4 text-lg font-semibold text-gray-800 bg-amber-200 hover:bg-amber-300 transition-shadow shadow-sm hover:shadow-md">
            Save
          </button>
          <button className="w-full rounded-2xl px-8 py-4 text-lg font-semibold text-gray-800 bg-pink-200 hover:bg-pink-300 transition-shadow shadow-sm hover:shadow-md">
            Invest
          </button>
        </div>
      </div>
    </section>
  );
}
