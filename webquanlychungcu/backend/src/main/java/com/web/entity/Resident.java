package com.web.entity;

import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.*;
import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "resident")
@Getter
@Setter
public class Resident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

//    @Email(message = "Email không hợp lệ")
//    @NotBlank(message = "Email không được để trống")
    private String email;

//    @NotBlank(message = "Họ tên không được để trống")
//    @Size(max = 100, message = "Họ tên không được vượt quá 100 ký tự")
    private String fullName;

//    @NotNull(message = "Ngày sinh không được để trống")
//    @Past(message = "Ngày sinh phải là một ngày trong quá khứ")
    private LocalDate bod;

//    @NotBlank(message = "Số điện thoại không được để trống")
//    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại phải có 10-11 chữ số")
    private String phone;

    private String image;

    // căn cước công dân
//    @NotBlank(message = "Căn cước công dân không được để trống")
//    @Pattern(regexp = "^[0-9]{12}$", message = "Căn cước công dân phải có đúng 12 chữ số")
    private String cic;

    private Boolean isHouseholdHead = false;

//    @OneToOne
//    private User user;

    @NotNull(message = "Căn hộ không được để trống")
    @ManyToOne
    private Apartment apartment;


    @ManyToOne
    private User user;

}
