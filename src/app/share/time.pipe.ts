import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeFormat } from './date-time-format';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: Date|any, format: DateTimeFormat): string {
    if (!(value instanceof Date)) {
      return value;
    }
    let result = '';

    if (format.showHours) {
      result += value.getHours();
    }
    if (format.showMinutes) {
      if (format.showHours) {
        result += ':';
      }
      result += value.getMinutes();
    }
    if (format.showSeconds) {
      if (format.showHours || format.showMinutes) {
        result += ':';
      }
      result += value.getSeconds();
    }
    if (format.showMiliseconds) {
      if (format.showHours || format.showMinutes || format.showSeconds) {
        result += ':';
      }
      result += value.getMilliseconds();
    }

    return result;
  }

}
