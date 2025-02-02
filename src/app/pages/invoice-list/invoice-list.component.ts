import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeadlineComponent } from '../../shared/components/headline/headline.component';
import { TextComponent } from '../../shared/components/text/text.component';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InvoiceCardComponent } from '../../shared/components/invoice-card/invoice-card.component';
import { combineLatest, map, Observable } from 'rxjs';
import { Invoice } from '../../models/services.type';
import { Store } from '@ngrx/store';
import {
  selectFilterStatuses,
  selectInvoices,
  selectLoading,
} from '../../store/reducers/invoice.reducer';
import { InvoiceActions } from '../../store/actions/invoice.actions';
import {
  BadgeVariant,
  FilterOption,
} from '../../shared/models';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AppState } from '../../models/app.state';
import { SideDrawerComponent } from '../../shared/components/side-drawer/side-drawer.component';
import { InvoiceFormComponent } from '../../shared/components/invoice-form/invoice-form.component';

@Component({
  selector: 'app-invoice-list',
  imports: [
    CommonModule,
    HeadlineComponent,
    TextComponent,
    FilterComponent,
    ButtonComponent,
    InvoiceCardComponent,
    IconComponent,
    SideDrawerComponent,
    InvoiceFormComponent,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css',
})
export class InvoiceListComponent implements OnInit {
 public readonly invoices$: Observable<Invoice[]>;
 public readonly loading$: Observable<boolean>;
 public readonly filterStatuses$: Observable<BadgeVariant[]>;
 public readonly filteredInvoices$: Observable<Invoice[]>;
 public readonly invoiceCount$: Observable<number>;

 public isSideDrawerOpen = false;

 public readonly filterOptions: FilterOption[] = [
    { value: 'draft', title: 'Draft' },
    { value: 'pending', title: 'Pending' },
    { value: 'paid', title: 'Paid' },
  ];

  constructor(private readonly store: Store<AppState>) {
    this.invoices$ = this.store.select(selectInvoices);
    this.loading$ = this.store.select(selectLoading);
    this.filterStatuses$ = this.store.select(selectFilterStatuses);

    this.filteredInvoices$ = combineLatest([
      this.invoices$,
      this.filterStatuses$,
    ]).pipe(
      map(([invoices, statuses]) => {
        if (!statuses || statuses.length === 0) {
          return invoices;
        }
        return invoices.filter((invoice) => statuses.includes(invoice.status));
      }),
    );

    this.invoiceCount$ = this.filteredInvoices$.pipe(
      map((invoices) => invoices.length),
    );
  }

  ngOnInit(): void {
    this.store.dispatch(InvoiceActions.loadInvoices());
  }

 public onFilterChange(selectedStatuses: BadgeVariant[]): void {
    this.store.dispatch(
      InvoiceActions.setFilterStatus({ statuses: selectedStatuses }),
    );
  }

 public toggleDrawer() {
    this.isSideDrawerOpen = !this.isSideDrawerOpen;
  }

 public onDrawerClose() {
    this.isSideDrawerOpen = false;
    this.store.dispatch(InvoiceActions.loadInvoices());
  }
}
