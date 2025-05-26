package com.web.service;

import com.web.dto.request.FeeUpdate;
import com.web.dto.request.PayCheckRequest;
import com.web.dto.response.Fee;
import com.web.dto.response.RemainFee;
import com.web.entity.*;
import com.web.exception.MessageException;
import com.web.repository.*;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import com.web.vnpay.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.event.ActionEvent;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class FeeService {

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
    private UserUtils userUtils;

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private VNPayService vnPayService;

    public List<Fee> getFeeByTime(Integer month, Integer year){
        List<Fee> list = new ArrayList<>();
        List<Apartment> apartments = apartmentRepository.canHoDaBan();
        for (Apartment a : apartments){
            ServiceFee serviceFeeEx = serviceFeeRepository.findByThangNamAndCanHo(month, year, a.getId());
            UtilityBill utilityBillEx = utilityBillRepository.findByThangNamAndCanHo(month, year, a.getId());
            VehicleFee vehicleFeeEx = vehicleFeeRepository.findByThangNamAndCanHo(month, year, a.getId());
            if(serviceFeeEx != null && utilityBillEx != null && vehicleFeeEx != null){
                Fee fee = new Fee();
                fee.setMonth(month);
                fee.setYear(year);
                fee.setServiceFee(serviceFeeEx);
                fee.setApartment(a);
                fee.setVehicleFee(vehicleFeeEx);
                fee.setUtilityBill(utilityBillEx);
                list.add(fee);
            }
        }
        return list;
    }


    public void taoDongPhi(Integer month, Integer year) {
        List<Apartment> apartments = apartmentRepository.canHoDaBan();
        for (Apartment a : apartments){
            ServiceFee serviceFeeEx = serviceFeeRepository.findByThangNamAndCanHo(month, year, a.getId());
            UtilityBill utilityBillEx = utilityBillRepository.findByThangNamAndCanHo(month, year, a.getId());
            VehicleFee vehicleFeeEx = vehicleFeeRepository.findByThangNamAndCanHo(month, year, a.getId());
            if(serviceFeeEx == null) createServiceFee(a, month, year);
            if(vehicleFeeEx == null) createVehicleFee(a, month, year);
            if(utilityBillEx == null) createDNFee(a, month, year);
            if(serviceFeeEx != null && serviceFeeEx.getPaidStatus() == false){
                sendMailFee(a, serviceFeeEx.getFee(), month, year, 1);
            }
            if(vehicleFeeEx != null && vehicleFeeEx.getPaidStatus() == false){
                sendMailFee(a, vehicleFeeEx.getFee(), month, year, 2);
            }
            if(utilityBillEx != null && utilityBillEx.getPaidStatus() == false && utilityBillEx.getFee() != null){
                sendMailFee(a, utilityBillEx.getFee(), month, year, 3);
            }
        }
    }

    public void createServiceFee(Apartment a, Integer month, Integer year){
        ServiceFee serviceFee = new ServiceFee();
        serviceFee.setFee(a.getAcreage() * 13000D);
        serviceFee.setApartment(a);
        serviceFee.setCreatedDate(LocalDateTime.now());
        serviceFee.setMonth(month);
        serviceFee.setYear(year);
        serviceFee.setPaidStatus(false);
        serviceFeeRepository.save(serviceFee);
    }

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

    public void createDNFee(Apartment a, Integer month, Integer year){
        Integer preMonth = month - 1;
        Integer preYear = year;
        if(preMonth == 0){
            preMonth = 12;
            preYear = year - 1;
        }
        UtilityBill ex = utilityBillRepository.findByThangNamAndCanHo(preMonth, preYear, a.getId());
        UtilityBill utilityBill = new UtilityBill();
        utilityBill.setApartment(a);
        utilityBill.setCreatedDate(LocalDateTime.now());
        utilityBill.setMonth(month);
        utilityBill.setYear(year);
        utilityBill.setPaidStatus(false);
        if(ex != null){
            utilityBill.setElectricityIndexPreMonth(ex.getElectricityIndex());
            utilityBill.setWaterIndexPreMonth(ex.getWaterIndex());
        }
        utilityBillRepository.save(utilityBill);
    }


    public void sendMailFee(Apartment a, Double fee, Integer month, Integer year, Integer loaiPhi){
        if(loaiPhi == 1){
            for (Resident r : a.getResidents()){
                mailService.sendEmail(r.getUser().getUsername(), "Thông báo đóng phí căn hộ "+a.getName(),
                        "Phí căn hộ tháng "+month+" năm "+year+" của bạn là "+ formatToVND(fee), false, true);
            }
        }
        if(loaiPhi == 2){
            for (Resident r : a.getResidents()){
                mailService.sendEmail(r.getUser().getUsername(), "Thông báo đóng phí gửi xe ",
                        "Phí gửi xe của căn hộ "+ a.getName()+" tháng "+month+" năm "+year+" của bạn là "+ formatToVND(fee), false, true);
            }
        }
        if(loaiPhi == 3){
            for (Resident r : a.getResidents()){
                mailService.sendEmail(r.getUser().getUsername(), "Thông báo đóng phí điện nước ",
                        "Phí điện nước của căn hộ "+ a.getName()+" tháng "+month+" năm "+year+" của bạn là "+ formatToVND(fee), false, true);
            }
        }
    }

    public Fee getByApartmentId(Long id, Integer month, Integer year){
        Apartment a = apartmentRepository.findById(id).get();
        ServiceFee serviceFeeEx = serviceFeeRepository.findByThangNamAndCanHo(month, year, a.getId());
        UtilityBill utilityBillEx = utilityBillRepository.findByThangNamAndCanHo(month, year, a.getId());
        VehicleFee vehicleFeeEx = vehicleFeeRepository.findByThangNamAndCanHo(month, year, a.getId());
        Fee fee = new Fee();
        if(serviceFeeEx != null && utilityBillEx != null && vehicleFeeEx != null){
            fee.setServiceFee(serviceFeeEx);
            fee.setMonth(month);
            fee.setYear(year);
            fee.setApartment(a);
            fee.setVehicleFee(vehicleFeeEx);
            fee.setUtilityBill(utilityBillEx);
        }
        return fee;
    }


    public void capNhatThongTin(FeeUpdate feeUpdate) {
        Apartment a = apartmentRepository.findById(feeUpdate.getId()).get();
        ServiceFee serviceFeeEx = serviceFeeRepository.findByThangNamAndCanHo(feeUpdate.getMonth(), feeUpdate.getYear(), a.getId());
        UtilityBill utilityBillEx = utilityBillRepository.findByThangNamAndCanHo(feeUpdate.getMonth(), feeUpdate.getYear(), a.getId());
        VehicleFee vehicleFeeEx = vehicleFeeRepository.findByThangNamAndCanHo(feeUpdate.getMonth(), feeUpdate.getYear(), a.getId());

        vehicleFeeEx.setPaidStatus(feeUpdate.getCheckPhiGuiXe());
        vehicleFeeRepository.save(vehicleFeeEx);

        serviceFeeEx.setPaidStatus(feeUpdate.getCheckPhiCanHo());
        serviceFeeRepository.save(serviceFeeEx);

        if(feeUpdate.getChiSoDien() != null && feeUpdate.getSoDien() != null){
            try {
                utilityBillEx.setElectricityIndex(feeUpdate.getChiSoDien());
                utilityBillEx.setNumElectricity(feeUpdate.getSoDien());
            }catch (Exception e) {}
        }
        if(feeUpdate.getChiSoNuoc() != null && feeUpdate.getSoNuoc() != null){
            try {
                utilityBillEx.setWaterIndex(feeUpdate.getChiSoNuoc());
                utilityBillEx.setNumWater(feeUpdate.getSoNuoc());
            }catch (Exception e) {}
        }

        saveHDDienNuoc(utilityBillEx);
        utilityBillEx.setPaidStatus(feeUpdate.getCheckPhiDienNuoc());
        utilityBillRepository.save(utilityBillEx);
    }

    public void saveHDDienNuoc(UtilityBill utilityBill){
        Double fee = 0D;
        if(utilityBill.getNumWater() != null){
            fee += calculateWaterBill(utilityBill.getNumWater().intValue());
        }
        if(utilityBill.getNumElectricity() != null){
            fee += calculateElectricityBill(utilityBill.getNumElectricity().intValue());
        }
        if(fee != 0D){
            utilityBill.setFee(fee);
        }
        utilityBillRepository.save(utilityBill);
    }

    public double calculateWaterBill(int numWater) {
        double totalCost = 0;

        // Giá nước theo từng bậc
        int tier1Limit = 10;
        int tier2Limit = 20;
        int tier3Limit = 30;

        double tier1Rate = 8500;
        double tier2Rate = 9900;
        double tier3Rate = 16000;
        double tier4Rate = 27000;

        if (numWater > tier3Limit) {
            totalCost += (numWater - tier3Limit) * tier4Rate;
            numWater = tier3Limit;
        }
        if (numWater > tier2Limit) {
            totalCost += (numWater - tier2Limit) * tier3Rate;
            numWater = tier2Limit;
        }
        if (numWater > tier1Limit) {
            totalCost += (numWater - tier1Limit) * tier2Rate;
            numWater = tier1Limit;
        }
        if (numWater > 0) {
            totalCost += numWater * tier1Rate;
        }

        return totalCost;
    }

    public static double calculateElectricityBill(int numKWh) {
        double totalCost = 0;

        // Giá điện theo từng bậc
        int tier1Limit = 50;
        int tier2Limit = 100;
        int tier3Limit = 200;
        int tier4Limit = 300;
        int tier5Limit = 400;

        double tier1Rate = 1806;
        double tier2Rate = 1866;
        double tier3Rate = 2167;
        double tier4Rate = 2729;
        double tier5Rate = 3050;
        double tier6Rate = 3151;

        if (numKWh > tier5Limit) {
            totalCost += (numKWh - tier5Limit) * tier6Rate;
            numKWh = tier5Limit;
        }
        if (numKWh > tier4Limit) {
            totalCost += (numKWh - tier4Limit) * tier5Rate;
            numKWh = tier4Limit;
        }
        if (numKWh > tier3Limit) {
            totalCost += (numKWh - tier3Limit) * tier4Rate;
            numKWh = tier3Limit;
        }
        if (numKWh > tier2Limit) {
            totalCost += (numKWh - tier2Limit) * tier3Rate;
            numKWh = tier2Limit;
        }
        if (numKWh > tier1Limit) {
            totalCost += (numKWh - tier1Limit) * tier2Rate;
            numKWh = tier1Limit;
        }
        if (numKWh > 0) {
            totalCost += numKWh * tier1Rate;
        }

        return totalCost;
    }


    public static String formatToVND(Double amount) {
        Locale vietnamLocale = new Locale("vi", "VN"); // Định dạng theo Việt Nam
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(vietnamLocale);
        return currencyFormatter.format(amount);
    }

    public RemainFee allRemainFee(){
        User user = userUtils.getUserWithAuthority();
        Resident resident = residentRepository.findByUserName(user.getUsername());
        List<VehicleFee> vehicleFees = vehicleFeeRepository.dichVuChuaDong(resident.getApartment().getId());
        List<ServiceFee> serviceFees = serviceFeeRepository.dichVuChuaDong(resident.getApartment().getId());
        List<UtilityBill> utilityBills = utilityBillRepository.dichVuChuaDong(resident.getApartment().getId());

        Double fee = 0D;
        for(VehicleFee v : vehicleFees){
            fee += v.getFee();
        }
        for(ServiceFee v : serviceFees){
            fee += v.getFee();
        }
        for(UtilityBill v : utilityBills){
            fee += v.getFee();
        }

        return new RemainFee(resident, fee, vehicleFees, serviceFees, utilityBills);
    }

    public RemainFee phiDaDong(){
        User user = userUtils.getUserWithAuthority();
        Resident resident = residentRepository.findByUserName(user.getUsername());
        List<VehicleFee> vehicleFees = vehicleFeeRepository.dichVuDaDong(resident.getApartment().getId());
        List<ServiceFee> serviceFees = serviceFeeRepository.dichVuDaDong(resident.getApartment().getId());
        List<UtilityBill> utilityBills = utilityBillRepository.dichVuDaDong(resident.getApartment().getId());

        Double fee = 0D;
        for(VehicleFee v : vehicleFees){
            fee += v.getFee();
        }
        for(ServiceFee v : serviceFees){
            fee += v.getFee();
        }
        for(UtilityBill v : utilityBills){
            fee += v.getFee();
        }

        return new RemainFee(resident, fee, vehicleFees, serviceFees, utilityBills);
    }

    public String payService(Long id,String returnUrl, String type){
        if(type.equals("SERVICE")){
            ServiceFee serviceFee = serviceFeeRepository.findById(id).get();
            return vnPayService.createOrder(serviceFee.getFee().intValue(), String.valueOf(System.currentTimeMillis()),returnUrl);
        }
        if(type.equals("GUIXE")){
            VehicleFee vehicleFee = vehicleFeeRepository.findById(id).get();
            return vnPayService.createOrder(vehicleFee.getFee().intValue(), String.valueOf(System.currentTimeMillis()),returnUrl);
        }
        if(type.equals("DIENNUOC")){
            UtilityBill utilityBill = utilityBillRepository.findById(id).get();
            return vnPayService.createOrder(utilityBill.getFee().intValue(), String.valueOf(System.currentTimeMillis()),returnUrl);
        }

        return "";
    }

    public void checPayService(PayCheckRequest request) {
        User user = userUtils.getUserWithAuthority();
        Resident resident = residentRepository.findByUserName(user.getUsername());
        int paymentStatus = vnPayService.orderReturnByUrl(request.getUrlVnpay());
        if(paymentStatus != 1){
            throw new MessageException("Thanh toán thất bại");
        }
        if(request.getType().equals("SERVICE")){
            ServiceFee serviceFee = serviceFeeRepository.findById(request.getId()).get();
            serviceFee.setPaidStatus(true);
            serviceFeeRepository.save(serviceFee);
            sendMail(resident.getApartment(), "Phí dịch vụ", serviceFee.getFee(),resident.getFullName(),request.getVnpOrderInfo());
        }
        if(request.getType().equals("GUIXE")){
            VehicleFee vehicleFee = vehicleFeeRepository.findById(request.getId()).get();
            vehicleFee.setPaidStatus(true);
            vehicleFeeRepository.save(vehicleFee);
            sendMail(resident.getApartment(), "Phí gửi xe", vehicleFee.getFee(),resident.getFullName(),request.getVnpOrderInfo());
        }
        if(request.getType().equals("DIENNUOC")){
            UtilityBill utilityBill = utilityBillRepository.findById(request.getId()).get();
            utilityBill.setPaidStatus(true);
            utilityBillRepository.save(utilityBill);
            sendMail(resident.getApartment(), "Phí điện nước", utilityBill.getFee(),resident.getFullName(),request.getVnpOrderInfo());
        }
    }

    public String payAll(String returnUrl) {
        User user = userUtils.getUserWithAuthority();
        Resident resident = residentRepository.findByUserName(user.getUsername());
        List<VehicleFee> vehicleFees = vehicleFeeRepository.dichVuChuaDong(resident.getApartment().getId());
        List<ServiceFee> serviceFees = serviceFeeRepository.dichVuChuaDong(resident.getApartment().getId());
        List<UtilityBill> utilityBills = utilityBillRepository.dichVuChuaDong(resident.getApartment().getId());

        Double fee = 0D;
        for(VehicleFee v : vehicleFees){
            fee += v.getFee();
        }
        for(ServiceFee v : serviceFees){
            fee += v.getFee();
        }
        for(UtilityBill v : utilityBills){
            fee += v.getFee();
        }
        return vnPayService.createOrder(fee.intValue(), String.valueOf(System.currentTimeMillis()),returnUrl);
    }

    public void checkPayAll(PayCheckRequest request) {
        int paymentStatus = vnPayService.orderReturnByUrl(request.getUrlVnpay());
        if(paymentStatus != 1){
            throw new MessageException("Thanh toán thất bại");
        }
        User user = userUtils.getUserWithAuthority();
        Resident resident = residentRepository.findByUserName(user.getUsername());
        List<VehicleFee> vehicleFees = vehicleFeeRepository.dichVuChuaDong(resident.getApartment().getId());
        List<ServiceFee> serviceFees = serviceFeeRepository.dichVuChuaDong(resident.getApartment().getId());
        List<UtilityBill> utilityBills = utilityBillRepository.dichVuChuaDong(resident.getApartment().getId());

        Double fee = 0D;
        for(VehicleFee v : vehicleFees){
            v.setPaidStatus(true);
            vehicleFeeRepository.save(v);
            fee += v.getFee();
        }
        for(ServiceFee v : serviceFees){
            v.setPaidStatus(true);
            serviceFeeRepository.save(v);
            fee += v.getFee();
        }
        for(UtilityBill v : utilityBills){
            v.setPaidStatus(true);
            utilityBillRepository.save(v);
            fee += v.getFee();
        }
        sendMail(resident.getApartment(), "Thanh toán phí còn lại", fee,resident.getFullName(),request.getVnpOrderInfo());
    }


    public void sendMail(Apartment apartment, String titleAp, Double fee, String tenNguoiThanhToan, String maThanhToan){
        String content = mailContent(tenNguoiThanhToan, maThanhToan, titleAp, fee);
        for(Resident r : apartment.getResidents()){
            mailService.sendEmail(r.getUser().getUsername(), "Thông báo thanh toán "+titleAp, content, false, true);
        }
    }

    public String mailContent(String tenNguoiThanhToan, String maThanhToan, String tenDichVu, Double soTien){
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm dd-MM-yyyy");
        String ngayHienTai = now.format(formatter);
        Locale vietnamLocale = new Locale("vi", "VN"); // Định dạng theo Việt Nam
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(vietnamLocale);
        String tien = currencyFormatter.format(soTien);
        String content =
                "<div style=\"font-family: Arial, sans-serif; line-height: 1.6; margin: 20px;\">\n" +
                        "        <div style=\"max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;\">\n" +
                        "            <h2 style=\"text-align: center; color: #333; border-bottom: 2px solid #f4f4f4; padding-bottom: 10px;\">\n" +
                        "                Thanh Toán Hóa Đơn\n" +
                        "            </h2>\n" +
                        "            <div style=\"margin-bottom: 20px;\">\n" +
                        "                <p><strong>Tên người thanh toán:</strong> "+tenNguoiThanhToan+"</p>\n" +
                        "                <p><strong>Ngày thanh toán:</strong> "+ngayHienTai+"</p>\n" +
                        "                <p><strong>Mã thanh toán:</strong> #"+maThanhToan+"</p>\n" +
                        "            </div>\n" +
                        "            <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px;\">\n" +
                        "                <thead>\n" +
                        "                    <tr style=\"background-color: #f4f4f4; text-align: left;\">\n" +
                        "                        <th style=\"border: 1px solid #ddd; padding: 8px;\">Tên dịch vụ</th>\n" +
                        "                        <th style=\"border: 1px solid #ddd; padding: 8px;\">Số tiền</th>\n" +
                        "                    </tr>\n" +
                        "                </thead>\n" +
                        "                <tbody>\n" +
                        "                    <tr>\n" +
                        "                        <td style=\"border: 1px solid #ddd; padding: 8px;\">"+tenDichVu+"</td>\n" +
                        "                        <td style=\"border: 1px solid #ddd; padding: 8px; text-align: right;\">"+tien+"</td>\n" +
                        "                    </tr>\n" +
                        "                </tbody>\n" +
                        "            </table>\n" +
                        "            <div style=\"text-align: center; margin-top: 20px;\">\n" +
                        "                <p>Cảm ơn bạn đã thanh toán!</p>\n" +
                        "                <p>Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi theo địa chỉ <a href=\"mailto:support@example.com\" style=\"color: #007BFF; text-decoration: none;\">support@example.com</a>.</p>\n" +
                        "            </div>\n" +
                        "        </div>\n" +
                        "    </div>";
        return content;
    }
}
