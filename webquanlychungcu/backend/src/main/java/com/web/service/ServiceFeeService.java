package com.web.service;

import com.web.entity.ServiceFee;
import com.web.repository.ServiceFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceFeeService {

    @Autowired
    private ServiceFeeRepository serviceFeeRepository;
}
