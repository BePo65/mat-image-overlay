/**
 * Pipelines to be used for iterating over the elements of an enum.
 * The enum is defined without explicit values (e.g. enum Demo {A, B, C}).
 * The enum must be assigned to a property of the component that uses the
 * pipeline in its template (e.g. demo = Demo;).
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to convert a 'regular' enum (with numeric values) to an array.
 */
@Pipe({
  name: 'numericEnumToArray',
  standalone: true
})
export class NumericEnumToArrayPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(inputObject: object): any[] {
    return Object.keys(inputObject)
      .filter(property => !isNaN(+property))
      .map(numericProp => {
        return {value: +numericProp, key: inputObject[numericProp as keyof object]};
      });
  }

}

/**
 * Pipe to convert an enum with string values to an array.
 */
@Pipe({
  name: 'stringEnumToArray',
  standalone: true
})
export class StringEnumToArrayPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(inputObject: object): any[] {
    return Object.keys(inputObject)
      .map(property => {
        return {key: property, value: inputObject[property as keyof object]};
      });
  }

}
