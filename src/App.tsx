import { useMemo, useState } from "react";
import jsPDF from "jspdf";
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
    const totalAnnualBenefit = revenuePerYear + annualSavings + extraRevenue;
    const annualProfit = totalAnnualBenefit - annualOperatingCost;
    const profitPerHour = sellingPrice - costPerHour;

    const breakEvenHours =
      profitPerHour > 0 ? annualOperatingCost / profitPerHour : Infinity;

    const requiredRevenue =
      annualOperatingCost - annualSavings;

    const marginAmount =
      sellingPrice - costPerHour;

    const marginPercent =
      sellingPrice > 0 ? (marginAmount / sellingPrice) * 100 : 0;

    const payback =
      annualProfit > 0 ? purchasePrice / annualProfit : Infinity;

    const tco =
      purchasePrice +
      servicePerYear * lifetime +
      insurancePerYear * lifetime +
      financingCostTotal -
      residualValue;

    let score = 0;

    if (annualProfit > 0) score += 20;

    if (payback <= 2) score += 25;
    else if (payback <= 4) score += 18;
    else if (payback <= 6) score += 10;

    if (marginPercent >= 25) score += 15;
    else if (marginPercent >= 15) score += 8;

    if (breakEvenHours <= hoursPerYear * 0.75) score += 15;
    else if (breakEvenHours <= hoursPerYear) score += 8;

    if (residualValue > purchasePrice * 0.15) score += 10;
    else if (residualValue > 0) score += 5;

    if (financingType === "Cash") score += 10;
    else if (interestRate <= 6) score += 10;
    else if (interestRate <= 10) score += 5;

    score = Math.min(score, 100);

    let status = "Reject or redesign";
    let decisionLevel = "High risk";
    let color = "#dc2626";

    if (score >= 80) {
      status = "Strong investment";
      decisionLevel = "Approve";
      color = "#16a34a";
    } else if (score >= 65) {
      status = "Good investment with conditions";
      decisionLevel = "Approve with conditions";
      color = "#65a30d";
    } else if (score >= 50) {
      status = "Viable, but assumptions must be reviewed";
      decisionLevel = "Review before approval";
      color = "#f97316";
    }

    const advisorBullets = [];

    if (annualProfit > 0) {
      advisorBullets.push("The investment generates a positive annual profit based on current assumptions.");
    } else {
      advisorBullets.push("The investment does not generate positive annual profit under current assumptions.");
    }

    if (payback <= 3) {
      advisorBullets.push("Payback period is within a strong investment range.");
    } else if (payback <= 6) {
      advisorBullets.push("Payback period is acceptable, but should be validated against company policy.");
    } else {
      advisorBullets.push("Payback period is long and should be challenged before approval.");
    }

    if (marginPercent >= 25) {
      advisorBullets.push("Margin level is healthy.");
    } else {
      advisorBullets.push("Margin is below recommended level. Consider higher pricing or lower operating cost.");
    }

    if (breakEvenHours <= hoursPerYear) {
      advisorBullets.push("Expected utilization is above break-even requirement.");
    } else {
      advisorBullets.push("Expected utilization is below break-even requirement. Increase usage or adjust pricing.");
    }

    const recommendedActions = [];

    if (marginPercent < 25) {
      recommendedActions.push("Increase target margin to at least 25% if market allows.");
    }

    if (breakEvenHours > hoursPerYear) {
      recommendedActions.push("Increase annual utilization or reduce fixed operating cost.");
    }

    if (payback > 5) {
      recommendedActions.push("Review investment price, residual value or financing structure.");
    }

    if (interestRate > 10 && financingType !== "Cash") {
      recommendedActions.push("Review financing terms due to high interest rate.");
    }

    if (recommendedActions.length === 0) {
      recommendedActions.push("No critical actions identified. Validate assumptions before final approval.");
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
      breakEvenHours,
      requiredRevenue,
      marginAmount,
      marginPercent,
      payback,
      tco,
      score,
      status,
      decisionLevel,
      color,
      advisorBullets,
      recommendedActions,
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
    annualSavings,
    extraRevenue,
  ]);
function downloadReport() {
    const doc = new jsPDF();

    const left = 20;
    let y = 20;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("OperatorOS Invest", left, 18);

    doc.setTextColor(249, 115, 22);
    doc.setFontSize(10);
    doc.text("EXECUTIVE INVESTMENT REPORT", 145, 18);

    y = 42;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.text("Executive Summary", left, y);

    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(`Company: ${companyName}`, left, y);
    y += 7;
    doc.text(`Project: ${projectName}`, left, y);
    y += 7;
    doc.text(`Currency: ${currency}`, left, y);

    y += 14;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text("Decision Intelligence", left, y);

    y += 10;
    doc.setFontSize(11);
    doc.text(`Investment Score: ${result.score}/100`, left, y);
    y += 7;
    doc.text(`Decision Level: ${result.decisionLevel}`, left, y);
    y += 7;
    doc.text(`Recommendation: ${result.status}`, left, y);

    y += 14;

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Financial Highlights", left, y);

    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);

    const financialRows = [
      ["TCO", formatMoney(result.tco, currency)],
      ["Annual Operating Cost", formatMoney(result.annualOperatingCost, currency)],
      ["Annual Profit", formatMoney(result.annualProfit, currency)],
      ["Payback", `${formatNumber(result.payback === Infinity ? 0 : result.payback)} years`],
      ["Break-even Hours", formatNumber(result.breakEvenHours === Infinity ? 0 : result.breakEvenHours)],
      ["Required Revenue", formatMoney(result.requiredRevenue, currency)],
      ["Margin", `${formatNumber(result.marginPercent)} %`],
    ];

    financialRows.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, left, y);
      y += 7;
    });

    y += 8;

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Pricing Intelligence", left, y);

    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);

    const pricingRows = [
      ["Cost / Hour", formatMoney(result.costPerHour, currency)],
      ["Selling Price / Hour", formatMoney(result.sellingPrice, currency)],
      ["Profit / Hour", formatMoney(result.profitPerHour, currency)],
      ["Financing Cost Total", formatMoney(result.financingCostTotal, currency)],
    ];

    pricingRows.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, left, y);
      y += 7;
    });

    y += 8;

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Advisor Notes", left, y);

    y += 9;
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    result.advisorBullets.forEach((bullet: string) => {
      const lines = doc.splitTextToSize(`• ${bullet}`, 170);
      doc.text(lines, left, y);
      y += lines.length * 6;
    });

    y += 6;

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Recommended Actions", left, y);

    y += 9;
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    result.recommendedActions.forEach((action: string) => {
      const lines = doc.splitTextToSize(`• ${action}`, 170);
      doc.text(lines, left, y);
      y += lines.length * 6;
    });

    y += 12;

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "This report is generated from current user assumptions and should be validated before final approval.",
      left,
      y,
      { maxWidth: 170 }
    );

    doc.save(`OperatorOS-Invest-${projectName}.pdf`);
  }
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
      <Field
        label="Annual Savings"
        value={props.annualSavings}
        setter={props.setAnnualSavings}
      />
      <Field
        label="Extra Revenue / Year"
        value={props.extraRevenue}
        setter={props.setExtraRevenue}
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
          <span style={{ fontSize: 34, fontWeight: 900, color: result.color }}>
            {result.score}
          </span>
          <span style={{ color: "#64748b", fontWeight: 700 }}>/100</span>
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

      <button className="operator-download-button" style={styles.downloadButton} onClick={downloadReport}>
  Download Executive Report
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
        className="operator-input"
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
        className="operator-input"
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
  },lookupButton: {
  width: "100%",
  height: 48,
  borderRadius: 14,
  border: "none",
  background: "#f97316",
  color: "white",
  fontSize: 16,
  fontWeight: 900,
  cursor: "pointer",
  marginBottom: 18,
},
};