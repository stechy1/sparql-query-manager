import { Pipe, PipeTransform } from '@angular/core';

export interface TimeFormat {
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  showMiliseconds: boolean;
}

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, format: TimeFormat): any {
    const date = new Date(value);
    let result = '';

    if (format.showHours) {
      result += `${date.getHours()}h `;
    }
    if (format.showMinutes) {
      result += `${date.getMinutes()}m `;
    }
    if (format.showSeconds) {
      result += `${date.getSeconds()}s `;
    }
    if (format.showMiliseconds) {
      result += `${date.getMilliseconds()}ms`;
    }

    if (!result || result === '' || result.length === 0) {
      return '';
    }

    if (result.charAt(result.length - 1) === ' ') {
      result = result.substr(0, result.length - 1);
    }

    return result;
  }
}
