package com.skyjourney.backend.controller;

import com.skyjourney.backend.dto.LoginRequest;
import com.skyjourney.backend.dto.PassengerResponse;
import com.skyjourney.backend.dto.RegisterRequest;
import com.skyjourney.backend.model.Passenger;
import com.skyjourney.backend.model.Role;
import com.skyjourney.backend.repository.PassengerRepository;
import com.skyjourney.backend.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final PassengerRepository passengerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        if (passengerRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email is already in use"));
        }

        Role role = Role.PASSENGER;
        if (request.getRole() != null) {
            String roleStr = request.getRole().trim().toUpperCase();
            if ("ADMIN".equals(roleStr)) {
                if (!"admin".equals(request.getSecretKey())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("message", "Invalid secret key for ADMIN role"));
                }
                role = Role.ADMIN;
            } else if ("STAFF".equals(roleStr)) {
                if (!"staff".equals(request.getSecretKey())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("message", "Invalid secret key for STAFF role"));
                }
                role = Role.STAFF;
            }
        }

        Passenger passenger = Passenger.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nationality(request.getNationality())
                .passportNo(request.getPassportNo())
                .role(role)
                .build();

        Passenger savedPassenger = passengerRepository.save(passenger);
        String token = jwtService.generateToken(savedPassenger.getEmail());
        jwtService.addJwtCookie(response, token);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(savedPassenger));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        Passenger passenger = passengerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Passenger not found after successful authentication"));

        String token = jwtService.generateToken(passenger.getEmail());
        jwtService.addJwtCookie(response, token);

        return ResponseEntity.ok(mapToResponse(passenger));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        jwtService.clearJwtCookie(response);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }
        
        Passenger passenger = passengerRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Passenger not found in context"));

        return ResponseEntity.ok(mapToResponse(passenger));
    }

    private PassengerResponse mapToResponse(Passenger passenger) {
        return PassengerResponse.builder()
                .id(passenger.getId())
                .name(passenger.getName())
                .email(passenger.getEmail())
                .nationality(passenger.getNationality())
                .passportNo(passenger.getPassportNo())
                .role(passenger.getRole() != null ? passenger.getRole().name() : "PASSENGER")
                .build();
    }
}
