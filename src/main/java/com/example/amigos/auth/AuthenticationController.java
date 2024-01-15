package com.example.amigos.auth;

import com.example.amigos.auth.requests.AuthenticationRequest;
import com.example.amigos.auth.requests.RegisterRequest;
import com.example.amigos.auth.responses.AuthenticationResponse;
import com.example.amigos.auth.responses.PictureResponse;
import com.example.amigos.auth.responses.UpdatePasswordResponse;
import com.example.amigos.entities.User;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Optional;

import org.springframework.http.ResponseEntity.BodyBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {


    private final AuthenticationService service;

    //---------------------------------login-----------------------------------
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    //---------------------------------register--------------------------------
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody @Valid RegisterRequest request,
            HttpServletRequest requestUrl
    )throws UnsupportedEncodingException, MessagingException{

        return new ResponseEntity<>(service.register(request, getSiteURL(requestUrl)), HttpStatus.CREATED);
    }
    private String getSiteURL(HttpServletRequest request) {
        String siteURL = request.getRequestURL().toString();
        return siteURL.replace(request.getServletPath(), "");
    }
    //---------------------------------Verification by email-----------------------------------
    @GetMapping("/verify")
    public void verifyUser(@RequestParam("code") String code, HttpServletResponse response) throws IOException, IOException {
        if (service.verify(code)) {
            // Redirect to your Angular application upon successful verification
            response.sendRedirect("http://localhost:4200/#/success");
        } else {
            // Redirect to a failure page in your Angular application
            response.sendRedirect("http://localhost:4200/#/fail");
        }

    }
    //---------------------------------forget password-----------------------------------
    @GetMapping("/forget-password")
    public void forgetPassword(@RequestParam("email") String email) throws MessagingException, UnsupportedEncodingException {
        service.forgetPassword(email);
    }
    //---------------------------------update password-----------------------------------
    @PostMapping("/update-password")
    public void forgetPwd(@RequestBody AuthenticationRequest request) {
        service.updatePassword(request);
    }

    @PutMapping("/{username}/update-password")
    public ResponseEntity<UpdatePasswordResponse> updatePassword(
            @PathVariable String username,
            @RequestParam("oldPassword") String oldPassword,
            @RequestParam("newPassword") String newPassword) {

        boolean success = service.updateProfilePassword(username, oldPassword, newPassword);

        if (success) {
            return ResponseEntity.ok(new UpdatePasswordResponse("Password updated successfully"));
        } else {
            return new ResponseEntity<>(new UpdatePasswordResponse("Password updated successfully"),HttpStatus.UNAUTHORIZED);
            //return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid old password");
        }
    }

    //---------------------------------update profile-----------------------------------

    @GetMapping("/profile/{email}")
    public Optional<User> profile(@PathVariable String email){
        return service.profile(email);
    }

    @PutMapping("/profile/{email}")
    public Optional<User> updateProfile(@PathVariable String email, @RequestBody User user){
        return service.updateProfile(email,user);
    }
    //---------------------------------upload profile picture-----------------------------------
    @PostMapping("/profile/upload/{email}")
    public ResponseEntity<BodyBuilder>  uplaodImage(@RequestParam("imageFile") MultipartFile file, @PathVariable("email") String email) throws IOException {
        service.uploadPicture(file,email);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @PutMapping("/profile/removePic/{email}")
    public ResponseEntity<String> removeImage(@PathVariable("email") String email) {
        service.removePicture(email);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
    @GetMapping("/profile/upload/get/{email}")
    public PictureResponse getImage(@PathVariable("email") String email) throws IOException {
        return service.getPicture(email);
    }
}
