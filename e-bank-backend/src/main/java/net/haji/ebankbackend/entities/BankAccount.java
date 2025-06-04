package net.haji.ebankbackend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import lombok.experimental.SuperBuilder;
import net.haji.ebankbackend.enums.AccountStatus;

import java.util.Date;
import java.util.List;

@Entity
@Getter @Setter @ToString @SuperBuilder
@AllArgsConstructor @NoArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "TYPE", length = 4)
public class BankAccount {
    @Id
    @NotNull(message = "Account ID is required")
    private String id;

    @PositiveOrZero(message = "Balance must be positive or zero")
    private double balance;

    @NotNull(message = "Creation date is required")
    @PastOrPresent(message = "Creation date must be in the past or present")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @NotNull(message = "Account status is required")
    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @NotNull(message = "Customer is required")
    @ManyToOne
    private Customer customer;

    @OneToMany(mappedBy = "bankAccount", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<AccountOperation> accountOperations;
}
