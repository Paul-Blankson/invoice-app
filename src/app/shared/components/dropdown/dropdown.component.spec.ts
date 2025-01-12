import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DropdownOption } from '../../models';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  const mockOptions: DropdownOption[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3', disabled: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    component.options = mockOptions;
    component.control = new FormControl();
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.isOpen).toBeFalse();
      expect(component.label).toBe('');
      expect(component.placeholder).toBe('Select an option');
      expect(component.required).toBeFalse();
      expect(component.error).toBe('');
    });
  });

  describe('Dropdown Toggle', () => {
    it('should toggle dropdown on button click', () => {
      const button = fixture.debugElement.query(By.css('.dropdown__toggle'));
      button.nativeElement.click();
      fixture.detectChanges();
      expect(component.isOpen).toBeTrue();

      button.nativeElement.click();
      fixture.detectChanges();
      expect(component.isOpen).toBeFalse();
    });

    it('should close dropdown when clicking outside', () => {
      component.isOpen = true;
      fixture.detectChanges();

      document.body.click();
      fixture.detectChanges();
      expect(component.isOpen).toBeFalse();
    });
  });

  describe('Option Selection', () => {
    it('should select option and emit value', () => {
      const selectionSpy = spyOn(component.selectionChange, 'emit');
      component.isOpen = true;
      fixture.detectChanges();

      const option = fixture.debugElement.query(By.css('.dropdown__option'));
      option.nativeElement.click();

      expect(component.selectedOption).toEqual(mockOptions[0]);
      expect(selectionSpy).toHaveBeenCalledWith({
        value: mockOptions[0].value,
        option: mockOptions[0]
      });
    });

    it('should not select disabled options', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const disabledOption = mockOptions.find(opt => opt.disabled);
      component.selectOption(disabledOption!);

      expect(component.selectedOption).not.toEqual(disabledOption);
    });
  });

  describe('Form Integration', () => {
    it('should update form control on selection', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const option = fixture.debugElement.query(By.css('.dropdown__option'));
      option.nativeElement.click();

      expect(component.control?.value).toBe(mockOptions[0].value);
    });

    it('should show error state when control is invalid', () => {
      component.control?.setErrors({ required: true });
      component.control?.markAsTouched();
      component.error = 'Required field';
      fixture.detectChanges();

      const toggle = fixture.debugElement.query(By.css('.dropdown__toggle'));
      expect(toggle.nativeElement.classList.contains('error')).toBeTrue();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close dropdown on escape key', () => {
      component.isOpen = true;
      fixture.detectChanges();

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(component.isOpen).toBeFalse();
    });

    it('should navigate options with arrow keys', () => {
      component.isOpen = true;
      fixture.detectChanges();

      component.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      expect(component.focusedIndex).toBe(0);
    });

    it('should select option with Enter key', () => {
      component.isOpen = true;
      component.focusedIndex = 0;
      fixture.detectChanges();

      component.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(component.selectedOption).toEqual(mockOptions[0]);
    });
  });

  describe('Accessibility', () => {
    it('should set correct ARIA attributes', () => {
      const toggle = fixture.debugElement.query(By.css('.dropdown__toggle'));
      expect(toggle.attributes['aria-expanded']).toBe('false');

      component.isOpen = true;
      fixture.detectChanges();
      expect(toggle.attributes['aria-expanded']).toBe('true');
    });

    it('should set proper role attributes', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const menu = fixture.debugElement.query(By.css('.dropdown__menu'));
      expect(menu.attributes['role']).toBe('listbox');
    });
  });
});
