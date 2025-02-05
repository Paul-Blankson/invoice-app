import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { Toast, ToastType } from '../models/services.type';
import { firstValueFrom } from 'rxjs';

describe('ToastService', () => {
  let service: ToastService;
  let dateNowSpy: jest.SpyInstance;
  let randomSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);

    // Mock Date.now() and Math.random() for consistent IDs
    dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(12345);
    randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
    randomSpy.mockRestore();
  });

  describe('show', () => {
    it('should add a toast to the list', async () => {
      const expectedToast: Toast = {
        id: 'toast-12345-4fzzzxj',
        message: 'Test message',
        type: 'info',
        timeout: 5000,
      };

      service.show('Test message');
      const toasts = await firstValueFrom(service.toasts$);

      expect(toasts.length).toBe(1);
      expect(toasts[0]).toEqual(expectedToast);
    });

    it('should add multiple toasts to the list', async () => {
      service.show('First toast');
      service.show('Second toast');

      const toasts = await firstValueFrom(service.toasts$);

      expect(toasts.length).toBe(2);
      expect(toasts[0].message).toBe('First toast');
      expect(toasts[1].message).toBe('Second toast');
    });

    it('should auto-remove toast after timeout', fakeAsync(() => {
      service.show('Test message', 'info', 1000);

      let toasts = service.toasts.getValue();
      expect(toasts.length).toBe(1);

      tick(1000);

      toasts = service.toasts.getValue();
      expect(toasts.length).toBe(0);
    }));

    it('should not auto-remove toast if timeout is 0', fakeAsync(() => {
      service.show('Test message', 'info', 0);

      tick(10000);

      const toasts = service.toasts.getValue();
      expect(toasts.length).toBe(1);
    }));
  });

  describe('convenience methods', () => {
    const testConvenienceMethod = async (
      methodName: ToastType,
      message: string
    ) => {
      service[methodName](message);
      const toasts = await firstValueFrom(service.toasts$);

      expect(toasts[0].type).toBe(methodName);
      expect(toasts[0].message).toBe(message);
    };

    it('should show success toast', async () => {
      await testConvenienceMethod('success', 'Success message');
    });

    it('should show error toast', async () => {
      await testConvenienceMethod('error', 'Error message');
    });

    it('should show info toast', async () => {
      await testConvenienceMethod('info', 'Info message');
    });

    it('should show warning toast', async () => {
      await testConvenienceMethod('warning', 'Warning message');
    });

    it('should respect custom timeout in convenience methods', fakeAsync(() => {
      service.success('Success message', 1000);

      let toasts = service.toasts.getValue();
      expect(toasts.length).toBe(1);

      tick(1000);

      toasts = service.toasts.getValue();
      expect(toasts.length).toBe(0);
    }));
  });

  describe('generateId', () => {
    it('should generate unique IDs', async () => {
      // Update the random mock for the second call to generate a different ID
      randomSpy.mockReturnValueOnce(0.123456789).mockReturnValueOnce(0.987654321);

      service.show('First message');
      service.show('Second message');

      const toasts = await firstValueFrom(service.toasts$);
      expect(toasts[0].id).not.toBe(toasts[1].id);
    });
  });
});
