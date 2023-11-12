import { NumericEnumToArrayPipe } from './enum-to-array.pipe';

describe('EnumToArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new NumericEnumToArrayPipe();

    expect(pipe).toBeTruthy();
  });
});
