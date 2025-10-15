import React, { useState } from 'react';
import './App.css';
import CalorieCalculator from './components/CalorieCalculator';
import EMICalculator from './components/EMICalculator';
import APYCalculator from './components/APYCalculator';
import MutualFundsCalculator from './components/MutualFundsCalculator';
import LoanEstimator from './components/LoanEstimator';

type TabType = 'calorie' | 'emi' | 'apy' | 'mutual-funds' | 'loan';

interface Tab {
  id: TabType;
  label: string;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  { id: 'calorie', label: 'Calorie Calculator', component: CalorieCalculator },
  { id: 'emi', label: 'EMI Calculator', component: EMICalculator },
  { id: 'apy', label: 'APY Calculator', component: APYCalculator },
  { id: 'mutual-funds', label: 'Mutual Funds Return', component: MutualFundsCalculator },
  { id: 'loan', label: 'Loan Estimator', component: LoanEstimator },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('calorie');

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CalorieCalculator;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Calculators</h1>
      </header>

      <nav className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        <ActiveComponent />
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <h2>Financial & Health Terms Glossary</h2>
          <div className="glossary-grid">
            <div className="glossary-section">
              <h3>Health & Fitness</h3>
              <div className="glossary-item">
                <strong>BMR</strong> - Basal Metabolic Rate: The number of calories your body needs at rest to maintain basic functions
              </div>
              <div className="glossary-item">
                <strong>TDEE</strong> - Total Daily Energy Expenditure: Total calories burned per day including BMR + activity
              </div>
              <div className="glossary-item">
                <strong>BMI</strong> - Body Mass Index: A measure of body fat based on height and weight
              </div>
              <div className="glossary-item">
                <strong>Macros</strong> - Macronutrients: Protein, carbohydrates, and fats that provide energy
              </div>
            </div>

            <div className="glossary-section">
              <h3>Financial Terms</h3>
              <div className="glossary-item">
                <strong>EMI</strong> - Equated Monthly Installment: Fixed payment amount for loans
              </div>
              <div className="glossary-item">
                <strong>APY</strong> - Annual Percentage Yield: Real annual return on investment including compound interest
              </div>
              <div className="glossary-item">
                <strong>APR</strong> - Annual Percentage Rate: Annual cost of borrowing, including fees
              </div>
              <div className="glossary-item">
                <strong>DTI</strong> - Debt-to-Income Ratio: Percentage of income used for debt payments
              </div>
              <div className="glossary-item">
                <strong>FD/CD</strong> - Fixed Deposit/Certificate of Deposit: Time deposit with guaranteed returns
              </div>
            </div>

            <div className="glossary-section">
              <h3>Investment Terms</h3>
              <div className="glossary-item">
                <strong>SIP</strong> - Systematic Investment Plan: Regular investment in mutual funds
              </div>
              <div className="glossary-item">
                <strong>CAGR</strong> - Compound Annual Growth Rate: Average annual return over time
              </div>
              <div className="glossary-item">
                <strong>XIRR</strong> - Extended Internal Rate of Return: For irregular investment patterns
              </div>
              <div className="glossary-item">
                <strong>LTCG</strong> - Long Term Capital Gains: Tax on investments held more than 1 year
              </div>
              <div className="glossary-item">
                <strong>STCG</strong> - Short Term Capital Gains: Tax on investments held less than 1 year
              </div>
            </div>

            <div className="glossary-section">
              <h3>Loan Terms</h3>
              <div className="glossary-item">
                <strong>Principal</strong> - Original loan amount borrowed
              </div>
              <div className="glossary-item">
                <strong>Interest Rate</strong> - Cost of borrowing, expressed as percentage
              </div>
              <div className="glossary-item">
                <strong>Tenure</strong> - Loan repayment period in months/years
              </div>
              <div className="glossary-item">
                <strong>Down Payment</strong> - Initial payment made when purchasing
              </div>
              <div className="glossary-item">
                <strong>Amortization</strong> - Gradual repayment of loan through regular payments
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;