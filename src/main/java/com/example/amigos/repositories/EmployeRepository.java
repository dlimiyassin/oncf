package com.example.amigos.repositories;

import com.example.amigos.entities.Employe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface EmployeRepository extends PagingAndSortingRepository<Employe, Long> {

    List<Employe> findAll();
    Employe findById(Long id);
    Employe save(Employe em);
    void deleteById(Long id);

    @Query("SELECT e FROM Employe e WHERE TIMESTAMPDIFF(DAY, CURRENT_DATE, e.retraite) BETWEEN 0 AND 90 ORDER BY e.retraite")
    List<Employe> findEmployeesWithRetirementInNext3Months();

    @Query(value = "SELECT * FROM employe e WHERE ( e.firstname LIKE %:keyword% OR e.lastname LIKE %:keyword% )",
            countQuery = "SELECT count(*) FROM employe e WHERE ( e.firstname LIKE %:keyword% OR e.lastname LIKE %:keyword% )",
            nativeQuery = true)
    Page<Employe> findAllByUsername(Pageable pageable, @Param("keyword") String keyword);


}
