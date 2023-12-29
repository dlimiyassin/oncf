package com.example.amigos.conroller;


import com.example.amigos.employe.Employe;
import com.example.amigos.service.EmployeService;
import com.example.amigos.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employe")
public class EmployeController {

    @Autowired
    EmployeService employeService;

//    @GetMapping()
//    public List<Employe> getAllEmploye(){
//        return employeService.getAllEmploye();
//    }
    @GetMapping()
    public List<Employe> getAllUsers(@RequestParam(value = "keyword", defaultValue = "") String keyword,
                                     @RequestParam(value = "page", defaultValue = "1") int page,
                                     @RequestParam(value = "size", defaultValue = "5") int size){
        return employeService.getAllEmployes(page,size,keyword);
    }
    @GetMapping("/search/{keyword}")
    public List<Employe> searchEmploye(@PathVariable String keyword){
        return employeService.searchEmploye(keyword);
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
