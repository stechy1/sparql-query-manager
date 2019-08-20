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
    const milliseconds = Math.floor((value % 1000) / 100);
    const seconds = Math.floor((value / 1000) % 60);
    const minutes = Math.floor((value / (1000 * 60)) % 60);
    const hours = Math.floor(((value / (1000 * 60 * 60)) % 24));
    let result = '';

    if (format.showHours) {
      result += `${hours}h `;
    }
    if (format.showMinutes) {
      result += `${minutes}m `;
    }
    if (format.showSeconds) {
      result += `${seconds}s `;
    }
    if (format.showMiliseconds) {
      result += `${milliseconds}ms`;
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
