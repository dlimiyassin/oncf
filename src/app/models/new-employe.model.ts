export class NewEmploye {
  cni: string;
  firstname: string;
  lastname: string;
  email: string;
  birthDate: Date;
  rendement: number;
  objectif: number;

  constructor(
    cni: string,
    firstname: string,
    lastname: string,
    email: string,
    birthDate: Date,
    rendement: number,
    objectif: number,
  ) {
    this.cni = cni;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.birthDate = birthDate;
    this.rendement = rendement;
    this.objectif = objectif;
  }
}
