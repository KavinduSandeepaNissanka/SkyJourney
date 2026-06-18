package com.skyjourney.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PassengerResponse {
    private Long id;
    private String name;
    private String email;
    private String nationality;
    private String passportNo;
    private String role;
}
