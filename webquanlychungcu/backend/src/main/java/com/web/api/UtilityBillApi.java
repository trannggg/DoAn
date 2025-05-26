package com.web.api;

import com.web.service.UtilityBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/UtilityBill")
@CrossOrigin
public class UtilityBillApi {

    @Autowired
    private UtilityBillService utilityBillService;
}
