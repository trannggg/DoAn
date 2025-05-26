package com.web.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.usertype.UserType;

import javax.persistence.*;
import java.sql.Date;
import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String username;

    private String password;

    private String fullName;

    private Boolean actived;

    private String rememberKey;

    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "authority_name")
    private Authority authorities;

}

