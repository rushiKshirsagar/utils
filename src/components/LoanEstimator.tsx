import React, { useState, useEffect } from 'react';

interface LoanEligibility {
  maxLoanAmount: string;
  maxEMI: string;
  dtiRatio: string;
  affordability: string;
  recommendedLoanAmount: string;
}

interface DownPaymentAnalysis {
  minDownPayment: string;
  recommendedDownPayment: string;
  maxLoanWithDownPayment: string;
  savings: string;
}

const LoanEstimator: React.FC = () => {
  const [loanType, setLoanType] = useState<'home' | 'personal' | 'car'>('home');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(100000);
  const [existingEMIs, setExistingEMIs] = useState<number>(15000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(40000);
  const [creditScore, setCreditScore] = useState<number>(750);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTenure, setLoanTenure] = useState<number>(20);
  const [propertyValue, setPropertyValue] = useState<number>(10000000);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(2000000);

  const [eligibility, setEligibility] = useState<LoanEligibility>({
    maxLoanAmount: '—',
    maxEMI: '—',
    dtiRatio: '—',
    affordability: '—',
    recommendedLoanAmount: '—'
  });

  const [downPaymentAnalysis, setDownPaymentAnalysis] = useState<DownPaymentAnalysis>({
    minDownPayment: '—',
    recommendedDownPayment: '—',
    maxLoanWithDownPayment: '—',
    savings: '—'
  });

  const calculateLoanEligibility = () => {
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTenure * 12;

    // Calculate DTI ratio
    const dtiRatio = (existingEMIs / monthlyIncome) * 100;

    // Maximum EMI capacity (typically 40-60% of income minus existing EMIs)
    const maxEMICapacity = (monthlyIncome * 0.4) - existingEMIs;
    const conservativeEMI = Math.max(maxEMICapacity * 0.8, 0);

    // Calculate maximum loan amount based on EMI capacity
    const maxLoanAmount = monthlyRate > 0 
      ? (conservativeEMI * (Math.pow(1 + monthlyRate, months) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, months))
      : conservativeEMI * months;

    // Adjust for credit score (affects interest rate and loan amount)
    let creditMultiplier = 1;
    if (creditScore >= 750) creditMultiplier = 1;
    else if (creditScore >= 700) creditMultiplier = 0.9;
    else if (creditScore >= 650) creditMultiplier = 0.8;
    else creditMultiplier = 0.7;

    const adjustedMaxLoan = maxLoanAmount * creditMultiplier;

    // Calculate affordability based on remaining income
    const remainingIncome = monthlyIncome - existingEMIs - conservativeEMI;
    const affordability = (remainingIncome / monthlyIncome) * 100;

    // Recommended loan amount (conservative)
    const recommendedAmount = adjustedMaxLoan * 0.8;

    setEligibility({
      maxLoanAmount: `$${Math.round(adjustedMaxLoan).toLocaleString()}`,
      maxEMI: `$${Math.round(conservativeEMI).toLocaleString()}`,
      dtiRatio: `${dtiRatio.toFixed(1)}%`,
      affordability: `${affordability.toFixed(1)}%`,
      recommendedLoanAmount: `$${Math.round(recommendedAmount).toLocaleString()}`
    });
  };

  const calculateDownPaymentAnalysis = () => {
    if (loanType !== 'home') {
      setDownPaymentAnalysis({
        minDownPayment: '—',
        recommendedDownPayment: '—',
        maxLoanWithDownPayment: '—',
        savings: '—'
      });
      return;
    }

    const minDownPaymentPercent = 10; // Minimum 10% for home loans
    const recommendedDownPaymentPercent = 20; // Recommended 20%

    const minDownPayment = propertyValue * (minDownPaymentPercent / 100);
    const recommendedDownPayment = propertyValue * (recommendedDownPaymentPercent / 100);

    const maxLoanWithMinDown = propertyValue - minDownPayment;
    const maxLoanWithRecommendedDown = propertyValue - recommendedDownPayment;

    // Calculate EMI savings with higher down payment
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTenure * 12;

    const emiWithMinDown = monthlyRate > 0 
      ? (maxLoanWithMinDown * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : maxLoanWithMinDown / months;

    const emiWithRecommendedDown = monthlyRate > 0 
      ? (maxLoanWithRecommendedDown * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : maxLoanWithRecommendedDown / months;

    const monthlySavings = emiWithMinDown - emiWithRecommendedDown;
    const totalSavings = monthlySavings * months;

    setDownPaymentAnalysis({
      minDownPayment: `$${Math.round(minDownPayment).toLocaleString()}`,
      recommendedDownPayment: `$${Math.round(recommendedDownPayment).toLocaleString()}`,
      maxLoanWithDownPayment: `$${Math.round(maxLoanWithRecommendedDown).toLocaleString()}`,
      savings: `$${Math.round(totalSavings).toLocaleString()}`
    });
  };

  useEffect(() => {
    calculateLoanEligibility();
    calculateDownPaymentAnalysis();
  }, [loanType, monthlyIncome, existingEMIs, interestRate, loanTenure, creditScore, propertyValue, downPaymentAmount]);

  const getLoanTypeInfo = () => {
    switch (loanType) {
      case 'home':
        return {
          maxDti: 40,
          minCreditScore: 650,
          maxTenure: 30,
          minDownPayment: 10,
          description: 'Home loans typically have lower interest rates and longer tenures'
        };
      case 'personal':
        return {
          maxDti: 50,
          minCreditScore: 600,
          maxTenure: 5,
          minDownPayment: 0,
          description: 'Personal loans are unsecured and have higher interest rates'
        };
      case 'car':
        return {
          maxDti: 45,
          minCreditScore: 650,
          maxTenure: 7,
          minDownPayment: 10,
          description: 'Car loans are secured by the vehicle and have moderate rates'
        };
      default:
        return {
          maxDti: 40,
          minCreditScore: 650,
          maxTenure: 20,
          minDownPayment: 10,
          description: 'General loan information'
        };
    }
  };

  const loanInfo = getLoanTypeInfo();

  return (
    <div className="grid">
      {/* Inputs */}
      <section className="card">
        <h2>Financial Profile</h2>

        <div className="row">
          <div>
            <label>Loan Type</label>
            <div className="seg">
              <button
                type="button"
                className={loanType === 'home' ? 'active' : ''}
                onClick={() => setLoanType('home')}
              >
                Home Loan
              </button>
              <button
                type="button"
                className={loanType === 'personal' ? 'active' : ''}
                onClick={() => setLoanType('personal')}
              >
                Personal Loan
              </button>
              <button
                type="button"
                className={loanType === 'car' ? 'active' : ''}
                onClick={() => setLoanType('car')}
              >
                Car Loan
              </button>
            </div>
          </div>
          <div>
            <label>Monthly Income ($)</label>
            <input
              type="number"
              min="10000"
              max="10000000"
              step="1000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="row">
          <div>
            <label>Existing EMIs ($)</label>
            <input
              type="number"
              min="0"
              max="500000"
              step="1000"
              value={existingEMIs}
              onChange={(e) => setExistingEMIs(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Monthly Expenses ($)</label>
            <input
              type="number"
              min="0"
              max="500000"
              step="1000"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="row">
          <div>
            <label>Credit Score</label>
            <input
              type="number"
              min="300"
              max="900"
              step="10"
              value={creditScore}
              onChange={(e) => setCreditScore(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Interest Rate (% p.a.)</label>
            <input
              type="number"
              min="0"
              max="30"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="row">
          <div>
            <label>Loan Tenure (Years)</label>
            <input
              type="number"
              min="1"
              max={loanInfo.maxTenure}
              step="1"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
            />
          </div>
          {loanType === 'home' && (
            <div>
              <label>Property Value ($)</label>
              <input
                type="number"
                min="100000"
                max="100000000"
                step="100000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        <div className="inline" style={{ marginTop: '14px', gap: '10px' }}>
          <button className="btn" onClick={calculateLoanEligibility}>
            Calculate Eligibility
          </button>
          <button className="btn secondary" onClick={calculateDownPaymentAnalysis}>
            Analyze Down Payment
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="card">
        <h2>Loan Eligibility Results</h2>

        <div className="result-grid" style={{ marginBottom: '10px' }}>
          <div className="kpi">
            <div className="label">Max Loan Amount (Eligible)</div>
            <div className="value hl">{eligibility.maxLoanAmount}</div>
          </div>
          <div className="kpi">
            <div className="label">Max EMI Capacity (Monthly)</div>
            <div className="value">{eligibility.maxEMI}</div>
          </div>
          <div className="kpi">
            <div className="label">DTI Ratio (Debt-to-Income)</div>
            <div className="value" style={{ color: parseFloat(eligibility.dtiRatio) > loanInfo.maxDti ? 'var(--bad)' : 'var(--good)' }}>
              {eligibility.dtiRatio}
            </div>
          </div>
          <div className="kpi">
            <div className="label">Affordability (% Remaining Income)</div>
            <div className="value" style={{ color: parseFloat(eligibility.affordability) < 30 ? 'var(--bad)' : 'var(--good)' }}>
              {eligibility.affordability}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="kpi">
            <div className="label">Recommended Loan Amount</div>
            <div className="value" style={{ color: 'var(--accent)' }}>{eligibility.recommendedLoanAmount}</div>
          </div>
          <div className="kpi">
            <div className="label">Credit Score</div>
            <div className="value" style={{ color: creditScore >= 750 ? 'var(--good)' : creditScore >= 650 ? 'var(--accent)' : 'var(--bad)' }}>
              {creditScore}
            </div>
          </div>
        </div>

        {loanType === 'home' && (
          <div className="card" style={{ marginTop: '16px' }}>
            <h3 style={{ marginTop: 0 }}>Down Payment Analysis</h3>
            <div className="result-grid">
              <div className="kpi">
                <div className="label">Minimum Down Payment</div>
                <div className="value">{downPaymentAnalysis.minDownPayment}</div>
              </div>
              <div className="kpi">
                <div className="label">Recommended Down Payment</div>
                <div className="value">{downPaymentAnalysis.recommendedDownPayment}</div>
              </div>
              <div className="kpi">
                <div className="label">Max Loan with Recommended Down</div>
                <div className="value">{downPaymentAnalysis.maxLoanWithDownPayment}</div>
              </div>
              <div className="kpi">
                <div className="label">Total EMI Savings</div>
                <div className="value" style={{ color: 'var(--good)' }}>{downPaymentAnalysis.savings}</div>
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ marginTop: '16px' }}>
          <h3 style={{ marginTop: 0 }}>Loan Guidelines</h3>
          <div className="code">
            {loanType === 'home' && `Home Loan Guidelines:
• Maximum DTI Ratio: ${loanInfo.maxDti}%
• Minimum Credit Score: ${loanInfo.minCreditScore}
• Maximum Tenure: ${loanInfo.maxTenure} years
• Minimum Down Payment: ${loanInfo.minDownPayment}%
• Interest Rate: 7.5% - 12% p.a.

Benefits:
• Lower interest rates
• Tax benefits under Section 24(b) and 80C
• Longer repayment period
• Property as collateral`}

            {loanType === 'personal' && `Personal Loan Guidelines:
• Maximum DTI Ratio: ${loanInfo.maxDti}%
• Minimum Credit Score: ${loanInfo.minCreditScore}
• Maximum Tenure: ${loanInfo.maxTenure} years
• No collateral required
• Interest Rate: 10% - 24% p.a.

Benefits:
• Quick approval process
• No collateral required
• Flexible usage
• Fixed EMI payments`}

            {loanType === 'car' && `Car Loan Guidelines:
• Maximum DTI Ratio: ${loanInfo.maxDti}%
• Minimum Credit Score: ${loanInfo.minCreditScore}
• Maximum Tenure: ${loanInfo.maxTenure} years
• Minimum Down Payment: ${loanInfo.minDownPayment}%
• Interest Rate: 8% - 15% p.a.

Benefits:
• Vehicle as collateral
• Lower interest rates than personal loans
• Flexible tenure options
• Quick processing`}

            <div style={{ marginTop: '16px', padding: '8px', background: 'rgba(255, 122, 122, 0.1)', borderRadius: '6px' }}>
              <strong>Important Notes:</strong><br/>
              • DTI ratio should ideally be below ${loanInfo.maxDti}%<br/>
              • Maintain at least 30% income for living expenses<br/>
              • Higher down payment reduces EMI burden<br/>
              • Credit score significantly affects loan terms
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoanEstimator;
