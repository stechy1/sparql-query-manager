import { Pipe, PipeTransform } from '@angular/core';
import { TripleType } from '../../share/server-responce-parsers/triple-type';

@Pipe({
  name: 'RTripleType'
})
export class RTripleTypePipe implements PipeTransform {

  transform(value: TripleType, ...args: any[]): any {
    return value === TripleType.SELECT ? 'Počet řádek: ' : 'Počet trojic:';
  }

}
