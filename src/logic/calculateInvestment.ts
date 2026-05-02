export type InvestmentInput = {
  purchasePrice: number;
  residualValue: number;
  lifetime: number;
  financingType: string;
  downPayment: number;
  interestRate: number;
  financingTerm: number;
  servicePerYear: number;
  insurancePerYear: number;
  hoursPerYear: number;
  margin: number;
  annualSavings: number;
  extraRevenue: number;
};

export function calculateInvestment(input: InvestmentInput) {
  const {
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
  } = input;

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

  const requiredRevenue = annualOperatingCost - annualSavings;

  const marginAmount = sellingPrice - costPerHour;

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

  const advisorBullets: string[] = [];

  if (annualProfit > 0) {
    advisorBullets.push(
      "The investment generates a positive annual profit based on current assumptions."
    );
  } else {
    advisorBullets.push(
      "The investment does not generate positive annual profit under current assumptions."
    );
  }

  if (payback <= 3) {
    advisorBullets.push("Payback period is within a strong investment range.");
  } else if (payback <= 6) {
    advisorBullets.push(
      "Payback period is acceptable, but should be validated against company policy."
    );
  } else {
    advisorBullets.push(
      "Payback period is long and should be challenged before approval."
    );
  }

  if (marginPercent >= 25) {
    advisorBullets.push("Margin level is healthy.");
  } else {
    advisorBullets.push(
      "Margin is below recommended level. Consider higher pricing or lower operating cost."
    );
  }

  if (breakEvenHours <= hoursPerYear) {
    advisorBullets.push("Expected utilization is above break-even requirement.");
  } else {
    advisorBullets.push(
      "Expected utilization is below break-even requirement. Increase usage or adjust pricing."
    );
  }

  const recommendedActions: string[] = [];

  if (marginPercent < 25) {
    recommendedActions.push(
      "Increase target margin to at least 25% if market allows."
    );
  }

  if (breakEvenHours > hoursPerYear) {
    recommendedActions.push(
      "Increase annual utilization or reduce fixed operating cost."
    );
  }

  if (payback > 5) {
    recommendedActions.push(
      "Review investment price, residual value or financing structure."
    );
  }

  if (interestRate > 10 && financingType !== "Cash") {
    recommendedActions.push(
      "Review financing terms due to high interest rate."
    );
  }

  if (recommendedActions.length === 0) {
    recommendedActions.push(
      "No critical actions identified. Validate assumptions before final approval."
    );
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
    totalAnnualBenefit,
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
}