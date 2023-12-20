import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeService } from '../services/employe.service';
import { DatePipe } from '@angular/common';
import { Employe } from '../models/employe.model';

@Component({
  selector: 'app-contrat-notification',
  templateUrl: './contrat-notification.component.html',
  styleUrls: ['./contrat-notification.component.css'],
})
export class ContratNotificationComponent implements OnInit {
  employes: Employe[] = [];
  constructor(
    private router: Router,
    private employe: EmployeService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.employe.getAllNotifications().subscribe({
      next: (employes) => {
        this.employes = employes.map(
          (data) =>
            new Employe(
              data.id,
              data.cni,
              data.firstname,
              data.lastname,
              data.email,
              new Date(data.birthDate),
              data.rendement,
              data.objectif,
              data.atteint,
              new Date(data.retraite),
              data.performanceComment
            )
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  formatDate(date: Date | null): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }
  timeLeftValue(date: Date): string {
    return this.employe.timeLeft(date);
  }
}
