package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.*;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "apartment")
@Getter
@Setter
public class Apartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "Tên căn hộ không được để trống")
    @Size(max = 100, message = "Tên căn hộ tối đa 100 ký tự")
    private String name;

    @NotNull(message = "Diện tích không được để trống")
    @Positive(message = "Diện tích phải lớn hơn 0")
    private Float acreage;

    @NotNull(message = "Tầng không được để trống")
    @Min(value = 1, message = "Tầng phải lớn hơn hoặc bằng 1")
    private Integer floor;

    @NotNull(message = "Giá không được để trống")
    @PositiveOrZero(message = "Giá phải lớn hơn hoặc bằng 0")
    private Double price;


    private Boolean isSold = false;

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties(value = {"apartment"})
    private List<Resident> residents;

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties(value = {"apartment"})
    private List<Vehicle> vehicles;

    @Override
    public String toString() {
        return name +
                ", tầng: " + floor;
    }
}
