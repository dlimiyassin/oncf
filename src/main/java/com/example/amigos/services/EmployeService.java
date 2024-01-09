package com.example.amigos.services;


import com.example.amigos.entities.Employe;
import com.example.amigos.repositories.EmployeRepository;
import com.example.amigos.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class EmployeService {
    @Autowired
    private EmployeRepository employeRepository;
    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
 //  public List<Employe> getAllEmploye(){
 //      return employeRepository.findAll();
 //  }

    public Page<Employe> getAllEmployes(int page, int size, String keyword) {
        if (page > 0) page -= 1;
        Pageable Pageable= PageRequest.of(page, size);
        Page<Employe> employePage;
        if (!keyword.isEmpty()){
            employePage =  employeRepository.findAllByUsername(Pageable,keyword);

        }else{
            employePage = employeRepository.findAll(Pageable);
        }
        return employePage;
    }
    public List<Employe> getAllNotifications(){
        return employeRepository.findEmployeesWithRetirementInNext3Months();
    }

   public Employe getEmployeById(Long id){
       return employeRepository.findById(id);
   }

   public Employe saveEmpolye(Employe em){
       int atteint = em.getRendement()*100/em.getObjectif();
       em.setAtteint(atteint);
       em.setRetraite(em.getBirthDate().plusYears(60));
       return employeRepository.save(em);
   }

  public void delete(Long id ){
   employeRepository.deleteById(id);
  }


}
