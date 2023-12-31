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
  displayedEmployes: Employe[] = [];
  totalPages : number = 0
  keyword : string = '';
  pageSize: number = 5; // Nombre d'éléments par page
  currentPage: number = 0; // Numéro de page actuel

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

  closeResult!: string;

  constructor(
    private employeService: EmployeService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) {}

  /*--------------------------------- fETCH DATA FOR TABLE ----------------------------- */
  ngOnInit(): void {
    this.getEmployes();
  }


  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getEmployes();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getEmployes();
    }
  }

  goToPage(page : number){
  this.currentPage=page;
  this.getEmployes();
  }

  getEmployes(){
    this.employeService.getAllEmployes(this.keyword,this.currentPage,this.pageSize).
    subscribe({
      next : (resp) =>{
        this.employes = resp.body as Employe[];
        let totalEmployes : number = parseInt(resp.headers.get('x-total-count')!);
        this.totalPages = Math.floor(totalEmployes/this.pageSize);
        if( totalEmployes % this.pageSize !=0){
          this.totalPages=this.totalPages+1;
        }
        console.log(totalEmployes);
      }
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

    // Abonnez-vous à l'observable getAllEmployes pour mettre à jour le tableau des employés
    this.employeService.getAllEmployes(this.keyword,this.currentPage, this.pageSize).subscribe({
      next: (resp) => {
        this.employes = resp.body as Employe[];
        let totalEmployes: number = parseInt(resp.headers.get('x-total-count')!);
        this.totalPages = Math.floor(totalEmployes / this.pageSize);
        if (totalEmployes % this.pageSize !== 0) {
          this.totalPages = this.totalPages + 1;
        }
        console.log(totalEmployes);
      },
    });
    this.employeService.getAllEmployes(this.keyword,this.currentPage,this.pageSize);
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
  // modifierEmploye() {
  //   this.employeService.updateEmploye(this.employe).subscribe(() => {
  //     this.employeService.getAllEmployes().subscribe((employes) => {
  //       this.employes = employes;
  //       this.modalService.activeInstances.closed;
  //     });
  //   });
  //   this.toaster.warning('The empolye modified successfully', 'Warning', {
  //     timeOut: 3000,
  //   });
  // }
  modifierEmploye() {
    this.employeService.updateEmploye(this.employe).subscribe(() => {
      // Mettez à jour la liste existante avec le nouvel employé modifié
      const index = this.employes.findIndex(e => e.id === this.employe.id);
      if (index !== -1) {
        this.employes[index] = this.employe;
      }
      this.modalService.activeInstances.closed;
    });
    this.toaster.warning('The employee modified successfully', 'Warning', {
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

    /*----------------- TRAITEMENT DE LA RECHERCHE ------------------------- */
    // searchEmployes() {
    //   this.currentPage=1;
    //   this.totalPages=0;
    //   this.employeService.searchEmployes(this.keyword, this.currentPage, this.pageSize)
    //     .subscribe({
    //       next: (resp) => {
    //         this.employes = resp;
    //         // Mettez à jour le nombre total de pages ou effectuez d'autres opérations nécessaires
    //       },
    //       error: (error) => {
    //         console.error('Error during search:', error);
    //       },
    //     });
    //}
}
