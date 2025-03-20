import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreneauxListComponent } from './creneaux-list.component';

describe('CreneauxListComponent', () => {
  let component: CreneauxListComponent;
  let fixture: ComponentFixture<CreneauxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreneauxListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreneauxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
