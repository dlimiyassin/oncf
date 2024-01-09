package com.example.amigos.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizResponse {
    Long id;

    String question;

    String option1;

    String option2;

    String option3;

    String option4;
}
