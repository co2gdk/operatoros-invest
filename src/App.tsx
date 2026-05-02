import { useMemo, useState } from "react";
import { formatHours, formatMoney, formatNumber } from "./utils/format";
import { calculateInvestment } from "./logic/calculateInvestment";
import { downloadReport } from "./reports/downloadReport";
import "./App.css";
export default function App() {
  const [step, setStep] = useState(1);

  const [country, setCountry] = useState("Denmark");
const [companyId, setCompanyId] = useState("25019776");
const [companyName, setCompanyName] = useState("Delpro A/S");
const [projectName, setProjectName] = useState("New asset investment");
const [department, setDepartment] = useState("Operations");
const [investmentType, setInvestmentType] = useState("Machinery");
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
  const [annualSavings, setAnnualSavings] = useState(150000);
  const [extraRevenue, setExtraRevenue] = useState(250000);
  
 const result = useMemo(
  () =>
    calculateInvestment({
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
      annualSavings,
      extraRevenue,
    }),
  [
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
    annualSavings,
    extraRevenue,
  ]
);

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <Header />

        <Progress step={step} />

        <section className="operator-card" style={styles.card}>
          {step === 1 && (
            <CompanyStep
  country={country}
  setCountry={setCountry}
  companyId={companyId}
  setCompanyId={setCompanyId}
  companyName={companyName}
  setCompanyName={setCompanyName}
  projectName={projectName}
  setProjectName={setProjectName}
  department={department}
  setDepartment={setDepartment}
  investmentType={investmentType}
  setInvestmentType={setInvestmentType}
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
              annualSavings={annualSavings}
              setAnnualSavings={setAnnualSavings}
              extraRevenue={extraRevenue}
              setExtraRevenue={setExtraRevenue}
            />
          )}

          {step === 5 && (
           <ResultsStep
  result={result}
  companyName={companyName}
  projectName={projectName}
  currency={currency}
  downloadReport={downloadReport}
/>
          )}

          <div className="operator-nav" style={styles.nav}>
            <button
              className="operator-secondary-button"
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
              className="operator-primary-button"
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

      <div className="operator-badge-row">
        <span className="operator-badge">● Live calculation</span>
        <span className="operator-badge">● Executive PDF</span>
        <span className="operator-badge">● TCO / ROI / Payback</span>
        <span className="operator-badge">● Decision advisor</span>
      </div>
    </header>
  );
}

function Progress({ step }: { step: number }) {
  const labels = ["Company", "Asset", "Financing", "Operations", "Results"];

  return (
    <div className="operator-progress" style={styles.progressCard}>
      {labels.map((label, index) => {
        const active = step === index + 1;
        const done = step > index + 1;

        return (
          <div key={label} className="operator-progress-item" style={styles.progressItem}>
            <div
              style={{
                ...styles.progressDot,
                background: active || done ? "#0073a8" : "#e2e8f0",
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

      <Select
        label="Country"
        value={props.country}
        setter={props.setCountry}
        options={["Denmark", "Germany", "Sweden", "Norway", "UK", "USA", "Other"]}
      />

      <Field
        label="Company ID / CVR / VAT"
        value={props.companyId}
        setter={props.setCompanyId}
        type="text"
      />

      <button
        type="button"
        className="operator-lookup-button"
        style={styles.lookupButton}
        onClick={() => alert("Company lookup coming soon")}
      >
        Lookup Company
      </button>

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
        label="Department"
        value={props.department}
        setter={props.setDepartment}
        options={[
          "Operations",
          "Fleet",
          "Procurement",
          "Finance",
          "Logistics",
          "Energy",
          "Other",
        ]}
      />

      <Select
        label="Investment Type"
        value={props.investmentType}
        setter={props.setInvestmentType}
        options={[
          "Machinery",
          "Vehicles",
          "Software",
          "Personnel",
          "Projects",
          "Subscription",
          "Facilities",
          "Energy",
          "Logistics",
          "Other",
        ]}
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
        help="Total acquisition cost excluding VAT, including purchase price but excluding financing cost."
      />

      <Field
        label="Residual / Scrap Value"
        value={props.residualValue}
        setter={props.setResidualValue}
        help="Expected resale or scrap value at the end of the asset lifetime."
      />

      <Field
        label="Expected Lifetime (Years)"
        value={props.lifetime}
        setter={props.setLifetime}
        help="How many years the investment is expected to be operationally useful."
      />
    </>
  );
}

function FinancingStep(props: any) {
  return (
    <>
      <StepTitle
        title="Financing"
        text="Model how the investment is funded and how financing impacts annual cost."
      />

      <Select
        label="Financing Type"
        value={props.financingType}
        setter={props.setFinancingType}
        options={["Cash", "Loan", "Lease"]}
        help="Choose whether the investment is paid upfront, financed through a loan, or handled as a lease."
      />

      {props.financingType !== "Cash" && (
        <>
          <Field
            label="Down Payment"
            value={props.downPayment}
            setter={props.setDownPayment}
            help="Initial payment made before financing the remaining amount."
          />

          <Field
            label="Interest Rate %"
            value={props.interestRate}
            setter={props.setInterestRate}
            help="Annual interest rate used to estimate the financing cost."
          />

          <Field
            label="Financing Term (Years)"
            value={props.financingTerm}
            setter={props.setFinancingTerm}
            help="Expected financing or leasing period in years."
          />

          <div style={styles.infoBox}>
            <p style={styles.muted}>Estimated Monthly Payment</p>
            <h2>{formatMoney(props.result.monthlyPayment, props.currency)}</h2>
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
        text="Define operating cost, expected utilization, savings and commercial assumptions."
      />

      <div style={styles.sectionTitle}>Operating Costs</div>

      <Field
        label="Service & Maintenance / Year"
        value={props.servicePerYear}
        setter={props.setServicePerYear}
        help="Expected annual cost for service, maintenance, calibration, inspections and repairs."
      />

      <Field
        label="Insurance / Year"
        value={props.insurancePerYear}
        setter={props.setInsurancePerYear}
        help="Expected annual insurance cost related to the investment."
      />

      <div style={styles.sectionTitle}>Utilization</div>

      <Field
        label="Expected Productive Hours / Year"
        value={props.hoursPerYear}
        setter={props.setHoursPerYear}
        help="Expected annual hours where the asset is actively creating value."
      />

      <div style={styles.sectionTitle}>Pricing & Benefits</div>

      <Field
        label="Target Margin %"
        value={props.margin}
        setter={props.setMargin}
        help="Target margin used to calculate recommended selling price per hour."
      />

      <Field
        label="Annual Savings"
        value={props.annualSavings}
        setter={props.setAnnualSavings}
        help="Annual cost reduction created by the investment, such as less outsourcing, less downtime or lower operating cost."
      />

      <Field
        label="Additional Revenue / Year"
        value={props.extraRevenue}
        setter={props.setExtraRevenue}
        help="Expected additional yearly revenue enabled by the investment."
      />
    </>
  );
}

function ResultsStep({
  result,
  companyName,
  projectName,
  currency,
  downloadReport,
}: any) {  const recommendation =
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

      <div className="operator-report-hero" style={{ ...styles.reportHero, borderColor: result.color }}>
        <div>
          <p style={styles.muted}>Investment Recommendation</p>
          <strong style={{ color: result.color }}>{result.status}</strong>

          <p
            style={{
              marginTop: 10,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Decision level: {result.decisionLevel}
          </p>
          <p style={{ color: "#334155", fontSize: 17, lineHeight: 1.6 }}>
            {recommendation}
          </p>
        </div>

        <div className="operator-score-circle" style={styles.scoreCircle}>
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: result.color,
              lineHeight: 1,
            }}
          >
            {result.score} / 100
          </span>
          <span
            style={{
              color: "#64748b",
              fontWeight: 800,
              fontSize: 12,
              marginTop: 6,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            score
          </span>
        </div>
      </div>

      <div style={styles.sectionTitle}>Financial Highlights</div>

      <div className="operator-metrics-grid" style={styles.metricsGrid}>
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
      </div>

      <div style={styles.sectionTitle}>Pricing Intelligence</div>

      <div className="operator-metrics-grid" style={styles.metricsGrid}>
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
        />        <Metric
          label="Margin %"
          value={result.marginPercent}
        />
        <Metric
          label="Break-even Hours"
          value={result.breakEvenHours === Infinity ? 0 : result.breakEvenHours}
        />
        <Metric
          label="Required Revenue"
          value={result.requiredRevenue}
          currency={currency}
        />
        <Metric
          label="Payback (Years)"
          value={result.payback === Infinity ? 0 : result.payback}
        />        <Metric
          label="Financing Cost Total"
          value={result.financingCostTotal}
          currency={currency}
        />
      </div>

      <div style={styles.assumptionBox}>
        <h3 style={{ marginTop: 0 }}>Advisor Notes</h3>

        <ul style={{ color: "#475569", lineHeight: 1.8 }}>
          {result.advisorBullets.map((bullet: string) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>

        <h3>Recommended Actions</h3>

        <ul style={{ color: "#475569", lineHeight: 1.8 }}>
          {result.recommendedActions.map((action: string) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </div>

<button
  className="operator-download-button"
  style={styles.downloadButton}
  onClick={() =>
    downloadReport({
      companyName,
      projectName,
      currency,
      result,
    })
  }
>
  Download Executive Report
</button>    </>
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

function Field({ label, value, setter, type = "number", help }: any) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={styles.label}>{label}</label>

      <input
        className="operator-input"
        style={styles.input}
        type={type}
        value={value}
        onChange={(e) =>
          setter(type === "number" ? Number(e.target.value) : e.target.value)
        }
      />

      {help && <p style={styles.helpText}>{help}</p>}
    </div>
  );
}

function Select({ label, value, setter, options, help }: any) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={styles.label}>{label}</label>

      <select
        className="operator-input"
        style={styles.input}
        value={value}
        onChange={(e) => setter(e.target.value)}
      >
        {options.map((option: string) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      {help && <p style={styles.helpText}>{help}</p>}
    </div>
  );
}

function Metric({ label, value, currency }: any) {
  const isHours = label.toLowerCase().includes("hours");

  return (
    <div style={styles.metric}>
      <p style={styles.muted}>{label}</p>
      <h2>
        {isHours
          ? `${formatHours(value)} hours`
          : currency
          ? formatMoney(value, currency)
          : formatNumber(value)}
      </h2>
    </div>
  );
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
    color: "#0073a8",
    fontWeight: 800,
    letterSpacing: "0.14em",
    marginBottom: 8,
  },
  title: {
    fontSize: 54,
    margin: "0 0 14px",
    lineHeight: 1,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 20,
    margin: 0,
    lineHeight: 1.5,
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
  },
  reportHero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 140px",
    gap: 24,
    alignItems: "center",
    padding: 28,
    borderRadius: 24,
    background: "#f8fafc",
    border: "2px solid",
    marginBottom: 26,
    overflow: "hidden",
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
    color: "#0073a8",
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
    background: "#0073a8",
    color: "white",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
  },
  lookupButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    border: "none",
    background: "#0073a8",
    color: "white",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
    marginBottom: 18,
  },
  helpText: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: 13,
    lineHeight: 1.45,
  },
};