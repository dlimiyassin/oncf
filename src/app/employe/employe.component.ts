import { Component, HostListener, TemplateRef } from '@angular/core';
import { Employe } from '../models/employe.model';
import { EmployeService } from '../services/employe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EmployeResponse } from '../models/employe-response.model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NewEmploye } from '../models/new-employe.model';
import { UpdatedEmploye } from '../models/updated-employe.model';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css'],
})
export class EmployeComponent {
  employes: Employe[] = [];
  displayedEmployes: Employe[] = [];
  totalPages: number = 0;
  keyword: string = '';
  pageSize: number = 6; // Nombre d'éléments par page
  currentPage: number = 1; // Numéro de page actuel

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

  employeForm = new FormGroup({
    cni: new FormControl('', [Validators.required, Validators.minLength(6)]),
    lastname: new FormControl('', [  Validators.required,  Validators.minLength(3),]),
    firstname: new FormControl('', [  Validators.required,  Validators.minLength(3),]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', Validators.required),
    rendement: new FormControl('', [Validators.required,this.rendementValidation,    ]),
    objectif: new FormControl('', [Validators.required,this.objectifValidation,    ]),
  });

  objectifValidation(control: AbstractControl) {
    if (control.value >= 0) {
      return null;
    }
    return { objectifPositif: true };
  }

  rendementValidation(control: AbstractControl) {
    if (control.value >= 0) {
      return null;
    }
    return { rendementValidation: true };
  }

  ajouterEmploye() {
    const newEmploye: NewEmploye = {
      cni: this.employeForm.get('cni')?.value as string,
      firstname: this.employeForm.get('firstname')?.value as string,
      lastname: this.employeForm.get('lastname')?.value as string,
      email: this.employeForm.get('email')?.value as string,
      birthDate: new Date(this.employeForm.get('birthDate')?.value as string),
      rendement: this.employeForm.get('rendement')?.value? Number(this.employeForm.get('rendement')?.value): 0,
      objectif: this.employeForm.get('objectif')?.value? Number(this.employeForm.get('objectif')?.value): 0,
    };
    this.employeService.createEmploye(newEmploye).subscribe(() => {
      this.ngOnInit();
      this.employeForm.reset();
      this.modalService.dismissAll();
    });
    this.toaster.success('New empolye added successfully', 'Success', {
      timeOut: 3000,
    });
  }
  openAdd(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' });
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

  /*--------------------------------- TRAITEMENT DE LA MODIFICATION ----------------------------- */
  editEmployeForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    cni: new FormControl('', [Validators.required, Validators.minLength(6)]),
    lastname: new FormControl('', [Validators.required,Validators.minLength(3),]),
    firstname: new FormControl('', [Validators.required,Validators.minLength(3),]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', Validators.required),
    rendement: new FormControl('', [Validators.required,this.rendementValidation,]),
    objectif: new FormControl('', [Validators.required,this.objectifValidation,]),
  });

  openEdit(content: TemplateRef<any>, id: number) {
    this.modalService.open(content, { size: 'lg' });
    this.getEmployeById(id);
  }

  getEmployeById(id: number) {
    this.employeService.getEmployeById(id).subscribe((employe) => {
      this.editEmployeForm.setValue({
        id: String(employe.id),
        cni: employe.cni,
        firstname: employe.firstname,
        lastname: employe.lastname,
        email: employe.email,
        birthDate: this.formatDate(new Date(employe.birthDate)),
        rendement: String(employe.rendement),
        objectif: String(employe.objectif),
      });
      console.log(this.editEmployeForm);
    });
  }
 
  modifierEmploye() {
    const employe : UpdatedEmploye = {
      id: Number(this.editEmployeForm.get('id')?.value) ,
      cni: this.editEmployeForm.get('cni')?.value as string,
      firstname: this.editEmployeForm.get('firstname')?.value as string,
      lastname: this.editEmployeForm.get('lastname')?.value as string,
      email: this.editEmployeForm.get('email')?.value as string,
      birthDate: new Date(this.editEmployeForm.get('birthDate')?.value as string),
      rendement: this.editEmployeForm.get('rendement')?.value? Number(this.editEmployeForm.get('rendement')?.value): 0,
      objectif: this.editEmployeForm.get('objectif')?.value ? Number(this.editEmployeForm.get('objectif')?.value): 0,
    };
    this.employeService.updateEmploye(employe).subscribe(() => {
      this.ngOnInit();
    });
    this.toaster.success('The employee modified successfully', 'Success', {
      timeOut: 3000,
    });
  }
  
  formatDate(date: Date | null): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }

}
