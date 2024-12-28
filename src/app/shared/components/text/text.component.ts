import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextVariant } from '../../models';

@Component({
  selector: 'app-text',
  imports: [CommonModule],
  templateUrl: './text.component.html',
  styleUrl: './text.component.css'
})
export class TextComponent {
  @Input() variant: TextVariant = 'large';
}
