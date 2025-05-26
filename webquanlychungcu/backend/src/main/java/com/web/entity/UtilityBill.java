package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "utility_bill")
@Getter
@Setter
public class UtilityBill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Integer month;

    private Integer year;

    private Boolean paidStatus = false;

    private LocalDateTime createdDate;

    private Double fee;

    private Float electricityIndexPreMonth;

    private Float electricityIndex;

    private Float numElectricity;

    private Float electricityAmount;

    private Float waterIndex;

    private Float waterIndexPreMonth;

    private Float waterAmount;

    private Float numWater;

    @ManyToOne
    private Apartment apartment;
}
