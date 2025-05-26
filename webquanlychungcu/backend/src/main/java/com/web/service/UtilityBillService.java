package com.web.service;

import com.web.entity.UtilityBill;
import com.web.repository.UtilityBillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UtilityBillService {

    @Autowired
    private UtilityBillRepository utilityBillRepository;
}
