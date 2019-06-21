import { Pipe, PipeTransform } from '@angular/core';
import * as beautify from 'js-beautify';
import { ResponceFormat } from '../share/responce.format';

@Pipe({
  name: 'beautify'
})
export class BeautifyPipe implements PipeTransform {

  transform(value: string, format: string): any {
    switch (format) {
      case ResponceFormat[ResponceFormat.JSON]:
        return beautify(JSON.stringify(value));
      case ResponceFormat.XML:
        // TODO XML highlight?
        break;
      case ResponceFormat.CSV:
        // TODO CSV highlight?
        break;
      case ResponceFormat.TSV:
        // TODO TSV highlight?
        break;
    }
    return value;
  }

}
