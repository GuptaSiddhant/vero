#!/usr/bin/env node
// Values from EnterFinland
//@ts-check

// Constants
const pensionMultiplier = 0.0745,
  unEmpInsuranceMultiplier = 0.0125,
  municipalTaxMultiplier = 0.1983;
// Locale
const locale = undefined,
  localeFractions = { maximumFractionDigits: 2, minimumFractionDigits: 2 },
  intlCurrency = new Intl.NumberFormat(locale, {
    ...localeFractions,
    style: "currency",
    currency: "EUR",
  }).format,
  intlPercent = new Intl.NumberFormat(locale, {
    ...localeFractions,
    style: "percent",
  }).format,
  helpRow = generateOutput(
    ...["", "", `(${intlPercent(pensionMultiplier)})`],
    ...[`(${intlPercent(unEmpInsuranceMultiplier)})`, "", ""]
  );
//@ts-ignore
const { argv, exit } = process;
if (argv.length <= 2) {
  // Execute with auto-gen-values
  // Error
  // console.error("ERROR", "Income is not provided");
  // exit(1);
  const values = [];
  for (let x = 1000; x <= 10000; x = x + 1000) values.push(x.toString());
  console.table([helpRow, ...values.map(generateTaxObject)]);
} else {
  // Execute with user-value
  console.table([helpRow, ...argv.slice(2).map(generateTaxObject)]);
}
console.log("");

// -------
// HELPERS
// -------
function generateOutput() {
  return {
    "Income/month": arguments[0],
    "Income tax": arguments[1],
    Pension: arguments[2],
    Unemployment: arguments[3],
    "Total deduction": arguments[4],
    "In-hand": arguments[5],
  };
}

/** @param {string} value */
function generateTaxObject(value) {
  if (Number.isNaN(parseInt(value))) return {};

  const monthlyIncome = parseFloat(value),
    incomeTaxMultiplier = calculateIncomeTaxPercentage(monthlyIncome),
    pensionCost = monthlyIncome * pensionMultiplier,
    unEmpInsuranceCost = monthlyIncome * unEmpInsuranceMultiplier,
    incomeTax = monthlyIncome * incomeTaxMultiplier,
    totalTax = incomeTax + unEmpInsuranceCost + pensionCost,
    totalTaxMultiplier = totalTax / monthlyIncome,
    inHandSalary = monthlyIncome - totalTax;

  return {
    "Income/month": intlCurrency(monthlyIncome),
    "Income tax":
      intlCurrency(incomeTax) + " (" + intlPercent(incomeTaxMultiplier) + ")",
    Pension: intlCurrency(pensionCost),
    Unemployment: intlCurrency(unEmpInsuranceCost),
    "Total deduction":
      intlCurrency(totalTax) + " (" + intlPercent(totalTaxMultiplier) + ")",
    "In-hand":
      intlCurrency(inHandSalary) +
      " (" +
      intlPercent(1 - totalTaxMultiplier) +
      ")",
  };
}

/** @param {number} monthlyIncome */
function calculateIncomeTaxPercentage(monthlyIncome) {
  const yearlyIncome = monthlyIncome * 12 * 1.05;
  const incomeTax = calculateIncomeTax(yearlyIncome);
  const municipalTax = yearlyIncome * municipalTaxMultiplier;
  const yearlyTax = incomeTax + municipalTax;
  const taxPercentage = yearlyTax / yearlyIncome;
  return taxPercentage;
}

/** @param {number} yearlyIncome */
function calculateIncomeTax(yearlyIncome) {
  var taxableEarnedIncome;
  var taxPayableLowestAmount;
  var taxOnIncomePercentage;
  //2020
  //var taxableEarnedIncome = low end of incomeBracket. Just named badly
  if (yearlyIncome < 18100) {
    taxableEarnedIncome = 0;
    taxPayableLowestAmount = 0;
    taxOnIncomePercentage = 0;
  } else if (yearlyIncome < 27200) {
    taxableEarnedIncome = 18100;
    taxPayableLowestAmount = 8;
    taxOnIncomePercentage = 0.06;
  } else if (yearlyIncome < 44800) {
    taxableEarnedIncome = 27200;
    taxPayableLowestAmount = 554;
    taxOnIncomePercentage = 0.1725;
  } else if (yearlyIncome < 78500) {
    taxableEarnedIncome = 44800;
    taxPayableLowestAmount = 3590;
    taxOnIncomePercentage = 0.2125;
  } else {
    taxableEarnedIncome = 78500;
    taxPayableLowestAmount = 10751;
    taxOnIncomePercentage = 0.3125;
  }
  return (
    taxPayableLowestAmount +
    (yearlyIncome - taxableEarnedIncome) * taxOnIncomePercentage
  );
}
