package com.web.service;

import com.web.entity.Apartment;
import com.web.entity.Resident;
import com.web.entity.User;
import com.web.exception.MessageException;
import com.web.repository.ApartmentRepository;
import com.web.repository.ResidentRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.relational.core.sql.In;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApartmentService {

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private ResidentRepository residentRepository;

    public Apartment save(Apartment apartment){
        apartmentRepository.save(apartment);
        return apartment;
    }

    public Page<Apartment> findAllPage(Integer floor,Pageable pageable){
        return apartmentRepository.findByFloor(floor,pageable);
    }

    public List<Integer> allTang(){
        return apartmentRepository.getAllTang();
    }

    public void delete(Long id){
        try {
            apartmentRepository.deleteById(id);
        }
        catch (Exception e){
            throw new MessageException("Căn hộ đã bán, không thể xóa");
        }
    }

    public Apartment findById(Long id){
        return apartmentRepository.findById(id).orElse(null);
    }

    public Apartment myApp(){
        User user = userUtils.getUserWithAuthority();
        Resident resident = residentRepository.findByUserName(user.getUsername());
        return resident.getApartment();
    }
}
