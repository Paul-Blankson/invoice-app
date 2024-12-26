import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HeadingLevel, HeadingVariant } from '../../models';

@Component({
  selector: 'app-headline',
  imports: [CommonModule],
  templateUrl: './headline.component.html',
  styleUrl: './headline.component.css'
})
export class HeadlineComponent {
  @Input() level: HeadingLevel = 'h3';
  @Input() variant: HeadingVariant = 'medium';
}
