package com.dev.Sweet_Shop_Management_System.repository;

import com.dev.Sweet_Shop_Management_System.entity.Sweet;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface SweetRepository extends JpaRepository<Sweet,Long> {
    List<Sweet> findAll(Specification<Sweet> spec);
}
