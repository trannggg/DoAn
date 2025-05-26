package com.web.repository;

import com.web.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.sql.Date;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report,Long> {

    @Query("select r from Report r where r.user.id = ?1")
    public Page<Report> findByUser(Long UserId,Pageable pageable);

    @Query(value = "select * from report r where date(r.created_date) >= ?1 and date(r.created_date) <= ?2", nativeQuery = true)
    public Page<Report> findByDate(Date start, Date end, Pageable pageable);

    @Modifying
    @Transactional
    @Query("delete from Report p where p.user.id = ?1")
    int deleteByUser(Long userId);
}
