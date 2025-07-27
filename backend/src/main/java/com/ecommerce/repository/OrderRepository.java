package com.ecommerce.repository;

import com.ecommerce.model.Order;
import org.springframework.data.couchbase.repository.CouchbaseRepository;
import org.springframework.data.couchbase.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends CouchbaseRepository<Order, String> {

    @Query("SELECT o.* FROM #{#n1ql.bucket} o WHERE o.userId = $1 ORDER BY o.orderDate DESC")
    Page<Order> findByUserIdOrderByOrderDateDesc(String userId, Pageable pageable);
    
    @Query("SELECT o.* FROM #{#n1ql.bucket} o WHERE o.userId = $1 ORDER BY o.orderDate DESC")
    List<Order> findByUserIdOrderByOrderDateDesc(String userId);
    
    @Query("SELECT o.* FROM #{#n1ql.bucket} o WHERE o.status = $1")
    List<Order> findByStatus(Order.OrderStatus status);
    
    @Query("SELECT o.* FROM #{#n1ql.bucket} o WHERE o.orderNumber = $1")
    Order findByOrderNumber(String orderNumber);
}