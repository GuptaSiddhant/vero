#!/usr/bin/env node
//@ts-check

const pensionMultiplier = 0.0745,
  insuranceMultiplier = 0.0125,
  locale = undefined;

//@ts-ignore
const { argv, exit } = process;
console.clear();
if (argv.length <= 2) {
  console.error("ERROR", "Income is not provided");
  exit(1);
} else console.table(argv.slice(2).map(generateOutputObject));

/** @param {number} monthlyIncome */
function generateOutputObject(monthlyIncome) {
  const incomeTaxMultiplier = calculateIncomeTaxPercentage(monthlyIncome),
    employeePensionCost = monthlyIncome * pensionMultiplier,
    employeeInsuranceCost = monthlyIncome * insuranceMultiplier,
    incomeTax = monthlyIncome * incomeTaxMultiplier,
    totalTax = incomeTax + employeeInsuranceCost + employeePensionCost,
    totalTaxMultiplier = totalTax / monthlyIncome,
    inHandSalary = monthlyIncome - totalTax,
    intlCurrency = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "currency",
      currency: "EUR",
    }).format,
    intlPercent = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "percent",
    }).format;

  return {
    "Income/month": intlCurrency(monthlyIncome),
    "Income tax (%)": intlPercent(incomeTaxMultiplier),
    "Income tax": intlCurrency(incomeTax),
    [`Pension (${intlPercent(pensionMultiplier)})`]: intlCurrency(
      employeePensionCost
    ),
    [`Insurance (${intlPercent(insuranceMultiplier)})`]: intlCurrency(
      employeeInsuranceCost
    ),
    "Deduction (%)": intlPercent(totalTaxMultiplier),
    Deduction: intlCurrency(totalTax),
    "In-hand": intlCurrency(inHandSalary),
  };
}

/** @param {number} monthlyIncome */
function calculateIncomeTaxPercentage(monthlyIncome) {
  const yearlyIncome = monthlyIncome * 12 * 1.05;
  const incomeTax = calculateIncomeTax(yearlyIncome);
  const municipalTax = yearlyIncome * 0.1983;
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
