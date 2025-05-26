package com.web.repository;

import com.web.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("select r from Vehicle r where r.apartment.id = ?1")
    List<Vehicle> findByApartment(Long apId);

    @Query("select v from Vehicle v where v.id <> ?1 and v.apartment.id = ?2 and v.vehicleType = 2")
    Vehicle findByIdAndTypeAndHd(Long id, Long id1);

    @Query("select v from Vehicle v where v.apartment.id = ?1 and v.vehicleType = 2")
    Vehicle findByTypeAndHd(Long id1);
}
