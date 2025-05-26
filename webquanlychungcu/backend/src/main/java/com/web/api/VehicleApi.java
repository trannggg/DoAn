package com.web.api;

import com.web.dto.request.ResidentDto;
import com.web.entity.Maintenance;
import com.web.entity.Resident;
import com.web.entity.Vehicle;
import com.web.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Vehicle")
@CrossOrigin
public class VehicleApi {

    @Autowired
    private VehicleService vehicleService;


    @PostMapping("/user/create")
    public ResponseEntity<?> save(@RequestBody Vehicle vehicle){
        Vehicle result = vehicleService.save(vehicle);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/user/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        vehicleService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/user/my")
    public ResponseEntity<?> my(){
        List<Vehicle> result = vehicleService.myVehicle();
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/admin/findAll")
    public ResponseEntity<?> findAll(Pageable pageable){
        Page<Vehicle> result = vehicleService.all(pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/all/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        Vehicle result = vehicleService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
