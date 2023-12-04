import { Component } from '@angular/core';
import { Employe } from './employe.model';
import { EmployeService } from '../services/employe.service';
import { AjoutEmployeComponent } from './../ajout-employe/ajout-employe.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css'],
})
export class EmployeComponent {
  employes: Employe[] = [];

  constructor(
    private employeService: EmployeService,
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
  openModal() {
    const modalRef = this.modalService.open(AjoutEmployeComponent);
    // You can pass data to the modal using modalRef.componentInstance.propertyName = value;
    modalRef.componentInstance.propertyName = 'exampleData';

    modalRef.result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
        console.log(`Dismissed with: ${reason}`);
      }
    );
  }
}
