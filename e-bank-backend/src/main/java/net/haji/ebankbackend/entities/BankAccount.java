package net.haji.ebankbackend.entities;

import jakarta.persistence.*;
import lombok.*;
import net.haji.ebankbackend.enums.AccountStatus;

import java.util.Date;
import java.util.List;

@Entity
@Getter @Setter @ToString @Builder @AllArgsConstructor @NoArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "TYPE", length = 4)
public class BankAccount {
    @Id
    private String id;

    private double balance;
    private Date createdAt;
    @Enumerated(EnumType.STRING)
    private AccountStatus status;
    @ManyToOne
    private Customer customer;

    private List<AccountOperation> accountOperations;
}
