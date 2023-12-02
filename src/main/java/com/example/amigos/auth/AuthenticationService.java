package com.example.amigos.auth;

import com.example.amigos.config.JwtService;
import com.example.amigos.user.Role;
import com.example.amigos.user.User;
import com.example.amigos.user.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Optional;

import jakarta.mail.MessagingException;
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    @Autowired
    private final UserRepository repository;
    @Autowired
    private JavaMailSender mailSender;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    //---------------------------------login--------------------------------
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }


    //-------------------------------register----------------------------
    public AuthenticationResponse register(RegisterRequest request, String siteURL)
            throws UnsupportedEncodingException, MessagingException{

        Optional<User> checkEmail = repository.findByEmail(request.getEmail());
        if(checkEmail.isPresent()) throw new RuntimeException("user already exist !");

        String randomCode = RandomString.make(64);
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .birthdate(request.getBirthdate())
                .gender(request.getGender())
                .role(Role.USER)
                .enabled(false)
                .verificationCode(randomCode)
                .build();
        repository.save(user);
        sendVerificationEmail(user, siteURL);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }
    private void sendVerificationEmail(User user, String siteURL)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "oncf3308@gmail.com";
        String senderName = "Oncf Team";
        String subject = "Please verify your registration";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "ONCF TEAM.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", user.getFullName());
        String verifyURL = siteURL + "/api/auth/verify?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);

    }
    public boolean verify(String verificationCode) {
        User user = repository.findByVerificationCode(verificationCode);

        if (user == null || user.isEnabled()) {
            return false;
        } else {
            user.setVerificationCode(null);
            user.setEnabled(true);
            repository.save(user);

            return true;
        }

    }

}
