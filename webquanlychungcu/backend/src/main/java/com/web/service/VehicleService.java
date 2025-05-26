package com.web.service;

import com.web.entity.*;
import com.web.repository.ApartmentRepository;
import com.web.repository.ResidentRepository;
import com.web.repository.VehicleRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private ResidentRepository residentRepository;

    public Vehicle save(Vehicle vehicle){
        User user = userUtils.getUserWithAuthority();
        Resident resident = residentRepository.findByUserName(user.getUsername());
        vehicle.setApartment(resident.getApartment());
        if(vehicle.getId() == null){
            vehicle.setCreatedDate(new Date(System.currentTimeMillis()));
        }
        else{
            Vehicle ex = vehicleRepository.findById(vehicle.getId()).get();
            vehicle.setCreatedDate(ex.getCreatedDate());
            vehicle.setUpdateDate(new Date(System.currentTimeMillis()));
        }
        vehicleRepository.save(vehicle);
        return vehicle;
    }

    public List<Vehicle> myVehicle(){
        User user = userUtils.getUserWithAuthority();
        Resident resident = residentRepository.findByUserName(user.getUsername());
        return vehicleRepository.findByApartment(resident.getApartment().getId());
    }

    public List<Vehicle> findByApp(Long appId){
        return vehicleRepository.findByApartment(appId);
    }

    public Page<Vehicle> all(Pageable pageable){
        return vehicleRepository.findAll(pageable);
    }

    public void delete(Long id){
        vehicleRepository.deleteById(id);
    }

    public Vehicle findById(Long id){
        return vehicleRepository.findById(id).orElse(null);
    }
}
