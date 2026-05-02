import jsPDF from "jspdf";
import { formatHours, formatMoney, formatNumber } from "../utils/format";

export function downloadReport({
  companyName,
  projectName,
  currency,
  result,
}: any) {
  const doc = new jsPDF();

  const pageWidth = 210;
  const left = 18;
  const right = 192;
  let y = 18;

  function addPageIfNeeded(requiredSpace = 30) {
    if (y + requiredSpace > 275) {
      doc.addPage();
      y = 24;

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 18, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("OperatorOS Invest", left, 12);

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
    }
  }

  function sectionTitle(title: string) {
    addPageIfNeeded(24);

    y += 8;
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), left, y);
    y += 7;
  }

  function labelValue(label: string, value: string) {
    addPageIfNeeded(12);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(label, left, y);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(value, right, y, { align: "right" });

    y += 7;
  }

  function metricBox(label: string, value: string, x: number, yPos: number) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, yPos, 83, 24, 4, 4, "FD");

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(label, x + 5, yPos + 8);

    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(value, x + 5, yPos + 17);
  }

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 34, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("OperatorOS Invest", left, 19);

  doc.setTextColor(249, 115, 22);
  doc.setFontSize(9);
  doc.text("EXECUTIVE INVESTMENT REPORT", left, 27);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleDateString(), right, 20, { align: "right" });

  y = 48;

  // Executive summary card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(left, y, 174, 42, 5, 5, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", left + 6, y + 11);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Company: ${companyName}`, left + 6, y + 21);
  doc.text(`Project: ${projectName}`, left + 6, y + 29);
  doc.text(`Currency: ${currency}`, left + 6, y + 37);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(249, 115, 22);
  doc.roundedRect(150, y + 8, 34, 26, 5, 5, "FD");

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(249, 115, 22);
  doc.text(`${result.score} / 100`, 167, y + 22, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("score", 167, y + 30, { align: "center" });

  y += 55;

  sectionTitle("Decision intelligence");

  labelValue("Decision Level", result.decisionLevel);
  labelValue("Recommendation", result.status);
  labelValue("Investment Score", `${result.score}/100`);

  y += 4;

  sectionTitle("Financial highlights");

  metricBox("TCO", formatMoney(result.tco, currency), left, y);
  metricBox("Annual Profit", formatMoney(result.annualProfit, currency), left + 91, y);

  y += 32;

  metricBox(
    "Payback",
    `${formatNumber(result.payback === Infinity ? 0 : result.payback)} years`,
    left,
    y
  );
  metricBox(
    "Break-even Hours",
    `${formatHours(result.breakEvenHours === Infinity ? 0 : result.breakEvenHours)} hours`,
    left + 91,
    y
  );

  y += 34;

  sectionTitle("Pricing intelligence");

  labelValue("Cost / Hour", formatMoney(result.costPerHour, currency));
  labelValue("Selling Price / Hour", formatMoney(result.sellingPrice, currency));
  labelValue("Profit / Hour", formatMoney(result.profitPerHour, currency));
  labelValue("Margin", `${formatNumber(result.marginPercent)} %`);
  labelValue("Required Revenue", formatMoney(result.requiredRevenue, currency));
  labelValue("Financing Cost Total", formatMoney(result.financingCostTotal, currency));

  y += 4;

  sectionTitle("Advisor notes");

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);

  result.advisorBullets.forEach((bullet: string) => {
    const lines = doc.splitTextToSize(`• ${bullet}`, 170);
    addPageIfNeeded(lines.length * 6 + 8);

    doc.text(lines, left, y);
    y += lines.length * 6;
  });

  y += 4;

  sectionTitle("Recommended actions");

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);

  result.recommendedActions.forEach((action: string) => {
    const lines = doc.splitTextToSize(`• ${action}`, 170);
    addPageIfNeeded(lines.length * 6 + 8);

    doc.text(lines, left, y);
    y += lines.length * 6;
  });

  doc.setDrawColor(226, 232, 240);
  doc.line(left, 282, right, 282);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Generated by OperatorOS Invest. This report is based on user-provided assumptions and should be validated before final approval.",
    left,
    288,
    { maxWidth: 174 }
  );

  doc.save(`OperatorOS-Invest-${projectName}.pdf`);
}