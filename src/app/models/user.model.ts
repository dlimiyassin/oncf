export class User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  birthdate: Date;


  constructor(
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    birthdate: Date,
    password: string,
  ) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.birthdate = birthdate;
  }
}
