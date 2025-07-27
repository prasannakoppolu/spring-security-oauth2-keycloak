package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.couchbase.repository.CouchbaseRepository;
import org.springframework.data.couchbase.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends CouchbaseRepository<Product, String> {

    @Query("SELECT p.* FROM #{#n1ql.bucket} p WHERE p.active = true")
    Page<Product> findAllActive(Pageable pageable);
    
    @Query("SELECT p.* FROM #{#n1ql.bucket} p WHERE p.active = true AND p.category = $1")
    Page<Product> findByCategory(String category, Pageable pageable);
    
    @Query("SELECT p.* FROM #{#n1ql.bucket} p WHERE p.active = true AND p.featured = true")
    List<Product> findFeaturedProducts();
    
    @Query("SELECT p.* FROM #{#n1ql.bucket} p WHERE p.active = true AND LOWER(p.name) LIKE '%' || LOWER($1) || '%'")
    Page<Product> searchByName(String name, Pageable pageable);
    
    @Query("SELECT p.* FROM #{#n1ql.bucket} p WHERE p.active = true AND p.price BETWEEN $1 AND $2")
    Page<Product> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    @Query("SELECT p.* FROM #{#n1ql.bucket} p WHERE p.active = true AND p.brand = $1")
    Page<Product> findByBrand(String brand, Pageable pageable);
    
    @Query("SELECT DISTINCT p.category FROM #{#n1ql.bucket} p WHERE p.active = true")
    List<String> findAllCategories();
    
    @Query("SELECT DISTINCT p.brand FROM #{#n1ql.bucket} p WHERE p.active = true")
    List<String> findAllBrands();
}