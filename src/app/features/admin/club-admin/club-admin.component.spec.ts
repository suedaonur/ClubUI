import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubAdminComponent } from './club-admin.component';

describe('ClubAdminComponent', () => {
  let component: ClubAdminComponent;
  let fixture: ComponentFixture<ClubAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
