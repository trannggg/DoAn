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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

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

    public Maintenance save(Maintenance maintenance){
        if(maintenance.getId() == null){
            maintenance.setCreatedBy(userUtils.getUserWithAuthority());
            maintenance.setCreatedDate(LocalDateTime.now());
        }
        else{
            Maintenance ex = maintenanceRepository.findById(maintenance.getId()).get();
            maintenance.setCreatedDate(ex.getCreatedDate());
            maintenance.setCreatedBy(ex.getCreatedBy());
        }
        maintenanceRepository.save(maintenance);
        List<Resident> residents = residentRepository.findAll();
        if(maintenance.getCompleted() == false){
            residents.forEach(p->{
                mailService.sendEmail(p.getUser().getUsername(), maintenance.getTitle(), maintenance.getContent(), false, true);
            });
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
