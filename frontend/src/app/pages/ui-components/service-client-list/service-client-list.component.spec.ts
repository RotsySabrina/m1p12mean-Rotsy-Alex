import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceClientListComponent } from './service-client-list.component';

describe('ServiceClientListComponent', () => {
  let component: ServiceClientListComponent;
  let fixture: ComponentFixture<ServiceClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceClientListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
