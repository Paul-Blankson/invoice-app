import { BadgeVariant } from '../shared/models';
import { Invoice } from './services.type';

export interface AppState {
  invoice: InvoiceState;
  theme: ThemeState;
}

export interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  filterStatuses: BadgeVariant[];
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  theme: 'light' | 'dark';
}

export const initialInvoiceState: InvoiceState = {
  invoices: [],
  selectedInvoice: null,
  filterStatuses: [],
  loading: false,
  error: null
};

export const initialThemeState: ThemeState = {
  theme: 'light'
};
