import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { TextFieldComponent } from '../text-field/text-field.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { Invoice, Item, ItemFormControls } from '../../../models/services.type';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectLoading,
  selectSelectedInvoice,
} from '../../../store/reducers/invoice.reducer';
import { DropdownChanges } from '../../models';

@Component({
  selector: 'app-invoice-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    IconComponent,
    TextFieldComponent,
    DropdownComponent,
    DatePickerComponent,
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css',
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  @Input() invoiceId?: string;
  @Input() isEditing = false;
  @Output() save = new EventEmitter<Partial<Invoice>>();
  @Output() saveAsDraft = new EventEmitter<Partial<Invoice>>();
  @Output() discard = new EventEmitter<void>();
  isLoading = false;
  readonly invoice$: Observable<Invoice | null>;
  readonly loading$: Observable<boolean>;

  private readonly subscriptions: Subscription[] = [];
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);
  private readonly fb: FormBuilder = inject(FormBuilder);

  invoiceForm!: FormGroup;
  isSubmitting = false;

  readonly paymentTermsOptions = [
    { value: 1, label: 'Net 1 Day' },
    { value: 7, label: 'Net 7 Days' },
    { value: 14, label: 'Net 14 Days' },
    { value: 30, label: 'Net 30 Days' },
  ];

  constructor() {
    this.invoice$ = this.store.select(selectSelectedInvoice);
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.invoiceForm = this.fb.group({
      senderAddress: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        postCode: ['', [Validators.required]],
        country: ['', [Validators.required]],
      }),
      clientDetails: this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        address: this.fb.group({
          street: ['', [Validators.required]],
          city: ['', [Validators.required]],
          postCode: ['', [Validators.required]],
          country: ['', [Validators.required]],
        }),
      }),
      invoiceDetails: this.fb.group({
        date: [new Date().toISOString().split('T')[0], [Validators.required]],
        paymentTerms: [30, [Validators.required]],
        description: ['', [Validators.required]],
      }),
      items: this.fb.array([], [Validators.required, Validators.minLength(1)]),
    });
  }

  private createItemGroup(item: Item): FormGroup<ItemFormControls> {
    return this.fb.group({
      name: new FormControl(item?.name ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      quantity: new FormControl(item?.quantity ?? 1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      price: new FormControl(item?.price ?? 0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      total: new FormControl(
        {
          value: item?.total ?? 0,
          disabled: true,
        },
        { nonNullable: true },
      ),
    });
  }

  getFieldError(controlPath: string): string {
    return "";
  }

  onPaymentTermsChange(event: DropdownChanges<number>): void {
    const dateControl = this.invoiceForm.get('invoiceDetails.date');
    const termsControl = this.invoiceForm.get('invoiceDetails.paymentTerms');

    if (dateControl?.value && termsControl?.value) {
      const terms = Number(event.value);

      // Update payment terms
      termsControl.setValue(terms, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
