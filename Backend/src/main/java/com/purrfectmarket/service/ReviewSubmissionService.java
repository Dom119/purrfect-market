package com.purrfectmarket.service;

import com.purrfectmarket.dto.AuthResponse;
import com.purrfectmarket.dto.ReviewSubmitRequest;
import com.purrfectmarket.model.PendingReview;
import com.purrfectmarket.model.Product;
import com.purrfectmarket.model.User;
import com.purrfectmarket.model.UserGroup;
import com.purrfectmarket.repository.OrderRepository;
import com.purrfectmarket.repository.PendingReviewRepository;
import com.purrfectmarket.repository.ProductRepository;
import com.purrfectmarket.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewSubmissionService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PendingReviewRepository pendingReviewRepository;
    private final ResendEmailService resendEmailService;

    public ReviewSubmissionService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            PendingReviewRepository pendingReviewRepository,
            ResendEmailService resendEmailService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.pendingReviewRepository = pendingReviewRepository;
        this.resendEmailService = resendEmailService;
    }

    public void submit(AuthResponse sessionUser, Long productId, ReviewSubmitRequest req) {
        if (req.rating() < 1 || req.rating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (req.title() == null || req.title().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (req.body() == null || req.body().isBlank()) {
            throw new IllegalArgumentException("Review body is required");
        }

        if (!orderRepository.existsByUserIdAndProductId(sessionUser.id(), productId)) {
            throw new IllegalArgumentException("You can only review products you have purchased");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        pendingReviewRepository.save(new PendingReview(
                productId, product.getName(),
                sessionUser.id(), sessionUser.name(), sessionUser.email(),
                req.rating(), req.title().trim(), req.body().trim()));

        List<String> adminEmails = userRepository.findAll().stream()
                .filter(u -> u.getUserGroup() == UserGroup.MAIN_ADMIN)
                .map(User::getEmail)
                .toList();

        if (adminEmails.isEmpty()) return;

        String stars = "★".repeat(req.rating()) + "☆".repeat(5 - req.rating());
        String html = buildEmailHtml(sessionUser, product.getName(), req, stars);
        resendEmailService.sendHtmlBulk(adminEmails, "New Review Pending Approval — " + product.getName(), html);
    }

    private String buildEmailHtml(AuthResponse user, String productName, ReviewSubmitRequest req, String stars) {
        return """
                <div style="font-family: system-ui, sans-serif; max-width: 600px; line-height: 1.6; color: #1f2937;">
                  <h2 style="color: #1e3a5f; margin-bottom: 4px;">New Review Pending Approval</h2>
                  <p style="color: #6b7280; margin-top: 0;">A customer has submitted a review that requires your approval before publishing.</p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; width: 120px; vertical-align: top;">Product</td>
                      <td style="padding: 8px 0; font-weight: 600;">%s</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Reviewer</td>
                      <td style="padding: 8px 0;">%s &lt;%s&gt;</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Rating</td>
                      <td style="padding: 8px 0; font-size: 20px; color: #f2a365;">%s</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Title</td>
                      <td style="padding: 8px 0; font-weight: 600;">%s</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Review</td>
                      <td style="padding: 8px 0;">%s</td>
                    </tr>
                  </table>

                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                  <p style="color: #6b7280; font-size: 13px;">
                    To publish or reject this review, visit Admin → Pending Reviews.<br/>
                    Do not reply to this email.
                  </p>
                </div>
                """.formatted(
                        productName,
                        escapeHtml(user.name()), escapeHtml(user.email()),
                        stars,
                        escapeHtml(req.title()),
                        escapeHtml(req.body()).replace("\n", "<br/>"));
    }

    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
