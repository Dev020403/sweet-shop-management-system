package com.dev.Sweet_Shop_Management_System.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sweets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sweet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String category;
    private Double price;
    private Integer quantity;
}
