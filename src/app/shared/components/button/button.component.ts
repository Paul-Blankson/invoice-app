import { Component, Input } from '@angular/core';
import { ButtonVariant } from '../../models';
import { IconComponent } from "../icon/icon.component";
import { HeadlineComponent } from "../headline/headline.component";

@Component({
  selector: 'app-button',
  imports: [IconComponent, HeadlineComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() btnVariant: ButtonVariant = 'btn1';
  @Input() text: string = '';
  @Input() textColor: string = '';

  get buttonClass(): string {
    return this.btnVariant;
  }

  getButtonText(): string {
    if (this.text) {
      return this.text;
    }

    const textMap = {
      'btn1': 'New Invoice',
      'btn2': 'Mark as Paid',
      'btn3': 'Edit',
      'btn4': 'Save as Draft',
      'btn5': 'Delete',
      'btn6': '+ Add New Item'
    };
    return textMap[this.btnVariant];
  }
}
