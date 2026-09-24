package sri.code.Hello;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://todo-frontend-f6p8.onrender.com"
})
@RequestMapping("/tasks")
public class HelloWorldController {

    private final TodoRepository repository;

    public HelloWorldController(TodoRepository repository) {
        this.repository = repository;
    }

    // GET all tasks
    @GetMapping
    public List<todo> getTasks() {
        return repository.findAll();
    }

    // ADD task
    @PostMapping
    public todo addTask(@RequestBody todo task) {
        return repository.save(task);
    }

    // DELETE task
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {

        repository.deleteById(id);

        return "Task deleted";
    }

    // UPDATE task
    @PutMapping("/{id}")
    public todo updateTask(
            @PathVariable Long id,
            @RequestBody todo updatedTask) {

        todo existingTask = repository.findById(id).orElse(null);

        if (existingTask == null) {
            return null;
        }

        existingTask.setTask(updatedTask.getTask());
        existingTask.setCompleted(updatedTask.isCompleted());

        return repository.save(existingTask);
    }
}