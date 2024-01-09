package com.example.amigos.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table( name = "quiz_status")
public class QuizStatus {
    @Id
    @GeneratedValue
    Integer id;
    Boolean status=false;
}
