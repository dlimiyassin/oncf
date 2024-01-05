package com.example.amigos.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PictureResponse {

    private String imageName;

    private String imageType;

    private byte[] picByte;
}
