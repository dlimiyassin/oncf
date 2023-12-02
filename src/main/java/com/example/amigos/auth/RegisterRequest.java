package com.example.amigos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotNull(message = "must not be null")
    private String firstname;

    @NotNull
    private String lastname;

    @NotNull
    @Email
    private String email;

    @NotNull
    @Size(min = 4, max = 15)
    private String password;

    @NotNull
    private LocalDate birthdate;

    @NotNull
    private String gender;

}
