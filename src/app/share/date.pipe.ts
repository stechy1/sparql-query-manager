import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeFormat } from './date-time-format';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: Date|any, format: DateTimeFormat): string {
    if (!(value instanceof Date)) {
      return value;
    }
    let result = '';

    if (format.showDays) {
      result += value.getDate();
    }
    if (format.showMonths) {
      result += value.getMonth();
    }
    if (format.showYears) {
      result += value.getFullYear();
    }

    return result;
  }

}
