package com.web.service;

import com.web.entity.Apartment;
import com.web.entity.Maintenance;
import com.web.entity.Resident;
import com.web.exception.MessageException;
import com.web.repository.ApartmentRepository;
import com.web.repository.MaintenanceRepository;
import com.web.repository.ResidentRepository;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private MailService mailService;

    private static final Logger log = LoggerFactory.getLogger(MaintenanceService.class);

//    public Maintenance save(Maintenance maintenance){
//        if(maintenance.getId() == null){
//            maintenance.setCreatedBy(userUtils.getUserWithAuthority());
//            maintenance.setCreatedDate(LocalDateTime.now());
//        }
//        else{
//            Maintenance ex = maintenanceRepository.findById(maintenance.getId()).get();
//            maintenance.setCreatedDate(ex.getCreatedDate());
//            maintenance.setCreatedBy(ex.getCreatedBy());
//        }
//        maintenanceRepository.save(maintenance);
//        List<Resident> residents = residentRepository.findAll();
//        if(maintenance.getCompleted() == false){
//            residents.forEach(p->{
//                mailService.sendEmail(p.getUser().getUsername(), maintenance.getTitle(), maintenance.getContent(), false, true);
//            });
//        }
//        return maintenance;
//    }

    public Maintenance save(Maintenance maintenance) {

        if (maintenance.getId() == null) {
            maintenance.setCreatedBy(userUtils.getUserWithAuthority());
            maintenance.setCreatedDate(LocalDateTime.now());
        } else {
            Optional<Maintenance> optionalEx = maintenanceRepository.findById(maintenance.getId());
            if (optionalEx.isPresent()) {
                Maintenance ex = optionalEx.get();
                maintenance.setCreatedDate(ex.getCreatedDate());
                maintenance.setCreatedBy(ex.getCreatedBy());
            } else {
                throw new EntityNotFoundException("Maintenance ID không tồn tại: " + maintenance.getId());
            }
        }

        maintenanceRepository.save(maintenance);

        if (Boolean.FALSE.equals(maintenance.getCompleted())) {
            List<Resident> residents = residentRepository.findAll();
            for (Resident p : residents) {
                try {
                    String email = p.getUser().getUsername(); // Giả sử đây là email
                    if (email != null && !email.isEmpty()) {
                        mailService.sendEmail(email, maintenance.getTitle(), maintenance.getContent(), false, true);
                    } else {
                        log.warn("Cư dân không có địa chỉ email: " + p.getId());
                    }
                } catch (Exception e) {
                    log.error("Lỗi khi gửi email đến cư dân ID: " + p.getId(), e);
                    // tiếp tục với cư dân tiếp theo
                }
            }
        }

        return maintenance;
    }



    public Page<Maintenance> findAllPage(Pageable pageable){
        return maintenanceRepository.findAll(pageable);
    }

    public void delete(Long id){
        maintenanceRepository.deleteById(id);
    }

    public Maintenance findById(Long id){
        return maintenanceRepository.findById(id).orElse(null);
    }
}
