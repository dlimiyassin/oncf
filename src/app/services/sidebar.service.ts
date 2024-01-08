import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private collapsedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public collapsed$: Observable<boolean> = this.collapsedSubject.asObservable();

  toggleCollapse(collapsed: boolean): void {
    this.collapsedSubject.next(collapsed);
  }
}
