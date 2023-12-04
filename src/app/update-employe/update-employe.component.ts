import { Component } from '@angular/core';
import { Employe } from '../employe/employe.model';
import { EmployeService } from '../employe.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-employe',
  templateUrl: './update-employe.component.html',
  styleUrls: ['./update-employe.component.css']
})
export class UpdateEmployeComponent {
  employe! : Employe;

  constructor(
    private employeService: EmployeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.employeService.getEmployeById(id).subscribe((employe) => {
        this.employe = employe;
      });
    });
  }

  modifierEmploye() {
    this.employeService.updateEmploye(this.employe).subscribe(() => {
      this.router.navigate(['/employe']);
    });
  }
}
