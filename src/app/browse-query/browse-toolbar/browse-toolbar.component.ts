import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QueryFilterGroupSortService } from '../query-filter-group-sort.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-browse-toolbar',
  templateUrl: './browse-toolbar.component.html',
  styleUrls: ['./browse-toolbar.component.css']
})
export class BrowseToolbarComponent implements OnInit, AfterViewInit {

  // Skupina ovládacích prvků pro výběr seskupování
  formGroupBy: FormGroup;
  // Skupina ovládacích prvků pro výběr typu řazení
  formOrderBy: FormGroup;
  // Skupina ovládacích prvků pro určení směru řazení
  formOrderType: FormGroup;

  constructor(private _storage: LocalStorageService, private _route: ActivatedRoute, private _router: Router,
              public qfilterService: QueryFilterGroupSortService) { }

  private _handleParams(params: Params) {
    const groupBy = params['groupBy'] || this._storage.get('groupBy') || 'none';
    const orderBy = params['orderBy'] || this._storage.get('orderBy') || 'alphabeticaly';
    const orderType = params['orderType'] || this._storage.get('orderType') || 'ascending';
    this.formGroupBy.setValue({'groupBy': groupBy});
    this.formOrderBy.setValue({'orderBy': orderBy});
    this.formOrderType.setValue({'orderType': orderType});

    this.qfilterService.selectedGroup = groupBy;
    this.qfilterService.sort(orderBy, orderType);
  }

  ngOnInit() {
    this.formGroupBy = new FormGroup({
      groupBy: new FormControl('none')
    });
    this.formOrderBy = new FormGroup({
      orderBy: new FormControl('alphabeticaly')
    });
    this.formOrderType = new FormGroup({
      orderType: new FormControl('ascending')
    });

    // Nastavení handleru na změnu parametrů ve stavovém řádku
    // díky tomu se provádí řazení a seskupování v reálném čase
    this._route.params.subscribe(params => this._handleParams(params));

    this.formGroupBy.valueChanges.subscribe(change => {
      const groupBy = change['groupBy'];
      this._storage.set('groupBy', groupBy);
      const orderBy = this._route.snapshot.params['orderBy'] || this._storage.get('orderBy') || 'alphabeticaly';
      const orderType = this._route.snapshot.params['orderType'] || this._storage.get('orderType') || 'ascending';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
    this.formOrderBy.valueChanges.subscribe(change => {
      const orderBy = change['orderBy'];
      this._storage.set('orderBy', orderBy);
      const groupBy = this._route.snapshot.params['groupBy'] || this._storage.get('groupBy') || 'none';
      const orderType = this._route.snapshot.params['orderType'] || this._storage.get('orderType') || 'ascending';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
    this.formOrderType.valueChanges.subscribe(change => {
      const orderType = change['orderType'];
      this._storage.set('orderType', orderType);
      const orderBy = this._route.snapshot.params['orderBy'] || this._storage.get('orderBy') || 'alphabeticaly';
      const groupBy = this._route.snapshot.params['groupBy'] || this._storage.get('groupBy') || 'none';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
  }

  ngAfterViewInit(): void {
    this._handleParams(this._route.snapshot.params);
  }
}
