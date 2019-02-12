import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QueryFilterGroupSortService } from '../query-filter-group-sort.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-browse-toolbar',
  templateUrl: './browse-toolbar.component.html',
  styleUrls: ['./browse-toolbar.component.css']
})
export class BrowseToolbarComponent implements OnInit {

  // Skupina ovládacích prvků pro výběr seskupování
  formGroupBy: FormGroup;
  // Skupina ovládacích prvků pro výběr typu řazení
  formOrderBy: FormGroup;
  // Skupina ovládacích prvků pro určení směru řazení
  formOrderType: FormGroup;

  constructor(public qfilterService: QueryFilterGroupSortService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    console.log('Initializing browse toolbar...');

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
    this._route.params.subscribe(params => {
      console.log('Params update...');
      const groupBy = params['groupBy'] || 'none';
      const orderBy = params['orderBy'] || 'alphabeticaly';
      const orderType = params['orderType'] || 'ascending';
      this.formGroupBy.setValue({'groupBy': groupBy});
      this.formOrderBy.setValue({'orderBy': orderBy});
      this.formOrderType.setValue({'orderType': orderType});

      this.qfilterService.selectedGroup = groupBy;
      this.qfilterService.sort(orderBy, orderType);
    });

    this.formGroupBy.valueChanges.subscribe(change => {
      const groupBy = change['groupBy'];
      const orderBy = this._route.snapshot.params['orderBy'] || 'alphabeticaly';
      const orderType = this._route.snapshot.params['orderType'] || 'ascending';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
    this.formOrderBy.valueChanges.subscribe(change => {
      const orderBy = change['orderBy'];
      const groupBy = this._route.snapshot.params['groupBy'] || 'none';
      const orderType = this._route.snapshot.params['orderType'] || 'ascending';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
    this.formOrderType.valueChanges.subscribe(change => {
      const orderType = change['orderType'];
      const orderBy = this._route.snapshot.params['orderBy'] || 'alphabeticaly';
      const groupBy = this._route.snapshot.params['groupBy'] || 'none';
      this._router.navigate([{'groupBy': groupBy, 'orderBy': orderBy, 'orderType': orderType}]);
    });
  }

}
