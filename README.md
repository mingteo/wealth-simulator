# 📈 Interactive Wealth Simulator

![Project Screenshot](/public/screenshot.png)

> A modern, real-time financial projection tool built to visualize the power of compound interest with precision.

## 🚀 About The Project

This project is a high-performance financial simulator designed to help users calculate their future wealth based on monthly investments, interest rates, and tax deductions.

Unlike standard calculators that use simple yearly estimates, this application implements **Monthly Compounding Logic**, iterating through data month-by-month to provide a highly accurate financial projection.

### Why I Built This
I built this project to challenge my understanding of **Next.js 14 App Router** and **Complex State Management**. It serves as a practical implementation of financial mathematics translated into performant JavaScript code.

## ✨ Key Features

* **⚡ Real-Time Calculation:** The chart updates instantly as you drag sliders or type numbers using React `useMemo` for optimal performance.
* **📅 Monthly Compounding Precision:** Uses a nested loop logic to calculate interest 12 times a year, resulting in mathematically accurate projections compared to simple yearly formulas.
* **💸 Tax Logic Implementation:** Features a dedicated tax parameter that correctly deducts tax *only* from the profit/interest earned, not the principal capital.
* **🛡️ Robust Input Handling:** Custom input sanitization logic that solves the common "React Input Zero" bug, allowing users to clear inputs fully without getting stuck on "0".
* **📱 Fully Responsive:** Built with Tailwind CSS to look perfect on mobile devices and desktops.

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Visualization:** [Recharts](https://recharts.org/)
* **Icons:** Lucide React

## 🧮 The Logic (Snippet)

Here is how the core monthly compounding logic handles the calculation to ensure accuracy:

```typescript
// Nested Loop for Precision
for (let year = 1; year <= years; year++) {
  for (let month = 1; month <= 12; month++) {
    // 1. Add Monthly Contribution
    currentAmount += monthlyInvest;
    
    // 2. Calculate Monthly Interest
    const monthlyInterest = currentAmount * ((interestRate / 100) / 12);
    
    // 3. Deduct Tax from Interest
    const monthlyTax = monthlyInterest * (tax / 100);
    
    // 4. Accumulate
    currentAmount += (monthlyInterest - monthlyTax);
  }
}
