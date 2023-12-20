package com.example.amigos.conroller;


import com.example.amigos.employe.Employe;
import com.example.amigos.service.EmployeService;
import com.example.amigos.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employe")
public class EmployeController {

    @Autowired
    EmployeService employeService;

    @GetMapping()
    public List<Employe> getAllEmploye(){
        return employeService.getAllEmploye();
    }

    @GetMapping("/notify")
    public List<Employe> getAllNotifications(){
        return employeService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public Employe getEmployeById(@PathVariable Long id){
        return employeService.getEmployeById(id);
    }

    @PostMapping()
    public Employe createEmploye(@RequestBody Employe em){
        return  employeService.saveEmpolye(em);
    }

    @PutMapping("/{id}")
    public  Employe updateEmploye(@PathVariable Long id , @RequestBody Employe em){
        em.setId(id);
        return employeService.saveEmpolye(em);
    }

    @DeleteMapping("/{id}")
    public void deleteEmpolye(@PathVariable Long id){
        employeService.delete(id);
    }

    @GetMapping("/profile/{email}")
    public Optional<User> profile(@PathVariable String email){
        return employeService.profile(email);
    }

    @PutMapping("/profile/{email}")
    public Optional<User> updateProfile(@PathVariable String email, @RequestBody User user){
        return employeService.updateProfile(email,user);
    }
}
