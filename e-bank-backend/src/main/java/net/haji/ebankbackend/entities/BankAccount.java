package net.haji.ebankbackend.entities;

import jakarta.persistence.*;
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
    private String id;

    private double balance;
    private Date createdAt;
    @Enumerated(EnumType.STRING)
    private AccountStatus status;
    @ManyToOne
    private Customer customer;
    @OneToMany(mappedBy = "bankAccount")
    private List<AccountOperation> accountOperations;
}
