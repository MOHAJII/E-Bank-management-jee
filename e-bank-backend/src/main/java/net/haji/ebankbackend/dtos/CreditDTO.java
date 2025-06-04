package net.haji.ebankbackend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditDTO {
    @NotBlank(message = "Account ID is required")
    private String accountId;

    @Positive(message = "Amount must be positive")
    private double amount;

    private String description;
}
