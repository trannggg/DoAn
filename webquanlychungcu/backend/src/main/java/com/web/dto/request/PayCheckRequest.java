package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayCheckRequest {

    private Long id;

    private String type;

    private String vnpOrderInfo;

    private String urlVnpay;
}
