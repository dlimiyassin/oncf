package com.example.amigos.conroller;


import com.example.amigos.employe.Employe;
import com.example.amigos.service.EmployeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employe")
public class EmployeController {

    @Autowired
    EmployeService employeService;

    @GetMapping()
    public List<Employe> getAllEmploye(){
        return employeService.getAllEmploye();
    }

    @GetMapping("/{id}")
    public Employe getEmployeById(@PathVariable Long id){
        return employeService.getEmployeById(id);
    }

    @PostMapping()
    public Employe createEmploye(@RequestBody Employe em){
        return  employeService.saveEmpolye(em);
    }

    @PutMapping()
    public  Employe updateEmploye(@PathVariable Long id , @RequestBody Employe em){
        em.setId(id);
        return employeService.saveEmpolye(em);
    }

    @DeleteMapping("/{id}")
    public void deleteEmplye(@PathVariable Long id){
        employeService.delete(id);
    }



}
