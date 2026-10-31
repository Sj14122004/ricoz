import Link from 'next/link';
import SafetyNotice from '@/components/layout/SafetyNotice';

const essentials = [
  ['🍼', 'Formula milk'], ['👶', 'Hypoallergenic diapers'], ['💧', 'Colic relief drops'],
  ['🫧', 'Silicone nipple shields'], ['🧻', 'Organic wipes'], ['🌿', 'Gripe water'],
];

const steps = [
  ['Pick what you need', 'Browse the six essentials and check what is in stock right now.'],
  ['Send your request', 'Add your address and phone. We confirm stock before anything is promised.'],
  ['Follow it to your door', 'Track every step from packing to delivery.'],
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-night text-white">
        <div className="lamp-pulse absolute -right-10 top-10 h-40 w-40 rounded-full bg-lamp/70 shadow-glow sm:right-24 sm:h-56 sm:w-56" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="font-display text-7xl font-extrabold leading-none text-lamp sm:text-8xl" aria-label="2:07 AM">2:07</p>
            <h1 className="mt-6 max-w-lg text-3xl font-bold !text-white sm:text-5xl">
              Out of formula, and every shop is shut.
            </h1>
            <p className="mt-4 max-w-md text-white/75">
              Night Pod keeps the baby essentials you run out of at the worst hour. Request them, we confirm stock, and
              you follow the order to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-lamp !px-6 !py-3 text-base">Get supplies</Link>
              <Link href="/orders" className="btn border border-white/30 text-white hover:bg-white/10 !px-6 !py-3 text-base">Track a request</Link>
            </div>
          </div>
          <ul className="relative grid grid-cols-2 gap-3">
            {essentials.map(([emoji, name]) => (
              <li key={name} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm backdrop-blur">
                <span className="text-2xl" aria-hidden>{emoji}</span>{name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">How a request works</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map(([title, text], i) => (
            <li key={title} className="panel">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-night font-display font-bold text-lamp">{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10"><SafetyNotice /></div>
      </section>
    </main>
  );
}
