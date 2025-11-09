// test("Initial test", () => {
//    expect(3).toEqual(3);
// });

import { IntroScreenModel } from "../src/Intro/screens/IntroScreenModel.ts";

describe("Sample test suite", () => {
  test("Initial test", () => {
     expect(3).toEqual(3);
  });
  test("Intro Scene Model", () => {
    let s = new IntroScreenModel();
    expect(s.getState()).toEqual(0);  
  });
});