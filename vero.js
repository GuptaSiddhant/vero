#! /usr/env/bin node
// @ts-check

const { log, clear } = console;
const income = parseFloat(process.argv[2]) || 1;
const tax = calculateIncomeTaxPercentage(income);
const employeePensionCost = calculatePensionCost(income);
const employeeInsurance = calculateInsuranceCost(income);
const taxPercentage = round(tax * 100);
const inHandSalary = round(
  income * (1 - tax) - employeeInsurance - employeePensionCost
);

const intl = new Intl.NumberFormat("fi-FI", {
  maximumSignificantDigits: 2,
  style: "currency",
  currency: "EUR",
});

clear();
log("Income per month:", intl.format(income));
log("Income tax percentage:", taxPercentage + "%");
log("Total tax:", intl.format(income - inHandSalary));
log("In-hand salary:", intl.format(inHandSalary));

/** @param {number} income */
function calculatePensionCost(income) {
  return round(income * 0.0745);
}

/** @param {number} income */
function calculateInsuranceCost(income) {
  return round(income * 0.0125);
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

/** @param {number} num */
function round(num) {
  return Math.round(num * 100) / 100;
}
