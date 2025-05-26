package com.web.dto.response;

import com.web.entity.Apartment;
import com.web.entity.ServiceFee;
import com.web.entity.UtilityBill;
import com.web.entity.VehicleFee;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Fee {

    private Apartment apartment;

    private Integer month;

    private Integer year;

    private ServiceFee serviceFee;

    private VehicleFee vehicleFee;

    private UtilityBill utilityBill;
}
