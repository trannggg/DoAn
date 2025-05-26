package com.web.repository;

import com.web.entity.Apartment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long> {

    @Query("select a from Apartment a where a.isSold = true")
    List<Apartment> canHoDaBan();

    @Query("select a from Apartment a where a.name = ?1")
    Apartment findByTen(String ten);

    @Query("select a from Apartment a where a.name = ?1 and a.id <> ?2")
    Apartment findByTenAndId(String ten, Long id);

    @Query(value = "select DISTINCT a.floor from apartment a", nativeQuery = true)
    List<Integer> getAllTang();

    @Query("select a from Apartment a where (?1 is null or a.floor = ?1)")
    Page<Apartment> findByFloor(Integer floor, Pageable pageable);

    @Query(value = "select a.name from resident r inner join apartment a on a.id = r.apartment_id where r.user_id = ?1", nativeQuery = true)
    String apartmentNameByUser(Long userId);

    @Query(value = "SELECT count(a.id)\n" +
            "FROM apartment a\n" +
            "LEFT JOIN resident r ON a.id = r.apartment_id\n" +
            "WHERE r.id IS NULL", nativeQuery = true)
    Long soCanConTrong();
}
