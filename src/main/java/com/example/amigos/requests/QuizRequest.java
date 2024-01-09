package com.example.amigos.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizRequest {

    String question;

    String option1;

    String option2;

    String option3;

    String option4;

}
