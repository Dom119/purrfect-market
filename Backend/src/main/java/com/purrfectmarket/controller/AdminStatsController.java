package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AdminStatsResponse;
import com.purrfectmarket.repository.OrderRepository;
import com.purrfectmarket.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.List;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminStatsController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<AdminStatsResponse> getStats() {
        double totalRevenue = orderRepository.sumTotalRevenue();
        long totalOrders = orderRepository.count();
        Instant startOfMonth = YearMonth.now(ZoneOffset.UTC).atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        long newUsersThisMonth = userRepository.countByCreatedAtAfter(startOfMonth);

        List<AdminStatsResponse.TopProductEntry> topProducts = orderRepository.findTopProductsSorted()
                .stream()
                .limit(5)
                .map(row -> new AdminStatsResponse.TopProductEntry((String) row[0], ((Number) row[1]).longValue()))
                .toList();

        return ResponseEntity.ok(new AdminStatsResponse(totalRevenue, totalOrders, newUsersThisMonth, topProducts));
    }
}
