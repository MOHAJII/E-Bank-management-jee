package net.haji.ebankbackend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter @Setter @ToString @Builder @AllArgsConstructor @NoArgsConstructor
public class Customer {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    @OneToMany(mappedBy = "customer")
    private List<BankAccount> bankAccounts;
}
