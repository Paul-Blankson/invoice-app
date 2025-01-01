import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Invoice } from '../models/services.type';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dataUrl = '/data/data.json';

  constructor(private readonly http: HttpClient) {}

  get invoiceData(): Observable<Invoice[]> {
    return this.http
      .get<Invoice[]>(this.dataUrl)
      .pipe(map((response: Invoice[]): Invoice[] => response ));
  }

  getInvoiceById(id: string): Observable<Invoice | undefined> {
    return this.http
      .get<Invoice[]>(this.dataUrl)
      .pipe(
        map((invoices: Invoice[]) =>
          invoices.find((invoice) => invoice.id === id),
        ),
      );
  }
}
