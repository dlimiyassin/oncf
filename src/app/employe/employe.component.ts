import { Component, HostListener } from '@angular/core';
import { Employe } from '../models/employe.model';
import { EmployeService } from '../services/employe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EmployeResponse } from '../models/employe-response.model';
import { AbstractControl, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';

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
  pageSize: number = 6; // Nombre d'éléments par page
  currentPage: number = 1; // Numéro de page actuel

  employeForm = new FormGroup({
    cni : new FormControl(null,[Validators.required,Validators.minLength(6)]),
    lastname : new FormControl(null,[Validators.required,Validators.minLength(3)]),
    firstname : new FormControl(null,[Validators.required,Validators.minLength(3)]),
    email : new FormControl(null,[Validators.required,Validators.email]),
    birthDate : new FormControl(null,Validators.required),
    rendement : new FormControl(null,[Validators.required,this.rendementValidation]),
    objectif : new FormControl(null,[Validators.required,this.objectifValidation])

  });

  objectifValidation (control : AbstractControl){
    if(control.value > 0){
      return null;
    }
    return{ objectifPositif : true}
  }

  rendementValidation (control : AbstractControl){
    if(control.value > 0){
      return null;
    }
    return { rendementValidatio : true }
  }


=======
>>>>>>> 4fa8afef87bad4f734e11d34d7e7cdbd56e63ee6
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

  closeResult!: string; // for modal pop up

  constructor(
    private employeService: EmployeService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) {}

  /*--------------------------------- fETCH DATA FOR TABLE ----------------------------- */
  ngOnInit(): void {
    this.adjustPageSize();
    this.FetchEmployes();
  }
  FetchEmployes() {
    this.employeService
      .getAllEmployes(this.keyword, this.currentPage, this.pageSize)
      .subscribe((response: EmployeResponse) => {
        this.employes = response.content;
        this.totalPages = response.totalPages;
      });
  }
  /*--------------------------------- costimaze table with screen width ----------------------------- */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.adjustPageSize();
  }
  screenWidth!: number;
  adjustPageSize(): void {
    const screenWidth = window.innerWidth;
    this.screenWidth = screenWidth;
    if (screenWidth <= 1163) {
      this.pageSize = 5;
    } else if (1164 <= screenWidth && screenWidth <= 1280) {
      this.pageSize = 6;
    } else if (1281 <= screenWidth && screenWidth <= 1422) {
      this.pageSize = 7;
    } else if (1423 <= screenWidth && screenWidth <= 1600) {
      this.pageSize = 9;
    } else if (1601 <= screenWidth && screenWidth <= 1707) {
      this.pageSize = 10;
    } else if (1708 <= screenWidth && screenWidth <= 1920) {
      this.pageSize = 12;
    }
    this.FetchEmployes();
  }

  /*-------------------------------------- Pagination ------------------------------------ */
  handleGoToPage(keyword?: string, page?: number) {
    this.currentPage = page || 1;
    this.keyword = keyword || '';
    this.FetchEmployes();
  }
  handleNext() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.FetchEmployes();
    }
  }
  handlePrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.FetchEmployes();
    }
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
        .getAllEmployes(this.keyword, this.currentPage, this.pageSize)
        .subscribe((response: EmployeResponse) => {
          this.employes = response.content;
          this.totalPages = response.totalPages;
        });
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
      this.employeService
        .getAllEmployes(this.keyword, this.currentPage, this.pageSize)
        .subscribe((response: EmployeResponse) => {
          this.employes = response.content;
          this.totalPages = response.totalPages;
          this.modalService.activeInstances.closed;
        });
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
  onBirthDateInput(event: any) {
    this.employe.birthDate = new Date(event.target.value);
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
