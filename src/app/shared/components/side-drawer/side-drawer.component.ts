import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { HeadlineComponent } from "../headline/headline.component";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-side-drawer',
  imports: [CommonModule, ClickOutsideDirective, HeadlineComponent, IconComponent],
  templateUrl: './side-drawer.component.html',
  styleUrl: './side-drawer.component.css'
})
export class SideDrawerComponent {
  @Input() isDrawerOpen: boolean = false;
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  onClickOutside() {
    if (this.isDrawerOpen) {
      this.onClose();
    }
  }

  onClose() {
    this.close.emit();
  }
}
