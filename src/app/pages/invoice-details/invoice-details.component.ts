import { Component, inject, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { HeadlineComponent } from '../../shared/components/headline/headline.component';
import { TextComponent } from '../../shared/components/text/text.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Invoice } from '../../models/services.type';
import {
  selectLoading,
  selectSelectedInvoice,
} from '../../store/reducers/invoice.reducer';
import { InvoiceActions } from '../../store/actions/invoice.actions';
import { CommonModule, Location } from '@angular/common';
import { JoinPipe } from '../../shared/pipes/join.pipe';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { DeleteCardComponent } from '../../shared/components/delete-card/delete-card.component';
import { SideDrawerComponent } from "../../shared/components/side-drawer/side-drawer.component";
@Component({
  selector: 'app-invoice-details',
  imports: [
    CommonModule,
    IconComponent,
    HeadlineComponent,
    TextComponent,
    BadgeComponent,
    ButtonComponent,
    JoinPipe,
    DialogComponent,
    DeleteCardComponent,
    SideDrawerComponent
],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css',
})
export class InvoiceDetailsComponent implements OnInit {
  private readonly store: Store = inject(Store);
  public readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly location: Location = inject(Location);

  readonly invoice$: Observable<Invoice | null>;
  readonly loading$: Observable<boolean>;
  isDeleteDialogOpen: boolean = false;
  isSideDrawerOpen: boolean = false;

  constructor() {
    this.invoice$ = this.store.select(selectSelectedInvoice);
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit() {
    const invoiceId = this.activeRoute.snapshot.paramMap.get('id');
    if (invoiceId) {
      this.store.dispatch(InvoiceActions.loadInvoiceById({ id: invoiceId }));
    }
  }

  goBack(): void {
    this.store.dispatch(InvoiceActions.loadInvoices());
    this.location.back();
  }

  markAsPaid(invoice: Invoice): void {
    if (invoice.status === 'pending') {
      const updatedInvoice: Invoice = {
        ...invoice,
        status: 'paid',
      };
      this.store.dispatch(
        InvoiceActions.editInvoice({ invoice: updatedInvoice }),
      );
      this.store.dispatch(InvoiceActions.loadInvoiceById({ id: invoice.id }));
    }
  }

  openDeleteDialog(): void {
    this.isDeleteDialogOpen = true;
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogOpen = false;
  }

  handleDeleteInvoice(invoice: Invoice): void {
    this.store.dispatch(InvoiceActions.deleteInvoice({ id: invoice.id }));
    this.closeDeleteDialog();
    this.location.back();
  }

  toggleDrawer() {
    this.isSideDrawerOpen = !this.isSideDrawerOpen;
  }

  onDrawerClose() {
    this.isSideDrawerOpen = false;
  }
}
