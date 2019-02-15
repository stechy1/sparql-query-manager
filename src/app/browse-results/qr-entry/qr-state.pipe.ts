import { Pipe, PipeTransform } from '@angular/core';
import { ResultState } from '../../query-result/query-result';

@Pipe({
  name: 'qrState'
})
export class QrStatePipe implements PipeTransform {

  transform(value: ResultState, args?: any): string {
    return value === ResultState.OK ? 'OK' : 'KO';
  }

}
