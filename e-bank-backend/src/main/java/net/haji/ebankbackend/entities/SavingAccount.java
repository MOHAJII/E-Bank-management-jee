package net.haji.ebankbackend.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter @Setter @ToString @SuperBuilder
@AllArgsConstructor @NoArgsConstructor
@DiscriminatorValue("SA")
public class SavingAccount extends BankAccount{
    private double interestRate;
}
