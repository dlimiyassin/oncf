import { Component } from '@angular/core';
import { Employe } from '../models/employe.model';
import { EmployeService } from '../services/employe.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css'],
})
export class EmployeComponent {
  employes: Employe[] = [];
  employe: Employe = {
    id: 0,
    cni: '',
    firstname: '',
    lastname: '',
    email: '',
    birthDate: new Date(),
    rendement: 0,
    objectif: 0,
    atteint: 0,
    performanceComment: '',
  };
  newEmploye: Employe = {
    id: 0,
    cni: '',
    firstname: '',
    lastname: '',
    email: '',
    birthDate: new Date(),
    rendement: 0,
    objectif: 0,
    atteint: 0,
    performanceComment: '',
  };

  constructor(
    private employeService: EmployeService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.employeService
      .getAllEmployes()
      .subscribe((employes) => (this.employes = employes));
  }

  supprimerEmploye(id: number) {
    this.employeService.deleteEmploye(id).subscribe(() => {
      this.employes = this.employes.filter((employe) => employe.id !== id);
    });
  }

  ajouterEmploye() {
    this.employeService.createEmploye(this.newEmploye).subscribe(() => {
      this.newEmploye = {
        id: 0,
        cni: '',
        firstname: '',
        lastname: '',
        email: '',
        birthDate: new Date(),
        rendement: 0,
        objectif: 0,
        atteint: 0,
        performanceComment: '',
      };
      // Mettre à jour la liste d'employés après l'ajout réussi
      this.employeService
        .getAllEmployes()
        .subscribe((employes) => (this.employes = employes));
    });
  }

  modifierEmploye() {
    this.employeService.updateEmploye(this.employe).subscribe(() => {
      this.employeService.getAllEmployes().subscribe((employes) => {
        this.employes = employes;
        this.modalService.activeInstances.closed;
      });
    });
  }

  afficherDetailsEmploye(id: number) {
    this.employeService.getEmployeById(id).subscribe((employe) => {
      this.employe = employe;
      // Ouvrir la modal de modification
      // this.modalService.open('modifierEmployeModal');
      // this.modalRef = this.modalService.open(this.modifierEmployeMod, { size: 'lg' });
    });
  }

  formatDate(date: Date | null): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }
}
