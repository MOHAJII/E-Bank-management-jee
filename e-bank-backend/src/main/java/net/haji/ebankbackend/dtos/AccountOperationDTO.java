package net.haji.ebankbackend.dtos;

import lombok.*;
import net.haji.ebankbackend.enums.OperationType;

import java.util.Date;

@Getter @Setter @Builder @ToString @AllArgsConstructor
@NoArgsConstructor
public class AccountOperationDTO {
    private Long id;
    private Date operationDate;
    private double amount;
    private OperationType type;
    private String description;
}
