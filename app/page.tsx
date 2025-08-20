// app/page.tsx (extrait mis à jour)

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero */}
      <section className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl py-24 sm:py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500">
                Photographie & vidéo de mariage
              </p>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                Des souvenirs capturés avec{" "}
                <span className="text-orange-500">élégance</span> & douceur
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                15+ ans d’expérience, 12 professionnels dédiés. Réservez en ligne en quelques minutes : 
                formule, options, questionnaire, acompte ou virement.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/reservation"
                  className="rounded-md bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 transition"
                >
                  Choisir une formule
                </Link>
                <Link
                  href="#formules"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-orange-500"
                >
                  Voir les offres →
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/formules1.jpg"
                alt="Formules"
                width={600}
                height={600}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nos formules */}
      <section id="formules" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nos formules
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Des collections pastel et intemporelles
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <Image
                src="/formules1.jpg"
                alt="Formules 1"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
            <div className="rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
              <Image
                src="/formules2.jpg"
                alt="Formules 2"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}