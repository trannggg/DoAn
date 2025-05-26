package com.web.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayRequest {

    private Long id;

    private String returnUrl;

    private String type;
}
