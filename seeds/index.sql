INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jimmy", "John", 1, null),
       ("George", "Gillroy", 1, 1),
       ("Megan", "Martinez", 2, null),
       ("Derek", "Dogson", 3, 3),
       ("Timmy", "Tilup", 4, null),
       ("Micheal", "McPherson", 5, 5),
       ("Sam", "Sandman", 6, null),
       ("Laura", "Lordson", 7, 7);

INSERT INTO department (name)
VALUES ("Tech Support"),
       ("IT Department"),
       ("Maintenance"),
       ("Janitorial");

INSERT INTO role (title, salary, department_id)
VALUES ("Department Head", 150000, 1),
       ("Lead Tech", 110000, 1),
       ("Lead Support", 95000, 2),
       ("Intern", 20000, 2),
       ("Head Contractor", 100000, 3),
       ("General Labor", 50000, 3),
       ("Head Janitor", 80000, 4),
       ("Floor Polisher", 40000, 4);
