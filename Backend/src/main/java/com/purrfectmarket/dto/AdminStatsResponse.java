package com.purrfectmarket.dto;

import java.util.List;

public record AdminStatsResponse(
        double totalRevenue,
        long totalOrders,
        long newUsersThisMonth,
        List<TopProductEntry> topProducts
) {
    public record TopProductEntry(String productName, long unitsSold) {}
}
