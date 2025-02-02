import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BadgeVariant } from '../shared/models';

interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface AddressFormGroup {
  street: FormControl<string>;
  city: FormControl<string>;
  postCode: FormControl<string>;
  country: FormControl<string>;
}

export interface Item {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ItemFormControls {
  name: FormControl<string>;
  quantity: FormControl<number>;
  price: FormControl<number>;
  total: FormControl<number>;
}

export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: BadgeVariant;
  senderAddress: Address;
  clientAddress: Address;
  items: Item[];
  total: number;
}

export interface InvoiceFormGroup {
  description: FormControl<string>;
  paymentTerms: FormControl<number>;
  clientName: FormControl<string>;
  clientEmail: FormControl<string>;
  status: FormControl<BadgeVariant>;
  senderAddress: FormGroup<AddressFormGroup>;
  clientAddress: FormGroup<AddressFormGroup>;
  items: FormArray<FormGroup<ItemFormControls>>;
  paymentDue: FormControl<string>;
  total: FormControl<number>;
}
