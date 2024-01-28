import assert from "assert";
import { matches } from "../regex_practice.js";

const FIXTURE = {
  canadianPostalCode: {
    good: ["A7X 2P8", "P8E 4R2", "K1V 9P2", "Y3J 5C0"],
    bad: ["A7X   9B2", "C7E9U2", "", "Dog", "K1V\t9P2", " A7X 2P8", "A7X 2P8 "],
  },
  visa: {
    good: ["4128976567772613", "4089655522138888", "4098562516243"],
    bad: [
      "43333",
      "42346238746283746823",
      "7687777777263211",
      "foo",
      "π",
      "4128976567772613 ",
    ],
  },
  masterCard: {
    good: [
      "5100000000000000",
      "5294837679998888",
      "5309888182838282",
      "5599999999999999",
      "2221000000000000",
      "2720999999999999",
      "2578930481258783",
      "2230000000000000",
    ],
    bad: [
      "5763777373890002",
      "513988843211541",
      "51398884321108541",
      "",
      "OH",
      "5432333xxxxxxxxx",
    ],
  },
  adaFloat: {
    good: [
      "1",
      "23_5",
      "4#20#",
      "13#fD34_2_1#",
      "1.3e2",
      "11_3.3_3_222E-199",
      "3#1.2#E33",
      "4e+33",
    ],
    bad: ["dog", "4fe", "p#ii#", "_", "_33", "3_", "5__2", "9#88#E-1e3", "-6"],
  },
  notThreeEndingInOO: {
    good: ["", "fog", "Tho", "one", "a", "ab", "food", "ЂҋЍ"],
    bad: ["fOo", "gOO", "HoO", "Фoo", "πOO", "1π3", "A15", "лOo"],
  },
  divisibleBy32: {
    good: [
      "0",
      "00",
      "000",
      "00000",
      "00000",
      "000000",
      "00000000",
      "110100000",
      "10010101000000",
    ],
    bad: ["1", "0000000010000", "1000000001", "dog0000000", "200000"],
  },
  sevenThroughThirtyOne: {
    good: Array(24)
      .fill(0)
      .map((x, i) => i + 7),
    bad: ["1", "0", "00003", "dog", "", "361", "90", "6", "-11", "32", "123z"],
  },
  mLComment: {
    good: ["(**)", "(*  *)", "(*756****)", "(*****)", "(*(*(******9*)"],
    bad: [
      "",
      "(*)",
      "(**",
      "dog",
      "(* before (* inner *) after *)",
      "(* extra space *) ",
    ],
  },
  notFileForFirstNoLookAround: {
    good: [
      "",
      "files",
      "fors",
      "FOR",
      "thefirst",
      "afile",
      "fork",
      "fILE",
      "fifor",
    ],
    bad: ["file", "for", "first"],
  },
  cOctal: {
    good: ["0", "027", "0777", "07766554433221100", "000000"],
    bad: ["08", "099", "100", "777", "011542651234612487236"],
  },
  restrictedFloatingPoint: {
    good: [
      "2",
      "11.5",
      "9.E111",
      "233E17",
      "15.0E999",
      "11E982",
      "3290.182937482364723887E-98",
      "1e3",
      "25.",
      "00.2E+2",
    ],
    bad: ["", "dog", "3.1E9012", "22.3221E", "2e"],
  },
  palindrome2358: {
    good: ["ππ", "©&©", "0@∂@0", "🔭ñabbañ🔭"],
    bad: ["Російський", "військовий", "корабель", "A", "BBBB", "#$%%$#"],
  },
  noNegativeIntLits: {
    good: [
      "12",
      "7 dogs",
      "I have 8 rats",
      "Got response 404",
      "hAx0r",
      "What is 2-3?",
    ],
    bad: ["", "-3", "Shoot it was -16", "-2-2-2-2-2", "-420", "A -300 A"],
  },
  repeated: {
    good: ["badbad", "", "wootwoot", "bebe", "swooshswoosh"],
    bad: ["aba", "zzyzz", "ABAB", "ZooZ", "123123"],
  },
};

// Looks funny, but you can probably figure out what it does
FIXTURE.notFileForFirstWithLookAround = FIXTURE.notFileForFirstNoLookAround;

for (let name of Object.keys(FIXTURE)) {
  describe(`When matching ${name}`, () => {
    for (let s of FIXTURE[name].good) {
      it(`accepts ${s}`, () => {
        assert.ok(matches(name, s));
      });
    }
    for (let s of FIXTURE[name].bad) {
      it(`rejects ${s}`, () => {
        assert.ok(!matches(name, s));
      });
    }
  });
}
