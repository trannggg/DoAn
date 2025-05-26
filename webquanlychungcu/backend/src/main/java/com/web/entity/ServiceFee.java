package com.web.entity;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_fee")
@Getter
@Setter
public class ServiceFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Integer month;

    private Integer year;

    private Double fee;

    private Boolean paidStatus = false;

    private LocalDateTime createdDate;

    @ManyToOne
    private Apartment apartment;
}
