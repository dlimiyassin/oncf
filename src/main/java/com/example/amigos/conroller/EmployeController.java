package com.example.amigos.conroller;


import com.example.amigos.employe.Employe;
import com.example.amigos.responses.PaginationResponse;
import com.example.amigos.service.EmployeService;
import com.example.amigos.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employe")
public class EmployeController {

    @Autowired
    EmployeService employeService;

    @GetMapping()
    public ResponseEntity<PaginationResponse<Employe>> getAllUsers(@RequestParam(value = "keyword", defaultValue = "") String keyword,
                                                          @RequestParam(value = "page", defaultValue = "1") int page,
                                                          @RequestParam(value = "size", defaultValue = "7") int size){
        Page<Employe> employePage = employeService.getAllEmployes(page,size,keyword);
        PaginationResponse<Employe> paginationResponse = new PaginationResponse<>(employePage.getContent(),employePage.getTotalPages());
        return new ResponseEntity<>(paginationResponse, HttpStatus.OK);
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

}
