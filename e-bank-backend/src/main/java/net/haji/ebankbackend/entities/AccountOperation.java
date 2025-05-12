package net.haji.ebankbackend.entities;

import jakarta.persistence.*;
import lombok.*;
import net.haji.ebankbackend.enums.OperationType;

import java.util.Date;

@Entity
@Getter @Setter @Builder @ToString @AllArgsConstructor @NoArgsConstructor
public class AccountOperation {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date operationDate;
    private double amount;

    @Enumerated(EnumType.STRING)
    private OperationType type;

    @ManyToOne
    private BankAccount bankAccount;

    private String description;

}
