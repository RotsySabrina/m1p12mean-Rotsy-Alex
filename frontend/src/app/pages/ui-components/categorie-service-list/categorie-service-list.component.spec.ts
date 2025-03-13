import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieServiceListComponent } from './categorie-service-list.component';

describe('CategorieServiceListComponent', () => {
  let component: CategorieServiceListComponent;
  let fixture: ComponentFixture<CategorieServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieServiceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorieServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
