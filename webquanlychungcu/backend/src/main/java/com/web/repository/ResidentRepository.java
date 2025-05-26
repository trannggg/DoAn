package com.web.repository;

import com.web.entity.Resident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ResidentRepository extends JpaRepository<Resident, Long> {

    @Query("select r from Resident r where r.apartment.id = ?1")
    List<Resident> findByApartment(Long apId);

    @Query("select r from Resident r where r.user.username = ?1 and r.user.username is not null and r.user.username <> ''")
    Resident findByUserName(String username);

    @Query("select r from Resident r where r.user.username = ?1 and r.id <> ?2 and r.user.username is not null and r.user.username <> ''")
    Resident findByUserNameAndId(String username, Long id);

    @Query("select r from Resident r where r.apartment.floor = ?1")
    List<Resident> findByTang(Integer tang);

    @Query("select r from Resident r where r.fullName like ?1 or r.phone like ?1 or r.user.username like ?1")
    Page<Resident> findAllByParam(String search, Pageable pageable);

    @Query("select r from Resident r where (r.fullName like ?1 or r.phone like ?1 or r.user.username like ?1) and r.apartment.id = ?2")
    Page<Resident> findAllByParamAndApartment(String search, Long apartmentId, Pageable pageable);

}
