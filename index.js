const express = require('express');
const app = express();
const port = 8081;
let employees = [];

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.render('index', {
        employees
    });
});

app.post('/', (req, res) => {
    employees.push({ ...req.body, id: Date.now() });
    console.log(employees);
    console.log("Employee Add Successfully");
    return res.redirect('/');
});

app.get('/table', (req, res) => {
    return res.render('table', {
        employees
    });
});
app.post('/', (req, res) => {
    employees.push({ ...req.body, id: Date.now() });
    return res.redirect('/table');
});

app.get('/employee/delete/:id', (req, res) => {
    let id = req.params.id;
    employees = employees.filter(employee => employee.id != id);
    console.log("Employee Data Delete Successfully");
    return res.redirect(req.get('Referrer')) || ('/table');
});

app.get('/employee/edit/:id', (req, res) => {
    let id = req.params.id;
    let employee = employees.find(employee => employee.id == id);
    if (employee) {
        return res.render('edit', {
            employee
        });
    }
    return res.redirect('/table');
});

app.post('/employee/edit/:id', (req, res) => {
    let id = req.params.id;
    let index = employees.findIndex(employee => employee.id == id);
    if (index !== -1) {
        employees[index] = { ...req.body, id: parseInt(id) };
    }
    console.log("Employee Data Edit Successfully");
    return res.redirect('/table');
});

app.use(express.urlencoded({ extended: true }));

app.get('/employee/task/:id', (req, res) => {
    let id = Number(req.params.id);
    let employee = employees.find(emp => emp.id === id);
    if (employee) {
        return res.render('task', {
            employee
        });
    }
    return res.redirect('/table');
});

app.post('/employee/task/:id', (req, res) => {
    let id = Number(req.params.id);
    let employee = employees.find(emp => emp.id === id);
    if (employee) {
        employee.task = req.body.task;
        employee.priority = req.body.priority;
        employee.description = req.body.description;
        console.log("Task Assigned Successfully");
    }
    if (employee) {
        let index = employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
            employees[index] = employee;
        } else {
            employees.push(employee);
        }
    }
    console.log(employees);
    return res.redirect('/table');
});

app.get('/employee/search', (req, res) => {
    let searchQuery = req.query.search?.toLowerCase() || '';

    if (!searchQuery) {
        return res.redirect('/employee');
    }

    let filteredEmployees = employees.filter(employee =>
        Object.values(employee).some(value =>
            String(value).toLowerCase().includes(searchQuery)
        )
    );

    return res.render('table', { employees: filteredEmployees });
});


app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`server start http://localhost:${port}`);
    }
});
