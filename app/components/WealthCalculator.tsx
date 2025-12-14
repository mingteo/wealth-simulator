"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign } from "lucide-react";

// Tipe data bisa berupa number atau string kosong agar input bisa dihapus total
type InputValue = number | "";

export default function WealthCalculator() {
  // --- STATE MANAGEMENT ---
  // Kita inisialisasi dengan angka, tapi tipe datanya mengizinkan ""
  const [initialAmount, setInitialAmount] = useState<InputValue>(5000000);
  const [monthlyInvest, setMonthlyInvest] = useState<InputValue>(1000000);
  const [interestRate, setInterestRate] = useState<InputValue>(10);
  const [years, setYears] = useState<InputValue>(5);
  const [tax, setTax] = useState<InputValue>(10);

  // --- HELPER: Handle Input Change ---
  // Fungsi ini mencegah angka 0 muncul otomatis saat dihapus
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<InputValue>>
  ) => {
    const value = e.target.value;
    if (value === "") {
      setter(""); // Izinkan kosong
    } else {
      // Pastikan tidak diawali 0 (kecuali angka 0 itu sendiri atau desimal)
      setter(parseFloat(value));
    }
  };

  // --- LOGIC SECTION ---
  const data = useMemo(() => {
    // SANITASI DATA:
    // Karena state bisa "", kita harus ubah jadi 0 saat mau dihitung
    const safeInitial = initialAmount === "" ? 0 : initialAmount;
    const safeMonthly = monthlyInvest === "" ? 0 : monthlyInvest;
    const safeRate = interestRate === "" ? 0 : interestRate;
    const safeYears = years === "" ? 0 : years;
    const safeTax = tax === "" ? 0 : tax;

    let currentAmount = safeInitial;
    let totalModal = safeInitial;
    const chartData = [];

    // 1. Push data awal
    chartData.push({
      year: "Start",
      amount: safeInitial,
      modal: safeInitial,
    });

    // 2. Loop Tahun
    for (let year = 1; year <= safeYears; year++) {
      // 3. Loop Bulan (Monthly Compounding)
      for (let month = 1; month <= 12; month++) {
        // A. Tambah Investasi
        currentAmount += safeMonthly;
        totalModal += safeMonthly;

        // B. Hitung Bunga & Pajak Bulanan
        const monthlyInterest = currentAmount * (safeRate / 100 / 12);
        const monthlyTax = monthlyInterest * (safeTax / 100);

        // C. Akumulasi
        currentAmount += monthlyInterest - monthlyTax;
      }

      chartData.push({
        year: `Tahun ${year}`,
        amount: Math.round(currentAmount),
        modal: totalModal,
      });
    }

    return chartData;
  }, [initialAmount, monthlyInvest, interestRate, years, tax]);

  const finalAmount = data.length > 0 ? data[data.length - 1].amount : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* KOLOM KIRI: INPUT USER */}
        <div className="md:col-span-4 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" /> Parameter
          </h2>

          {/* Input 1: Modal Awal */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Modal Awal (Rp)
            </label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => handleInputChange(e, setInitialAmount)}
              placeholder="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Input 2: Investasi Bulanan */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Investasi Bulanan (Rp)
            </label>
            {/* Input Range (Slider) tetap butuh angka pasti, jadi kita kasih fallback 0 */}
            <input
              type="range"
              min={0}
              max={20000000}
              step={100000}
              value={monthlyInvest === "" ? 0 : monthlyInvest}
              onChange={(e) => setMonthlyInvest(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-2"
            />
            {/* Input Manual untuk Investasi Bulanan (Biar bisa diketik juga) */}
            <input
              type="number"
              value={monthlyInvest}
              onChange={(e) => handleInputChange(e, setMonthlyInvest)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 outline-none text-right"
            />
          </div>

          {/* Input 3: Return & Durasi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Return (%)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => handleInputChange(e, setInterestRate)}
                className="w-full p-2 border text-black border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Durasi (Thn)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => handleInputChange(e, setYears)}
                className="w-full p-2 border text-black border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Input 4: Pajak */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Pajak Bunga (%)
            </label>
            <input
              type="number"
              value={tax}
              onChange={(e) => handleInputChange(e, setTax)}
              className="w-full p-2 border text-black border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-400 mt-1">
              *Pajak hanya memotong profit
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: HASIL & GRAFIK */}
        <div className="md:col-span-8 flex flex-col justify-between">
          <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
            <p className="text-gray-500 text-sm">Estimasi Total Aset</p>
            <p className="text-3xl font-bold text-blue-700">
              Rp {finalAmount.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [
                    `Rp ${value.toLocaleString("id-ID")}`,
                    "Total Aset",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563eb", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  name="Total Aset"
                />
                <Line
                  type="monotone"
                  dataKey="modal"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Modal Disetor"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
