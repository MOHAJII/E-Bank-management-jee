package net.haji.ebankbackend.repositories;

import net.haji.ebankbackend.entities.AccountOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AccountOperationRepository extends JpaRepository<AccountOperation, Long> {
    List<AccountOperation> findByBankAccountId(String id);

    Page<AccountOperation> findByBankAccountIdOrderByOperationDateDesc(String bankAccountId, Pageable pageable);
}
