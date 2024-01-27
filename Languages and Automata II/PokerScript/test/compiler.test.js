import assert from "assert/strict"
import { add, times } from "../src/PokerScript.js"

describe("The compiler ", () => {
  describe("has an add function", () => {
    it("and it should return 4 when adding 2 and 2", () => {
      assert.deepEqual(add(2, 2), 4)
    })
  })
})

describe("The compiler ", () => {
  describe("has a times function", () => {
    it("and it should return 4 when miltiplying 2 and 2", () => {
      assert.deepEqual(times(2, 2), 4)
    })
    it("returns 0 when multiplying by 0", () => {
      assert.deepEqual(times(2, 0), 0)
      assert.deepEqual(times(23552, 0), 0)
    })
  })
})
