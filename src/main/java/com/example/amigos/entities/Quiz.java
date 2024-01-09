package com.example.amigos.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table( name = "quizzes")
public class Quiz {

    @Id
    @GeneratedValue
    Long id;

    String question;

    String option1;

    String option2;

    String option3;

    String option4;
}
