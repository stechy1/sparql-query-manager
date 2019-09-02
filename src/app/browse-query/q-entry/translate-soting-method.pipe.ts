import { Pipe, PipeTransform } from '@angular/core';
import { OrderByPosibilities } from '../query-filter-group-sort.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'translateSotingMethod'
})
export class TranslateSotingMethodPipe implements PipeTransform {

  transform(value: string|Observable<string>): any {
    if (value instanceof Observable) {
      return value.pipe(map(method => {
        return OrderByPosibilities.byValue(method).name;
      }));
    } else {
      return of(OrderByPosibilities.byValue(value).name);
    }
  }

}
