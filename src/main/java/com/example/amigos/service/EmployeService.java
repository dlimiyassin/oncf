package com.example.amigos.service;


import com.example.amigos.employe.Employe;
import com.example.amigos.repositories.EmployeRepository;
import com.example.amigos.user.Role;
import com.example.amigos.user.User;
import com.example.amigos.user.UserRepository;
import lombok.RequiredArgsConstructor;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
   public List<Employe> getAllEmploye(){
       return employeRepository.findAll();
   }

   public Employe getEmployeById(Long id){
       return employeRepository.findById(id).orElse(null);
   }

   public Employe saveEmpolye(Employe em){
       int atteint = em.getRendement()*100/em.getObjectif();
       em.setAtteint(atteint);
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
}
