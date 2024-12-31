import { Component } from '@angular/core';
import { HeadlineComponent } from "../headline/headline.component";
import { TextComponent } from "../text/text.component";
import { BadgeComponent } from "../badge/badge.component";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-invoice-card',
  imports: [HeadlineComponent, TextComponent, BadgeComponent, IconComponent],
  templateUrl: './invoice-card.component.html',
  styleUrl: './invoice-card.component.css'
})
export class InvoiceCardComponent {

}
