package com.web.service;

import com.web.entity.Report;
import com.web.repository.ReportRepository;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Component
public class ReportService {

    @Autowired
    public UserUtils userUtils;

    @Autowired
    ReportRepository reportRepository;


    @Autowired
    NotificationService notificationService;

    @Autowired
    MailService mailService;

    public Report save(Report report){
        report.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        report.setUser(userUtils.getUserWithAuthority());
        reportRepository.save(report);
        return report;
    }

    public Page<Report> findByUser(Pageable pageable){
        return reportRepository.findByUser(userUtils.getUserWithAuthority().getId(),pageable);
    }

    public Page<Report> findAll(Pageable pageable, Date start, Date end){
        Page<Report> page = null;
        if(start == null || end == null){
            page = reportRepository.findAll(pageable);
        }
        else{
            page = reportRepository.findByDate(start, end, pageable);
        }
        return page;
    }

    public void delete(Long id) {
        reportRepository.deleteById(id);
    }

    public Report checked(Long id) {
        Report report = reportRepository.findById(id).get();
        report.setChecked(true);
        reportRepository.save(report);
        mailService.sendEmail(report.getUser().getUsername(), "Chúng tôi đã xử lý phản ảnh của bạn",
                "Nội dung phản ánh<br>"+report.getContent()+"<br>Chúng tôi đã xử lý phản ánh của bạn",false, true);
        return report;
    }
}
