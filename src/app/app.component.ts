import { Component } from '@angular/core';
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { MainContentComponent } from './layout/main-content/main-content.component';

@Component({
  selector: 'app-root',
  imports: [ SidebarComponent, MainContentComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoice-app';
}
