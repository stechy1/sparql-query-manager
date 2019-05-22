import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { QueryFilterGroupSortService } from '../query-filter-group-sort.service';
import { QueryService } from '../../query/query.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit {

  @ViewChild('inputSearch') inputSearch: ElementRef;

  constructor(private _qservice: QueryService,
              private qFilterGroupSortingService: QueryFilterGroupSortService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // Nabindování změny hodnoty ve vyhledávacím řádku
    (<HTMLInputElement>this.inputSearch.nativeElement).onkeyup = ev => {
      // Získání nové hodnoty
      const searchedValue = (<HTMLInputElement>ev.target).value;
      // Pokud je hodnota prázdná, nic nebudu vyhledávat a zobrazím všechny dotazy
      if (searchedValue === '') {
        this.qFilterGroupSortingService.resetQueries();
        return;
      }

      this.qFilterGroupSortingService.filterBy(searchedValue);
    };
  }

  get visible(): boolean {
    return this._qservice.allQueries().length !== 0;
  }

}
