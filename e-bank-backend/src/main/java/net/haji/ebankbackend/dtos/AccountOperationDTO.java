package net.haji.ebankbackend.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import net.haji.ebankbackend.enums.OperationType;

import java.util.Date;

@Getter @Setter @ToString @Builder
public class AccountOperationDTO {
    private Long id;
    private Date operationDate;
    private double amount;
    private OperationType type;
    private String description;
}
