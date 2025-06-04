package net.haji.ebankbackend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.*;
import net.haji.ebankbackend.enums.OperationType;

import java.util.Date;

@Entity
@Getter @Setter @Builder @ToString @AllArgsConstructor @NoArgsConstructor
public class AccountOperation {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Operation date is required")
    @PastOrPresent(message = "Operation date must be in the past or present")
    @Temporal(TemporalType.TIMESTAMP)
    private Date operationDate;

    @Positive(message = "Amount must be positive")
    private double amount;

    @NotNull(message = "Operation type is required")
    @Enumerated(EnumType.STRING)
    private OperationType type;

    @NotNull(message = "Bank account is required")
    @ManyToOne
    @JoinColumn(name = "bank_account_id")
    private BankAccount bankAccount;

    private String description;
}
