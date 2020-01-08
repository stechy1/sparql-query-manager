import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usageCutter'
})
export class UsageCutterPipe implements PipeTransform {

  transform(value: string): any {
    if (!isNaN(Number(value))) {
      return value;
    }
    if (value.indexOf('1970') !== -1) {
      return 'nikdy';
    }
    return value;
  }

}
