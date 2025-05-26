package com.web.service;

import com.web.entity.Apartment;
import com.web.entity.Vehicle;
import com.web.entity.VehicleFee;
import com.web.entity.VehicleServiceFee;
import com.web.repository.VehicleFeeRepository;
import com.web.repository.VehicleServiceFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class VehicleFeeService {

    @Autowired
    private VehicleFeeRepository vehicleFeeRepository;

    @Autowired
    private VehicleServiceFeeRepository vehicleServiceFeeRepository;

    public void createVehicleFee(Apartment a, Integer month, Integer year){
        VehicleFee vehicleFee = new VehicleFee();
        Double fee = 0D;
        VehicleServiceFee phiOTo = vehicleServiceFeeRepository.findById(1L).get();
        VehicleServiceFee phiXeMay = vehicleServiceFeeRepository.findById(2L).get();
        VehicleServiceFee phiXeDap = vehicleServiceFeeRepository.findById(3L).get();
        for(Vehicle v : a.getVehicles()){
            if(v.getVehicleType() == 2){
                fee += phiOTo.getFee();
            }
            if(v.getVehicleType() == 1){
                fee += phiXeMay.getFee();
            }
            if(v.getVehicleType() == 0){
                fee += phiXeDap.getFee();
            }
        }
        vehicleFee.setFee(fee);
        vehicleFee.setApartment(a);
        vehicleFee.setCreatedDate(LocalDateTime.now());
        vehicleFee.setMonth(month);
        vehicleFee.setYear(year);
        vehicleFee.setPaidStatus(false);
        vehicleFeeRepository.save(vehicleFee);
    }
}
