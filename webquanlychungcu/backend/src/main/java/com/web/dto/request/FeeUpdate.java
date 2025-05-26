package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeeUpdate {

    private Boolean checkPhiGuiXe = false;
    private Boolean checkPhiCanHo = false;
    private Boolean checkPhiDienNuoc = false;
    private Float chiSoDien;
    private Float chiSoNuoc;
    private Float soDien;
    private Float soNuoc;
    private Integer month;
    private Integer year;
    private Long id;

}
