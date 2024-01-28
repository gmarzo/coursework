const regexes = {
  canadianPostalCode:
    /^[A-CEGHJ-NPR-TV-Z]\d[A-CEGHJ-NPR-TV-Z] \d[A-CEGHJ-NPR-TV-Z]\d$/,
  visa: /^4(\d{15}|\d{12})$/,
  masterCard:
    /^(5[1-5]\d{14})$|^(2((2(2[1-9]|[3-9]\d))|[3-6]\d{2}|7([01]\d|20)))\d{12}$/,
  adaFloat:
    /^((\d(_\d)?)+(\.(\d((_\d)+)?)+)?(([Ee]\+?(\d(_\d)?)+)|([Ee]\-(\d(_\d)?)+))?)$|^(((\d(_\d)?)+)#(([\dA-Fa-f]((_[\dA-Fa-f])+)?)+)(\.([\dA-Fa-f](_[\dA-Fa-f])?)+)?#((E\+?(\d(_\d)?)+)|(E\-(\d(_\d)?)+))?)$/,
  notThreeEndingInOO: /^(\p{L}(?![oO]{2}\b)\p{L}*)?$/u,
  divisibleBy32: /^0{1,4}$|^[01]*(?<=0{5,})$/,
  sevenThroughThirtyOne: /^[7-9]$|^[12]\d$|^3[01]$/,
  mLComment: /^\(\*+\s?\S*\s?\*+\)$/,
  notFileForFirstNoLookAround: /.*/,
  notFileForFirstWithLookAround: /^(?!^file$|^for$|^first$)(.*)$/,
  cOctal: /^0[0-7]*$/,
  restrictedFloatingPoint: /^\d+(\.\d*)?((E|e)(\+|\-)?\d{1,3})?$/,
  palindrome2358:
    /^([^\p{C}\s])\1$|^([^\p{C}\s])([^\p{C}\s])\2$|^([^\p{C}\s])([^\p{C}\s])([^\p{C}\s])\5\4$|^([^\p{C}\s])([^\p{C}\s])([^\p{C}\s])([^\p{C}\s])\10\9\8\7$/u,
  noNegativeIntLits: /^(?!(.*\B\-)+).+$/,
  repeated: /^([a-z]*)\1$/,
};

export function matches(name, string) {
  return regexes[name].test(string);
}
