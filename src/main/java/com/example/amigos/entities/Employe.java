    package com.example.amigos.entities;

    import jakarta.persistence.*;
    import jakarta.validation.constraints.NotNull;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.time.LocalDate;
    import java.util.Date;


    @Entity
    @Data @AllArgsConstructor
    @NoArgsConstructor
    @Table( name = "employe")
    public class Employe {

        @Id
        @GeneratedValue
        private Long id;

        private String cni;
        private  String firstname;
        private String lastname;
        private String email;
        @Column(name = "date_naissance")
        private LocalDate birthDate;
        private int rendement;
        private int objectif;
        private int atteint;
        private LocalDate retraite;
        private String performanceComment;

    }
