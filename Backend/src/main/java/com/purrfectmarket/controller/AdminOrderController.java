package com.purrfectmarket.controller;

import com.purrfectmarket.dto.AdminOrderResponse;
import com.purrfectmarket.service.AdminOrderService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    @GetMapping
    public ResponseEntity<List<AdminOrderResponse>> listAll() {
        return ResponseEntity.ok(adminOrderService.findAllOrders());
    }

    @GetMapping(value = "/export.csv", produces = "text/csv")
    public ResponseEntity<byte[]> exportCsv() {
        List<AdminOrderResponse> orders = adminOrderService.findAllOrders();
        StringBuilder sb = new StringBuilder();
        sb.append("Order ID,Customer Name,Customer Email,Payment Status,Shipping Status,Total,Date,Items\r\n");
        for (AdminOrderResponse o : orders) {
            String items = o.items().stream()
                    .map(i -> i.productName() + " x" + i.quantity())
                    .reduce((a, b) -> a + "; " + b)
                    .orElse("");
            sb.append(o.id()).append(',')
              .append(csvEscape(o.customerName())).append(',')
              .append(csvEscape(o.customerEmail())).append(',')
              .append(o.paymentStatus()).append(',')
              .append(o.shippingStatus()).append(',')
              .append(String.format("%.2f", o.totalAmount())).append(',')
              .append(o.createdAt().toString().substring(0, 10)).append(',')
              .append(csvEscape(items)).append("\r\n");
        }
        byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"orders.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    private static String csvEscape(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
