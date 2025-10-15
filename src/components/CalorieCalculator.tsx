import React, { useState, useEffect } from 'react';

interface Metrics {
  kg: number;
  cm: number;
}

const CalorieCalculator: React.FC = () => {
  // State
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [age, setAge] = useState<number>(29);
  
  // Imperial units
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [weightLb, setWeightLb] = useState<number>(143);
  
  // Metric units
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(65);
  
  const [activity, setActivity] = useState<number>(1.55);
  const [proteinPct, setProteinPct] = useState<number>(25);
  const [carbPct, setCarbPct] = useState<number>(50);
  const [fatPct, setFatPct] = useState<number>(25);

  // Results
  const [results, setResults] = useState({
    bmr: '—',
    activityFactor: '—',
    tdee: '—',
    bmi: '—',
    maintain: '—',
    cut: '—',
    bulk: '—',
    protein: '—',
    macroBreakdown: '—',
    equation: 'Mifflin–St Jeor (male): BMR = 10·kg + 6.25·cm − 5·age + 5\nTDEE = BMR × activity\nkcal → macros: protein = P%/4, carbs = C%/4, fat = F%/9'
  });

  // Helper functions
  const to2 = (n: number): string => Number.isFinite(n) ? Math.round(n).toString() : "—";
  
  const getMetrics = (): Metrics => {
    let kg: number, cm: number;
    
    if (unit === 'imperial') {
      const ft = heightFt;
      const inc = heightIn;
      const lb = weightLb;
      cm = ((ft * 12) + inc) * 2.54;
      kg = lb * 0.45359237;
    } else {
      cm = heightCm;
      kg = weightKg;
    }
    
    return { kg, cm };
  };

  const mifflinStJeorBMR = ({ kg, cm, age, sex }: Metrics & { age: number; sex: string }): number => {
    const s = sex === 'male' ? 5 : -161;
    return 10 * kg + 6.25 * cm - 5 * age + s;
  };

  const calcBMI = ({ kg, cm }: Metrics): number => {
    const m = cm / 100;
    return kg / (m * m);
  };

  const validateMacroSum = () => {
    const p = proteinPct;
    const c = carbPct;
    const f = fatPct;
    return { sum: p + c + f, p, c, f };
  };

  const calculate = () => {
    const ageVal = age;
    const act = activity;
    const metrics = getMetrics();

    if (!Number.isFinite(metrics.kg) || !Number.isFinite(metrics.cm) || !Number.isFinite(ageVal)) {
      alert("Please provide valid numbers for age, height, and weight.");
      return;
    }

    const bmr = mifflinStJeorBMR({ kg: metrics.kg, cm: metrics.cm, age: ageVal, sex });
    const tdee = bmr * act;
    const bmi = calcBMI(metrics);

    // Targets
    const maintain = tdee;
    const gentleCut = tdee - 350; // ~0.5 lb/week deficit
    const bulk = tdee + 250; // lean bulk

    // Protein target (1.6–2.2 g/kg, using 2.0 g/kg)
    const proteinTargetG = metrics.kg * 2.0;

    // Macros @ maintenance
    const { sum, p, c, f } = validateMacroSum();
    let macroBreakdown: string;
    
    if (sum !== 100) {
      macroBreakdown = `Macros must equal 100%. (Current = ${sum}%)`;
    } else {
      const kcal = maintain;
      const pG = (kcal * (p / 100)) / 4;
      const cG = (kcal * (c / 100)) / 4;
      const fG = (kcal * (f / 100)) / 9;
      macroBreakdown = `Maintenance ${to2(kcal)} kcal with ${p}/${c}/${f} (%):
• Protein:  ${to2(pG)} g
• Carbs:    ${to2(cG)} g
• Fat:      ${to2(fG)} g`;
    }

    // Equations shown with numbers
    const equation = `Mifflin–St Jeor (${sex}):
BMR = 10·kg + 6.25·cm − 5·age + s
    = 10·${metrics.kg.toFixed(2)} + 6.25·${metrics.cm.toFixed(2)} − 5·${ageVal} + ${sex === 'male' ? 5 : -161}
    = ${to2(bmr)} kcal

TDEE = BMR × activity = ${to2(bmr)} × ${act.toFixed(2)} = ${to2(tdee)} kcal

Macros @ maintenance:
kcal × (macro%)/cal_per_gram
protein & carbs: 4 kcal/g • fat: 9 kcal/g.`;

    setResults({
      bmr: to2(bmr) + ' kcal',
      activityFactor: '× ' + act.toFixed(2),
      tdee: to2(tdee) + ' kcal',
      bmi: bmi ? bmi.toFixed(1) : '—',
      maintain: to2(maintain) + ' kcal',
      cut: to2(gentleCut) + ' kcal',
      bulk: to2(bulk) + ' kcal',
      protein: to2(proteinTargetG) + ' g',
      macroBreakdown,
      equation
    });
  };

  const reset = () => {
    setSex('male');
    setUnit('imperial');
    setAge(29);
    setHeightFt(5);
    setHeightIn(9);
    setWeightLb(143);
    setHeightCm(175);
    setWeightKg(65);
    setActivity(1.55);
    setProteinPct(25);
    setCarbPct(50);
    setFatPct(25);
    
    setResults({
      bmr: '—',
      activityFactor: '—',
      tdee: '—',
      bmi: '—',
      maintain: '—',
      cut: '—',
      bulk: '—',
      protein: '—',
      macroBreakdown: '—',
      equation: 'Mifflin–St Jeor (male): BMR = 10·kg + 6.25·cm − 5·age + 5\nTDEE = BMR × activity\nkcal → macros: protein = P%/4, carbs = C%/4, fat = F%/9'
    });
  };

  const prefill = () => {
    setSex('male');
    setAge(29);
    setHeightFt(5);
    setHeightIn(9);
    setWeightLb(143);
    setHeightCm(175);
    setWeightKg(65);
    setActivity(1.55);
    setProteinPct(25);
    setCarbPct(50);
    setFatPct(25);
    calculate();
  };

  // Auto-calculate on component mount
  useEffect(() => {
    calculate();
  }, []);

  // Update calculations when inputs change
  useEffect(() => {
    calculate();
  }, [sex, unit, age, heightFt, heightIn, weightLb, heightCm, weightKg, activity, proteinPct, carbPct, fatPct]);

  return (
    <div className="grid">
      {/* Inputs */}
      <section className="card">
        <h2>Inputs</h2>

        <div className="row">
          <div>
            <label>Sex</label>
            <div className="seg">
              <button
                type="button"
                className={sex === 'male' ? 'active' : ''}
                onClick={() => setSex('male')}
              >
                Male
              </button>
              <button
                type="button"
                className={sex === 'female' ? 'active' : ''}
                onClick={() => setSex('female')}
              >
                Female
              </button>
            </div>
          </div>
          <div>
            <label>Age</label>
            <input
              type="number"
              min="10"
              max="100"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="row">
          <div>
            <label>Units</label>
            <div className="seg">
              <button
                type="button"
                className={unit === 'imperial' ? 'active' : ''}
                onClick={() => setUnit('imperial')}
              >
                Imperial
              </button>
              <button
                type="button"
                className={unit === 'metric' ? 'active' : ''}
                onClick={() => setUnit('metric')}
              >
                Metric
              </button>
            </div>
          </div>
          <div className="inline" style={{ justifyContent: 'space-between', marginTop: '22px' }}>
            <button
              className="btn secondary"
              type="button"
              onClick={prefill}
              title="Prefill your data"
            >
              Prefill yours
            </button>
            <span className="pill">Equation: Mifflin–St Jeor</span>
          </div>
        </div>

        {/* Height & Weight */}
        {unit === 'imperial' ? (
          <div>
            <div className="row">
              <div>
                <label>Height — feet</label>
                <input
                  type="number"
                  min="3"
                  max="8"
                  value={heightFt}
                  onChange={(e) => setHeightFt(Number(e.target.value))}
                />
              </div>
              <div>
                <label>Height — inches</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={heightIn}
                  onChange={(e) => setHeightIn(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="row">
              <div>
                <label>Weight — pounds</label>
                <input
                  type="number"
                  min="60"
                  max="500"
                  value={weightLb}
                  onChange={(e) => setWeightLb(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="muted">Conversions</label>
                <div className="code">
                  {to2(weightLb * 0.45359237)} kg • {to2(((heightFt * 12) + heightIn) * 2.54)} cm
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="row">
              <div>
                <label>Height — cm</label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                />
              </div>
              <div>
                <label>Weight — kg</label>
                <input
                  type="number"
                  min="40"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Activity */}
        <div className="row">
          <div>
            <label>Activity level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
            >
              <option value="1.2">Sedentary — little/no exercise (×1.20)</option>
              <option value="1.375">Light — 1–3 days/week (×1.375)</option>
              <option value="1.55">Moderate — 3–5 days/week (×1.55)</option>
              <option value="1.725">Active — 6–7 days/week (×1.725)</option>
              <option value="1.9">Very active — hard exercise + physical job (×1.90)</option>
            </select>
          </div>
          <div>
            <label>One-click: your routine</label>
            <button
              className="btn"
              type="button"
              onClick={() => setActivity(1.55)}
              title="Every other day ~ moderate"
            >
              Set to "every other day" (×1.55)
            </button>
          </div>
        </div>

        {/* Macros */}
        <div className="card" style={{ marginTop: '12px' }}>
          <h2 style={{ marginTop: 0 }}>Macro split (editable)</h2>
          <div className="macros">
            <div className="macro-row">
              <div><span className="pill">Protein</span></div>
              <input
                type="number"
                min="10"
                max="40"
                value={proteinPct}
                onChange={(e) => setProteinPct(Number(e.target.value))}
              />
              <div className="muted">%</div>
            </div>
            <div className="macro-row">
              <div><span className="pill">Carbs</span></div>
              <input
                type="number"
                min="30"
                max="70"
                value={carbPct}
                onChange={(e) => setCarbPct(Number(e.target.value))}
              />
              <div className="muted">%</div>
            </div>
            <div className="macro-row">
              <div><span className="pill">Fat</span></div>
              <input
                type="number"
                min="15"
                max="40"
                value={fatPct}
                onChange={(e) => setFatPct(Number(e.target.value))}
              />
              <div className="muted">%</div>
            </div>
            <div className="foot">Tip: Macros must add up to <strong>100%</strong>.</div>
          </div>
        </div>

        <div className="inline" style={{ marginTop: '14px', gap: '10px' }}>
          <button className="btn" type="button" onClick={calculate}>
            Calculate
          </button>
          <button className="btn secondary" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="card">
        <h2>Results</h2>

        <div className="result-grid" style={{ marginBottom: '10px' }}>
          <div className="kpi">
            <div className="label">BMR (Basal Metabolic Rate)</div>
            <div className="value">{results.bmr}</div>
          </div>
          <div className="kpi">
            <div className="label">Activity Factor</div>
            <div className="value">{results.activityFactor}</div>
          </div>
          <div className="kpi">
            <div className="label">TDEE (Total Daily Energy Expenditure)</div>
            <div className="value hl">{results.tdee}</div>
          </div>
          <div className="kpi">
            <div className="label">BMI (Body Mass Index)</div>
            <div className="value">{results.bmi}</div>
          </div>
        </div>

        <div className="row">
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Targets</h2>
            <div className="row">
              <div className="kpi">
                <div className="label">Maintain</div>
                <div className="value">{results.maintain}</div>
              </div>
              <div className="kpi">
                <div className="label">Slow cut (~-0.5 lb/wk)</div>
                <div className="value">{results.cut}</div>
              </div>
            </div>
            <div className="row" style={{ marginTop: '10px' }}>
              <div className="kpi">
                <div className="label">Lean bulk</div>
                <div className="value">{results.bulk}</div>
              </div>
              <div className="kpi">
                <div className="label">Protein Target (grams)</div>
                <div className="value">{results.protein}</div>
              </div>
            </div>
          </div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Macro breakdown @ maintenance</h2>
            <div className="code">{results.macroBreakdown}</div>
          </div>
        </div>

        <h2 style={{ marginTop: '14px' }}>Equations</h2>
        <div className="code">{results.equation}</div>
      </section>
    </div>
  );
};

export default CalorieCalculator;
