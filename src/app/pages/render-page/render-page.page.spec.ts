import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenderPagePage } from './render-page.page';

describe('RenderPagePage', () => {
  let component: RenderPagePage;
  let fixture: ComponentFixture<RenderPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
