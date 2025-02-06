import { Component } from '@angular/core';
import { HeadlineComponent } from "../../shared/components/headline/headline.component";
import { TextComponent } from "../../shared/components/text/text.component";
import { FilterComponent } from "../../shared/components/filter/filter.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { InvoiceCardComponent } from "../../shared/components/invoice-card/invoice-card.component";

@Component({
  selector: 'app-invoice-list',
  imports: [HeadlineComponent, TextComponent, FilterComponent, ButtonComponent, InvoiceCardComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css'
})
export class InvoiceListComponent {

}
