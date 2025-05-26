package com.web.api;

import com.web.entity.Report;
import com.web.repository.ReportRepository;
import com.web.service.NotificationService;
import com.web.service.ReportService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/api/report")
@CrossOrigin("*")
public class ReportApi {

    @Autowired
    ReportService reportService;

    @PostMapping("/user/add")
    public ResponseEntity<?> save(@RequestBody Report report){
        Report result = reportService.save(report);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/user/my-report")
    public Page<Report> findByBds(Pageable pageable){
        Page<Report> list = reportService.findByUser(pageable);
        return list;
    }

    @GetMapping("/admin/all")
    public Page<Report> allReport(Pageable pageable, @RequestParam(required = false) Date start,
                                  @RequestParam(required = false) Date end){
        Page<Report> result = reportService.findAll(pageable, start, end);
        return result;
    }

    @DeleteMapping("/all/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        reportService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/admin/checked")
    public ResponseEntity<?> checked(@RequestParam Long id){
        Report result = reportService.checked(id);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
}