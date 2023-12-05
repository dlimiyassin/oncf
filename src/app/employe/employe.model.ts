export class Employe {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  date_naissance: Date | null; // Assuming you want to represent LocalDate as a string
  performanceComment: string;

  constructor( id: number, firstname: string, lastname: string,email: string,
    date_naissance: Date, performanceComment: string) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.date_naissance = date_naissance;
    this.performanceComment = performanceComment;
  }
}
