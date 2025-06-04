package net.haji.ebankbackend.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter @Setter @ToString @SuperBuilder
@AllArgsConstructor @NoArgsConstructor
@DiscriminatorValue("CA")
public class CurrentAccount extends BankAccount {
    @PositiveOrZero(message = "Overdraft must be positive or zero")
    private double overDraft;
}
