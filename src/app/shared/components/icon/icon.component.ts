import { Component, Input } from '@angular/core';
import { IconName } from '../../models';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-icon',
  imports: [NgOptimizedImage],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {
  @Input({ required: true }) name: IconName = 'logo';

  get isImageAvatar(): boolean {
    return this.name === 'image-avatar';
  }

  get assetPath(): string {
    const extension = this.isImageAvatar ? 'jpg' : 'svg';
    return `assets/${this.name}.${extension}`;
  }

  getIconWidth(): number {
    const sizes = {
      'icon-moon': 20,
      'icon-sun': 20,
      'icon-arrow-down': 9,
      'icon-arrow-left': 9,
      'icon-arrow-right': 9,
      'icon-calendar': 16,
      'icon-check': 10,
      'icon-delete': 11,
      'icon-plus': 10,
      'image-avatar': 40,
      'illustration-empty': 242,
      'logo': 40
    };
    return sizes[this.name];
  }

  getIconHeight(): number {
    const sizes = {
      'icon-moon': 20,
      'icon-sun': 20,
      'icon-arrow-down': 5,
      'icon-arrow-left': 5,
      'icon-arrow-right': 5,
      'icon-calendar': 16,
      'icon-check': 8,
      'icon-delete': 13,
      'icon-plus': 10,
      'image-avatar': 40,
      'illustration-empty': 200,
      'logo': 40
    };
    return sizes[this.name];
  }
}
