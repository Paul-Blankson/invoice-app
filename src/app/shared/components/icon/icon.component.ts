import { Component, Input } from '@angular/core';
import { IconName, IconVariant } from '../../models';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {
  @Input({ required: true }) name: IconName = 'logo';
  @Input() variant: IconVariant = 'desktop';

  get isImageAvatar(): boolean {
    return this.name === 'image-avatar';
  }

  get assetPath(): string {
    const extension = this.isImageAvatar ? 'jpg' : 'svg';
    return `assets/${this.name}.${extension}`;
  }
}
