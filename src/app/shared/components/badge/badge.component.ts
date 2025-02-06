import { Component, Input } from '@angular/core';
import { BadgeVariant } from '../../models';
import { HeadlineComponent } from "../headline/headline.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  imports: [CommonModule, HeadlineComponent],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'pending';

}
