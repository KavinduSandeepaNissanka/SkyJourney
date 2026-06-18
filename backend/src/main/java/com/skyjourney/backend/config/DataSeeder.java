package com.skyjourney.backend.config;

import com.skyjourney.backend.model.*;
import com.skyjourney.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final PassengerRepository passengerRepository;
    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final BaggageRepository baggageRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (passengerRepository.count() > 0) {
            return; // Data already seeded
        }

        // 1. Seed Passengers with specific roles
        Passenger john = Passenger.builder()
                .name("John Doe")
                .email("john@skyjourney.com")
                .password(passwordEncoder.encode("password"))
                .nationality("American")
                .passportNo("US1234567")
                .role(Role.PASSENGER)
                .build();
        passengerRepository.save(john);

        Passenger jane = Passenger.builder()
                .name("Jane Smith")
                .email("jane@skyjourney.com")
                .password(passwordEncoder.encode("password"))
                .nationality("British")
                .passportNo("UK7654321")
                .role(Role.PASSENGER)
                .build();
        passengerRepository.save(jane);

        Passenger admin = Passenger.builder()
                .name("Admin Portal")
                .email("admin@skyjourney.com")
                .password(passwordEncoder.encode("password"))
                .nationality("Global")
                .passportNo("AD0000001")
                .role(Role.ADMIN)
                .build();
        passengerRepository.save(admin);

        Passenger staff = Passenger.builder()
                .name("Staff Member")
                .email("staff@skyjourney.com")
                .password(passwordEncoder.encode("password"))
                .nationality("Local")
                .passportNo("ST0000002")
                .role(Role.STAFF)
                .build();
        passengerRepository.save(staff);

        // 2. Seed Flights
        Flight flight1 = Flight.builder()
                .flightNo("SJ-101")
                .origin("JFK")
                .destination("LAX")
                .departTime(LocalDateTime.now().plusHours(3))
                .arriveTime(LocalDateTime.now().plusHours(9))
                .gate("T8-Gate 4")
                .status("BOARDING")
                .build();
        flightRepository.save(flight1);

        Flight flight2 = Flight.builder()
                .flightNo("SJ-202")
                .origin("LHR")
                .destination("JFK")
                .departTime(LocalDateTime.now().plusDays(2))
                .arriveTime(LocalDateTime.now().plusDays(2).plusHours(8))
                .gate("T5-Gate B22")
                .status("SCHEDULED")
                .build();
        flightRepository.save(flight2);

        // 3. Seed Seats for flight1 (SJ-101)
        List<Seat> seats = new ArrayList<>();
        for (int r = 1; r <= 30; r++) {
            seats.add(Seat.builder().flight(flight1).row(r).col("A").type("WINDOW").status("AVAILABLE").build());
            seats.add(Seat.builder().flight(flight1).row(r).col("B").type("MIDDLE").status("AVAILABLE").build());
            seats.add(Seat.builder().flight(flight1).row(r).col("C").type("AISLE").status("AVAILABLE").build());
            seats.add(Seat.builder().flight(flight1).row(r).col("D").type("AISLE").status("AVAILABLE").build());
            seats.add(Seat.builder().flight(flight1).row(r).col("E").type("MIDDLE").status("AVAILABLE").build());
            seats.add(Seat.builder().flight(flight1).row(r).col("F").type("WINDOW").status("AVAILABLE").build());
        }
        seatRepository.saveAll(seats);

        // 4. Seed Seats for flight2 (SJ-202)
        List<Seat> seats2 = new ArrayList<>();
        for (int r = 1; r <= 10; r++) {
            seats2.add(Seat.builder().flight(flight2).row(r).col("A").type("WINDOW").status("AVAILABLE").build());
            seats2.add(Seat.builder().flight(flight2).row(r).col("C").type("AISLE").status("AVAILABLE").build());
            seats2.add(Seat.builder().flight(flight2).row(r).col("D").type("AISLE").status("AVAILABLE").build());
            seats2.add(Seat.builder().flight(flight2).row(r).col("F").type("WINDOW").status("AVAILABLE").build());
        }
        seatRepository.saveAll(seats2);

        // 5. Book seat for John Doe on Flight 1 (Seat 12A)
        Seat johnSeat = seatRepository.findByFlightId(flight1.getId()).stream()
                .filter(s -> s.getRow() == 12 && s.getCol().equals("A"))
                .findFirst()
                .orElseThrow();
        johnSeat.setStatus("BOOKED");
        seatRepository.save(johnSeat);

        Booking johnBooking = Booking.builder()
                .passenger(john)
                .flight(flight1)
                .seat(johnSeat)
                .bookingRef("REF101")
                .build();
        bookingRepository.save(johnBooking);

        // 6. Book seat for Jane Smith on Flight 1 (Seat 12B)
        Seat janeSeat = seatRepository.findByFlightId(flight1.getId()).stream()
                .filter(s -> s.getRow() == 12 && s.getCol().equals("B"))
                .findFirst()
                .orElseThrow();
        janeSeat.setStatus("BOOKED");
        seatRepository.save(janeSeat);

        Booking janeBooking = Booking.builder()
                .passenger(jane)
                .flight(flight1)
                .seat(janeSeat)
                .bookingRef("REF102")
                .build();
        bookingRepository.save(janeBooking);

        // 7. Seed Baggage for John Doe's Booking
        Baggage bag1 = Baggage.builder()
                .booking(johnBooking)
                .tagNo("BG-998877")
                .status("CHECKED_IN")
                .location("Terminal 8 Checkout")
                .build();
        baggageRepository.save(bag1);
        
        System.out.println("SkyJourney Database successfully seeded with passengers and SJ-101/SJ-202 flights.");
    }
}
