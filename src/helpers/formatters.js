/**
adds commas to numbers after before every three digits
NOTE: make sure to run roundDecimal() first, because this will add commas after periods
ALSO NOTE: make sure to run this function last, because it converts the input to a string
https://blog.abelotech.com/posts/number-currency-formatting-javascript/
*/
export function addCommas(n) {
  return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

/**
removes trailing zeroes & decimal points
*/
export function removeTrailingZeroes(n) {
  return n
    .replace(/(\.[1-9]*)[0]*$/g, "$1") // removes trailing zeros
    .replace(/[.]$/g, ""); // removes trailing decimal point
}

/**
chops off decimal points & trailing zeroes
*/
export function roundDecimal(n, decimalPoints = 2) {
  n = parseFloat(n);
  n = removeTrailingZeroes(n.toFixed(decimalPoints));

  return n;
}

/**
completely removes decimal points
*/
export function removeDecimal(n) {
  if (typeof n === "number") {
    return n.toFixed(0);
  }
  return parseInt(n, 10);
}

/**
handles percentages;
sets the decimal floor depending on the value and adds a percent character. optionally, multiples the original value by 100
*/
export function percentage(
  n,
  times100 = false,
  commaSeparated = true // add commas by default
) {

  // multiply by 100
  if (times100) {
    n *= 100;
  }

  // remove excess digits
  n = roundDecimal(n);

  // add commas
  if (commaSeparated === true) {
    n = addCommas(n);
  }

  return n;
}

/**
handles growth; sets the decimal floor depending on the value, adds % as necessary
*/
export function growth(
  n,
  times100 = true, // is the percentage already a percentage?
  showMinus = true, // if the value follows the word "decline", no minus is necessary
  commaSeparated = true // add commas by default
) {

  // remove excess digits
  n = times100 ? n * 100 : n;
  n = roundDecimal(n);

  // remove minus
  if (showMinus === false) {
    n = n.toString().replace("-", "");
  }

  // add commas
  if (commaSeparated === true) {
    n = addCommas(n);
  }

  n += "%";

  return n;
}

/**
handles the word used for growth/decline
*/
export function growthWord(n) {
  if (n >= 0) {
    return "growth";
  }
  return "decline";
}

export function isPositive(n) {
  if (n.toString().indexOf("-") === -1) {
    return true;
  }
  return false;
}

/**
handles data sizes
WARNING: breaks with negative values
https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
*/
export function bytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return 0;
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${Math.round(bytes / Math.pow(1024, i), 2)}${sizes[i]}`;
}


/** handles numerical abbreviations */
export function abbreviateNumber(
  val,
  lang,
  addCurrency = false,
  abbreviateThousands = true
) {

  // error handling
  if (val === undefined || val === null) {
    console.log("invalid value argument in abbreviateNumber()");
    return null;
  }
  if (!lang || (lang !== "en" && lang !== "ar")) {
    console.log(`invalid lang argument ${lang} in abbreviateNumber() — 'en' or 'ar' expected`);
    return null;
  }

  // lookups
  const suffixes = {
    thousand: {
      en: "K", ar: "الف"
    },
    million: {
      en: "M", ar: "مليون"
    },
    billion: {
      en: "B", ar: "مليار"
    }
  }
  const currency = {
    sar: {
      en: "SAR", ar: "ريال"
    }
  }

  const valLength = val.toString().split(".")[0].replace("-", "").length;
  const isNegative = val < 0;

  // add the correct abbreviation
  let abbrVal = val;

  if (isNegative) abbrVal.replace("-", "");

  if (valLength < 6 && valLength > 3 && abbreviateThousands) {
    abbrVal = addCommas(roundDecimal( abbrVal / 1000, 1 ));
    abbrVal += ` ${ suffixes.thousand[lang] }`;
  }
  else if (valLength < 10 && valLength >= 6) {
    abbrVal = addCommas(roundDecimal( abbrVal / 1000000, 2 ));
    abbrVal += ` ${ suffixes.million[lang] }`;
  }
  else if (valLength >= 10) {
    abbrVal = addCommas(roundDecimal( abbrVal / 1000000000, 1 ));
    abbrVal += ` ${ suffixes.billion[lang] }`;
  }
  else {
    abbrVal = addCommas(roundDecimal( abbrVal ));
  }

  // console.log("val:", val); // debug

  // restore minus, add currency
  return `${ isNegative ? "-" : "" }${ addCurrency 
    ? `${ abbrVal } ${ currency.sar[lang] }`
    : abbrVal
  }`;
}

