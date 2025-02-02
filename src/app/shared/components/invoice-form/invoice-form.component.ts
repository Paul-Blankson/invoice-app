import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { TextFieldComponent } from '../text-field/text-field.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { HeadlineComponent } from '../headline/headline.component';
import { TextComponent } from '../text/text.component';
import { DropdownOption } from '../../models';
import { emailValidator } from '../../validators/email.validator';
import { noSpecialCharactersValidator } from '../../validators/special-charaters.validator';
import { InvoiceActions } from '../../../store/actions/invoice.actions';
import { selectSelectedInvoice } from '../../../store/reducers/invoice.reducer';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    IconComponent,
    TextFieldComponent,
    DropdownComponent,
    DatePickerComponent,
    HeadlineComponent,
    TextComponent,
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css',
})
export class InvoiceFormComponent implements OnInit {
  private readonly store = inject(Store);

  public readonly paymentTermsOptions: DropdownOption<number>[] = [
    { label: 'Net 1 Day', value: 1 },
    { label: 'Net 7 Days', value: 7 },
    { label: 'Net 14 Days', value: 14 },
    { label: 'Net 30 Days', value: 30 },
  ];

  @Input() isEditMode = false;
  @Output() close = new EventEmitter<void>();

  public form!: FormGroup;
  public isSaving = false;
  public error = '';
  public errors: string[] = [];
  public showError = false;

  constructor(private readonly fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.items.valueChanges.subscribe({
      next: () => {
        this.updateTotal();
      }
    });

    if (this.isEditMode) {
      this.store.select(selectSelectedInvoice)
        .pipe(take(1))
        .subscribe(invoice => {
          if (invoice) {
            this.form.patchValue(invoice);

            while (this.items.length) {
              this.items.removeAt(0);
            }

            invoice.items.forEach(item => {
              this.items.push(this.fb.group({
                name: [item.name, Validators.required],
                quantity: [item.quantity, [Validators.required, Validators.min(1)]],
                price: [item.price, [Validators.required, Validators.min(0)]],
                total: [item.total]
              }));
            });
          }
        });
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      senderAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', [Validators.required, noSpecialCharactersValidator()]],
        postCode: ['', Validators.required],
        country: ['', [Validators.required, noSpecialCharactersValidator()]],
      }),
      clientName: ['', [Validators.required, Validators.minLength(3)]],
      clientEmail: ['', [Validators.required, emailValidator()]],
      clientAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', [Validators.required, noSpecialCharactersValidator()]],
        postCode: ['', Validators.required],
        country: ['', [Validators.required, noSpecialCharactersValidator()]],
      }),
      paymentDue: ['', Validators.required],
      paymentTerms: [30, [Validators.required]],
      description: ['', Validators.required],
      items: this.fb.array([this.createItemFormGroup()]),
      total: this.updateTotal
    });
  }

  public createItemFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      total: [0]
    });
  }

  private validateCurrentItems(): boolean {
    if (this.items.length === 0) return false;

    return this.items.controls.every(control => {
      const item = control as FormGroup;
      return (
        item.get('name')?.value &&
        item.get('quantity')?.value > 0 &&
        item.get('price')?.value > 0
      );
    });
  }

  private validateForm(): boolean {
    this.errors = [];
    const isFormValid = this.form.valid;
    const areItemsValid = this.validateCurrentItems();

    if (!isFormValid || !areItemsValid) {
      if (!areItemsValid) {
        this.errors.push('All fields must be added');
      }

      if (this.items.length === 0 || !this.form.valid) {
        this.errors.push('An item must be added');
      }

      this.showError = true;
      return false;
    }

    this.showError = false;
    return true;
  }

  public addItem(): void {
    if (!this.validateCurrentItems()) {
      this.errors = ['All fields must be added'];
      this.showError = true;
      return;
    }

    this.showError = false;
    this.items.push(this.createItemFormGroup());
  }

  public removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.updateTotal();
    }
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  public getErrorMessage(controlPath: string): string {
    const control = this.form.get(controlPath);
    const errors = control?.errors;

    if (!errors || !control?.touched) return '';

    if (errors['required']) return 'can\'t be empty';
    if (errors['emailInvalid']) return 'invalid email address';
    if (errors['noSpecialCharacters']) return 'special characters are not allowed';
    if (errors['min']) return 'value must be greater than 0';
    if (errors['pattern']) return 'invalid format';

    return 'invalid value';
  }

  public calculateItemTotal(index: number): number {
    const item = this.items.at(index) as FormGroup;
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    const total = quantity * price;

    item.patchValue({ total }, { emitEvent: false });
    return total;
  }

  private updateTotal(): void {
    const total = this.items.controls.reduce((sum, item) => {
      return sum + this.calculateItemTotal(this.items.controls.indexOf(item));
    }, 0);

    this.form.patchValue({ total }, { emitEvent: false });
  }

  public async saveDraft(): Promise<void> {
    if (this.isSaving) return;

    try {
      this.isSaving = true;
      const formData = this.form.value;
      formData.status = 'draft';

      this.store.dispatch(InvoiceActions.createInvoice({ invoice: formData }));
      this.close.emit();
    } catch (error) {
      this.error = 'Failed to save draft. Please try again.';
    } finally {
      this.isSaving = false;
    }
  }

  onSubmit() {
    if (!this.validateForm() || this.isSaving) {
      return;
    }

    this.isSaving = true;
    const formData = this.form.value;
    formData.status = 'pending';

    if (this.isEditMode) {
      this.store.select(selectSelectedInvoice)
        .pipe(take(1))
        .subscribe(currentInvoice => {
          if (currentInvoice) {
            this.store.dispatch(InvoiceActions.editInvoice({
              invoice: { ...formData, id: currentInvoice.id }
            }));
            this.close.emit();
          }
        });
    } else {
      this.store.dispatch(InvoiceActions.createInvoice({ invoice: formData }));
      this.close.emit();
    }
  }

  onDiscard() {
    this.close.emit();
  }
}
