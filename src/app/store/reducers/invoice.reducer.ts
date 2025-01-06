import { createFeature, createReducer, on } from '@ngrx/store';
import { initialInvoiceState } from '../../models/app.state';
import { InvoiceActions } from '../actions/invoice.actions';

export const invoiceFeature = createFeature({
  name: 'invoice',
  reducer: createReducer(
    initialInvoiceState,
    on(InvoiceActions.loadInvoices, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(InvoiceActions.loadInvoicesSuccess, (state, { invoices }) => ({
      ...state,
      invoices,
      loading: false
    })),
    on(InvoiceActions.loadInvoicesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(InvoiceActions.loadInvoiceById, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(InvoiceActions.loadInvoiceByIdSuccess, (state, { invoice }) => ({
      ...state,
      selectedInvoice: invoice,
      loading: false
    })),
    on(InvoiceActions.loadInvoiceByIdFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),
    on(InvoiceActions.setFilterStatus, (state, { statuses }) => ({
      ...state,
      filterStatuses: statuses
    })),
    on(InvoiceActions.createInvoiceSuccess, (state, { invoice }) => ({
      ...state,
      invoices: [...state.invoices, invoice]
    })),
    on(InvoiceActions.editInvoiceSuccess, (state, { invoice }) => ({
      ...state,
      invoices: state.invoices.map(inv =>
        inv.id === invoice.id ? invoice : inv
      )
    })),
    on(InvoiceActions.deleteInvoiceSuccess, (state, { id }) => ({
      ...state,
      invoices: state.invoices.filter(inv => inv.id !== id)
    }))
  )
});

export const {
  name,
  reducer,
  selectInvoiceState,
  selectInvoices,
  selectSelectedInvoice,
  selectFilterStatuses,
  selectLoading,
  selectError
} = invoiceFeature;
