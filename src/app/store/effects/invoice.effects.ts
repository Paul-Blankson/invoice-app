import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import { InvoiceActions } from '../actions/invoice.actions';

@Injectable()
export class InvoiceEffects {
  private readonly actions$ = inject(Actions);
  private readonly dataService = inject(DataService);

  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadInvoices),
      mergeMap(() =>
        this.dataService.invoiceData.pipe(
          map((invoices) => InvoiceActions.loadInvoicesSuccess({ invoices })),
          catchError((error) =>
            of(InvoiceActions.loadInvoicesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  loadInvoiceById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadInvoiceById),
      mergeMap(({ id }) =>
        this.dataService.getInvoiceById(id).pipe(
          map((invoice) => {
            if (!invoice) {
              throw new Error('Invoice not found');
            }
            return InvoiceActions.loadInvoiceByIdSuccess({ invoice });
          }),
          catchError((error) =>
            of(InvoiceActions.loadInvoiceByIdFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  editInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.editInvoice),
      mergeMap(({ invoice }) =>
        this.dataService.updateInvoice(invoice).pipe(
          map((updatedInvoice) =>
            InvoiceActions.editInvoiceSuccess({ invoice: updatedInvoice }),
          ),
          catchError((error) =>
            of(InvoiceActions.editInvoiceFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
