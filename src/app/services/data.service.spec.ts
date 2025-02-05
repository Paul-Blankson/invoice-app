import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Invoice } from '../models/services.type';
import { BadgeVariant } from '../shared/models';

jest.mock('../utils', () => ({
  generateInvoiceId: jest.fn(() => 'AB1234'),
}));

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;
  const STORAGE_KEY = 'invoices';

  const mockInvoice: Invoice = {
    id: '1',
    clientName: 'John Doe',
    createdAt: '',
    paymentDue: '',
    description: '',
    paymentTerms: 0,
    clientEmail: '',
    status: 'pending' as BadgeVariant,
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    items: [],
    total: 100,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);

    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('invoiceData', () => {
    it('should retrieve invoice data from API if localStorage is empty', (done) => {
      service.invoiceData.subscribe((invoices) => {
        expect(invoices).toEqual([mockInvoice]);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          STORAGE_KEY,
          JSON.stringify([mockInvoice]),
        );
        done();
      });

      const req = httpMock.expectOne('/data/data.json');
      expect(req.request.method).toBe('GET');
      req.flush([mockInvoice]);
    });

    it('should retrieve invoice data from localStorage if available', (done) => {
      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify([mockInvoice]));

      service.invoiceData.subscribe((invoices) => {
        expect(invoices).toEqual([mockInvoice]);
        done();
      });
    });
  });

  describe('getInvoiceById', () => {
    it('should retrieve invoice by id from localStorage if available', (done) => {
      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify([mockInvoice]));

      service.getInvoiceById('1').subscribe((invoice) => {
        expect(invoice).toEqual(mockInvoice);
        done();
      });
    });

    it('should retrieve invoice by id from API if localStorage is empty', (done) => {
      service.getInvoiceById('1').subscribe((invoice) => {
        expect(invoice).toEqual(mockInvoice);
        done();
      });

      const req = httpMock.expectOne('/data/data.json');
      expect(req.request.method).toBe('GET');
      req.flush([mockInvoice]);
    });

    it('should return undefined when invoice is not found in API response', (done) => {
      service.getInvoiceById('nonexistent').subscribe((invoice) => {
        expect(invoice).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne('/data/data.json');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('createInvoice', () => {
    it('should create an invoice and store it', (done) => {
      const invoiceData: Omit<Invoice, 'id' | 'createdAt'> = {
        clientName: 'Jane Doe',
        paymentDue: '',
        description: '',
        paymentTerms: 0,
        clientEmail: '',
        status: 'pending' as BadgeVariant,
        senderAddress: { street: '', city: '', postCode: '', country: '' },
        clientAddress: { street: '', city: '', postCode: '', country: '' },
        items: [],
        total: 200,
      };

      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify([]));

      service.createInvoice(invoiceData).subscribe((invoice: Invoice) => {
        expect(invoice.id).toBe('AB1234');
        expect(invoice.createdAt).toBeDefined();
        expect(localStorage.setItem).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('deleteInvoice', () => {
    it('should delete an invoice', (done) => {
      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify([mockInvoice]));

      service.deleteInvoice('1').subscribe((id: string) => {
        expect(id).toBe('1');
        expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '[]');
        done();
      });
    });

    it('should return error when deleting a non-existent invoice', (done) => {
      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify([]));

      service.deleteInvoice('99').subscribe({
        error: (err: Error) => {
          expect(err).toEqual(new Error('Invoice not found'));
          done();
        },
      });
    });
  });

  describe('updateInvoice', () => {
    it('should update an invoice', (done) => {
      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify([mockInvoice]));

      const updatedInvoice: Invoice = { ...mockInvoice, total: 150 };

      service.updateInvoice(updatedInvoice).subscribe((invoice: Invoice) => {
        expect(invoice.total).toBe(150);
        expect(localStorage.setItem).toHaveBeenCalled();
        done();
      });
    });

    it('should return error when updating a non-existent invoice', (done) => {
      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify([]));

      const nonExistentInvoice: Invoice = {
        ...mockInvoice,
        id: '99',
        total: 150,
      };

      service.updateInvoice(nonExistentInvoice).subscribe({
        error: (err: Error) => {
          expect(err).toEqual(new Error('Invoice not found'));
          done();
        },
      });
    });
  });
});
