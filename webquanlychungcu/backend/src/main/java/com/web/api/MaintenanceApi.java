package com.web.api;

import com.web.entity.Apartment;
import com.web.entity.Maintenance;
import com.web.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin
public class MaintenanceApi {

    @Autowired
    private MaintenanceService maintenanceService;

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody Maintenance maintenance){
        Maintenance result = maintenanceService.save(maintenance);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        maintenanceService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/all/findAll")
    public ResponseEntity<?> findAll(Pageable pageable){
        Page<Maintenance> result = maintenanceService.findAllPage(pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/all/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        Maintenance result = maintenanceService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

}
