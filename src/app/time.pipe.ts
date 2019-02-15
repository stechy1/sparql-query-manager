import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    const date = new Date(value);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
}
