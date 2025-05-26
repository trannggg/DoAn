package com.web.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance")
@Getter
@Setter
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private LocalDateTime createdDate;

    private String title;

    private String content;

    private LocalDateTime maintenanceDate;

    private LocalDateTime expectedCompletionDate;

    private Boolean completed = false;

    @ManyToOne
    private User createdBy;
}
