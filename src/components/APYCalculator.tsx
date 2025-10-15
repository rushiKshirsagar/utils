import React, { useState, useEffect } from 'react';

interface APYResults {
  apy: string;
  totalAmount: string;
  totalInterest: string;
  monthlyBreakdown: Array<{
    month: number;
    balance: number;
    interest: number;
  }>;
  comparison: {
    simple: string;
    compound: string;
    difference: string;
  };
}

const APYCalculator: React.FC = () => {
  const [accountType, setAccountType] = useState<'savings' | 'cd' | 'high-yield'>('savings');
  const [principal, setPrincipal] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<'daily' | 'monthly' | 'quarterly' | 'annually'>('monthly');
  const [tenure, setTenure] = useState<number>(5);
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(0);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const [results, setResults] = useState<APYResults>({
    apy: '—',
    totalAmount: '—',
    totalInterest: '—',
    monthlyBreakdown: [],
    comparison: {
      simple: '—',
      compound: '—',
      difference: '—'
    }
  });

  const calculateAPY = () => {
    const principalAmount = principal;
    const rate = interestRate / 100;
    const months = tenureUnit === 'years' ? tenure * 12 : tenure;
    
    // Get compounding frequency
    const n = (() => {
      switch (compoundingFrequency) {
        case 'daily': return 365;
        case 'monthly': return 12;
        case 'quarterly': return 4;
        case 'annually': return 1;
        default: return 12;
      }
    })();

    // Calculate APY
    const apy = Math.pow(1 + (rate / n), n) - 1;
    
    // Calculate compound interest with monthly deposits
    const monthlyRate = rate / 12;
    let balance = principalAmount;
    const monthlyBreakdown = [];
    
    for (let month = 1; month <= months; month++) {
      const monthlyInterest = balance * monthlyRate;
      balance += monthlyInterest + monthlyDeposit;
      
      monthlyBreakdown.push({
        month,
        balance: Math.round(balance),
        interest: Math.round(monthlyInterest)
      });
    }

    const totalAmount = balance;
    const totalInterest = totalAmount - principalAmount - (monthlyDeposit * months);

    // Simple vs Compound comparison
    const simpleInterest = principalAmount * rate * (months / 12);
    const simpleTotal = principalAmount + simpleInterest;
    const compoundTotal = totalAmount;
    const difference = compoundTotal - simpleTotal;

    setResults({
      apy: `${(apy * 100).toFixed(4)}%`,
      totalAmount: `$${Math.round(totalAmount).toLocaleString()}`,
      totalInterest: `$${Math.round(totalInterest).toLocaleString()}`,
      monthlyBreakdown,
      comparison: {
        simple: `$${Math.round(simpleTotal).toLocaleString()}`,
        compound: `$${Math.round(compoundTotal).toLocaleString()}`,
        difference: `$${Math.round(difference).toLocaleString()}`
      }
    });
  };

  const getAccountTypeInfo = () => {
    switch (accountType) {
      case 'savings':
        return { 
          minAmount: 1000, 
          maxAmount: 10000000, 
          defaultRate: 4.5, 
          defaultTenure: 5,
          features: 'Regular savings account with moderate interest rates'
        };
      case 'cd':
        return { 
          minAmount: 10000, 
          maxAmount: 50000000, 
          defaultRate: 6.5, 
          defaultTenure: 3,
          features: 'Fixed deposit with higher rates and locked tenure'
        };
      case 'high-yield':
        return { 
          minAmount: 25000, 
          maxAmount: 100000000, 
          defaultRate: 7.5, 
          defaultTenure: 5,
          features: 'High-yield savings with premium rates and higher minimums'
        };
      default:
        return { 
          minAmount: 1000, 
          maxAmount: 10000000, 
          defaultRate: 5.0, 
          defaultTenure: 3,
          features: 'Standard savings account'
        };
    }
  };

  const handleAccountTypeChange = (type: 'savings' | 'cd' | 'high-yield') => {
    setAccountType(type);
    const info = getAccountTypeInfo();
    setInterestRate(info.defaultRate);
    setTenure(info.defaultTenure);
  };

  useEffect(() => {
    calculateAPY();
  }, [principal, interestRate, compoundingFrequency, tenure, tenureUnit, monthlyDeposit]);

  const accountInfo = getAccountTypeInfo();

  return (
    <div className="grid">
      {/* Inputs */}
      <section className="card">
        <h2>Investment Details</h2>

        <div className="row">
          <div>
            <label>Account Type</label>
            <div className="seg">
              <button
                type="button"
                className={accountType === 'savings' ? 'active' : ''}
                onClick={() => handleAccountTypeChange('savings')}
              >
                Savings
              </button>
              <button
                type="button"
                className={accountType === 'cd' ? 'active' : ''}
                onClick={() => handleAccountTypeChange('cd')}
              >
                CD/FD
              </button>
              <button
                type="button"
                className={accountType === 'high-yield' ? 'active' : ''}
                onClick={() => handleAccountTypeChange('high-yield')}
              >
                High-Yield
              </button>
            </div>
          </div>
          <div>
            <label>Initial Amount ($)</label>
            <input
              type="number"
              min={accountInfo.minAmount}
              max={accountInfo.maxAmount}
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
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Compounding Frequency</label>
            <select
              value={compoundingFrequency}
              onChange={(e) => setCompoundingFrequency(e.target.value as any)}
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div>
            <label>Investment Tenure</label>
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
          <div>
            <label>Monthly Deposit ($)</label>
            <input
              type="number"
              min="0"
              max="1000000"
              step="1000"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="inline" style={{ marginTop: '14px', gap: '10px' }}>
          <button className="btn" onClick={calculateAPY}>
            Calculate APY
          </button>
          <button 
            className="btn secondary" 
            onClick={() => setShowBreakdown(!showBreakdown)}
          >
            {showBreakdown ? 'Hide' : 'Show'} Breakdown
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="card">
        <h2>APY Calculation Results</h2>

        <div className="result-grid" style={{ marginBottom: '10px' }}>
          <div className="kpi">
            <div className="label">APY (Annual Percentage Yield)</div>
            <div className="value hl">{results.apy}</div>
          </div>
          <div className="kpi">
            <div className="label">Total Amount (Final Value)</div>
            <div className="value">{results.totalAmount}</div>
          </div>
          <div className="kpi">
            <div className="label">Total Interest Earned</div>
            <div className="value">{results.totalInterest}</div>
          </div>
          <div className="kpi">
            <div className="label">Initial Investment</div>
            <div className="value">${principal.toLocaleString()}</div>
          </div>
        </div>

        <div className="row">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Interest Comparison</h3>
            <div className="row">
              <div className="kpi">
                <div className="label">Simple Interest</div>
                <div className="value">{results.comparison.simple}</div>
              </div>
              <div className="kpi">
                <div className="label">Compound Interest (with APY)</div>
                <div className="value">{results.comparison.compound}</div>
              </div>
            </div>
            <div className="kpi" style={{ marginTop: '10px' }}>
              <div className="label">Extra from Compounding</div>
              <div className="value" style={{ color: 'var(--good)' }}>{results.comparison.difference}</div>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Account Information</h3>
            <div className="code">
              {accountType === 'savings' && `Savings Account:
• Minimum balance: $${accountInfo.minAmount.toLocaleString()}
• Maximum balance: $${accountInfo.maxAmount.toLocaleString()}
• Interest rates: 3% - 6% p.a.
• Liquidity: High (withdrawal anytime)
• Tax: Interest taxed as per income slab

Features:
• Easy access to funds
• No lock-in period
• Online banking available`}

              {accountType === 'cd' && `Certificate of Deposit:
• Minimum deposit: $${accountInfo.minAmount.toLocaleString()}
• Maximum deposit: $${accountInfo.maxAmount.toLocaleString()}
• Interest rates: 5% - 8% p.a.
• Lock-in period: 1-10 years
• Tax: TDS on interest @ 10%

Features:
• Higher interest rates
• Fixed maturity period
• Guaranteed returns
• No market risk`}

              {accountType === 'high-yield' && `High-Yield Savings:
• Minimum balance: $${accountInfo.minAmount.toLocaleString()}
• Maximum balance: $${accountInfo.maxAmount.toLocaleString()}
• Interest rates: 6% - 9% p.a.
• Premium features included
• Tax: Interest taxed as per income slab

Features:
• Premium interest rates
• Priority customer service
• Higher transaction limits
• Additional benefits`}
            </div>
          </div>
        </div>

        {showBreakdown && results.monthlyBreakdown.length > 0 && (
          <div className="card" style={{ marginTop: '16px' }}>
            <h3 style={{ marginTop: 0 }}>Growth Breakdown (First 12 Months)</h3>
            <div className="code" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {results.monthlyBreakdown.slice(0, 12).map((payment, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span>Month {payment.month}:</span>
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
      </section>
    </div>
  );
};

export default APYCalculator;
