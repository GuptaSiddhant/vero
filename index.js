#!/usr/bin/env node
// @ts-check

const arg = process.argv[2];
if (!arg) {
  console.error("Salary is not provided");
  process.exit(1);
}
const income = parseFloat(arg);
const tax = calculateIncomeTaxPercentage(income);
const employeePensionCost = calculatePensionCost(income);
const employeeInsurance = calculateInsuranceCost(income);
const taxPercentage = tax * 100;
const incomeTax = income * tax;
const totalTax = incomeTax + employeeInsurance + employeePensionCost;
const inHandSalary = income - totalTax;

const intl = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: "currency",
  currency: "EUR",
});

console.clear();
console.table({
  "Income per month": intl.format(income),
  ["Income tax" + " (" + taxPercentage + "%)"]: intl.format(incomeTax),
  "Pension cost": intl.format(employeePensionCost),
  "Insurance cost": intl.format(employeeInsurance),
  "Total tax": intl.format(totalTax),
  "In-hand salary": intl.format(inHandSalary),
});

/** @param {number} income */
function calculatePensionCost(income) {
  return income * 0.0745;
}

/** @param {number} income */
function calculateInsuranceCost(income) {
  return income * 0.0125;
}

/** @param {number} income */
function calculateIncomeTaxPercentage(income) {
  var yearlyIncome = calculateYearlyIncome(income);
  var incomeTax = calculateIncomeTax(yearlyIncome);
  var municipalTax = calculateMunicipalTax(yearlyIncome);
  var yearlyTax = incomeTax + municipalTax;
  var taxPercentage = Math.round((yearlyTax / yearlyIncome) * 1000) / 1000;
  return taxPercentage;
}

/** @param {number} income */
function calculateYearlyIncome(income) {
  return income * 12 * 1.05;
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

/** @param {number} yearlyIncome */
function calculateMunicipalTax(yearlyIncome) {
  return yearlyIncome * 0.1983;
}
