import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerRdvComponent } from './manager-rdv.component';

describe('ManagerRdvComponent', () => {
  let component: ManagerRdvComponent;
  let fixture: ComponentFixture<ManagerRdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerRdvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerRdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
