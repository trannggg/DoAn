package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ResidentDto {

    private Long id;

    private String email;

    private String fullName;

    private LocalDate bod;

    private String phone;

    private String image;

    private String cic;

    private Boolean isHouseholdHead;

    private Long apartmentId;

    private Long userId;
    private String username;
    private String password;
}
