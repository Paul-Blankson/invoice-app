import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconComponent } from "./shared/components/icon/icon.component";
import { ThemeTogglerComponent } from "./shared/components/theme-toggler/theme-toggler.component";
import { Store } from '@ngrx/store';
import { AppState } from './models/app.state';
import { selectTheme } from './store/reducers/theme.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, IconComponent, ThemeTogglerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'invoice-app';
  theme$: Observable<'light' | 'dark'>;

  constructor(private readonly store: Store<AppState>) {
    this.theme$ = this.store.select(selectTheme);
  }

  ngOnInit() {
    // Update body theme class when theme changes
    this.theme$.subscribe(theme => {
      document.body.setAttribute('data-theme', theme);
    });
  }

}
