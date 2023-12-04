    package com.example.amigos.employe;

    import jakarta.persistence.*;
    import jakarta.validation.constraints.NotNull;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.util.Date;


    @Entity
    @Data @AllArgsConstructor @NoArgsConstructor
    @Table( name = "employe")
    public class Employe {

        @Id
        @GeneratedValue
        private Long id;
        private  String firstname;
        private String lastname;
        private String email;
        @Column(name = "date_naissance")
        private Date birthDate;
        private String performanceComment;

    }
