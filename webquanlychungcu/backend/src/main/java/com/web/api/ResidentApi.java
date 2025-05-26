package com.web.api;

import com.web.dto.request.ResidentDto;
import com.web.entity.Apartment;
import com.web.entity.Resident;
import com.web.service.ResidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resident")
@CrossOrigin
public class ResidentApi {

    @Autowired
    private ResidentService residentService;

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestBody ResidentDto dto){
        ResidentDto result = residentService.save(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        residentService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/findAll")
    public ResponseEntity<?> findAll(@RequestParam(required = false) String search,
            @RequestParam(required = false) Long apartmentId, Pageable pageable){
        Page<Resident> result = residentService.findAllPage(search,apartmentId,pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/all/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        Resident result = residentService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

}
