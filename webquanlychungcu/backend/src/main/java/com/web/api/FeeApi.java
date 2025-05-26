package com.web.api;

import com.web.dto.request.FeeUpdate;
import com.web.dto.request.PayCheckRequest;
import com.web.dto.request.PayRequest;
import com.web.dto.response.Fee;
import com.web.dto.response.MessageResponse;
import com.web.dto.response.RemainFee;
import com.web.entity.Maintenance;
import com.web.service.FeeService;
import com.web.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee")
@CrossOrigin
public class FeeApi {

    @Autowired
    private FeeService feeService;

    @PostMapping("/admin/create")
    public ResponseEntity<?> save(@RequestParam Integer month, @RequestParam Integer year){
        feeService.taoDongPhi(month, year);
        return new ResponseEntity<>(new MessageResponse("Tạo yêu cầu đóng phí thành công"), HttpStatus.CREATED);
    }

    @PostMapping("/admin/update")
    public ResponseEntity<?> update(@RequestBody FeeUpdate feeUpdate){
        feeService.capNhatThongTin(feeUpdate);
        return new ResponseEntity<>(new MessageResponse("Cập nhật thành công"), HttpStatus.CREATED);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> findAll(@RequestParam Integer month, @RequestParam Integer year){
        List<Fee> result = feeService.getFeeByTime(month, year);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/admin/detail")
    public ResponseEntity<?> findByApartment(@RequestParam Integer month, @RequestParam Integer year, @RequestParam Long apartmentId){
        Fee result = feeService.getByApartmentId(apartmentId,month, year);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/user/remain-fee")
    public ResponseEntity<?> remainFee(){
        RemainFee result = feeService.allRemainFee();
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @PostMapping("/user/pay-other")
    public ResponseEntity<?> payService(@RequestBody PayRequest request){
        String result = feeService.payService(request.getId(), request.getReturnUrl(), request.getType());
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @PostMapping("/user/pay-all")
    public ResponseEntity<?> payAll(@RequestBody PayRequest request){
        String result = feeService.payAll(request.getReturnUrl());
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @PostMapping("/user/check-pay-other")
    public ResponseEntity<?> payCheckService(@RequestBody PayCheckRequest request){
        feeService.checPayService(request);
        return new ResponseEntity<>(new MessageResponse("Thành công"),HttpStatus.OK);
    }

    @PostMapping("/user/check-pay-all")
    public ResponseEntity<?> payCheckAll(@RequestBody PayCheckRequest request){
        feeService.checkPayAll(request);
        return new ResponseEntity<>(new MessageResponse("Thành công"),HttpStatus.OK);
    }

    @GetMapping("/user/phi-da-dong")
    public ResponseEntity<?> phiDaDong(){
        RemainFee result = feeService.phiDaDong();
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
