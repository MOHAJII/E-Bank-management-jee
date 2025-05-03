package net.haji.ebankbackend.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter @Setter @ToString @Builder @AllArgsConstructor @NoArgsConstructor
@DiscriminatorValue("CA")
public class CurrentAccount extends BankAccount{
    private double overDraft;
}
