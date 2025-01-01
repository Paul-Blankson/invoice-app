import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import { InvoiceActions } from '../actions/invoice.actions';

@Injectable()
export class InvoiceEffects {
  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadInvoices),
      mergeMap(() =>
        this.dataService.invoiceData.pipe(
          map((invoices) =>
            InvoiceActions.loadInvoicesSuccess({ invoices })
          ),
          catchError((error) =>
            of(InvoiceActions.loadInvoicesFailure({ error: error.message }))
          )
        )
      )
    )
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
            of(InvoiceActions.loadInvoiceByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataService: DataService
  ) {}
}
