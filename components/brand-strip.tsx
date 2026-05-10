"use client";

const BRANDS = [
  "Bosch",
  "Whirlpool",
  "Miele",
  "Electrolux",
  "Siemens",
  "AEG",
  "Bauknecht",
  "Beko",
  "Indesit",
  "Liebherr",
  "Brandt",
  "Dyson",
];

export default function BrandStrip() {
  return (
    <div className="py-8 sm:py-11 pb-2 bg-abelec-cream-deep border-t border-b border-abelec-cream-line">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <p className="font-mono text-[11px] tracking-[0.10em] uppercase text-abelec-navy/45 text-center mb-6">
          &mdash; 80+ marques compatibles &mdash;
        </p>
        <div className="relative overflow-hidden">
          <div
            className="flex items-center gap-10 pb-10"
            style={{
              maskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
            }}
          >
            <div className="flex items-center gap-6 sm:gap-10 animate-ticker whitespace-nowrap">
              {[...BRANDS, ...BRANDS].map((name, i) => (
                <span
                  key={i}
                  className="font-slab italic font-medium text-[16px] sm:text-[22px] text-abelec-navy/50 hover:text-abelec-navy/85 transition-colors cursor-pointer"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
