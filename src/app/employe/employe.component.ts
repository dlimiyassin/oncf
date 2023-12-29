import { Component } from '@angular/core';
import { Employe } from '../models/employe.model';
import { EmployeService } from '../services/employe.service';
import {
  NgbActiveModal,
  NgbModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
    retraite: new Date(),
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
    retraite: new Date(),
    performanceComment: '',
  };
  keyword!: string; // fro search on table
  closeResult!: string; // for modal pop up

  constructor(
    private employeService: EmployeService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) {}

  /*--------------------------------- fETCH DATA FOR TABLE ----------------------------- */
  ngOnInit(): void {
    this.employeService
      .getAllEmployes()
      .subscribe((employes) => (this.employes = employes));
  }
  searchEmployee() {
    this.employeService.searchEmployes(this.keyword).subscribe({
      next : value => {this.employes = value; console.log(value) },
      error : err => { console.log(err) }
    })
  }

  /*--------------------------------- TRAITEMENT DE L'AJOUT ----------------------------- */
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
        retraite: new Date(),
        performanceComment: '',
      };
      this.employeService
        .getAllEmployes()
        .subscribe((employes) => (this.employes = employes));
      this.modalService.dismissAll();
    });
    this.toaster.success('New empolye added successfully', 'Success', {
      timeOut: 3000,
    });
  }

  ajouterEmployeModal(AjouterModal: any) {
    this.modalService
      .open(AjouterModal, { ariaLabelledBy: 'ajouter-modal-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed with ${reason}`;
        }
      );
  }

  /*--------------------------------- TRAITEMENT DE LA MODIFICATION ----------------------------- */
  modifierEmploye() {
    this.employeService.updateEmploye(this.employe).subscribe(() => {
      this.employeService.getAllEmployes().subscribe((employes) => {
        this.employes = employes;
        this.modalService.activeInstances.closed;
      });
    });
    this.toaster.warning('The empolye modified successfully', 'Warning', {
      timeOut: 3000,
    });
  }
  modifierEmployeModal(modifierEmployee: any, id: number) {
    this.modalService
      .open(modifierEmployee, { ariaLabelledBy: 'modifier-modal-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed with ${reason}`;
        }
      );
    this.afficherDetailsEmploye(id);
  }

  afficherDetailsEmploye(id: number) {
    this.employeService.getEmployeById(id).subscribe((employe) => {
      this.employe = employe;
    });
  }

  formatDate(date: Date | null): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }

  /*--------------------------------- TRAITEMENT DE LA SUPPERSION ----------------------------- */
  supprimerEmploye(id: number) {
    this.employeService.deleteEmploye(id).subscribe(() => {
      this.employes = this.employes.filter((employe) => employe.id !== id);
    });
    this.toaster.error('The empolye deleted successfully', 'Error', {
      timeOut: 3000,
    });
  }
}
