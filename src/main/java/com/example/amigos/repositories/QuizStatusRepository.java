package com.example.amigos.repositories;

import com.example.amigos.entities.QuizStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizStatusRepository extends JpaRepository<QuizStatus,Integer> {
}
