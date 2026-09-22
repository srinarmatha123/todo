package sri.code.Hello;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<todo, Long> {
}