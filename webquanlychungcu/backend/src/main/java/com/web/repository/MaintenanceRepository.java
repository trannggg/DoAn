package com.web.repository;

import com.web.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    @Query("select m from Maintenance m order by m.id desc ")
    public List<Maintenance> findAll();
}
