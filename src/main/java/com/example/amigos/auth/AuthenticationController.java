package com.example.amigos.auth;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
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

    @GetMapping("/forget-password")
    public void forgetPassword(@RequestParam("email") String email) throws MessagingException, UnsupportedEncodingException {
        service.forgetPassword(email);
    }
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
}
