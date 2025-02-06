import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { Invoice } from '../models/services.type';
import { loadFromStorage, saveToStorage } from '../store/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly dataUrl = '/data/data.json';
  private readonly STORAGE_KEY = 'invoices';

  constructor(private readonly http: HttpClient) {}

  get invoiceData(): Observable<Invoice[]> {
    const storedInvoices = loadFromStorage<Invoice[]>(this.STORAGE_KEY, []);

    if (storedInvoices.length > 0) {
      return of(storedInvoices);
    }

    return this.http.get<Invoice[]>(this.dataUrl).pipe(
      tap(invoices => saveToStorage(this.STORAGE_KEY, invoices))
    );
  }

  getInvoiceById(id: string): Observable<Invoice | undefined> {
    const storedInvoices = loadFromStorage<Invoice[]>(this.STORAGE_KEY, []);

    if (storedInvoices.length > 0) {
      return of(storedInvoices.find(invoice => invoice.id === id));
    }

    return this.http.get<Invoice[]>(this.dataUrl).pipe(
      tap(invoices => saveToStorage(this.STORAGE_KEY, invoices)),
      map(invoices => invoices.find(invoice => invoice.id === id))
    );
  }

  updateInvoice(invoice: Invoice): Observable<Invoice> {
    return new Observable(subscriber => {
      const invoices = loadFromStorage<Invoice[]>(this.STORAGE_KEY, []);
      const index = invoices.findIndex(inv => inv.id === invoice.id);

      if (index === -1) {
        subscriber.error(new Error('Invoice not found'));
        return;
      }

      const updatedInvoices = [
        ...invoices.slice(0, index),
        invoice,
        ...invoices.slice(index + 1)
      ];

      saveToStorage(this.STORAGE_KEY, updatedInvoices);
      subscriber.next(invoice);
      subscriber.complete();
    });
  }

  deleteInvoice(id: string): Observable<string> {
    return new Observable(subscriber => {
      const invoices = loadFromStorage<Invoice[]>(this.STORAGE_KEY, []);
      const index = invoices.findIndex(inv => inv.id === id);

      if (index === -1) {
        subscriber.error(new Error('Invoice not found'));
        return;
      }

      const updatedInvoices = invoices.filter(inv => inv.id !== id);
      saveToStorage(this.STORAGE_KEY, updatedInvoices);
      subscriber.next(id);
      subscriber.complete();
    });
  }
}
