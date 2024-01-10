export class UpdatedEmploye {
  id: number;
  cni: string;
  firstname: string;
  lastname: string;
  email: string;
  birthDate: Date;
  rendement: number;
  objectif: number;

  constructor(
    id: number,
    cni: string,
    firstname: string,
    lastname: string,
    email: string,
    birthDate: Date,
    rendement: number,
    objectif: number
  ) {
    this.id = id,
    this.cni = cni;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.birthDate = birthDate;
    this.rendement = rendement;
    this.objectif = objectif;
  }
}
