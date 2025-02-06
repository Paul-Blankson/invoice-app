import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Invoice } from '../../models/services.type';
import { BadgeVariant } from '../../shared/models';

export const InvoiceActions = createActionGroup({
  source: 'Invoice',
  events: {
    'Load Invoices': emptyProps(),
    'Load Invoices Success': props<{ invoices: Invoice[] }>(),
    'Load Invoices Failure': props<{ error: string }>(),

    'Load Invoice By Id': props<{ id: string }>(),
    'Load Invoice By Id Success': props<{ invoice: Invoice }>(),
    'Load Invoice By Id Failure': props<{ error: string }>(),

    'Set Filter Status': props<{ statuses: BadgeVariant[] }>(),

    'Create Invoice': props<{ invoice: Invoice }>(),
    'Create Invoice Success': props<{ invoice: Invoice }>(),
    'Create Invoice Failure': props<{ error: string }>(),

    'Edit Invoice': props<{ invoice: Invoice }>(),
    'Edit Invoice Success': props<{ invoice: Invoice }>(),
    'Edit Invoice Failure': props<{ error: string }>(),

    'Delete Invoice': props<{ id: string }>(),
    'Delete Invoice Success': props<{ id: string }>(),
    'Delete Invoice Failure': props<{ error: string }>(),
  }
});
