import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  GroupByPosibilities,
  OrderByPosibilities,
  OrderTypePosibilities,
  QueryFilterGroupSortService
} from '../query-filter-group-sort.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-browse-toolbar',
  templateUrl: './browse-toolbar.component.html',
  styleUrls: ['./browse-toolbar.component.css']
})
export class BrowseToolbarComponent implements OnInit, AfterViewInit {

  form: FormGroup;

  constructor(public qfilterService: QueryFilterGroupSortService,
              private _storage: LocalStorageService,
              private _fb: FormBuilder,
              private _route: ActivatedRoute, private _router: Router) { }

  /**
   * Zpracování parametrů v navigaci
   *
   * @param params Parametry v navigaci
   */
  private _handleParams(params: Params) {
    // Získám způsob seskupení dotazů
    const groupBy = params[GroupByPosibilities.KEY]
      || this._storage.get(GroupByPosibilities.KEY)
      || GroupByPosibilities.NONE.value;
    // Získám způsob třídění dotazů
    const orderBy = params[OrderByPosibilities.KEY]
      || this._storage.get(OrderByPosibilities.KEY)
      || OrderByPosibilities.ALPHABET.value;
    // Získám způsob řazení dotazů
    const orderType = params[OrderTypePosibilities.KEY]
      || this._storage.get(OrderTypePosibilities.KEY)
      || OrderTypePosibilities.ASCENDING.value;

    const values = {};
    values[GroupByPosibilities.KEY] = groupBy;
    values[OrderByPosibilities.KEY] = orderBy;
    values[OrderTypePosibilities.KEY] = orderType;

    // Nastavím tyto hodnoty do formuláře
    this.form.setValue(values);

    // Aktualizuji hodnoty ve filtrační službě
    this.qfilterService.selectedGroup = groupBy;
    this.qfilterService.sort(orderBy, orderType);
  }

  ngOnInit() {
    // Vytvořím novou instanci formuláře se třemi formulářovými kontrolkami
    this.form = this._fb.group({
      groupBy: new FormControl(GroupByPosibilities.KEY),
      orderBy: new FormControl(OrderByPosibilities.KEY),
      orderType: new FormControl(OrderTypePosibilities.KEY),
    });

    // Nastavení handleru na změnu parametrů ve stavovém řádku
    // díky tomu se provádí řazení a seskupování v reálném čase
    this._route.params.subscribe(params => this._handleParams(params));

    // Přihlásím se ke změnám hodnot ve formuláři
    this.form.valueChanges.subscribe(change => {
      const groupBy = change[GroupByPosibilities.KEY];
      const orderBy = change[OrderByPosibilities.KEY];
      const orderType = change[OrderTypePosibilities.KEY];

      // Uložím hodnoty do úložiště
      this._storage.set(GroupByPosibilities.KEY, groupBy);
      this._storage.set(OrderByPosibilities.KEY, orderBy);
      this._storage.set(OrderTypePosibilities.KEY, orderType);

      const values = {};
      values[GroupByPosibilities.KEY] = groupBy;
      values[OrderByPosibilities.KEY] = orderBy;
      values[OrderTypePosibilities.KEY] = orderType;

      // Vložím hodnoty do navigace
      this._router.navigate([values]);
    });
  }

  ngAfterViewInit(): void {
    this._handleParams(this._route.snapshot.params);
  }

  get groupPosibilities(): GroupByPosibilities[] {
    return GroupByPosibilities.VALUES;
  }

  get orderPosibilities(): OrderByPosibilities[] {
    return OrderByPosibilities.VALUES;
  }

  get orderTypePosibilities(): OrderTypePosibilities[] {
    return OrderTypePosibilities.VALUES;
  }
}
