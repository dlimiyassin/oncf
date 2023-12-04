package com.example.amigos.repositories;

import com.example.amigos.employe.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
@EnableJpaRepositories
public interface EmployeRepository extends JpaRepository<Employe, Long>{


}
