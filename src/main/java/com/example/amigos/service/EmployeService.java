package com.example.amigos.service;


import com.example.amigos.employe.Employe;
import com.example.amigos.repositories.EmployeRepository;
import com.example.amigos.user.Role;
import com.example.amigos.user.User;
import com.example.amigos.user.UserRepository;
import lombok.RequiredArgsConstructor;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


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

    public List<Employe> getAllEmployes(int page, int size, String keyword) {
        if (page > 0) page -= 1;
        Pageable Pageable= PageRequest.of(page, size);
        Page<Employe> employePage;
        if (!keyword.isEmpty()){
            employePage =  employeRepository.findAllByUsername(Pageable,keyword);

        }else{
            employePage = employeRepository.findAll(Pageable);
        }
        return employePage.getContent();
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

    public Optional<User> profile(String email) {
       return userRepository.findByEmail(email);
    }

    public Optional<User> updateProfile(String email, User user) {
        Optional<User> search = userRepository.findByEmail(email);
        if (search.isEmpty()) {
            return Optional.empty();
        }
        User updatedUser = search.get();
        updatedUser.setFirstname(user.getFirstname());
        updatedUser.setLastname(user.getLastname());
       return Optional.of(userRepository.save(updatedUser));
    }

    public List<Employe> searchEmploye(String keyword) {
       return employeRepository.findByKeyword(keyword);
    }
}
