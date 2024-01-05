export class User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  birthdate: Date;
  image: any;

  constructor(
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    birthdate: Date,
    image: any,
  ) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.birthdate = birthdate;
    this.image = image;
  }
}
