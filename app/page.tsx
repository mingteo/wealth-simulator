import WealthCalculator from "./components/WealthCalculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Wealth Simulator <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Visualisasikan masa depan finansial Anda dalam hitungan detik.
          </p>
        </div>

        {/* Load Client Component */}
        <WealthCalculator />

        {/* Footer */}
        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>Dibuat dengan Next.js & Tailwind CSS</p>
        </div>
      </div>
    </main>
  );
}
