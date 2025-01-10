import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app.state';
import { selectTheme } from '../../../store/reducers/theme.reducer';
import { Observable, map } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';
import { ThemeActions } from '../../../store/actions/theme.actions';

@Component({
  selector: 'app-theme-toggler',
  imports: [IconComponent, CommonModule],
  templateUrl: './theme-toggler.component.html',
  styleUrl: './theme-toggler.component.css',
})
export class ThemeTogglerComponent {
  isDark$: Observable<boolean>;

  constructor(private readonly store: Store<AppState>) {
    this.isDark$ = this.store
      .select(selectTheme)
      .pipe(map((theme) => theme === 'dark'));
  }

  onToggleTheme(): void {
    this.store.dispatch(ThemeActions.toggleTheme());
  }
}
