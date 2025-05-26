package com.web.api;

import com.web.service.ServiceFeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/servicefee")
@CrossOrigin
public class ServiceFeeApi {

    @Autowired
    private ServiceFeeService serviceFeeService;
}
