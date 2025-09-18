package com.dev.Sweet_Shop_Management_System.repository;

import com.dev.Sweet_Shop_Management_System.entity.Sweet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SweetRepository extends JpaRepository<Sweet,Long> {
}
