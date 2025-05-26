package com.web.api;
import com.web.dto.response.DoanhThuNam;
import com.web.dto.response.ThongKe;
import com.web.repository.UserRepository;
import com.web.service.StatiticsService;
import com.web.utils.Contains;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/statistic")
@CrossOrigin
public class StatiticsApi {

    @Autowired
    private StatiticsService statiticsService;

    @GetMapping("/admin/revenue-year")
    public List<DoanhThuNam> doanhThu(@RequestParam Integer year){
        List<DoanhThuNam> list = statiticsService.getFeeByTime(year);
        return list;
    }

    @GetMapping("/admin/thongke")
    public ThongKe thongKe(){
        ThongKe thongKe = statiticsService.thongKe();
        return thongKe;
    }
}
