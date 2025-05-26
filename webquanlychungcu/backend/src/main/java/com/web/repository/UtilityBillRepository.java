package com.web.repository;

import com.web.entity.UtilityBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UtilityBillRepository extends JpaRepository<UtilityBill, Long> {

    @Query("select s from UtilityBill s where s.apartment.id = ?1 and s.paidStatus = false and s.fee is not null ")
    List<UtilityBill> dichVuChuaDong(Long apId);

    @Query("select s from UtilityBill s where s.apartment.id = ?1 and s.paidStatus = true")
    List<UtilityBill> dichVuDaDong(Long apId);

    @Query("select s from UtilityBill s where s.apartment.id = ?1 and s.paidStatus = true and s.month = ?2 and s.year = ?2")
    List<UtilityBill> dichVuDaDong(Long apId, Integer month, Integer year);

    @Query("select s from UtilityBill s where s.month = ?1 and s.year = ?2 and s.apartment.id = ?3")
    UtilityBill findByThangNamAndCanHo(Integer month, Integer year, Long canHoId);

    @Query(value = "SELECT SUM(u.fee) FROM utility_bill u WHERE u.month = ?1 AND u.year = ?2", nativeQuery = true)
    Double tinhDoanhThu(Integer month, Integer year);
}

