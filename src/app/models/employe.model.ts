export class Employe {
  id: number;
  cni: string;
  firstname: string;
  lastname: string;
  email: string;
  birthDate: Date;
  rendement: number;
  objectif: number;
  atteint: number;
  retraite: Date;
  performanceComment: string;

  constructor(
    id: number,
    cni: string,
    firstname: string,
    lastname: string,
    email: string,
    birthDate: Date,
    rendement: number,
    objectif: number,
    atteint: number,
    retraite: Date,
    performanceComment: string
  ) {
    this.id = id;
    this.cni = cni;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.birthDate = birthDate;
    this.rendement = rendement;
    this.objectif = objectif;
    this.atteint = atteint;
    this.retraite = retraite
    this.performanceComment = performanceComment;
  }
}
