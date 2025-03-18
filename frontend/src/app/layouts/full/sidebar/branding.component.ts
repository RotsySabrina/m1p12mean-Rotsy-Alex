import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding-container">
      <a [routerLink]="['/']">
        <img
          src="./assets/images/logos/logo.png"
          alt="logo"
          class="logo"
        />
      </a>
    </div>
  `,
  styles: [
    `
      .branding-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }

      .logo {
      margin-top: -20px ;
        width: 210px;
        height: auto;
      }
    `,
  ],
})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) { }
}
