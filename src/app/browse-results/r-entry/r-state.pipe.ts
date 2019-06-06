import { Pipe, PipeTransform } from '@angular/core';
import { ResultState } from '../../query-result/query-result';

@Pipe({
  name: 'RState'
})
export class RStatePipe implements PipeTransform {

  transform(value: ResultState, args?: any): string {
    return value === ResultState.OK ? 'OK' : 'KO';
  }

}
