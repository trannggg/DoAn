package com.web.service;

import com.web.entity.Resident;
import com.web.entity.VehicleServiceFee;
import com.web.repository.ResidentRepository;
import com.web.repository.VehicleServiceFeeRepository;
import com.web.utils.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

@Service
public class VehicleServiceFeeService {

    @Autowired
    private VehicleServiceFeeRepository vehicleServiceFeeRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private ResidentRepository residentRepository;


    public List<VehicleServiceFee> findAll(){
        return vehicleServiceFeeRepository.findAll();
    }

    public VehicleServiceFee update(VehicleServiceFee vehicleServiceFee) {
        VehicleServiceFee ex = vehicleServiceFeeRepository.findById(vehicleServiceFee.getId()).get();
        String giaCu = formatToVND(ex.getFee());
        List<Resident> residents = residentRepository.findAll();
        residents.forEach(p->{
            mailService.sendEmail(p.getUser().getUsername(), "Thay đổi phí gửi xe", "Thông báo, phí gửi xe "+vehicleServiceFee.getName()+
                    " sẽ thay đổi từ "+giaCu+" thành "+formatToVND(vehicleServiceFee.getFee())+" từ tháng sau. Xin chân thành cảm ơn quý cư dân", false, true);

        });
        return vehicleServiceFeeRepository.save(vehicleServiceFee);
    }

    public static String formatToVND(Double amount) {
        Locale vietnamLocale = new Locale("vi", "VN"); // Định dạng theo Việt Nam
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(vietnamLocale);
        return currencyFormatter.format(amount);
    }
}
