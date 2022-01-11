/**
 * Pipeline to be used for iterating over the elements of an enum.
 * The enum is defined without explicit values (e.g. enum Demo {A, B, C}).
 * The enum must be assigned to a property of the component that uses the
 * pipeline in its template (e.g. demo = Demo;).
*/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(inputObject: object): any[] {
    return Object.keys(inputObject)
      .filter(property => !isNaN(+property))
      .map(numericProp => {
        return {value: +numericProp, key: inputObject[numericProp as keyof object]}
      });
  }

}
