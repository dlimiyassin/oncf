package com.example.amigos.auth;

import com.example.amigos.auth.requests.AuthenticationRequest;
import com.example.amigos.auth.requests.RegisterRequest;
import com.example.amigos.auth.responses.AuthenticationResponse;
import com.example.amigos.auth.responses.PictureResponse;
import com.example.amigos.config.JwtService;
import com.example.amigos.entities.Role;
import com.example.amigos.entities.User;
import com.example.amigos.exceptions.UnauthorizedException;
import com.example.amigos.repositories.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

import jakarta.mail.MessagingException;
import org.springframework.web.multipart.MultipartFile;

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
        try {
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
        } catch (AuthenticationException ex) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }


    //-------------------------------register----------------------------
    public AuthenticationResponse register(RegisterRequest request, String siteURL)
            throws UnsupportedEncodingException, MessagingException {

        Optional<User> checkEmail = repository.findByEmail(request.getEmail());
        if (checkEmail.isPresent()) throw new RuntimeException("user already exist !");

        String randomCode = RandomString.make(64);
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .birthdate(request.getBirthdate())
                .gender(request.getGender())
                .role(Role.ADMIN)
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

    public void forgetPassword(String email) throws MessagingException, UnsupportedEncodingException {

        String toAddress = email;
        String fromAddress = "oncf3308@gmail.com";
        String senderName = "Oncf Team";
        String subject = "Please update your password";
        String content = "Please click the link below to update your password:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">UPDATE</a></h3>"
                + "Thank you,<br>"
                + "ONCF TEAM.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);


        String URL = "http://localhost:4200/#/new-password/" + email;

        content = content.replace("[[URL]]", URL);

        helper.setText(content, true);

        mailSender.send(message);
    }

    public void updatePassword(AuthenticationRequest request) {
        Optional<User> checkEmail = repository.findByEmail(request.getEmail());
        if (checkEmail.isEmpty()) throw new RuntimeException("user does not exist !");
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        repository.save(user);
    }

    public boolean updateProfilePassword(String username, String oldPassword, String newPassword) {
        User user = repository.findByEmail(username).orElseThrow(() -> new NoSuchElementException("User not found"));

        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            // Old password matches, update the password
            user.setPassword(passwordEncoder.encode(newPassword));
            repository.save(user);
            return true;
        } else {
            // Old password doesn't match
            return false;
        }
    }

    public void uploadPicture(MultipartFile file, String email) throws IOException {
        System.out.println("Original Image Byte Size - " + file.getBytes().length);
        Optional<User> search = repository.findByEmail(email);
        if (search.isEmpty()) {
            System.out.println("this email does not exist ");
        }

        User updatedUser = search.get();
        updatedUser.setImageName(file.getOriginalFilename());
        updatedUser.setImageType(file.getContentType());
        updatedUser.setPicByte(compressBytes(file.getBytes()));
        repository.save(updatedUser);
    }

    // compress the image bytes before storing it in the database
    public static byte[] compressBytes(byte[] data) {
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        while (!deflater.finished()) {
            int count = deflater.deflate(buffer);
            outputStream.write(buffer, 0, count);
        }
        try {
            outputStream.close();
        } catch (IOException e) {
        }
        System.out.println("Compressed Image Byte Size - " + outputStream.toByteArray().length);

        return outputStream.toByteArray();
    }

    // uncompress the image bytes before returning it to the angular application
    public static byte[] decompressBytes(byte[] data) {
        if (data == null) {
            return new byte[0];
        }
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(buffer);
                outputStream.write(buffer, 0, count);
            }
            outputStream.close();
        } catch (IOException | DataFormatException ignored) {
        }
        return outputStream.toByteArray();
    }

    public void removePicture(String email) {
        final Optional<User> search = repository.findByEmail(email);
        User user = search.get();
        user.setPicByte(null);
        user.setImageType(null);
        user.setImageName(null);
        repository.save(user);
    }

    public PictureResponse getPicture(String email) {
        final Optional<User> retrievedImage = repository.findByEmail(email);
        PictureResponse img = new PictureResponse(retrievedImage.get().getImageName(), retrievedImage.get().getImageType(), decompressBytes(retrievedImage.get().getPicByte()));
        return img;
    }

    public Optional<User> profile(String email) {
        return repository.findByEmail(email);
    }

    public Optional<User> updateProfile(String email, User user) {
        Optional<User> search = repository.findByEmail(email);
        if (search.isEmpty()) {
            return Optional.empty();
        }
        User updatedUser = search.get();
        updatedUser.setFirstname(user.getFirstname());
        updatedUser.setLastname(user.getLastname());
        updatedUser.setBirthdate(user.getBirthdate());
        return Optional.of(repository.save(updatedUser));
    }
}
