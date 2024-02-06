import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css'],
})
export class EmployeComponent implements OnInit, OnDestroy {
  employes: Employe[] = [];
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

  /*--------------------------------- fETCH DATA FOR TABLE. ----------------------------- */
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.employeService.employes$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((employes) => {
        this.employes = employes;
      });

    this.adjustPageSize();
    this.FetchEmployes();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  FetchEmployes() {
    this.employeService
      .getAllEmployes(this.keyword, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: EmployeResponse) => {
        this.employeService.updateEmployesStore(response.content);
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
      this.pageSize = 3;
    } else if (1164 <= screenWidth && screenWidth <= 1280) {
      this.pageSize = 4;
    } else if (1281 <= screenWidth && screenWidth <= 1422) {
      this.pageSize = 5;
    } else if (1423 <= screenWidth && screenWidth <= 1600) {
      this.pageSize = 6;
    } else if (1601 <= screenWidth && screenWidth <= 1707) {
      this.pageSize = 7;
    } else if (1708 <= screenWidth && screenWidth <= 1920) {
      this.pageSize = 8;
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
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', Validators.required),
    rendement: new FormControl('', [
      Validators.required,
      this.rendementValidation,
    ]),
    objectif: new FormControl('', [
      Validators.required,
      this.objectifValidation,
    ]),
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
    const newEmploye = {
      cni: this.employeForm.get('cni')?.value as string,
      firstname: this.employeForm.get('firstname')?.value as string,
      lastname: this.employeForm.get('lastname')?.value as string,
      email: this.employeForm.get('email')?.value as string,
      birthDate: new Date(this.employeForm.get('birthDate')?.value as string),
      rendement: this.employeForm.get('rendement')?.value
        ? Number(this.employeForm.get('rendement')?.value)
        : 0,
      objectif: this.employeForm.get('objectif')?.value
        ? Number(this.employeForm.get('objectif')?.value)
        : 0,
    };
    this.employeService
      .createEmploye(newEmploye)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.FetchEmployes();
        this.employeForm.reset();
        this.modalService.dismissAll();
      });
    this.toaster.success('New employee added successfully', 'Success', {
      timeOut: 3000,
    });
  }
  openAdd(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' });
  }

  /*--------------------------------- TRAITEMENT DE LA SUPPERSION ----------------------------- */

  supprimerEmploye(id: number) {
    this.employeService
      .deleteEmploye(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
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
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', Validators.required),
    rendement: new FormControl('', [
      Validators.required,
      this.rendementValidation,
    ]),
    objectif: new FormControl('', [
      Validators.required,
      this.objectifValidation,
    ]),
  });

  openEdit(content: TemplateRef<any>, id: number) {
    this.modalService.open(content, { size: 'lg' });
    this.getEmployeById(id);
  }

  getEmployeById(id: number) {
    this.employeService
      .getEmployeById(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((employe) => {
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
      });
  }

  modifierEmploye() {
    const employe = {
      id: Number(this.editEmployeForm.get('id')?.value),
      cni: this.editEmployeForm.get('cni')?.value as string,
      firstname: this.editEmployeForm.get('firstname')?.value as string,
      lastname: this.editEmployeForm.get('lastname')?.value as string,
      email: this.editEmployeForm.get('email')?.value as string,
      birthDate: new Date(
        this.editEmployeForm.get('birthDate')?.value as string
      ),
      rendement: this.editEmployeForm.get('rendement')?.value
        ? Number(this.editEmployeForm.get('rendement')?.value)
        : 0,
      objectif: this.editEmployeForm.get('objectif')?.value
        ? Number(this.editEmployeForm.get('objectif')?.value)
        : 0,
    };
    this.employeService
      .updateEmploye(employe, employe.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.FetchEmployes();
      });
    this.toaster.success('The employee modified successfully', 'Success', {
      timeOut: 3000,
    });
  }

  formatDate(date: Date | null): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }
}
