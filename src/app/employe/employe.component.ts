import { Component } from '@angular/core';
import { Employe } from './employe.model';

import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EmployeService } from '../services/employe.service';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css'],
})
export class EmployeComponent {
  employes: Employe[] = [];

  newEmploye : Employe = {id:0,firstname:'',lastname:'',email:'',date_naissance: new Date(),performanceComment:''};

  constructor(private employeService : EmployeService, private router: Router, private datePipe: DatePipe){}
  ngOnInit(): void {
    this.employeService
      .getAllEmployes()
      .subscribe((employes) => (this.employes = employes));
  }


     supprimerEmploye(id : number){
      this.employeService.deleteEmploye(id).subscribe(()=>{
        this.employes = this.employes.filter(employe => employe.id !== id);
      })
     }

     ajouterEmploye(){
      // const dateNaissanceFormatted = this.datePipe.transform(this.newEmploye.date_naissance, 'yyyy-MM-dd');
      // {{ debugger }}
      // // Mettre à jour la date de newEmploye avec la date formatée
      // this.newEmploye.date_naissance = dateNaissanceFormatted? new Date(dateNaissanceFormatted) : null;


      this.employeService.createEmploye(this.newEmploye).subscribe(()=>{
        this.newEmploye ={id:0,firstname:'',lastname:'',email:'',date_naissance: new Date(),performanceComment:''};
          // Mettre à jour la liste d'employés après l'ajout réussi
        this.employeService.getAllEmployes().subscribe(employes => this.employes = employes);


      })
    }


}
