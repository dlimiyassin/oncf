package com.example.amigos.service;


import com.example.amigos.employe.Employe;
import com.example.amigos.repositories.EmployeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class EmployeService {
    @Autowired
    private EmployeRepository employeRepository;

   public List<Employe> getAllEmploye(){
       return employeRepository.findAll();
   }

   public Employe getEmployeById(Long id){
       return employeRepository.findById(id).orElse(null);
   }

   public Employe saveEmpolye(Employe em){
       return employeRepository.save(em);
   }

  public void delete(Long id ){
   employeRepository.deleteById(id);
  }


}
