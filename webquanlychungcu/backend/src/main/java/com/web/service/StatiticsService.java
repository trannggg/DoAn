package com.web.service;

import com.web.dto.response.DoanhThuNam;
import com.web.dto.response.Fee;
import com.web.dto.response.ThongKe;
import com.web.entity.*;
import com.web.repository.*;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StatiticsService {


    @Autowired
    private VehicleFeeRepository vehicleFeeRepository;

    @Autowired
    private VehicleServiceFeeRepository vehicleServiceFeeRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private ServiceFeeRepository serviceFeeRepository;

    @Autowired
    private UtilityBillRepository utilityBillRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ResidentRepository residentRepository;

    public List<DoanhThuNam> getFeeByTime(Integer year){
        List<DoanhThuNam> list = new ArrayList<>();
        for (int i = 1; i< 13; i++){
            Double tongXe = vehicleFeeRepository.tinhDoanhThu(i, year);
            Double tongDv = serviceFeeRepository.tinhDoanhThu(i, year);
            Double tongDN = utilityBillRepository.tinhDoanhThu(i, year);
            DoanhThuNam d = new DoanhThuNam();
            d.setPhiDichVu(tongDv);
            d.setPhiDienNuoc(tongDN);
            d.setPhiGuiXe(tongXe);
            list.add(d);
        }
        return list;
    }

    public ThongKe thongKe() {
        ThongKe thongKe = new ThongKe();
        thongKe.setSoCanHo(apartmentRepository.count());
        thongKe.setSoCuDan(residentRepository.count());
        thongKe.setSoPhuongTien(vehicleFeeRepository.count());
        thongKe.setSoCanHoTrong(apartmentRepository.soCanConTrong());
        return thongKe;
    }
}
