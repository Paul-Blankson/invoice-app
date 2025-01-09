import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconComponent } from "./shared/components/icon/icon.component";
import { DialogComponent } from "./shared/components/dialog/dialog.component";
import { SideDrawerComponent } from "./shared/components/side-drawer/side-drawer.component";
import { Store } from '@ngrx/store';
import * as DrawerActions from './store/actions/drawer.actions';
import { AppState } from './models/app.state';
import { Observable } from 'rxjs';
import { selectDrawerOpen } from './store/reducers/drawer.reducer';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, IconComponent, DialogComponent, SideDrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoice-app';
  readonly isDrawerOpen$: Observable<boolean>;

  constructor(private readonly store: Store<AppState>) {
     this.isDrawerOpen$ = this.store.select(selectDrawerOpen);
  }

  closeDrawer(): void {
    this.store.dispatch(DrawerActions.closeDrawer());
  }
}
