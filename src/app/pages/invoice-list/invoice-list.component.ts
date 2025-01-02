import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeadlineComponent } from "../../shared/components/headline/headline.component";
import { TextComponent } from "../../shared/components/text/text.component";
import { FilterComponent } from "../../shared/components/filter/filter.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { InvoiceCardComponent } from "../../shared/components/invoice-card/invoice-card.component";
import { map, Observable } from 'rxjs';
import { Invoice } from '../../models/services.type';
import { Store } from '@ngrx/store';
import { selectInvoices, selectLoading } from '../../store/reducers/invoice.reducer';
import { InvoiceActions } from '../../store/actions/invoice.actions';

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule, HeadlineComponent, TextComponent, FilterComponent, ButtonComponent, InvoiceCardComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css'
})
export class InvoiceListComponent implements OnInit {
  invoices$: Observable<Invoice[]>;
  loading$: Observable<boolean>;
  invoiceCount$: Observable<number>;

  constructor(private readonly store: Store) {
    this.invoices$ = this.store.select(selectInvoices);
    this.loading$ = this.store.select(selectLoading);
    this.invoiceCount$ = this.invoices$.pipe(
      map(invoices => invoices.length)
    );
  }

  ngOnInit(): void {
    this.store.dispatch(InvoiceActions.loadInvoices());
  }
}
