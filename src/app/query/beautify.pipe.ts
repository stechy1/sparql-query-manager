import { Pipe, PipeTransform } from '@angular/core';
import * as beautify from 'js-beautify';

@Pipe({
  name: 'beautify'
})
export class BeautifyPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return beautify(JSON.stringify(value));
  }

}
