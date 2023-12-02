import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailMessageComponent } from './fail-message.component';

describe('FailMessageComponent', () => {
  let component: FailMessageComponent;
  let fixture: ComponentFixture<FailMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FailMessageComponent]
    });
    fixture = TestBed.createComponent(FailMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
