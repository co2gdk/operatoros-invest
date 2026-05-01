import { useMemo, useState } from "react";

export default function App() {
  const [step, setStep] = useState(1);

  const [companyName, setCompanyName] = useState("Delpro A/S");
  const [projectName, setProjectName] = useState("New asset investment");
  const [currency, setCurrency] = useState("DKK");

  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [residualValue, setResidualValue] = useState(100000);
  const [lifetime, setLifetime] = useState(5);

  const [financingType, setFinancingType] = useState("Loan");
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRate, setInterestRate] = useState(6);
  const [financingTerm, setFinancingTerm] = useState(5);

  const [servicePerYear, setServicePerYear] = useState(25000);
  const [insurancePerYear, setInsurancePerYear] = useState(10000);
  const [hoursPerYear, setHoursPerYear] = useState(1200);
  const [margin, setMargin] = useState(25);

  const result = useMemo(() => {
    const depreciationBase = Math.max(purchasePrice - residualValue, 0);
    const annualDepreciation = lifetime > 0 ? depreciationBase / lifetime : 0;

    const financedAmount = Math.max(purchasePrice - downPayment, 0);
    const monthlyInterest = interestRate / 100 / 12;
    const numberOfPayments = financingTerm * 12;

    let monthlyPayment = 0;

    if (financingType === "Cash") {
      monthlyPayment = 0;
    } else if (monthlyInterest > 0 && numberOfPayments > 0) {
      monthlyPayment =
        (financedAmount *
          monthlyInterest *
          Math.pow(1 + monthlyInterest, numberOfPayments)) /
        (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);
    } else if (numberOfPayments > 0) {
      monthlyPayment = financedAmount / numberOfPayments;
    }

    const annualFinancingCost =
      financingType === "Cash" ? 0 : monthlyPayment * 12;

    const totalFinancingPayments =
      financingType === "Cash" ? 0 : monthlyPayment * numberOfPayments;

    const financingCostTotal =
      financingType === "Cash"
        ? 0
        : Math.max(totalFinancingPayments - financedAmount, 0);

    const annualOperatingCost =
      annualDepreciation +
      servicePerYear +
      insurancePerYear +
      annualFinancingCost;

    const costPerHour =
      hoursPerYear > 0 ? annualOperatingCost / hoursPerYear : 0;

    const sellingPrice = costPerHour * (1 + margin / 100);

    const revenuePerYear = sellingPrice * hoursPerYear;
    const annualProfit = revenuePerYear - annualOperatingCost;
    const profitPerHour = sellingPrice - costPerHour;

    const payback =
      annualProfit > 0 ? purchasePrice / annualProfit : Infinity;

    const tco =
      purchasePrice +
      servicePerYear * lifetime +
      insurancePerYear * lifetime +
      financingCostTotal -
      residualValue;

    let score = 0;
    if (annualProfit > 0) score += 25;
    if (margin >= 25) score += 15;
    if (payback <= 3) score += 25;
    else if (payback <= 5) score += 15;
    if (hoursPerYear >= 1200) score += 15;
    else if (hoursPerYear >= 800) score += 8;
    if (residualValue > 0) score += 10;
    if (interestRate <= 8) score += 10;

    let status = "High risk – review assumptions";
    let color = "#dc2626";

    if (score >= 75) {
      status = "Strong investment";
      color = "#16a34a";
    } else if (score >= 50) {
      status = "Operationally viable, but utilization sensitive";
      color = "#f97316";
    }

    return {
      depreciationBase,
      annualDepreciation,
      financedAmount,
      monthlyPayment,
      annualFinancingCost,
      financingCostTotal,
      annualOperatingCost,
      costPerHour,
      sellingPrice,
      revenuePerYear,
      annualProfit,
      profitPerHour,
      payback,
      tco,
      score,
      status,
      color,
    };
  }, [
    purchasePrice,
    residualValue,
    lifetime,
    financingType,
    downPayment,
    interestRate,
    financingTerm,
    servicePerYear,
    insurancePerYear,
    hoursPerYear,
    margin,
  ]);

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <Header />

        <Progress step={step} />

        <section style={styles.card}>
          {step === 1 && (
            <CompanyStep
              companyName={companyName}
              setCompanyName={setCompanyName}
              projectName={projectName}
              setProjectName={setProjectName}
              currency={currency}
              setCurrency={setCurrency}
            />
          )}

          {step === 2 && (
            <AssetStep
              purchasePrice={purchasePrice}
              setPurchasePrice={setPurchasePrice}
              residualValue={residualValue}
              setResidualValue={setResidualValue}
              lifetime={lifetime}
              setLifetime={setLifetime}
            />
          )}

          {step === 3 && (
            <FinancingStep
              financingType={financingType}
              setFinancingType={setFinancingType}
              downPayment={downPayment}
              setDownPayment={setDownPayment}
              interestRate={interestRate}
              setInterestRate={setInterestRate}
              financingTerm={financingTerm}
              setFinancingTerm={setFinancingTerm}
              result={result}
              currency={currency}
            />
          )}

          {step === 4 && (
            <OperationsStep
              servicePerYear={servicePerYear}
              setServicePerYear={setServicePerYear}
              insurancePerYear={insurancePerYear}
              setInsurancePerYear={setInsurancePerYear}
              hoursPerYear={hoursPerYear}
              setHoursPerYear={setHoursPerYear}
              margin={margin}
              setMargin={setMargin}
            />
          )}

          {step === 5 && (
            <ResultsStep
              result={result}
              companyName={companyName}
              projectName={projectName}
              currency={currency}
            />
          )}

          <div style={styles.nav}>
            <button
              style={{
                ...styles.secondaryButton,
                opacity: step === 1 ? 0.45 : 1,
                cursor: step === 1 ? "not-allowed" : "pointer",
              }}
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
            >
              ← Back
            </button>

            <button
              style={styles.primaryButton}
              onClick={() => setStep(step < 5 ? step + 1 : 1)}
            >
              {step < 5 ? "Continue →" : "Start new analysis"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header style={{ marginBottom: 30 }}>
      <div style={styles.kicker}>OPERATOROS</div>
      <h1 style={styles.title}>Invest</h1>
      <p style={styles.subtitle}>
        Turn investment decisions into operational intelligence.
      </p>
    </header>
  );
}

function Progress({ step }: { step: number }) {
  const labels = ["Company", "Asset", "Financing", "Operations", "Results"];

  return (
    <div style={styles.progressCard}>
      {labels.map((label, index) => {
        const active = step === index + 1;
        const done = step > index + 1;

        return (
          <div key={label} style={styles.progressItem}>
            <div
              style={{
                ...styles.progressDot,
                background: active || done ? "#f97316" : "#e2e8f0",
                color: active || done ? "white" : "#64748b",
              }}
            >
              {index + 1}
            </div>
            <span style={{ fontWeight: active ? 800 : 600 }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function CompanyStep(props: any) {
  return (
    <>
      <StepTitle
        title="Company Setup"
        text="Identify the company and create the investment context."
      />
      <Field
        label="Company Name"
        value={props.companyName}
        setter={props.setCompanyName}
        type="text"
      />
      <Field
        label="Project Name"
        value={props.projectName}
        setter={props.setProjectName}
        type="text"
      />
      <Select
        label="Currency"
        value={props.currency}
        setter={props.setCurrency}
        options={["DKK", "EUR", "USD", "GBP", "SEK", "NOK", "PLN"]}
      />
    </>
  );
}

function AssetStep(props: any) {
  return (
    <>
      <StepTitle
        title="Asset Investment"
        text="Enter the investment basics and expected residual value."
      />
      <Field
        label="Purchase Price"
        value={props.purchasePrice}
        setter={props.setPurchasePrice}
      />
      <Field
        label="Residual Value"
        value={props.residualValue}
        setter={props.setResidualValue}
      />
      <Field
        label="Lifetime (Years)"
        value={props.lifetime}
        setter={props.setLifetime}
      />
    </>
  );
}

function FinancingStep(props: any) {
  return (
    <>
      <StepTitle
        title="Financing"
        text="Model cash purchase, loan or leasing impact."
      />

      <Select
        label="Financing Type"
        value={props.financingType}
        setter={props.setFinancingType}
        options={["Cash", "Loan", "Lease"]}
      />

      {props.financingType !== "Cash" && (
        <>
          <Field
            label="Down Payment"
            value={props.downPayment}
            setter={props.setDownPayment}
          />
          <Field
            label="Interest Rate %"
            value={props.interestRate}
            setter={props.setInterestRate}
          />
          <Field
            label="Financing Term (Years)"
            value={props.financingTerm}
            setter={props.setFinancingTerm}
          />

          <div style={styles.infoBox}>
            <p style={styles.muted}>Estimated Monthly Payment</p>
            <h2>
              {formatMoney(props.result.monthlyPayment, props.currency)}
            </h2>
          </div>
        </>
      )}

      {props.financingType === "Cash" && (
        <div style={styles.infoBox}>
          <p style={styles.muted}>Financing Impact</p>
          <h2>Cash purchase selected</h2>
        </div>
      )}
    </>
  );
}

function OperationsStep(props: any) {
  return (
    <>
      <StepTitle
        title="Operations & Pricing"
        text="Define operating costs, utilization and target margin."
      />
      <Field
        label="Service / Year"
        value={props.servicePerYear}
        setter={props.setServicePerYear}
      />
      <Field
        label="Insurance / Year"
        value={props.insurancePerYear}
        setter={props.setInsurancePerYear}
      />
      <Field
        label="Hours / Year"
        value={props.hoursPerYear}
        setter={props.setHoursPerYear}
      />
      <Field
        label="Target Margin %"
        value={props.margin}
        setter={props.setMargin}
      />
    </>
  );
}

function ResultsStep({ result, companyName, projectName, currency }: any) {
  const recommendation =
    result.score >= 75
      ? "The investment appears financially strong and operationally viable based on the current assumptions."
      : result.score >= 50
      ? "The investment may be viable, but the assumptions should be reviewed carefully before approval."
      : "The investment carries significant financial or operational risk and should be challenged before approval.";

  return (
    <>
      <StepTitle
        title="Executive Report Preview"
        text={`${companyName} · ${projectName}`}
      />

      <div style={{ ...styles.reportHero, borderColor: result.color }}>
        <div>
          <p style={styles.muted}>Investment Recommendation</p>
          <h1 style={{ color: result.color, margin: "8px 0" }}>
            {result.status}
          </h1>
          <p style={{ color: "#334155", fontSize: 17, lineHeight: 1.6 }}>
            {recommendation}
          </p>
        </div>

        <div style={styles.scoreCircle}>
          <span style={{ fontSize: 34, fontWeight: 900, color: result.color }}>
            {result.score}
          </span>
          <span style={{ color: "#64748b", fontWeight: 700 }}>/100</span>
        </div>
      </div>

      <div style={styles.sectionTitle}>Financial Highlights</div>

      <div style={styles.metricsGrid}>
        <Metric label="TCO" value={result.tco} currency={currency} />
        <Metric
          label="Annual Operating Cost"
          value={result.annualOperatingCost}
          currency={currency}
        />
        <Metric
          label="Annual Profit"
          value={result.annualProfit}
          currency={currency}
        />
        <Metric
          label="Payback (Years)"
          value={result.payback === Infinity ? 0 : result.payback}
        />
      </div>

      <div style={styles.sectionTitle}>Pricing Intelligence</div>

      <div style={styles.metricsGrid}>
        <Metric
          label="Cost / Hour"
          value={result.costPerHour}
          currency={currency}
        />
        <Metric
          label="Selling Price / Hour"
          value={result.sellingPrice}
          currency={currency}
        />
        <Metric
          label="Profit / Hour"
          value={result.profitPerHour}
          currency={currency}
        />
        <Metric
          label="Financing Cost Total"
          value={result.financingCostTotal}
          currency={currency}
        />
      </div>

      <div style={styles.assumptionBox}>
        <h3 style={{ marginTop: 0 }}>Executive Notes</h3>
        <ul style={{ color: "#475569", lineHeight: 1.8 }}>
          <li>
            The recommendation is based on current input assumptions and should
            be validated against operational reality.
          </li>
          <li>
            Utilization, financing cost and residual value have significant
            impact on the final investment score.
          </li>
          <li>
            This preview is intended as a decision-support summary, not a final
            approval document.
          </li>
        </ul>
      </div>

      <button style={styles.downloadButton}>
        Download Executive Report — coming soon
      </button>
    </>
  );
}

function StepTitle({ title, text }: any) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 34, margin: "0 0 8px" }}>{title}</h2>
      <p style={styles.muted}>{text}</p>
    </div>
  );
}

function Field({ label, value, setter, type = "number" }: any) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        type={type}
        value={value}
        onChange={(e) =>
          setter(type === "number" ? Number(e.target.value) : e.target.value)
        }
      />
    </div>
  );
}

function Select({ label, value, setter, options }: any) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={styles.label}>{label}</label>
      <select
        style={styles.input}
        value={value}
        onChange={(e) => setter(e.target.value)}
      >
        {options.map((option: string) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function Metric({ label, value, currency }: any) {
  return (
    <div style={styles.metric}>
      <p style={styles.muted}>{label}</p>
      <h2>{currency ? formatMoney(value, currency) : formatNumber(value)}</h2>
    </div>
  );
}

function formatMoney(value: number, currency: string) {
  return `${formatNumber(value)} ${currency}`;
}

function formatNumber(value: number) {
  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#f8fafc,#eef2f7)",
    fontFamily: "Arial",
    padding: "40px",
    color: "#0f172a",
  },
  shell: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  kicker: {
    color: "#f97316",
    fontWeight: 800,
    letterSpacing: "0.14em",
    marginBottom: 8,
  },
  title: {
    fontSize: 54,
    margin: 0,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 20,
  },
  progressCard: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 12,
    marginBottom: 24,
  },
  progressItem: {
    background: "white",
    borderRadius: 18,
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid #e2e8f0",
  },
  progressDot: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },
  card: {
    background: "white",
    borderRadius: 28,
    padding: 34,
    boxShadow: "0 18px 60px rgba(15,23,42,0.12)",
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    padding: "0 14px",
    fontSize: 16,
    boxSizing: "border-box",
  },
  label: {
    display: "block",
    fontWeight: 800,
    marginBottom: 7,
    color: "#334155",
  },
  muted: {
    color: "#64748b",
    margin: 0,
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 30,
  },
  primaryButton: {
    background: "#0f172a",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryButton: {
    background: "white",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    padding: "14px 22px",
    borderRadius: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  scoreBox: {
    padding: 22,
    borderRadius: 20,
    background: "#f8fafc",
    border: "2px solid",
    marginBottom: 22,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  metric: {
    background: "#f8fafc",
    borderRadius: 18,
    padding: 18,
    border: "1px solid #e2e8f0",
  },
  infoBox: {
    background: "#f8fafc",
    borderRadius: 18,
    padding: 20,
    border: "1px solid #e2e8f0",
    marginTop: 12,
  },  reportHero: {
    display: "grid",
    gridTemplateColumns: "1fr 150px",
    gap: 24,
    alignItems: "center",
    padding: 26,
    borderRadius: 24,
    background: "#f8fafc",
    border: "2px solid",
    marginBottom: 26,
  },
  scoreCircle: {
    width: 130,
    height: 130,
    borderRadius: "50%",
    background: "white",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 15,
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#f97316",
  },
  assumptionBox: {
    marginTop: 26,
    padding: 22,
    borderRadius: 20,
    background: "white",
    border: "1px solid #e2e8f0",
  },
  downloadButton: {
    width: "100%",
    marginTop: 24,
    height: 54,
    borderRadius: 16,
    border: "none",
    background: "#f97316",
    color: "white",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
  },
};