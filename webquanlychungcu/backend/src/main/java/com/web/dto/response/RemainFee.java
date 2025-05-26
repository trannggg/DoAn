package com.web.dto.response;

import com.web.entity.Resident;
import com.web.entity.ServiceFee;
import com.web.entity.UtilityBill;
import com.web.entity.VehicleFee;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RemainFee {

    private Resident resident;

    private Double total;

    private List<VehicleFee> vehicleFees;

    private List<ServiceFee> serviceFees;

    private List<UtilityBill> utilityBills;
}
