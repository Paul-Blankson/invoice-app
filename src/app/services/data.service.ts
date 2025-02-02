import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { Invoice } from '../models/services.type';
import { loadFromStorage, saveToStorage } from '../store/utils/utils';
import { generateInvoiceId } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly dataUrl = '/data/data.json';
  private readonly STORAGE_KEY = 'invoices';

  constructor(private readonly http: HttpClient) {}

  public get invoiceData(): Observable<Invoice[]> {
    const storedInvoices = loadFromStorage<Invoice[]>(this.STORAGE_KEY, []);

    if (storedInvoices.length > 0) {
      return of(storedInvoices);
    }

    return this.http
      .get<Invoice[]>(this.dataUrl)
      .pipe(tap((invoices) => saveToStorage(this.STORAGE_KEY, invoices)));
  }

  public getInvoiceById(id: string): Observable<Invoice | undefined> {
    const storedInvoices = loadFromStorage<Invoice[]>(this.STORAGE_KEY, []);

    if (storedInvoices.length > 0) {
      return of(storedInvoices.find((invoice) => invoice.id === id));
    }

    return this.http.get<Invoice[]>(this.dataUrl).pipe(
      tap((invoices) => saveToStorage(this.STORAGE_KEY, invoices)),
      map((invoices) => invoices.find((invoice) => invoice.id === id)),
    );
  }

  public updateInvoice(invoice: Invoice): Observable<Invoice> {
    return new Observable((subscriber) => {
      const invoices = loadFromStorage<Invoice[]>(this.STORAGE_KEY, []);
      const index = invoices.findIndex((inv) => inv.id === invoice.id);

      if (index === -1) {
        subscriber.error(new Error('Invoice not found'));
        return;
      }

      const updatedInvoices = [
        ...invoices.slice(0, index),
        invoice,
        ...invoices.slice(index + 1),
      ];

      saveToStorage(this.STORAGE_KEY, updatedInvoices);
      subscriber.next(invoice);
      subscriber.complete();
    });
  }

  public deleteInvoice(id: string): Observable<string> {
    return new Observable((subscriber) => {
      const invoices = loadFromStorage<Invoice[]>(this.STORAGE_KEY, []);
      const index = invoices.findIndex((inv) => inv.id === id);

      if (index === -1) {
        subscriber.error(new Error('Invoice not found'));
        return;
      }

      const updatedInvoices = invoices.filter((inv) => inv.id !== id);
      saveToStorage(this.STORAGE_KEY, updatedInvoices);
      subscriber.next(id);
      subscriber.complete();
    });
  }

  public createInvoice(
    invoiceData: Omit<Invoice, 'id' | 'createdAt'>,
  ): Observable<Invoice> {
    return new Observable((subscriber) => {
      const invoices = loadFromStorage(this.STORAGE_KEY, []);

      const newInvoice: Invoice = {
        id: generateInvoiceId(),
        createdAt: new Date().toISOString(),
        paymentDue: invoiceData.paymentDue,
        description: invoiceData.description,
        paymentTerms: invoiceData.paymentTerms,
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        status: invoiceData.status,
        senderAddress: {
          street: invoiceData.senderAddress.street,
          city: invoiceData.senderAddress.city,
          postCode: invoiceData.senderAddress.postCode,
          country: invoiceData.senderAddress.country,
        },
        clientAddress: {
          street: invoiceData.clientAddress.street,
          city: invoiceData.clientAddress.city,
          postCode: invoiceData.clientAddress.postCode,
          country: invoiceData.clientAddress.country,
        },
        items: invoiceData.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        total: invoiceData.total,
      };

      const updatedInvoices = [...invoices, newInvoice];
      saveToStorage(this.STORAGE_KEY, updatedInvoices);

      subscriber.next(newInvoice);
      subscriber.complete();
    });
  }
}
