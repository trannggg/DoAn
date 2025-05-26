package com.web.service;

import com.web.dto.request.ResidentDto;
import com.web.entity.Apartment;
import com.web.entity.Maintenance;
import com.web.entity.Resident;
import com.web.entity.User;
import com.web.exception.MessageException;
import com.web.repository.ApartmentRepository;
import com.web.repository.AuthorityRepository;
import com.web.repository.ResidentRepository;
import com.web.repository.UserRepository;
import com.web.utils.Contains;
import org.hibernate.usertype.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Date;
import java.util.Optional;

@Service
public class ResidentService {

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Transactional
    public ResidentDto save(ResidentDto dto) {
        Resident resident = (dto.getId() != null)
                ? residentRepository.findById(dto.getId()).orElse(new Resident())
                : new Resident();

        User user;

        if (dto.getUserId() != null) {
            if(userRepository.findByEmail(dto.getEmail(), dto.getUserId()).isPresent()){
                throw new MessageException("Email đã được sử dụng");
            }
            user = userRepository.findById(dto.getUserId()).orElse(new User());
        }
        else {
            if(userRepository.findByEmail(dto.getEmail()).isPresent()){
                throw new MessageException("Email đã được sử dụng");
            }
            user = new User();
            user.setActived(true);
            user.setCreatedDate(new Date(System.currentTimeMillis()));
            user.setAuthorities(authorityRepository.findById(Contains.ROLE_USER).orElse(null));
        }

        // Cập nhật thông tin user
        user.setUsername(dto.getUsername());
        user.setFullName(dto.getFullName());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepository.save(user);

        // Cập nhật thông tin doctor
        resident.setFullName(dto.getFullName());
        resident.setBod(dto.getBod());
        resident.setCic(dto.getCic());
        resident.setImage(dto.getImage());
        resident.setIsHouseholdHead(dto.getIsHouseholdHead());
        resident.setPhone(dto.getPhone());
        resident.setUser(user);

        if (dto.getApartmentId() != null) {
            Optional<Apartment> apartment = apartmentRepository.findById(dto.getApartmentId());
            apartment.ifPresent(resident::setApartment);
        }

        residentRepository.save(resident);

        // Cập nhật lại DTO để trả về nếu cần
        dto.setId(resident.getId());
        dto.setUserId(user.getId());

        return dto;
    }

    public Page<Resident> findAllPage(String search,Long apartmentId,Pageable pageable){
        if(search == null){
            search = "";
        }
        search ="%"+search+"%";
        if(apartmentId != null){
            return residentRepository.findAllByParamAndApartment(search, apartmentId,pageable);
        }
        return residentRepository.findAllByParam(search,pageable);
    }

    public void delete(Long id){
        try {
            Resident r = residentRepository.findById(id).get();
            residentRepository.deleteById(id);
            userRepository.deleteById(r.getUser().getId());
        }
        catch (Exception e){
            throw new MessageException("Đã có nhiều liên kết, không thể xóa");
        }
    }

    public Resident findById(Long id){
        return residentRepository.findById(id).orElse(null);
    }
}
