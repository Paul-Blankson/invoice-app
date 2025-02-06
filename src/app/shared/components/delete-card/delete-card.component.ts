import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeadlineComponent } from "../headline/headline.component";
import { TextComponent } from "../text/text.component";
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-delete-card',
  imports: [HeadlineComponent, TextComponent, ButtonComponent],
  templateUrl: './delete-card.component.html',
  styleUrl: './delete-card.component.css'
})
export class DeleteCardComponent {
  @Input() invoiceId: string = '';
  @Input() buttonText: string = 'Cancel';
  @Output() onCancel = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();
}
