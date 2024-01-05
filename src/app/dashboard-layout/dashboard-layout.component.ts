import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
})
export class DashboardLayoutComponent implements OnInit {
  sideNavCollapsed: boolean = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.collapsed$.subscribe((collapsed) => {
      this.sideNavCollapsed = collapsed;
    });
  }

  onToggleSideNav(event: any): void {
    // Handle any additional logic if needed
  }
}
