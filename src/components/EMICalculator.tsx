import React, { useState, useEffect } from 'react';

interface EMIResults {
  emi: string;
  totalAmount: string;
  totalInterest: string;
  principalAmount: string;
  monthlyBreakdown: Array<{
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

const EMICalculator: React.FC = () => {
  const [loanType, setLoanType] = useState<'home' | 'personal' | 'car'>('home');
  const [principal, setPrincipal] = useState<number>(5000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(20);
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  const [results, setResults] = useState<EMIResults>({
    emi: '—',
    totalAmount: '—',
    totalInterest: '—',
    principalAmount: '—',
    monthlyBreakdown: []
  });

  const calculateEMI = () => {
    const principalAmount = principal;
    const rate = interestRate / 100 / 12; // Monthly interest rate
    const months = tenureUnit === 'years' ? tenure * 12 : tenure;

    if (rate === 0) {
      // If interest rate is 0, EMI is simply principal / tenure
      const emi = principalAmount / months;
      const totalAmount = principalAmount;
      const totalInterest = 0;

      setResults({
        emi: `$${Math.round(emi).toLocaleString()}`,
        totalAmount: `$${totalAmount.toLocaleString()}`,
        totalInterest: `$${totalInterest.toLocaleString()}`,
        principalAmount: `$${principalAmount.toLocaleString()}`,
        monthlyBreakdown: []
      });
      return;
    }

    // EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
    const emi = (principalAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principalAmount;

    // Generate amortization schedule
    const monthlyBreakdown = [];
    let balance = principalAmount;

    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * rate;
      const principalPayment = emi - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      monthlyBreakdown.push({
        month,
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(balance)
      });

      if (balance <= 0) break;
    }

    setResults({
      emi: `$${Math.round(emi).toLocaleString()}`,
      totalAmount: `$${Math.round(totalAmount).toLocaleString()}`,
      totalInterest: `$${Math.round(totalInterest).toLocaleString()}`,
      principalAmount: `$${principalAmount.toLocaleString()}`,
      monthlyBreakdown
    });
  };

  const getLoanTypeInfo = () => {
    switch (loanType) {
      case 'home':
        return { minAmount: 500000, maxAmount: 100000000, defaultRate: 8.5, defaultTenure: 20 };
      case 'personal':
        return { minAmount: 50000, maxAmount: 5000000, defaultRate: 12, defaultTenure: 5 };
      case 'car':
        return { minAmount: 100000, maxAmount: 5000000, defaultRate: 10, defaultTenure: 7 };
      default:
        return { minAmount: 50000, maxAmount: 10000000, defaultRate: 10, defaultTenure: 10 };
    }
  };

  const handleLoanTypeChange = (type: 'home' | 'personal' | 'car') => {
    setLoanType(type);
    const info = getLoanTypeInfo();
    setInterestRate(info.defaultRate);
    setTenure(info.defaultTenure);
  };

  useEffect(() => {
    calculateEMI();
  }, [principal, interestRate, tenure, tenureUnit]);

  const loanInfo = getLoanTypeInfo();

  return (
    <div className="grid">
      {/* Inputs */}
      <section className="card">
        <h2>Loan Details</h2>

        <div className="row">
          <div>
            <label>Loan Type</label>
            <div className="seg">
              <button
                type="button"
                className={loanType === 'home' ? 'active' : ''}
                onClick={() => handleLoanTypeChange('home')}
              >
                Home Loan
              </button>
              <button
                type="button"
                className={loanType === 'personal' ? 'active' : ''}
                onClick={() => handleLoanTypeChange('personal')}
              >
                Personal Loan
              </button>
              <button
                type="button"
                className={loanType === 'car' ? 'active' : ''}
                onClick={() => handleLoanTypeChange('car')}
              >
                Car Loan
              </button>
            </div>
          </div>
          <div>
            <label>Principal Amount ($)</label>
            <input
              type="number"
              min={loanInfo.minAmount}
              max={loanInfo.maxAmount}
              step="1000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="row">
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
          <div>
            <label>Loan Tenure</label>
            <div className="inline">
              <input
                type="number"
                min="1"
                max="30"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <div className="seg">
                <button
                  type="button"
                  className={tenureUnit === 'years' ? 'active' : ''}
                  onClick={() => setTenureUnit('years')}
                >
                  Years
                </button>
                <button
                  type="button"
                  className={tenureUnit === 'months' ? 'active' : ''}
                  onClick={() => setTenureUnit('months')}
                >
                  Months
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="inline" style={{ marginTop: '14px', gap: '10px' }}>
          <button className="btn" onClick={calculateEMI}>
            Calculate EMI
          </button>
          <button 
            className="btn secondary" 
            onClick={() => setShowAmortization(!showAmortization)}
          >
            {showAmortization ? 'Hide' : 'Show'} Amortization
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="card">
        <h2>EMI Calculation Results</h2>

        <div className="result-grid" style={{ marginBottom: '10px' }}>
          <div className="kpi">
            <div className="label">Monthly EMI (Equated Monthly Installment)</div>
            <div className="value hl">{results.emi}</div>
          </div>
          <div className="kpi">
            <div className="label">Total Amount (Principal + Interest)</div>
            <div className="value">{results.totalAmount}</div>
          </div>
          <div className="kpi">
            <div className="label">Total Interest Paid</div>
            <div className="value">{results.totalInterest}</div>
          </div>
          <div className="kpi">
            <div className="label">Principal Amount (Loan Amount)</div>
            <div className="value">{results.principalAmount}</div>
          </div>
        </div>

        {showAmortization && results.monthlyBreakdown.length > 0 && (
          <div className="card" style={{ marginTop: '16px' }}>
            <h3 style={{ marginTop: 0 }}>Amortization Schedule (First 12 Months)</h3>
            <div className="code" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {results.monthlyBreakdown.slice(0, 12).map((payment, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span>Month {payment.month}:</span>
                  <span>Principal: ${payment.principal.toLocaleString()}</span>
                  <span>Interest: ${payment.interest.toLocaleString()}</span>
                  <span>Balance: ${payment.balance.toLocaleString()}</span>
                </div>
              ))}
              {results.monthlyBreakdown.length > 12 && (
                <div style={{ textAlign: 'center', marginTop: '10px', color: 'var(--muted)' }}>
                  ... and {results.monthlyBreakdown.length - 12} more months
                </div>
              )}
            </div>
          </div>
        )}

        <div className="card" style={{ marginTop: '16px' }}>
          <h3 style={{ marginTop: 0 }}>Loan Information</h3>
          <div className="code">
            {loanType === 'home' && `Home Loan:
• Minimum amount: $${loanInfo.minAmount.toLocaleString()}
• Maximum amount: $${loanInfo.maxAmount.toLocaleString()}
• Typical tenure: 10-30 years
• Interest rates: 7.5% - 12% p.a.

Tax Benefits:
• Section 24(b): Up to $2 lakh interest deduction
• Section 80C: Up to $1.5 lakh principal deduction`}

            {loanType === 'personal' && `Personal Loan:
• Minimum amount: $${loanInfo.minAmount.toLocaleString()}
• Maximum amount: $${loanInfo.maxAmount.toLocaleString()}
• Typical tenure: 1-5 years
• Interest rates: 10% - 24% p.a.

Features:
• No collateral required
• Quick approval process
• Fixed EMI payments`}

            {loanType === 'car' && `Car Loan:
• Minimum amount: $${loanInfo.minAmount.toLocaleString()}
• Maximum amount: $${loanInfo.maxAmount.toLocaleString()}
• Typical tenure: 1-7 years
• Interest rates: 8% - 15% p.a.

Features:
• Vehicle as collateral
• Lower interest rates than personal loans
• Flexible tenure options`}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EMICalculator;
