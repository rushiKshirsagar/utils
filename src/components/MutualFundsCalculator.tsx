import React, { useState, useEffect } from 'react';

interface SIPResults {
  totalInvestment: string;
  finalValue: string;
  totalGains: string;
  absoluteReturn: string;
  cagr: string;
  monthlyBreakdown: Array<{
    month: number;
    investment: number;
    value: number;
    gain: number;
  }>;
}

interface LumpSumResults {
  initialInvestment: string;
  finalValue: string;
  totalGains: string;
  absoluteReturn: string;
  cagr: string;
}

const MutualFundsCalculator: React.FC = () => {
  const [investmentType, setInvestmentType] = useState<'sip' | 'lumpsum'>('sip');
  const [monthlySIP, setMonthlySIP] = useState<number>(10000);
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(500000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [investmentTenure, setInvestmentTenure] = useState<number>(10);
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const [sipResults, setSipResults] = useState<SIPResults>({
    totalInvestment: '—',
    finalValue: '—',
    totalGains: '—',
    absoluteReturn: '—',
    cagr: '—',
    monthlyBreakdown: []
  });

  const [lumpSumResults, setLumpSumResults] = useState<LumpSumResults>({
    initialInvestment: '—',
    finalValue: '—',
    totalGains: '—',
    absoluteReturn: '—',
    cagr: '—'
  });

  const calculateSIP = () => {
    const monthlyInvestment = monthlySIP;
    const months = tenureUnit === 'years' ? investmentTenure * 12 : investmentTenure;
    const monthlyRate = expectedReturn / 100 / 12;
    
    // SIP Future Value = P × [{(1 + r)^n - 1} / r] × (1 + r)
    const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvestment = monthlyInvestment * months;
    const totalGains = futureValue - totalInvestment;
    const absoluteReturn = (totalGains / totalInvestment) * 100;
    
    // CAGR = (Final Value / Initial Investment)^(1/n) - 1
    const cagr = (Math.pow(futureValue / totalInvestment, 12 / months) - 1) * 100;

    // Generate monthly breakdown
    const monthlyBreakdown = [];
    let accumulatedValue = 0;
    
    for (let month = 1; month <= months; month++) {
      accumulatedValue = (accumulatedValue + monthlyInvestment) * (1 + monthlyRate);
      const gain = accumulatedValue - (monthlyInvestment * month);
      
      monthlyBreakdown.push({
        month,
        investment: monthlyInvestment * month,
        value: Math.round(accumulatedValue),
        gain: Math.round(gain)
      });
    }

    setSipResults({
      totalInvestment: `$${totalInvestment.toLocaleString()}`,
      finalValue: `$${Math.round(futureValue).toLocaleString()}`,
      totalGains: `$${Math.round(totalGains).toLocaleString()}`,
      absoluteReturn: `${absoluteReturn.toFixed(2)}%`,
      cagr: `${cagr.toFixed(2)}%`,
      monthlyBreakdown
    });
  };

  const calculateLumpSum = () => {
    const initialInvestment = lumpSumAmount;
    const years = tenureUnit === 'years' ? investmentTenure : investmentTenure / 12;
    const annualRate = expectedReturn / 100;
    
    // Compound Interest: A = P(1 + r)^n
    const finalValue = initialInvestment * Math.pow(1 + annualRate, years);
    const totalGains = finalValue - initialInvestment;
    const absoluteReturn = (totalGains / initialInvestment) * 100;
    
    // CAGR = (Final Value / Initial Investment)^(1/n) - 1
    const cagr = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;

    setLumpSumResults({
      initialInvestment: `$${initialInvestment.toLocaleString()}`,
      finalValue: `$${Math.round(finalValue).toLocaleString()}`,
      totalGains: `$${Math.round(totalGains).toLocaleString()}`,
      absoluteReturn: `${absoluteReturn.toFixed(2)}%`,
      cagr: `${cagr.toFixed(2)}%`
    });
  };

  useEffect(() => {
    if (investmentType === 'sip') {
      calculateSIP();
    } else {
      calculateLumpSum();
    }
  }, [investmentType, monthlySIP, lumpSumAmount, expectedReturn, investmentTenure, tenureUnit]);

  const getFundTypeInfo = () => {
    return {
      equity: {
        name: 'Equity Funds',
        risk: 'High',
        returns: '12-18% p.a.',
        tenure: '5+ years',
        description: 'Invest in stocks, suitable for long-term growth'
      },
      debt: {
        name: 'Debt Funds',
        risk: 'Low to Medium',
        returns: '6-9% p.a.',
        tenure: '1-3 years',
        description: 'Invest in bonds and fixed income securities'
      },
      hybrid: {
        name: 'Hybrid Funds',
        risk: 'Medium',
        returns: '9-12% p.a.',
        tenure: '3-5 years',
        description: 'Mix of equity and debt for balanced growth'
      },
      index: {
        name: 'Index Funds',
        risk: 'Medium',
        returns: '10-15% p.a.',
        tenure: '5+ years',
        description: 'Track market indices, lower expense ratios'
      }
    };
  };

  const fundTypes = getFundTypeInfo();

  return (
    <div className="grid">
      {/* Inputs */}
      <section className="card">
        <h2>Investment Details</h2>

        <div className="row">
          <div>
            <label>Investment Type</label>
            <div className="seg">
              <button
                type="button"
                className={investmentType === 'sip' ? 'active' : ''}
                onClick={() => setInvestmentType('sip')}
              >
                SIP
              </button>
              <button
                type="button"
                className={investmentType === 'lumpsum' ? 'active' : ''}
                onClick={() => setInvestmentType('lumpsum')}
              >
                Lump Sum
              </button>
            </div>
          </div>
          <div>
            {investmentType === 'sip' ? (
              <>
                <label>Monthly SIP Amount ($)</label>
                <input
                  type="number"
                  min="500"
                  max="1000000"
                  step="1000"
                  value={monthlySIP}
                  onChange={(e) => setMonthlySIP(Number(e.target.value))}
                />
              </>
            ) : (
              <>
                <label>Lump Sum Amount ($)</label>
                <input
                  type="number"
                  min="1000"
                  max="10000000"
                  step="1000"
                  value={lumpSumAmount}
                  onChange={(e) => setLumpSumAmount(Number(e.target.value))}
                />
              </>
            )}
          </div>
        </div>

        <div className="row">
          <div>
            <label>Expected Annual Return (%)</label>
            <input
              type="number"
              min="0"
              max="30"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Investment Tenure</label>
            <div className="inline">
              <input
                type="number"
                min="1"
                max="30"
                value={investmentTenure}
                onChange={(e) => setInvestmentTenure(Number(e.target.value))}
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
          <button className="btn" onClick={investmentType === 'sip' ? calculateSIP : calculateLumpSum}>
            Calculate Returns
          </button>
          {investmentType === 'sip' && (
            <button 
              className="btn secondary" 
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              {showBreakdown ? 'Hide' : 'Show'} Breakdown
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="card">
        <h2>Investment Returns</h2>

        {investmentType === 'sip' ? (
          <>
            <div className="result-grid" style={{ marginBottom: '10px' }}>
              <div className="kpi">
                <div className="label">Total Investment (SIP)</div>
                <div className="value">{sipResults.totalInvestment}</div>
              </div>
              <div className="kpi">
                <div className="label">Final Value (Maturity Amount)</div>
                <div className="value hl">{sipResults.finalValue}</div>
              </div>
              <div className="kpi">
                <div className="label">Total Gains (Profit)</div>
                <div className="value" style={{ color: 'var(--good)' }}>{sipResults.totalGains}</div>
              </div>
              <div className="kpi">
                <div className="label">Absolute Return (%)</div>
                <div className="value">{sipResults.absoluteReturn}</div>
              </div>
            </div>

            <div className="row">
              <div className="kpi">
                <div className="label">CAGR (Compound Annual Growth Rate)</div>
                <div className="value">{sipResults.cagr}</div>
              </div>
              <div className="kpi">
                <div className="label">Monthly SIP Amount</div>
                <div className="value">${monthlySIP.toLocaleString()}</div>
              </div>
            </div>

            {showBreakdown && sipResults.monthlyBreakdown.length > 0 && (
              <div className="card" style={{ marginTop: '16px' }}>
                <h3 style={{ marginTop: 0 }}>SIP Growth Breakdown (First 12 Months)</h3>
                <div className="code" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {sipResults.monthlyBreakdown.slice(0, 12).map((payment, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                      <span>Month {payment.month}:</span>
                      <span>Invested: ${payment.investment.toLocaleString()}</span>
                      <span>Value: ${payment.value.toLocaleString()}</span>
                      <span>Gain: ${payment.gain.toLocaleString()}</span>
                    </div>
                  ))}
                  {sipResults.monthlyBreakdown.length > 12 && (
                    <div style={{ textAlign: 'center', marginTop: '10px', color: 'var(--muted)' }}>
                      ... and {sipResults.monthlyBreakdown.length - 12} more months
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="result-grid" style={{ marginBottom: '10px' }}>
              <div className="kpi">
                <div className="label">Initial Investment (Lump Sum)</div>
                <div className="value">{lumpSumResults.initialInvestment}</div>
              </div>
              <div className="kpi">
                <div className="label">Final Value (Maturity Amount)</div>
                <div className="value hl">{lumpSumResults.finalValue}</div>
              </div>
              <div className="kpi">
                <div className="label">Total Gains (Profit)</div>
                <div className="value" style={{ color: 'var(--good)' }}>{lumpSumResults.totalGains}</div>
              </div>
              <div className="kpi">
                <div className="label">Absolute Return (%)</div>
                <div className="value">{lumpSumResults.absoluteReturn}</div>
              </div>
            </div>

            <div className="row">
              <div className="kpi">
                <div className="label">CAGR (Compound Annual Growth Rate)</div>
                <div className="value">{lumpSumResults.cagr}</div>
              </div>
              <div className="kpi">
                <div className="label">Investment Period</div>
                <div className="value">{investmentTenure} {tenureUnit}</div>
              </div>
            </div>
          </>
        )}

        <div className="card" style={{ marginTop: '16px' }}>
          <h3 style={{ marginTop: 0 }}>Mutual Fund Types</h3>
          <div className="code">
            {Object.entries(fundTypes).map(([key, fund]) => (
              <div key={key} style={{ marginBottom: '12px' }}>
                <strong>{fund.name}:</strong><br/>
                Risk Level: {fund.risk} | Expected Returns: {fund.returns}<br/>
                Recommended Tenure: {fund.tenure}<br/>
                {fund.description}<br/>
              </div>
            ))}
            
            <div style={{ marginTop: '16px', padding: '8px', background: 'rgba(122, 162, 255, 0.1)', borderRadius: '6px' }}>
              <strong>Tax Implications:</strong><br/>
              • LTCG (Long Term Capital Gains): 10% above $1 lakh (equity funds)<br/>
              • STCG (Short Term Capital Gains): 15% (equity funds)<br/>
              • Debt funds: As per income tax slab<br/>
              • SIP: Each installment has its own holding period
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MutualFundsCalculator;
