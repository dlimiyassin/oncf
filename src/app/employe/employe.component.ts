import { Component } from '@angular/core';
import { Employe } from './employe.model';
import { EmployeService } from '../employe.service';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css']
})
export class EmployeComponent {
  employes : Employe[]=[];

  constructor(private employeService : EmployeService){}

     ngOnInit(): void {
       this.employeService.getAllEmployes().subscribe(employes => this.employes=employes)
     }

     supprimerEmploye(id : number){
      this.employeService.deleteEmploye(id).subscribe(()=>{
        this.employes = this.employes.filter(employe => employe.id !== id);
      })
     }
}
